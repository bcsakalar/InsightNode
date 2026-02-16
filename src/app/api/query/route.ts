// ============================================================================
// API Route: /api/query
// ============================================================================
// POST: Full AI pipeline — text → query → execute → chart config.
// This is the core endpoint that powers the dashboard.
// ============================================================================

import { NextResponse } from "next/server";
import { createDatabaseAdapter } from "@/lib/db";
import { generateQuery } from "@/services/query-generator";
import { formatChart } from "@/services/chart-formatter";
import { sanitizeSQLQuery, sanitizeMongoOperation } from "@/utils/query-sanitizer";
import { sanitizePrompt } from "@/utils/validators";
import type { ConnectionFormData } from "@/types/database";
import type { ApiResponse } from "@/types/api";
import type { DashboardQueryResponse } from "@/types/chart";

interface QueryRequestBody {
    prompt: string;
    locale?: string;
    connection: ConnectionFormData & { id: string };
}

export async function POST(
    request: Request
): Promise<NextResponse<ApiResponse<DashboardQueryResponse>>> {
    try {
        const body = (await request.json()) as QueryRequestBody;

        // Validate prompt
        const prompt = sanitizePrompt(body.prompt);
        const locale = body.locale || "en";
        if (!prompt) {
            return NextResponse.json(
                { success: false, error: "Please enter a question." },
                { status: 400 }
            );
        }

        // Create database adapter
        const adapter = createDatabaseAdapter(body.connection);

        try {
            // Step 0: Connect and fetch schema
            await adapter.connect();
            const schema = await adapter.getSchema();

            // Step 1: Generate query using Gemini
            const generated = await generateQuery(
                prompt,
                schema,
                body.connection.type,
                locale
            );

            // Step 2: Sanitize the generated query
            let sanitizedQuery = generated.queryString;
            if (generated.queryType === "sql") {
                sanitizedQuery = sanitizeSQLQuery(generated.queryString);
            } else {
                // For MongoDB, validate the operation type
                try {
                    const parsed = JSON.parse(generated.queryString) as { operation: string };
                    sanitizeMongoOperation(parsed.operation);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        throw new Error("Generated MongoDB query is not valid JSON.");
                    }
                    throw e;
                }
            }

            // Step 3: Execute the query
            const queryResult = await adapter.executeQuery(sanitizedQuery);

            if (queryResult.rows.length === 0) {
                return NextResponse.json({
                    success: false,
                    error: "The query returned no results. Try a different question.",
                });
            }

            // Step 4: Format as chart using Gemini
            const chartConfig = await formatChart(
                queryResult.rows,
                queryResult.columns,
                prompt,
                locale
            );

            // Build response
            const response: DashboardQueryResponse = {
                chartConfig,
                generatedQuery: sanitizedQuery,
                queryType: generated.queryType,
                executionTimeMs: queryResult.executionTimeMs,
                rowCount: queryResult.rowCount,
            };

            return NextResponse.json({ success: true, data: response });
        } finally {
            await adapter.disconnect();
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred.";
        console.error("[/api/query] Error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

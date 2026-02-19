// ============================================================================
// API Route: /api/query
// ============================================================================
// POST: Full AI pipeline — text → query → execute → chart config.
// Supports streaming progress updates via ReadableStream.
// ============================================================================

import { NextResponse } from "next/server";
import { createDatabaseAdapter } from "@/lib/db";
import { generateQuery } from "@/services/query-generator";
import { formatChart } from "@/services/chart-formatter";
import { sanitizeSQLQuery, sanitizeMongoOperation } from "@/utils/query-sanitizer";
import { sanitizePrompt } from "@/utils/validators";
import type { ConnectionFormData } from "@/types/database";
import type { ConversationMessage } from "@/types/api";
import type { DashboardQueryResponse } from "@/types/chart";

interface QueryRequestBody {
    prompt: string;
    locale?: string;
    connection: ConnectionFormData & { id: string };
    conversationHistory?: ConversationMessage[];
    streaming?: boolean;
}

export async function POST(request: Request): Promise<Response> {
    const body = (await request.json()) as QueryRequestBody;

    // If streaming is requested, use ReadableStream
    if (body.streaming) {
        return handleStreamingQuery(body);
    }

    // Standard non-streaming response
    return handleStandardQuery(body);
}

/** Standard non-streaming query handler */
async function handleStandardQuery(body: QueryRequestBody): Promise<NextResponse> {
    try {
        const prompt = sanitizePrompt(body.prompt);
        const locale = body.locale || "en";
        if (!prompt) {
            return NextResponse.json(
                { success: false, error: "Please enter a question." },
                { status: 400 }
            );
        }

        const adapter = createDatabaseAdapter(body.connection);

        try {
            await adapter.connect();
            const schema = await adapter.getSchema();

            const generated = await generateQuery(
                prompt, schema, body.connection.type, locale,
                body.conversationHistory || []
            );

            let sanitizedQuery = generated.queryString;
            if (generated.queryType === "sql") {
                sanitizedQuery = sanitizeSQLQuery(generated.queryString);
            } else {
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

            let queryResult = await adapter.executeQuery(sanitizedQuery);

            // Retry once with relaxed prompt if no results
            if (queryResult.rows.length === 0) {
                try {
                    const retryPrompt = `The previous query returned 0 rows. Original question: "${prompt}". Previous query: ${sanitizedQuery}. Please generate a broader/alternative query that is more likely to return results. Remove strict filters, try without WHERE clauses or with wider date ranges, or query different relevant columns.`;
                    const retryGenerated = await generateQuery(
                        retryPrompt, schema, body.connection.type, locale,
                        body.conversationHistory || []
                    );
                    let retrySanitized = retryGenerated.queryString;
                    if (retryGenerated.queryType === "sql") {
                        retrySanitized = sanitizeSQLQuery(retryGenerated.queryString);
                    }
                    const retryResult = await adapter.executeQuery(retrySanitized);
                    if (retryResult.rows.length > 0) {
                        queryResult = retryResult;
                        sanitizedQuery = retrySanitized;
                    }
                } catch {
                    // Retry failed, continue with original empty result
                }
            }

            if (queryResult.rows.length === 0) {
                return NextResponse.json({
                    success: false,
                    error: "The query returned no results. Try a different question.",
                });
            }

            const chartConfig = await formatChart(
                queryResult.rows, queryResult.columns, prompt, locale
            );

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

/** Streaming query handler — sends progress updates as JSON chunks */
async function handleStreamingQuery(body: QueryRequestBody): Promise<Response> {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: Record<string, unknown>) => {
                controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
            };

            try {
                const prompt = sanitizePrompt(body.prompt);
                const locale = body.locale || "en";
                if (!prompt) {
                    send({ step: "error", error: "Please enter a question." });
                    controller.close();
                    return;
                }

                // Step 1: Generating query
                send({ step: "generating" });

                const adapter = createDatabaseAdapter(body.connection);

                try {
                    await adapter.connect();
                    const schema = await adapter.getSchema();

                    const generated = await generateQuery(
                        prompt, schema, body.connection.type, locale,
                        body.conversationHistory || []
                    );

                    // Step 2: Validating
                    send({ step: "validating" });

                    let sanitizedQuery = generated.queryString;
                    if (generated.queryType === "sql") {
                        sanitizedQuery = sanitizeSQLQuery(generated.queryString);
                    } else {
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

                    // Step 3: Executing query
                    send({ step: "executing" });
                    let queryResult = await adapter.executeQuery(sanitizedQuery);

                    // Retry once with relaxed prompt if no results
                    if (queryResult.rows.length === 0) {
                        try {
                            send({ step: "generating" }); // Show retry
                            const retryPrompt = `The previous query returned 0 rows. Original question: "${prompt}". Previous query: ${sanitizedQuery}. Please generate a broader/alternative query that is more likely to return results. Remove strict filters, try without WHERE clauses or with wider date ranges, or query different relevant columns.`;
                            const retryGenerated = await generateQuery(
                                retryPrompt, schema, body.connection.type, locale,
                                body.conversationHistory || []
                            );
                            send({ step: "validating" });
                            let retrySanitized = retryGenerated.queryString;
                            if (retryGenerated.queryType === "sql") {
                                retrySanitized = sanitizeSQLQuery(retryGenerated.queryString);
                            }
                            send({ step: "executing" });
                            const retryResult = await adapter.executeQuery(retrySanitized);
                            if (retryResult.rows.length > 0) {
                                queryResult = retryResult;
                                sanitizedQuery = retrySanitized;
                            }
                        } catch {
                            // Retry failed, continue with original empty result
                        }
                    }

                    if (queryResult.rows.length === 0) {
                        send({ step: "error", error: "The query returned no results. Try a different question." });
                        controller.close();
                        return;
                    }

                    // Step 4: Charting
                    send({ step: "charting" });
                    const chartConfig = await formatChart(
                        queryResult.rows, queryResult.columns, prompt, locale
                    );

                    const response: DashboardQueryResponse = {
                        chartConfig,
                        generatedQuery: sanitizedQuery,
                        queryType: generated.queryType,
                        executionTimeMs: queryResult.executionTimeMs,
                        rowCount: queryResult.rowCount,
                    };

                    send({ step: "done", data: response });
                } finally {
                    await adapter.disconnect();
                }
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "An unexpected error occurred.";
                console.error("[/api/query/stream] Error:", message);
                send({ step: "error", error: message });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "application/x-ndjson",
            "Cache-Control": "no-cache",
            "Transfer-Encoding": "chunked",
        },
    });
}

// ============================================================================
// API Route: /api/suggestions
// ============================================================================
// POST: Generate AI-powered query suggestions based on database schema.
// ============================================================================

import { NextResponse } from "next/server";
import { generateSuggestions } from "@/services/suggestion-generator";
import type { DatabaseSchema } from "@/types/database";
import type { ApiResponse } from "@/types/api";

interface SuggestionRequestBody {
    schema: DatabaseSchema;
    locale?: string;
}

export async function POST(
    request: Request
): Promise<NextResponse<ApiResponse<{ suggestions: string[] }>>> {
    try {
        const body = (await request.json()) as SuggestionRequestBody;

        if (!body.schema || !body.schema.tables.length) {
            return NextResponse.json(
                { success: false, error: "Schema is required." },
                { status: 400 }
            );
        }

        const suggestions = await generateSuggestions(
            body.schema,
            body.locale || "en"
        );

        return NextResponse.json({
            success: true,
            data: { suggestions },
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to generate suggestions.";
        console.error("[/api/suggestions] Error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

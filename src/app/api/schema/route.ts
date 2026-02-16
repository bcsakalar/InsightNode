// ============================================================================
// API Route: /api/schema
// ============================================================================
// POST: Fetch and return the database schema for a given connection.
// ============================================================================

import { NextResponse } from "next/server";
import { createDatabaseAdapter } from "@/lib/db";
import type { ConnectionFormData } from "@/types/database";
import type { ApiResponse } from "@/types/api";
import type { DatabaseSchema } from "@/types/database";

export async function POST(
    request: Request
): Promise<NextResponse<ApiResponse<DatabaseSchema>>> {
    try {
        const body = (await request.json()) as ConnectionFormData;
        const adapter = createDatabaseAdapter({ ...body, id: "schema-fetch" });

        await adapter.connect();
        const schema = await adapter.getSchema();
        await adapter.disconnect();

        return NextResponse.json({
            success: true,
            data: schema,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to fetch schema.";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

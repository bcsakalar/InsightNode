// ============================================================================
// API Route: /api/connections
// ============================================================================
// POST: Test a database connection and return its schema on success.
// ============================================================================

import { NextResponse } from "next/server";
import { createDatabaseAdapter } from "@/lib/db";
import { validateConnectionForm } from "@/utils/validators";
import type { ConnectionFormData } from "@/types/database";
import type { ApiResponse, ConnectionTestResponse } from "@/types/api";
import type { DatabaseSchema } from "@/types/database";

export async function POST(
    request: Request
): Promise<NextResponse<ApiResponse<ConnectionTestResponse & { schema?: DatabaseSchema }>>> {
    try {
        const body = (await request.json()) as Partial<ConnectionFormData>;

        // Validate form fields
        const validation = validateConnectionForm(body);
        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            return NextResponse.json(
                { success: false, error: firstError },
                { status: 400 }
            );
        }

        // Build a connection object with a temporary ID
        const connection = {
            id: "test-" + Date.now(),
            ...body,
        } as ConnectionFormData & { id: string };

        // Create the adapter and test the connection
        const adapter = createDatabaseAdapter(connection);

        try {
            const isConnected = await adapter.testConnection();

            if (!isConnected) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Could not connect to the database. Please check your credentials.",
                    },
                    { status: 400 }
                );
            }

            // Connection succeeded — fetch schema
            await adapter.connect();
            const schema = await adapter.getSchema();
            await adapter.disconnect();

            return NextResponse.json({
                success: true,
                data: {
                    connected: true,
                    message: `Successfully connected to ${body.type} database "${body.database}".`,
                    schema,
                },
            });
        } finally {
            // Ensure cleanup
            try {
                await adapter.disconnect();
            } catch {
                // Ignore disconnect errors during cleanup
            }
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

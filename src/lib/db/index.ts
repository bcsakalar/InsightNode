// ============================================================================
// Database Adapter Factory
// ============================================================================
// Returns the correct adapter based on the database type.
// ============================================================================

import type { DatabaseAdapter, DatabaseConnection } from "@/types/database";
import { PostgresAdapter } from "./postgres";
import { MySQLAdapter } from "./mysql";
import { MongoDBAdapter } from "./mongodb-client";

/**
 * Factory function that creates the appropriate database adapter
 * based on the connection's database type.
 */
export function createDatabaseAdapter(
    connection: DatabaseConnection
): DatabaseAdapter {
    switch (connection.type) {
        case "postgresql":
            return new PostgresAdapter(connection);
        case "mysql":
            return new MySQLAdapter(connection);
        case "mongodb":
            return new MongoDBAdapter(connection);
        default: {
            // Exhaustiveness check — TypeScript will error if a type is missed
            const _exhaustive: never = connection.type;
            throw new Error(`Unsupported database type: ${_exhaustive}`);
        }
    }
}

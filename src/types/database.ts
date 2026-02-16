// ============================================================================
// Database Type Definitions
// ============================================================================

/** Supported database types */
export type DatabaseType = "postgresql" | "mysql" | "mongodb";

/** Database connection configuration */
export interface DatabaseConnection {
    id: string;
    name: string;
    type: DatabaseType;
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    ssl: boolean;
    /** MongoDB connection string URI (mongodb:// or mongodb+srv://) */
    connectionString?: string;
    /** How the user chose to connect — 'manual' fields or 'uri' string */
    connectionMode?: "manual" | "uri";
}

/** Form data for creating/editing a connection (password may be optional on display) */
export type ConnectionFormData = Omit<DatabaseConnection, "id">;

/** Represents a column/field in a database table or collection */
export interface ColumnSchema {
    name: string;
    type: string;
    nullable: boolean;
}

/** Represents a table (SQL) or collection (MongoDB) */
export interface TableSchema {
    name: string;
    columns: ColumnSchema[];
}

/** The full schema for a connected database */
export interface DatabaseSchema {
    tables: TableSchema[];
    databaseType: DatabaseType;
}

/** Result from executing a database query */
export interface QueryResult {
    rows: Record<string, unknown>[];
    columns: string[];
    rowCount: number;
    executionTimeMs: number;
}

/** Database adapter interface — implemented per driver */
export interface DatabaseAdapter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getSchema(): Promise<DatabaseSchema>;
    executeQuery(query: string): Promise<QueryResult>;
    testConnection(): Promise<boolean>;
}

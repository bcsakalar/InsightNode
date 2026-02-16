// ============================================================================
// PostgreSQL Database Adapter
// ============================================================================

import pg from "pg";
import type {
    DatabaseAdapter,
    DatabaseConnection,
    DatabaseSchema,
    QueryResult,
    TableSchema,
    ColumnSchema,
} from "@/types/database";

const { Pool } = pg;

/**
 * PostgreSQL adapter using the `pg` library.
 * Creates a connection pool for efficient query execution.
 */
export class PostgresAdapter implements DatabaseAdapter {
    private pool: pg.Pool | null = null;
    private connection: DatabaseConnection;

    constructor(connection: DatabaseConnection) {
        this.connection = connection;
    }

    async connect(): Promise<void> {
        this.pool = new Pool({
            host: this.connection.host,
            port: this.connection.port,
            user: this.connection.user,
            password: this.connection.password,
            database: this.connection.database,
            ssl: this.connection.ssl ? { rejectUnauthorized: false } : false,
            max: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        });
    }

    async disconnect(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.connect();
            const client = await this.pool!.connect();
            await client.query("SELECT 1");
            client.release();
            return true;
        } catch {
            return false;
        } finally {
            await this.disconnect();
        }
    }

    async getSchema(): Promise<DatabaseSchema> {
        if (!this.pool) await this.connect();

        const tablesResult = await this.pool!.query<{ table_name: string }>(
            `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name`
        );

        const tables: TableSchema[] = [];

        for (const row of tablesResult.rows) {
            const columnsResult = await this.pool!.query<{
                column_name: string;
                data_type: string;
                is_nullable: string;
            }>(
                `SELECT column_name, data_type, is_nullable 
         FROM information_schema.columns 
         WHERE table_schema = 'public' AND table_name = $1 
         ORDER BY ordinal_position`,
                [row.table_name]
            );

            const columns: ColumnSchema[] = columnsResult.rows.map((col) => ({
                name: col.column_name,
                type: col.data_type,
                nullable: col.is_nullable === "YES",
            }));

            tables.push({ name: row.table_name, columns });
        }

        return { tables, databaseType: "postgresql" };
    }

    async executeQuery(query: string): Promise<QueryResult> {
        if (!this.pool) await this.connect();

        const start = performance.now();
        const result = await this.pool!.query(query);
        const executionTimeMs = Math.round(performance.now() - start);

        return {
            rows: result.rows as Record<string, unknown>[],
            columns: result.fields.map((f) => f.name),
            rowCount: result.rowCount ?? 0,
            executionTimeMs,
        };
    }
}

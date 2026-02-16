// ============================================================================
// MySQL Database Adapter
// ============================================================================

import mysql from "mysql2/promise";
import type {
    DatabaseAdapter,
    DatabaseConnection,
    DatabaseSchema,
    QueryResult,
    TableSchema,
    ColumnSchema,
} from "@/types/database";

/**
 * MySQL adapter using the `mysql2/promise` library.
 * Creates a connection pool for efficient query execution.
 */
export class MySQLAdapter implements DatabaseAdapter {
    private pool: mysql.Pool | null = null;
    private connection: DatabaseConnection;

    constructor(connection: DatabaseConnection) {
        this.connection = connection;
    }

    async connect(): Promise<void> {
        this.pool = mysql.createPool({
            host: this.connection.host,
            port: this.connection.port,
            user: this.connection.user,
            password: this.connection.password,
            database: this.connection.database,
            ssl: this.connection.ssl ? {} : undefined,
            connectionLimit: 5,
            connectTimeout: 10000,
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
            const conn = await this.pool!.getConnection();
            await conn.query("SELECT 1");
            conn.release();
            return true;
        } catch {
            return false;
        } finally {
            await this.disconnect();
        }
    }

    async getSchema(): Promise<DatabaseSchema> {
        if (!this.pool) await this.connect();

        const [tableRows] = await this.pool!.query<mysql.RowDataPacket[]>(
            `SELECT TABLE_NAME as table_name FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ? 
       ORDER BY TABLE_NAME`,
            [this.connection.database]
        );

        const tables: TableSchema[] = [];

        for (const row of tableRows) {
            const [columnRows] = await this.pool!.query<mysql.RowDataPacket[]>(
                `SELECT COLUMN_NAME as column_name, DATA_TYPE as data_type, IS_NULLABLE as is_nullable
         FROM information_schema.COLUMNS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? 
         ORDER BY ORDINAL_POSITION`,
                [this.connection.database, row.table_name]
            );

            const columns: ColumnSchema[] = columnRows.map((col) => ({
                name: col.column_name as string,
                type: col.data_type as string,
                nullable: col.is_nullable === "YES",
            }));

            tables.push({ name: row.table_name as string, columns });
        }

        return { tables, databaseType: "mysql" };
    }

    async executeQuery(query: string): Promise<QueryResult> {
        if (!this.pool) await this.connect();

        const start = performance.now();
        const [rows, fields] = await this.pool!.query<mysql.RowDataPacket[]>(query);
        const executionTimeMs = Math.round(performance.now() - start);

        const columns = fields
            ? (fields as mysql.FieldPacket[]).map((f) => f.name)
            : Object.keys(rows[0] || {});

        return {
            rows: rows as Record<string, unknown>[],
            columns,
            rowCount: rows.length,
            executionTimeMs,
        };
    }
}

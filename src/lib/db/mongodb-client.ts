// ============================================================================
// MongoDB Database Adapter
// ============================================================================

import { MongoClient, type Document } from "mongodb";
import type {
    DatabaseAdapter,
    DatabaseConnection,
    DatabaseSchema,
    QueryResult,
    TableSchema,
    ColumnSchema,
} from "@/types/database";

/**
 * MongoDB adapter using the official `mongodb` driver.
 * Schema is inferred from sampling documents in each collection.
 */
export class MongoDBAdapter implements DatabaseAdapter {
    private client: MongoClient | null = null;
    private connection: DatabaseConnection;

    constructor(connection: DatabaseConnection) {
        this.connection = connection;
    }

    /** Build the MongoDB connection URI */
    private buildUri(): string {
        // If user provided a connection string directly, use it
        if (this.connection.connectionMode === "uri" && this.connection.connectionString) {
            return this.connection.connectionString;
        }

        const { host, port, user, password, database, ssl } = this.connection;
        const auth = user && password ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}@` : "";
        const sslParam = ssl ? "?tls=true&tlsAllowInvalidCertificates=true" : "";
        return `mongodb://${auth}${host}:${port}/${database}${sslParam}`;
    }

    async connect(): Promise<void> {
        this.client = new MongoClient(this.buildUri(), {
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
        });
        await this.client.connect();
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = null;
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.connect();
            const db = this.client!.db(this.connection.database);
            await db.command({ ping: 1 });
            return true;
        } catch {
            return false;
        } finally {
            await this.disconnect();
        }
    }

    async getSchema(): Promise<DatabaseSchema> {
        if (!this.client) await this.connect();

        const db = this.client!.db(this.connection.database);
        const collections = await db.listCollections().toArray();
        const tables: TableSchema[] = [];

        for (const col of collections) {
            // Sample one document to infer schema
            const sampleDoc = await db
                .collection(col.name)
                .findOne({});

            const columns: ColumnSchema[] = sampleDoc
                ? Object.entries(sampleDoc).map(([key, value]) => ({
                    name: key,
                    type: inferMongoType(value),
                    nullable: false,
                }))
                : [];

            tables.push({ name: col.name, columns });
        }

        return { tables, databaseType: "mongodb" };
    }

    async executeQuery(query: string): Promise<QueryResult> {
        if (!this.client) await this.connect();

        const db = this.client!.db(this.connection.database);

        // Parse the query string as JSON — expected format:
        // { "collection": "name", "operation": "find|aggregate", "pipeline": [...] | "filter": {...} }
        let parsed: {
            collection: string;
            operation: string;
            pipeline?: Document[];
            filter?: Document;
        };

        try {
            parsed = JSON.parse(query);
        } catch {
            throw new Error(
                "MongoDB query must be a valid JSON object with: collection, operation, and filter/pipeline."
            );
        }

        const collection = db.collection(parsed.collection);
        const start = performance.now();
        let rows: Document[];

        if (parsed.operation === "aggregate" && parsed.pipeline) {
            rows = await collection.aggregate(parsed.pipeline).toArray();
        } else {
            rows = await collection.find(parsed.filter || {}).limit(1000).toArray();
        }

        const executionTimeMs = Math.round(performance.now() - start);
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

        return {
            rows: rows as Record<string, unknown>[],
            columns,
            rowCount: rows.length,
            executionTimeMs,
        };
    }
}

/** Infer a human-readable type string from a MongoDB document value */
function inferMongoType(value: unknown): string {
    if (value === null || value === undefined) return "null";
    if (Array.isArray(value)) return "array";
    if (value instanceof Date) return "date";
    if (typeof value === "object") return "object";
    return typeof value; // string, number, boolean
}

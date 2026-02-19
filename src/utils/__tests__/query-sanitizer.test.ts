// ============================================================================
// Query Sanitizer Tests — Critical security boundary
// ============================================================================

import { describe, it, expect } from "vitest";
import {
    sanitizeSQLQuery,
    sanitizeMongoOperation,
    QuerySanitizationError,
} from "../query-sanitizer";

describe("sanitizeSQLQuery", () => {
    // ── Valid Queries ─────────────────────────────────────────────────
    it("should allow a simple SELECT query", () => {
        const query = "SELECT * FROM users";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    it("should allow SELECT with WHERE clause", () => {
        const query = "SELECT name, email FROM users WHERE id = 1";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    it("should allow SELECT with JOINs", () => {
        const query =
            "SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    it("should allow SELECT with GROUP BY and aggregate functions", () => {
        const query =
            "SELECT category, COUNT(*) as cnt FROM products GROUP BY category ORDER BY cnt DESC";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    it("should allow WITH (CTE) queries", () => {
        const query =
            "WITH monthly AS (SELECT date_trunc('month', created_at) as m, COUNT(*) as c FROM orders GROUP BY 1) SELECT * FROM monthly";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    it("should allow LIMIT and OFFSET", () => {
        const query = "SELECT * FROM users LIMIT 10 OFFSET 20";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    it("should allow subqueries in FROM", () => {
        const query =
            "SELECT t.name FROM (SELECT name FROM users WHERE active = true) t";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    it("should allow HAVING clause", () => {
        const query =
            "SELECT category, SUM(price) as total FROM products GROUP BY category HAVING SUM(price) > 100";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    // ── Destructive Operations ────────────────────────────────────────
    it("should block DROP TABLE", () => {
        expect(() => sanitizeSQLQuery("DROP TABLE users")).toThrow(
            QuerySanitizationError
        );
    });

    it("should block DELETE FROM", () => {
        expect(() => sanitizeSQLQuery("DELETE FROM users WHERE id = 1")).toThrow(
            QuerySanitizationError
        );
    });

    it("should block INSERT INTO", () => {
        expect(() =>
            sanitizeSQLQuery("INSERT INTO users (name) VALUES ('test')")
        ).toThrow(QuerySanitizationError);
    });

    it("should block UPDATE SET", () => {
        expect(() =>
            sanitizeSQLQuery("UPDATE users SET name = 'hacked' WHERE id = 1")
        ).toThrow(QuerySanitizationError);
    });

    it("should block ALTER TABLE", () => {
        expect(() =>
            sanitizeSQLQuery("ALTER TABLE users ADD COLUMN hacked boolean")
        ).toThrow(QuerySanitizationError);
    });

    it("should block TRUNCATE", () => {
        expect(() => sanitizeSQLQuery("TRUNCATE TABLE users")).toThrow(
            QuerySanitizationError
        );
    });

    it("should block GRANT", () => {
        expect(() =>
            sanitizeSQLQuery("GRANT ALL PRIVILEGES ON users TO hacker")
        ).toThrow(QuerySanitizationError);
    });

    it("should block REVOKE", () => {
        expect(() =>
            sanitizeSQLQuery("REVOKE ALL ON users FROM readonly_user")
        ).toThrow(QuerySanitizationError);
    });

    it("should block EXEC/EXECUTE", () => {
        expect(() => sanitizeSQLQuery("EXEC sp_executesql 'DROP TABLE users'")).toThrow(
            QuerySanitizationError
        );
    });

    it("should block CALL", () => {
        expect(() => sanitizeSQLQuery("CALL dangerous_procedure()")).toThrow(
            QuerySanitizationError
        );
    });

    // ── Case Insensitivity ────────────────────────────────────────────
    it("should block case-insensitive: sElEcT is ok but DrOp is not", () => {
        expect(() => sanitizeSQLQuery("DrOp TaBlE users")).toThrow(
            QuerySanitizationError
        );
    });

    it("should allow case-insensitive SELECT", () => {
        const query = "SeLeCt * FrOm users";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    // ── Comment Stripping ─────────────────────────────────────────────
    it("should strip single-line comments hiding destructive SQL", () => {
        expect(() =>
            sanitizeSQLQuery("SELECT 1; -- DROP TABLE users")
        ).not.toThrow();
    });

    it("should strip multi-line comments hiding destructive SQL", () => {
        expect(() =>
            sanitizeSQLQuery("SELECT 1 /* DELETE FROM users */")
        ).not.toThrow();
    });

    // ── Subquery Attacks ──────────────────────────────────────────────
    it("should block DELETE inside a subquery", () => {
        expect(() =>
            sanitizeSQLQuery("SELECT * FROM (DELETE FROM users RETURNING *) x")
        ).toThrow(QuerySanitizationError);
    });

    it("should block UPDATE inside a subquery", () => {
        expect(() =>
            sanitizeSQLQuery(
                "SELECT * FROM (UPDATE users SET role='admin' RETURNING *) x"
            )
        ).toThrow(QuerySanitizationError);
    });

    // ── INTO OUTFILE / DUMPFILE ───────────────────────────────────────
    it("should block SELECT INTO OUTFILE", () => {
        expect(() =>
            sanitizeSQLQuery("SELECT * FROM users INTO OUTFILE '/tmp/data.csv'")
        ).toThrow(QuerySanitizationError);
    });

    it("should block SELECT INTO DUMPFILE", () => {
        expect(() =>
            sanitizeSQLQuery("SELECT * FROM users INTO DUMPFILE '/tmp/data.bin'")
        ).toThrow(QuerySanitizationError);
    });

    // ── LOAD / SOURCE ─────────────────────────────────────────────────
    it("should block LOAD DATA", () => {
        expect(() =>
            sanitizeSQLQuery("LOAD DATA INFILE '/tmp/data.csv' INTO TABLE users")
        ).toThrow(QuerySanitizationError);
    });

    // ── Edge Cases ────────────────────────────────────────────────────
    it("should throw on empty query", () => {
        expect(() => sanitizeSQLQuery("")).toThrow(QuerySanitizationError);
    });

    it("should throw on whitespace-only query", () => {
        expect(() => sanitizeSQLQuery("   \n\t  ")).toThrow(
            QuerySanitizationError
        );
    });

    it("should enforce max query length", () => {
        const longQuery = "SELECT " + "a".repeat(15000) + " FROM users";
        expect(() => sanitizeSQLQuery(longQuery)).toThrow(
            QuerySanitizationError
        );
    });

    it("should not false-positive on column names with reserved words", () => {
        // e.g., "updated_at" contains "update" but should be ok
        const query = "SELECT updated_at, created_at FROM events";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    it("should not false-positive on 'settings' table name", () => {
        const query = "SELECT * FROM settings";
        expect(sanitizeSQLQuery(query)).toBe(query);
    });

    it("should block MySQL nested comments", () => {
        expect(() =>
            sanitizeSQLQuery("SELECT /*!50000 DROP TABLE users*/")
        ).toThrow(QuerySanitizationError);
    });
});

describe("sanitizeMongoOperation", () => {
    it("should allow 'find'", () => {
        expect(sanitizeMongoOperation("find")).toBe("find");
    });

    it("should allow 'aggregate'", () => {
        expect(sanitizeMongoOperation("aggregate")).toBe("aggregate");
    });

    it("should allow 'countDocuments'", () => {
        expect(sanitizeMongoOperation("countDocuments")).toBe("countdocuments");
    });

    it("should allow 'distinct'", () => {
        expect(sanitizeMongoOperation("distinct")).toBe("distinct");
    });

    it("should allow 'estimatedDocumentCount'", () => {
        expect(sanitizeMongoOperation("estimatedDocumentCount")).toBe(
            "estimateddocumentcount"
        );
    });

    it("should block 'deleteMany'", () => {
        expect(() => sanitizeMongoOperation("deleteMany")).toThrow(
            QuerySanitizationError
        );
    });

    it("should block 'insertOne'", () => {
        expect(() => sanitizeMongoOperation("insertOne")).toThrow(
            QuerySanitizationError
        );
    });

    it("should block 'updateMany'", () => {
        expect(() => sanitizeMongoOperation("updateMany")).toThrow(
            QuerySanitizationError
        );
    });

    it("should block 'drop'", () => {
        expect(() => sanitizeMongoOperation("drop")).toThrow(
            QuerySanitizationError
        );
    });

    it("should block 'rename'", () => {
        expect(() => sanitizeMongoOperation("rename")).toThrow(
            QuerySanitizationError
        );
    });

    it("should handle case-insensitive input", () => {
        expect(sanitizeMongoOperation("FIND")).toBe("find");
        expect(sanitizeMongoOperation("Aggregate")).toBe("aggregate");
    });
});

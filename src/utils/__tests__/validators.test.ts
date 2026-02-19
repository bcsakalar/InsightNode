// ============================================================================
// Validators Tests — Input validation for forms and prompts
// ============================================================================

import { describe, it, expect } from "vitest";
import { validateConnectionForm, sanitizePrompt, DEFAULT_PORTS } from "../validators";

describe("validateConnectionForm", () => {
    const validPostgres = {
        name: "Test DB",
        type: "postgresql" as const,
        host: "localhost",
        port: 5432,
        user: "admin",
        password: "secret",
        database: "testdb",
        ssl: false,
    };

    it("should pass with valid PostgreSQL data", () => {
        const result = validateConnectionForm(validPostgres);
        expect(result.valid).toBe(true);
        expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it("should fail when name is missing", () => {
        const result = validateConnectionForm({ ...validPostgres, name: "" });
        expect(result.valid).toBe(false);
        expect(result.errors.name).toBeDefined();
    });

    it("should fail when host is missing", () => {
        const result = validateConnectionForm({ ...validPostgres, host: "" });
        expect(result.valid).toBe(false);
        expect(result.errors.host).toBeDefined();
    });

    it("should fail when port is out of range (0)", () => {
        const result = validateConnectionForm({ ...validPostgres, port: 0 });
        expect(result.valid).toBe(false);
        expect(result.errors.port).toBeDefined();
    });

    it("should fail when port is out of range (>65535)", () => {
        const result = validateConnectionForm({ ...validPostgres, port: 70000 });
        expect(result.valid).toBe(false);
        expect(result.errors.port).toBeDefined();
    });

    it("should fail when user is missing", () => {
        const result = validateConnectionForm({ ...validPostgres, user: "" });
        expect(result.valid).toBe(false);
        expect(result.errors.user).toBeDefined();
    });

    it("should fail when database is missing", () => {
        const result = validateConnectionForm({ ...validPostgres, database: "" });
        expect(result.valid).toBe(false);
        expect(result.errors.database).toBeDefined();
    });

    // MongoDB URI mode
    it("should pass with valid MongoDB URI", () => {
        const result = validateConnectionForm({
            name: "Mongo Prod",
            type: "mongodb",
            connectionMode: "uri",
            connectionString: "mongodb+srv://user:pass@cluster.mongodb.net",
            database: "mydb",
        });
        expect(result.valid).toBe(true);
    });

    it("should fail with invalid MongoDB URI prefix", () => {
        const result = validateConnectionForm({
            name: "Mongo Bad",
            type: "mongodb",
            connectionMode: "uri",
            connectionString: "postgresql://user:pass@localhost/db",
            database: "mydb",
        });
        expect(result.valid).toBe(false);
        expect(result.errors.connectionString).toBeDefined();
    });

    it("should fail when MongoDB URI is empty", () => {
        const result = validateConnectionForm({
            name: "Mongo Empty",
            type: "mongodb",
            connectionMode: "uri",
            connectionString: "",
            database: "mydb",
        });
        expect(result.valid).toBe(false);
        expect(result.errors.connectionString).toBeDefined();
    });
});

describe("sanitizePrompt", () => {
    it("should trim whitespace", () => {
        expect(sanitizePrompt("  hello world  ")).toBe("hello world");
    });

    it("should limit to 2000 characters", () => {
        const longPrompt = "a".repeat(3000);
        expect(sanitizePrompt(longPrompt)).toHaveLength(2000);
    });

    it("should handle empty string", () => {
        expect(sanitizePrompt("")).toBe("");
    });

    it("should handle whitespace-only string", () => {
        expect(sanitizePrompt("   ")).toBe("");
    });
});

describe("DEFAULT_PORTS", () => {
    it("should have correct default port for postgresql", () => {
        expect(DEFAULT_PORTS.postgresql).toBe(5432);
    });

    it("should have correct default port for mysql", () => {
        expect(DEFAULT_PORTS.mysql).toBe(3306);
    });

    it("should have correct default port for mongodb", () => {
        expect(DEFAULT_PORTS.mongodb).toBe(27017);
    });
});

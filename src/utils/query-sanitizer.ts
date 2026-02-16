// ============================================================================
// Query Sanitizer — Security Layer
// ============================================================================
// Prevents destructive SQL operations and restricts MongoDB to safe operations.
// This is a critical security boundary for the read-only enforcement.
// ============================================================================

/** Error thrown when a query contains forbidden operations */
export class QuerySanitizationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "QuerySanitizationError";
    }
}

/**
 * Destructive SQL keywords that must NEVER be executed.
 * Checked case-insensitively against the full query string.
 */
const FORBIDDEN_SQL_KEYWORDS: readonly string[] = [
    "DROP",
    "DELETE",
    "UPDATE",
    "INSERT",
    "TRUNCATE",
    "ALTER",
    "CREATE",
    "GRANT",
    "REVOKE",
    "EXEC",
    "EXECUTE",
    "CALL",
    "INTO",       // INSERT INTO, SELECT INTO
    "MERGE",
    "REPLACE",
    "RENAME",
    "SET ",        // SET variable = ...
] as const;

/**
 * MongoDB operations that ARE allowed (whitelist approach).
 * Everything else is blocked.
 */
const ALLOWED_MONGO_OPERATIONS: readonly string[] = [
    "find",
    "aggregate",
    "countDocuments",
    "estimatedDocumentCount",
    "distinct",
] as const;

/**
 * Build a regex pattern that matches forbidden keywords as whole words.
 * Uses word boundaries to avoid false positives (e.g., "UPDATED_AT" in a column name).
 */
function buildForbiddenPattern(): RegExp {
    const escaped = FORBIDDEN_SQL_KEYWORDS.map((kw) =>
        kw.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    // Match keyword at word boundary, case-insensitive
    return new RegExp(`\\b(${escaped.join("|")})\\b`, "i");
}

const FORBIDDEN_PATTERN = buildForbiddenPattern();

/**
 * Sanitize a SQL query string. Throws if destructive operations are detected.
 *
 * @param query - The raw SQL query to validate
 * @returns The original query if safe
 * @throws {QuerySanitizationError} if destructive keywords are found
 */
export function sanitizeSQLQuery(query: string): string {
    // Remove comments that could hide malicious SQL
    const cleanedQuery = query
        .replace(/--.*$/gm, "")        // Single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, "")  // Multi-line comments
        .trim();

    if (!cleanedQuery) {
        throw new QuerySanitizationError("Query cannot be empty.");
    }

    const match = FORBIDDEN_PATTERN.exec(cleanedQuery);
    if (match) {
        throw new QuerySanitizationError(
            `Forbidden operation detected: "${match[1].toUpperCase()}". ` +
            "Only SELECT queries are allowed for security reasons."
        );
    }

    // Ensure the query starts with SELECT (after stripping whitespace)
    if (!/^\s*SELECT\b/i.test(cleanedQuery) && !/^\s*WITH\b/i.test(cleanedQuery)) {
        throw new QuerySanitizationError(
            "Only SELECT and WITH (CTE) queries are allowed."
        );
    }

    return query.trim();
}

/**
 * Validate that a MongoDB operation is in the allowed whitelist.
 *
 * @param operation - The MongoDB operation name (e.g., "find", "aggregate")
 * @returns The operation if safe
 * @throws {QuerySanitizationError} if operation is not whitelisted
 */
export function sanitizeMongoOperation(operation: string): string {
    const normalized = operation.trim().toLowerCase();

    if (!ALLOWED_MONGO_OPERATIONS.includes(normalized)) {
        throw new QuerySanitizationError(
            `MongoDB operation "${operation}" is not allowed. ` +
            `Permitted operations: ${ALLOWED_MONGO_OPERATIONS.join(", ")}`
        );
    }

    return normalized;
}

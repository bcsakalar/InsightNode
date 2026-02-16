// ============================================================================
// Validators — Input Validation Utilities
// ============================================================================

import type { ConnectionFormData, DatabaseType } from "@/types/database";

/** Validation result with optional field-level errors */
export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

/** Default port numbers per database type */
export const DEFAULT_PORTS: Record<DatabaseType, number> = {
    postgresql: 5432,
    mysql: 3306,
    mongodb: 27017,
};

/**
 * Validate a database connection form.
 * Checks required fields, port range, and hostname format.
 */
export function validateConnectionForm(
    data: Partial<ConnectionFormData>
): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
        errors.name = "Connection name is required.";
    }

    if (!data.type) {
        errors.type = "Database type is required.";
    }

    // MongoDB URI mode — only need name + connectionString
    if (data.type === "mongodb" && data.connectionMode === "uri") {
        if (!data.connectionString?.trim()) {
            errors.connectionString = "Connection string is required.";
        } else if (
            !data.connectionString.startsWith("mongodb://") &&
            !data.connectionString.startsWith("mongodb+srv://")
        ) {
            errors.connectionString = "Must start with mongodb:// or mongodb+srv://";
        }

        if (!data.database?.trim()) {
            errors.database = "Database name is required.";
        }

        return { valid: Object.keys(errors).length === 0, errors };
    }

    // Manual mode — standard field validation
    if (!data.host?.trim()) {
        errors.host = "Host is required.";
    }

    if (!data.port || data.port < 1 || data.port > 65535) {
        errors.port = "Port must be between 1 and 65535.";
    }

    if (!data.user?.trim()) {
        errors.user = "Username is required.";
    }

    if (!data.database?.trim()) {
        errors.database = "Database name is required.";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Sanitize a user prompt by trimming and limiting length.
 * Does NOT strip special characters — the prompt is sent to Gemini, not SQL.
 */
export function sanitizePrompt(prompt: string): string {
    return prompt.trim().slice(0, 2000);
}

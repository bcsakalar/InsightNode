// ============================================================================
// Query Generator Service
// ============================================================================
// Step 1 of the AI pipeline: Natural language → Database query.
// Sends the user prompt + database schema to Gemini with the
// execute_database_query function declaration.
// ============================================================================

import { generateWithTools } from "@/lib/ai/gemini-client";
import { executeDatabaseQueryDeclaration } from "@/lib/ai/function-declarations";
import type { DatabaseSchema, DatabaseType } from "@/types/database";

/** Result of query generation */
export interface GeneratedQuery {
    queryString: string;
    queryType: "sql" | "aggregation";
    explanation: string;
}

/**
 * Generate a database query from a natural language prompt.
 *
 * @param userPrompt - The user's natural language question
 * @param schema - The database schema (tables, columns)
 * @param dbType - The database type to generate for
 * @returns A generated query string, type, and explanation
 */
export async function generateQuery(
    userPrompt: string,
    schema: DatabaseSchema,
    dbType: DatabaseType,
    locale: string = "en"
): Promise<GeneratedQuery> {
    // Build schema description for the prompt
    const schemaDescription = schema.tables
        .map((table) => {
            const cols = table.columns
                .map((col) => `  - ${col.name} (${col.type}${col.nullable ? ", nullable" : ""})`)
                .join("\n");
            return `Table/Collection: ${table.name}\nColumns/Fields:\n${cols}`;
        })
        .join("\n\n");

    // Build the system+user prompt
    const prompt = buildQueryPrompt(userPrompt, schemaDescription, dbType, locale);

    // Call Gemini with function calling in ANY mode
    const response = await generateWithTools(prompt, [
        executeDatabaseQueryDeclaration,
    ]);

    // Extract function call from response
    const functionCalls = response.functionCalls;
    if (!functionCalls || functionCalls.length === 0) {
        throw new Error(
            "Gemini did not generate a function call. Please try rephrasing your question."
        );
    }

    const call = functionCalls[0];
    if (call.name !== "execute_database_query") {
        throw new Error(`Unexpected function call: ${call.name}`);
    }

    const args = call.args as Record<string, string>;

    return {
        queryString: args.query_string,
        queryType: args.query_type as "sql" | "aggregation",
        explanation: args.explanation,
    };
}

/** Build the prompt for query generation */
function buildQueryPrompt(
    userPrompt: string,
    schemaDescription: string,
    dbType: DatabaseType,
    locale: string
): string {
    const dbLabel =
        dbType === "postgresql"
            ? "PostgreSQL"
            : dbType === "mysql"
                ? "MySQL"
                : "MongoDB";

    return `You are an expert ${dbLabel} database analyst. The user wants to query their database using natural language.

DATABASE TYPE: ${dbLabel}
DATABASE SCHEMA:
${schemaDescription}

USER QUESTION: "${userPrompt}"

INSTRUCTIONS:
- Generate a valid, read-only query to answer the user's question.
${dbType === "mongodb"
            ? '- For MongoDB: return a JSON string with "collection", "operation" (find or aggregate), and "filter" or "pipeline".'
            : "- For SQL: return a SELECT query only. Never use INSERT, UPDATE, DELETE, DROP, or any destructive operations."
        }
- CRITICAL: When the user asks for counts, totals, distributions, rankings, or comparisons, you MUST use GROUP BY with aggregate functions (COUNT, SUM, AVG, etc.). Never return raw individual rows for aggregate questions.
- Use appropriate JOINs, GROUP BY, ORDER BY, and aggregate functions as needed.
- Always alias columns with clear, descriptive names (e.g., AS category, AS total_count).
- Limit results to a reasonable number (e.g., LIMIT 100 for SQL, .limit(100) for Mongo) unless the user specifies otherwise.
- Make the query efficient and correct.
- The query results will be used to render a chart, so return data that maps well to chart axes (categories on one column, values on another).
- ${locale === "tr" ? "Generate all explanations in Turkish (Türkçe)." : "Generate all explanations in English."}

Call the execute_database_query function with your generated query.`;
}

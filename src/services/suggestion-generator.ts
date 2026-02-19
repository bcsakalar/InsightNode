// ============================================================================
// Suggestion Generator Service
// ============================================================================
// Generates smart query suggestions based on the database schema.
// Uses Gemini AI to produce context-aware questions.
// ============================================================================

import { generateWithTools } from "@/lib/ai/gemini-client";
import { suggestQueriesDeclaration } from "@/lib/ai/function-declarations";
import type { DatabaseSchema } from "@/types/database";

/**
 * Generate smart query suggestions based on the database schema.
 */
export async function generateSuggestions(
    schema: DatabaseSchema,
    locale: string = "en"
): Promise<string[]> {
    const schemaDescription = schema.tables
        .map((table) => {
            const cols = table.columns
                .map((col) => `  - ${col.name} (${col.type})`)
                .join("\n");
            return `Table/Collection: ${table.name}\nColumns/Fields:\n${cols}`;
        })
        .join("\n\n");

    const prompt = `You are a data analysis expert. Based on the following database schema, suggest 6 interesting and diverse questions that a user could ask to explore their data effectively.

DATABASE SCHEMA:
${schemaDescription}

DATABASE TYPE: ${schema.databaseType}

INSTRUCTIONS:
- Generate exactly 6 diverse questions that cover different aspects of the data.
- Include a mix: aggregations, trends (if date columns exist), comparisons, distributions, rankings.
- Questions should be specific to the actual table and column names in the schema.
- Keep questions concise (under 80 characters each).
- ${locale === "tr" ? "Generate all questions in Turkish (Türkçe)." : "Generate all questions in English."}

Call the suggest_queries function with your suggestions.`;

    const response = await generateWithTools(prompt, [suggestQueriesDeclaration]);
    const functionCalls = response.functionCalls;

    if (!functionCalls || functionCalls.length === 0) {
        return getDefaultSuggestions(locale);
    }

    const args = functionCalls[0].args as { suggestions: string[] };
    return args.suggestions || getDefaultSuggestions(locale);
}

/** Fallback suggestions if Gemini fails */
function getDefaultSuggestions(locale: string): string[] {
    if (locale === "tr") {
        return [
            "Toplam kayıt sayısını göster",
            "En çok kullanılan kategoriler neler?",
            "Son 30 günün trendi nasıl?",
            "En yüksek değerlere sahip ilk 10 kayıt",
            "Verilerin dağılımını pasta grafik olarak göster",
            "Aylık bazda karşılaştırma yap",
        ];
    }
    return [
        "Show total record count",
        "What are the most common categories?",
        "Show the trend for the last 30 days",
        "Top 10 records by highest value",
        "Show data distribution as a pie chart",
        "Compare data month by month",
    ];
}

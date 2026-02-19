// ============================================================================
// Chart Formatter Service
// ============================================================================
// Step 2 of the AI pipeline: Query results → Recharts chart configuration.
// Sends data STRUCTURE (keys + sample) to Gemini for chart config generation.
// Privacy: full data never leaves the server to Gemini.
// ============================================================================

import { generateWithTools } from "@/lib/ai/gemini-client";
import { renderChartDeclaration } from "@/lib/ai/function-declarations";
import type { ChartConfig, ChartColor } from "@/types/chart";

/**
 * Generate a Recharts chart configuration from query results.
 * Only sends column names and a small sample to Gemini for privacy.
 *
 * @param data - The full query result rows
 * @param columns - Column names from the query
 * @param originalPrompt - The user's original question (for context)
 * @returns A ChartConfig ready for Recharts rendering
 */
export async function formatChart(
    data: Record<string, unknown>[],
    columns: string[],
    originalPrompt: string,
    locale: string = "en"
): Promise<ChartConfig> {
    // Privacy: only send column names and 3 sample rows
    const sampleRows = data.slice(0, 3);

    const prompt = buildChartPrompt(columns, sampleRows, originalPrompt, data.length, locale);

    const response = await generateWithTools(prompt, [renderChartDeclaration]);

    const functionCalls = response.functionCalls;
    if (!functionCalls || functionCalls.length === 0) {
        throw new Error(
            "Gemini did not generate a chart configuration. Please try again."
        );
    }

    const call = functionCalls[0];
    if (call.name !== "render_chart") {
        throw new Error(`Unexpected function call: ${call.name}`);
    }

    const args = call.args as Record<string, unknown>;

    // Build ChartConfig from function call args
    const dataKeys = args.data_keys as string[];
    const colorPalette = args.color_palette as string[];

    const colors: ChartColor[] = dataKeys.map((key, index) => ({
        key,
        color: colorPalette[index] || getDefaultColor(index),
    }));

    const chartType = args.chart_type as ChartConfig["chartType"];

    const config: ChartConfig = {
        chartType,
        title: args.title as string,
        xAxisKey: args.x_axis_key as string,
        dataKeys,
        colors,
        data, // Attach the full data to the config
    };

    // Add KPI-specific fields if applicable
    if (chartType === "kpi") {
        config.kpiValue = args.kpi_value as string | undefined;
        config.kpiLabel = args.kpi_label as string | undefined;
        config.kpiChange = args.kpi_change as number | undefined;
        config.kpiPrefix = args.kpi_prefix as string | undefined;
        config.kpiSuffix = args.kpi_suffix as string | undefined;

        // If kpiValue wasn't set by AI, try to extract from data
        if (!config.kpiValue && data.length > 0 && dataKeys.length > 0) {
            config.kpiValue = String(data[0][dataKeys[0]] ?? "");
        }
    }

    return config;
}

/** Build the prompt for chart formatting */
function buildChartPrompt(
    columns: string[],
    sampleRows: Record<string, unknown>[],
    userPrompt: string,
    totalRows: number,
    locale: string
): string {
    return `You are a data visualization expert. The user asked a question and got database results. 
Design the best chart to visualize this data.

USER QUESTION: "${userPrompt}"

DATA STRUCTURE:
- Columns: ${columns.join(", ")}
- Total rows: ${totalRows}
- Sample data (first 3 rows):
${JSON.stringify(sampleRows, null, 2)}

INSTRUCTIONS:
- Choose the most appropriate chart type for this data.
- For comparisons → bar chart
- For trends over time → line chart  
- For cumulative/volume data → area chart
- For proportions/distribution → pie chart
- For correlations between two numeric variables → scatter chart
- For a single numeric result (COUNT, SUM, AVG with 1 row) → kpi chart
- For detailed multi-column data with many rows → table
- Pick visually appealing, modern hex colors. Use a cohesive palette.
- The x_axis_key should be the category/label column.
- The data_keys should be the numeric/value columns to visualize.
- For KPI type: set kpi_value to the main number, kpi_label to describe it, and optionally kpi_prefix (currency symbol) and kpi_suffix (unit).
- ${locale === "tr" ? "Generate the chart title in Turkish (Türkçe)." : "Generate the chart title in English."}

Call the render_chart function with your chart configuration.`;
}

/** Fallback colors if Gemini returns fewer than needed */
function getDefaultColor(index: number): string {
    const defaults = [
        "#6366f1", // Indigo
        "#8b5cf6", // Violet
        "#ec4899", // Pink
        "#f43f5e", // Rose
        "#f97316", // Orange
        "#eab308", // Yellow
        "#22c55e", // Green
        "#06b6d4", // Cyan
    ];
    return defaults[index % defaults.length];
}

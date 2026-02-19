// ============================================================================
// Gemini Function Declarations (Tool Definitions)
// ============================================================================
// These define the structured tools that Gemini must call.
// Using the @google/genai Type enum for schema definitions.
// ============================================================================

import { Type } from "@google/genai";
import type { FunctionDeclaration } from "@google/genai";

/**
 * Function declaration for Step 1: Text → Database Query.
 * The model MUST call this tool with a valid query string.
 */
export const executeDatabaseQueryDeclaration: FunctionDeclaration = {
    name: "execute_database_query",
    description:
        "Generates and returns a database query based on the user's natural language request. " +
        "For SQL databases (PostgreSQL, MySQL), return a valid SELECT query. " +
        "For MongoDB, return a JSON object with collection, operation (find or aggregate), and filter/pipeline.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            query_string: {
                type: Type.STRING,
                description:
                    "The generated database query. For SQL: a SELECT statement. " +
                    "For MongoDB: a JSON string like {\"collection\": \"name\", \"operation\": \"find\", \"filter\": {}}",
            },
            query_type: {
                type: Type.STRING,
                enum: ["sql", "aggregation"],
                description:
                    "The type of query — 'sql' for PostgreSQL/MySQL, 'aggregation' for MongoDB.",
            },
            explanation: {
                type: Type.STRING,
                description:
                    "A brief human-readable explanation of what the query does.",
            },
        },
        required: ["query_string", "query_type", "explanation"],
    },
};

/**
 * Function declaration for Step 2: Data → Chart Configuration.
 * The model MUST call this tool with a valid Recharts config.
 */
export const renderChartDeclaration: FunctionDeclaration = {
    name: "render_chart",
    description:
        "Returns a chart configuration for rendering the query results as a Recharts chart. " +
        "Choose the most appropriate chart type based on the data structure and the user's question.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            chart_type: {
                type: Type.STRING,
                enum: ["bar", "line", "area", "pie", "scatter", "kpi", "table"],
                description:
                    "The type of chart to render. Choose based on data characteristics: " +
                    "bar for comparisons, line for trends, area for cumulative, pie for proportions, scatter for correlations, " +
                    "kpi for single numeric values (COUNT, SUM, AVG results with 1 row), table for detailed multi-column data.",
            },
            title: {
                type: Type.STRING,
                description: "A concise, descriptive title for the chart.",
            },
            x_axis_key: {
                type: Type.STRING,
                description:
                    "The data key to use for the X axis (the independent/category variable). For KPI type, this can be empty string.",
            },
            data_keys: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                    "Array of data keys to plot as series/values (dependent variables).",
            },
            color_palette: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                    "Array of hex color codes for the chart series. Use a modern, visually appealing palette. " +
                    "Provide one color per data key.",
            },
            kpi_value: {
                type: Type.STRING,
                description: "For KPI charts only: the main value to display (e.g., '1,234' or '89.5').",
            },
            kpi_label: {
                type: Type.STRING,
                description: "For KPI charts only: a short label describing the metric (e.g., 'Total Revenue').",
            },
            kpi_change: {
                type: Type.NUMBER,
                description: "For KPI charts only: percentage change from previous period (e.g., 12.5 for +12.5%, -3.2 for -3.2%). Optional.",
            },
            kpi_prefix: {
                type: Type.STRING,
                description: "For KPI charts only: prefix symbol (e.g., '$', '₺', '€'). Optional.",
            },
            kpi_suffix: {
                type: Type.STRING,
                description: "For KPI charts only: suffix symbol (e.g., '%', ' users', ' orders'). Optional.",
            },
        },
        required: ["chart_type", "title", "x_axis_key", "data_keys", "color_palette"],
    },
};

/**
 * Function declaration for suggesting queries based on schema.
 */
export const suggestQueriesDeclaration: FunctionDeclaration = {
    name: "suggest_queries",
    description:
        "Suggests interesting and diverse natural language questions that a user could ask about their database.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                    "Array of 6 natural language questions the user can ask about their data. " +
                    "Should be diverse: mix of aggregations, trends, comparisons, distributions, rankings.",
            },
        },
        required: ["suggestions"],
    },
};

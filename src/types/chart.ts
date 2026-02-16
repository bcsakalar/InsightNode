// ============================================================================
// Chart Type Definitions (Recharts Configuration)
// ============================================================================

/** Supported chart types for Recharts rendering */
export type ChartType = "bar" | "line" | "area" | "pie" | "scatter";

/** Color palette entry */
export interface ChartColor {
    key: string;
    color: string;
}

/** Full chart configuration — output from Gemini, consumed by DynamicChart */
export interface ChartConfig {
    chartType: ChartType;
    title: string;
    xAxisKey: string;
    dataKeys: string[];
    colors: ChartColor[];
    data: Record<string, unknown>[];
}

/** The full AI pipeline response sent to the frontend */
export interface DashboardQueryResponse {
    chartConfig: ChartConfig;
    generatedQuery: string;
    queryType: "sql" | "aggregation";
    executionTimeMs: number;
    rowCount: number;
}

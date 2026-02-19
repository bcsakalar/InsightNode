// ============================================================================
// Dynamic Chart — Renders any ChartConfig as a Recharts chart
// ============================================================================

"use client";

import { useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import type { ChartConfig } from "@/types/chart";

interface DynamicChartProps {
    config: ChartConfig;
}

/** Theme-aware chart styles */
function useChartStyles() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const tooltipStyle = useMemo(() => ({
        contentStyle: {
            background: isDark ? "rgba(10, 10, 15, 0.95)" : "rgba(255, 255, 255, 0.95)",
            border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
            borderRadius: "8px",
            fontSize: "12px",
            color: isDark ? "#fafafa" : "#09090b",
            boxShadow: isDark
                ? "0 8px 30px rgba(0, 0, 0, 0.3)"
                : "0 8px 30px rgba(0, 0, 0, 0.08)",
        },
        itemStyle: { color: isDark ? "#a1a1aa" : "#71717a" },
        labelStyle: { color: isDark ? "#fafafa" : "#09090b", fontWeight: 600 },
    }), [isDark]);

    const gridColor = isDark ? "#1a1a2e" : "#e4e4e7";
    const axisColor = isDark ? "#27272a" : "#d4d4d8";
    const tickColor = isDark ? "#a1a1aa" : "#71717a";
    const legendColor = isDark ? "#a1a1aa" : "#71717a";
    const cursorFill = isDark ? "rgba(99, 102, 241, 0.08)" : "rgba(99, 102, 241, 0.06)";

    const axisStyle = useMemo(() => ({
        stroke: axisColor,
        tick: { fill: tickColor, fontSize: 11 },
        axisLine: { stroke: axisColor },
    }), [axisColor, tickColor]);

    const xAxisStyle = useMemo(() => ({
        ...axisStyle,
        tick: { fill: tickColor, fontSize: 10 },
        angle: -35,
        textAnchor: "end" as const,
        height: 80,
        interval: 0 as const,
    }), [axisStyle, tickColor]);

    return { tooltipStyle, gridColor, axisStyle, xAxisStyle, legendColor, cursorFill, isDark };
}

export function DynamicChart({ config }: DynamicChartProps) {
    const { chartType, data, xAxisKey, dataKeys, colors } = config;
    const { tooltipStyle, gridColor, axisStyle, xAxisStyle, legendColor, cursorFill } = useChartStyles();

    // Map color keys for quick lookup
    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        colors.forEach((c) => {
            map[c.key] = c.color;
        });
        return map;
    }, [colors]);

    // KPI Chart
    if (chartType === "kpi") {
        return <KPIChart config={config} />;
    }

    // Table Chart
    if (chartType === "table") {
        return <TableChart config={config} />;
    }

    // PIE: needs special handling
    if (chartType === "pie") {
        const pieDataKey = dataKeys[0] || "value";
        return (
            <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }: { name?: string | number; percent?: number }) =>
                            `${name ?? ""}: ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        outerRadius={130}
                        innerRadius={60}
                        dataKey={pieDataKey}
                        nameKey={xAxisKey}
                        paddingAngle={3}
                        strokeWidth={0}
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]?.color || "#6366f1"}
                            />
                        ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                    <Legend
                        wrapperStyle={{ fontSize: "12px", color: legendColor }}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    }

    // SCATTER
    if (chartType === "scatter") {
        return (
            <ResponsiveContainer width="100%" height={360}>
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} fill="transparent" />
                    <XAxis
                        dataKey={xAxisKey}
                        type="number"
                        name={xAxisKey}
                        {...axisStyle}
                    />
                    <YAxis
                        dataKey={dataKeys[0]}
                        type="number"
                        name={dataKeys[0]}
                        {...axisStyle}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} {...tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: "12px", color: legendColor }} />
                    <Scatter
                        name={dataKeys[0]}
                        data={data}
                        fill={colorMap[dataKeys[0]] || "#6366f1"}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
    }

    // BAR, LINE, AREA — share the same wrapper pattern
    const ChartWrapper =
        chartType === "bar"
            ? BarChart
            : chartType === "line"
                ? LineChart
                : AreaChart;

    return (
        <ResponsiveContainer width="100%" height={360}>
            <ChartWrapper data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} fill="transparent" />
                <XAxis
                    dataKey={xAxisKey}
                    {...axisStyle}
                    {...(data.length > 5 ? xAxisStyle : {})}
                    tickLine={false}
                />
                <YAxis {...axisStyle} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={chartType === "bar" ? { fill: cursorFill } : undefined} {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "12px", color: legendColor }} />

                {dataKeys.map((key) => {
                    const color = colorMap[key] || "#6366f1";

                    if (chartType === "bar") {
                        return (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={color}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        );
                    }
                    if (chartType === "line") {
                        return (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={color}
                                strokeWidth={2}
                                dot={{ r: 3, fill: color }}
                                activeDot={{ r: 5, fill: color }}
                            />
                        );
                    }
                    // area
                    return (
                        <Area
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={color}
                            fill={color}
                            fillOpacity={0.15}
                            strokeWidth={2}
                        />
                    );
                })}
            </ChartWrapper>
        </ResponsiveContainer>
    );
}

// ============================================================================
// KPI Chart Component
// ============================================================================

function KPIChart({ config }: { config: ChartConfig }) {
    const { data, dataKeys, colors } = config;

    // Extract value from config or data
    const value = config.kpiValue ?? (data[0] && dataKeys[0] ? data[0][dataKeys[0]] : "—");
    const label = config.kpiLabel ?? config.title;
    const change = config.kpiChange;
    const prefix = config.kpiPrefix ?? "";
    const suffix = config.kpiSuffix ?? "";
    const color = colors[0]?.color || "#6366f1";

    const formattedValue = typeof value === "number"
        ? value.toLocaleString()
        : String(value);

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
            {/* Main KPI value */}
            <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
                <p className="text-5xl font-bold tracking-tight" style={{ color }}>
                    {prefix}{formattedValue}{suffix}
                </p>
            </div>

            {/* Change indicator */}
            {change !== undefined && change !== null && (
                <div
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                        change > 0
                            ? "bg-success/10 text-success"
                            : change < 0
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                    }`}
                >
                    {change > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                    ) : change < 0 ? (
                        <TrendingDown className="h-4 w-4" />
                    ) : (
                        <Minus className="h-4 w-4" />
                    )}
                    {change > 0 ? "+" : ""}{change.toFixed(1)}%
                </div>
            )}

            {/* Mini sparkline if there's more than 1 data point */}
            {data.length > 1 && dataKeys[0] && (
                <div className="w-full max-w-xs mt-4">
                    <ResponsiveContainer width="100%" height={60}>
                        <AreaChart data={data}>
                            <Area
                                type="monotone"
                                dataKey={dataKeys[0]}
                                stroke={color}
                                fill={color}
                                fillOpacity={0.1}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Table Chart Component — Sortable, paginated data table
// ============================================================================

const ROWS_PER_PAGE = 10;

function TableChart({ config }: { config: ChartConfig }) {
    const { data } = config;
    const [page, setPage] = useState(0);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            }
            const aStr = String(aVal);
            const bStr = String(bVal);
            return sortDir === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
        });
    }, [data, sortKey, sortDir]);

    const totalPages = Math.ceil(sortedData.length / ROWS_PER_PAGE);
    const pageData = sortedData.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    return (
        <div className="w-full overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    onClick={() => handleSort(col)}
                                    className="px-3 py-2 text-left text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
                                >
                                    {col}
                                    {sortKey === col && (
                                        <span className="ml-1">
                                            {sortDir === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.map((row, i) => (
                            <tr
                                key={i}
                                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td key={col} className="px-3 py-2 whitespace-nowrap text-foreground">
                                        {row[col] === null || row[col] === undefined
                                            ? "—"
                                            : String(row[col])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-3 py-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                        {page * ROWS_PER_PAGE + 1}-{Math.min((page + 1) * ROWS_PER_PAGE, sortedData.length)} of {sortedData.length}
                    </span>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

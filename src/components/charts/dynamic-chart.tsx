// ============================================================================
// Dynamic Chart — Renders any ChartConfig as a Recharts chart
// ============================================================================

"use client";

import { useMemo } from "react";
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
import type { ChartConfig } from "@/types/chart";

interface DynamicChartProps {
    config: ChartConfig;
}

/** Shared tooltip styles */
const TOOLTIP_STYLE = {
    contentStyle: {
        background: "rgba(10, 10, 15, 0.95)",
        border: "1px solid #27272a",
        borderRadius: "8px",
        fontSize: "12px",
        color: "#fafafa",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
    },
    itemStyle: { color: "#a1a1aa" },
    labelStyle: { color: "#fafafa", fontWeight: 600 },
};

const AXIS_STYLE = {
    stroke: "#27272a",
    tick: { fill: "#a1a1aa", fontSize: 11 },
    axisLine: { stroke: "#27272a" },
};

const X_AXIS_STYLE = {
    ...AXIS_STYLE,
    tick: { fill: "#a1a1aa", fontSize: 10 },
    angle: -35,
    textAnchor: "end" as const,
    height: 80,
    interval: 0 as const,
};

export function DynamicChart({ config }: DynamicChartProps) {
    const { chartType, data, xAxisKey, dataKeys, colors } = config;

    // Map color keys for quick lookup
    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        colors.forEach((c) => {
            map[c.key] = c.color;
        });
        return map;
    }, [colors]);

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
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Legend
                        wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }}
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                    <XAxis
                        dataKey={xAxisKey}
                        type="number"
                        name={xAxisKey}
                        {...AXIS_STYLE}
                    />
                    <YAxis
                        dataKey={dataKeys[0]}
                        type="number"
                        name={dataKeys[0]}
                        {...AXIS_STYLE}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} {...TOOLTIP_STYLE} />
                    <Legend wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                <XAxis
                    dataKey={xAxisKey}
                    {...AXIS_STYLE}
                    {...(data.length > 5 ? X_AXIS_STYLE : {})}
                    tickLine={false}
                />
                <YAxis {...AXIS_STYLE} tickLine={false} allowDecimals={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }} />

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

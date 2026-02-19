// ============================================================================
// Chart Card — Wrapper for chart display with metadata + export + delete
// ============================================================================

"use client";

import { motion } from "framer-motion";
import {
    Code2,
    Clock,
    RowsIcon,
    Copy,
    Check,
    Download,
    Image as ImageIcon,
    FileSpreadsheet,
    FileJson,
    X,
} from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicChart } from "@/components/charts/dynamic-chart";
import { useLanguage } from "@/lib/i18n";
import { exportChartAsPNG, exportDataAsCSV, exportDataAsJSON } from "@/utils/export";
import { toast } from "sonner";
import type { DashboardQueryResponse } from "@/types/chart";

interface ChartCardProps {
    data: DashboardQueryResponse;
    index: number;
    onDelete?: (index: number) => void;
}

export function ChartCard({ data, index, onDelete }: ChartCardProps) {
    const { t } = useLanguage();
    const [showQuery, setShowQuery] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const chartRef = useRef<HTMLDivElement>(null);
    const chartId = `chart-${index}`;

    const copyQuery = useCallback(async () => {
        await navigator.clipboard.writeText(data.generatedQuery);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [data.generatedQuery]);

    const handleExportPNG = useCallback(async () => {
        try {
            await exportChartAsPNG(chartId, data.chartConfig.title);
            toast.success(t.toasts.exported);
        } catch {
            toast.error("PNG export failed");
        }
        setShowExportMenu(false);
    }, [chartId, data.chartConfig.title, t.toasts]);

    const handleExportCSV = useCallback(() => {
        exportDataAsCSV(data.chartConfig.data, data.chartConfig.title);
        toast.success(t.toasts.exported);
        setShowExportMenu(false);
    }, [data.chartConfig.data, data.chartConfig.title, t.toasts]);

    const handleExportJSON = useCallback(() => {
        exportDataAsJSON(data.chartConfig.data, data.chartConfig.title);
        toast.success(t.toasts.exported);
        setShowExportMenu(false);
    }, [data.chartConfig.data, data.chartConfig.title, t.toasts]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            className="glass-card rounded-xl overflow-hidden group"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-0">
                <div>
                    <h3 className="text-base font-semibold tracking-tight">
                        {data.chartConfig.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                            <Clock className="h-3 w-3" />
                            {data.executionTimeMs}ms
                        </Badge>
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                            <RowsIcon className="h-3 w-3" />
                            {data.rowCount} {t.chartCard.rows}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">
                            {data.chartConfig.chartType}
                        </Badge>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQuery(!showQuery)}
                        className="gap-1.5 text-xs"
                    >
                        <Code2 className="h-3.5 w-3.5" />
                        {showQuery ? t.chartCard.hideQuery : t.chartCard.showQuery}
                    </Button>

                    {/* Export dropdown */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            title="Export"
                        >
                            <Download className="h-3.5 w-3.5" />
                        </Button>
                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-lg border border-border bg-popover p-1 shadow-lg">
                                <button
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-popover-foreground hover:bg-muted transition-colors"
                                    onClick={handleExportPNG}
                                >
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    {t.chartCard.exportPng}
                                </button>
                                <button
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-popover-foreground hover:bg-muted transition-colors"
                                    onClick={handleExportCSV}
                                >
                                    <FileSpreadsheet className="h-3.5 w-3.5" />
                                    {t.chartCard.exportCsv}
                                </button>
                                <button
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-popover-foreground hover:bg-muted transition-colors"
                                    onClick={handleExportJSON}
                                >
                                    <FileJson className="h-3.5 w-3.5" />
                                    {t.chartCard.exportJson}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Delete button */}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                            onClick={() => onDelete(index)}
                            title={t.chartCard.delete}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Generated query (collapsible) */}
            {showQuery && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-5 mt-3"
                >
                    <div className="relative rounded-lg bg-muted/50 border border-border p-3">
                        <pre className="text-xs text-muted-foreground overflow-x-auto font-mono">
                            {data.generatedQuery}
                        </pre>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7"
                            onClick={copyQuery}
                        >
                            {copied ? (
                                <Check className="h-3.5 w-3.5 text-success" />
                            ) : (
                                <Copy className="h-3.5 w-3.5" />
                            )}
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Chart */}
            <div className="p-5" id={chartId} ref={chartRef}>
                <DynamicChart config={data.chartConfig} />
            </div>
        </motion.div>
    );
}

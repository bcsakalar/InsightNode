// ============================================================================
// Chart Card — Wrapper for chart display with metadata
// ============================================================================

"use client";

import { motion } from "framer-motion";
import { Code2, Clock, RowsIcon, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicChart } from "@/components/charts/dynamic-chart";
import { useLanguage } from "@/lib/i18n";
import type { DashboardQueryResponse } from "@/types/chart";

interface ChartCardProps {
    data: DashboardQueryResponse;
    index: number;
}

export function ChartCard({ data, index }: ChartCardProps) {
    const { t } = useLanguage();
    const [showQuery, setShowQuery] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyQuery = useCallback(async () => {
        await navigator.clipboard.writeText(data.generatedQuery);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [data.generatedQuery]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            className="glass-card rounded-xl overflow-hidden"
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
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuery(!showQuery)}
                    className="gap-1.5 text-xs"
                >
                    <Code2 className="h-3.5 w-3.5" />
                    {showQuery ? t.chartCard.hideQuery : t.chartCard.showQuery}
                </Button>
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
            <div className="p-5">
                <DynamicChart config={data.chartConfig} />
            </div>
        </motion.div>
    );
}

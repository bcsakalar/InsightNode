// ============================================================================
// Empty State — Beautiful placeholder when no charts exist, with suggestions
// ============================================================================

"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, PieChart, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface EmptyStateProps {
    isConnected: boolean;
    suggestions?: string[];
    suggestionsLoading?: boolean;
    onSuggestionClick?: (suggestion: string) => void;
}

export function EmptyState({
    isConnected,
    suggestions = [],
    suggestionsLoading = false,
    onSuggestionClick,
}: EmptyStateProps) {
    const { t } = useLanguage();

    const FEATURES = [
        {
            icon: BarChart3,
            title: t.emptyState.barCharts,
            desc: t.emptyState.barChartsDesc,
        },
        {
            icon: TrendingUp,
            title: t.emptyState.trendLines,
            desc: t.emptyState.trendLinesDesc,
        },
        {
            icon: PieChart,
            title: t.emptyState.pieCharts,
            desc: t.emptyState.pieChartsDesc,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-20 px-6"
        >
            {/* Large icon */}
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                className="relative mb-8"
            >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                    <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -inset-4 rounded-3xl bg-primary/5 -z-10 blur-xl" />
            </motion.div>

            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-semibold tracking-tight mb-2"
            >
                {isConnected ? t.emptyState.readyTitle : t.emptyState.connectTitle}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground text-center max-w-md mb-10"
            >
                {isConnected ? t.emptyState.readyDesc : t.emptyState.connectDesc}
            </motion.p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl w-full">
                {FEATURES.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="glass-card rounded-xl p-4 text-center"
                    >
                        <feature.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                        <h3 className="text-sm font-medium mb-1">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Suggested queries */}
            {isConnected && (suggestionsLoading || suggestions.length > 0) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-10 w-full max-w-xl"
                >
                    <p className="text-xs font-medium text-muted-foreground text-center mb-3">
                        {t.emptyState.suggestedQuestions}
                    </p>
                    {suggestionsLoading ? (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-xs">{t.emptyState.loadingSuggestions}</span>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-2">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSuggestionClick?.(s)}
                                    className="rounded-full border border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}

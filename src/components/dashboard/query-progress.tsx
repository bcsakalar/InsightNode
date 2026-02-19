// ============================================================================
// Query Progress — Step-by-step pipeline progress indicator
// ============================================================================

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, Brain, Shield, Database, Palette } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export type QueryStep = "generating" | "validating" | "executing" | "charting" | null;

interface QueryProgressProps {
    currentStep: QueryStep;
}

const STEPS = [
    { key: "generating", icon: Brain },
    { key: "validating", icon: Shield },
    { key: "executing", icon: Database },
    { key: "charting", icon: Palette },
] as const;

export function QueryProgress({ currentStep }: QueryProgressProps) {
    const { t } = useLanguage();

    if (!currentStep) return null;

    const stepLabels: Record<string, string> = {
        generating: t.progress.generating,
        validating: t.progress.validating,
        executing: t.progress.executing,
        charting: t.progress.charting,
    };

    const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-3xl mx-auto mb-6"
            >
                <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => {
                            const isCompleted = index < currentIndex;
                            const isCurrent = index === currentIndex;
                            const Icon = step.icon;

                            return (
                                <div key={step.key} className="flex items-center gap-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                                                isCompleted
                                                    ? "bg-success/20 text-success"
                                                    : isCurrent
                                                    ? "bg-primary/20 text-primary"
                                                    : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="h-4 w-4" />
                                            ) : isCurrent ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Icon className="h-4 w-4" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs font-medium whitespace-nowrap ${
                                                isCurrent
                                                    ? "text-foreground"
                                                    : isCompleted
                                                    ? "text-success"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {stepLabels[step.key]}
                                        </span>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div
                                            className={`flex-1 h-px mx-2 transition-colors duration-300 ${
                                                isCompleted ? "bg-success/50" : "bg-border"
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

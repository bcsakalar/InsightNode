// ============================================================================
// Command Input — Natural Language Query Bar with suggestion chips
// ============================================================================

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

interface CommandInputProps {
    onSubmit: (prompt: string) => void;
    isLoading: boolean;
    disabled: boolean;
    suggestions?: string[];
}

export function CommandInput({
    onSubmit,
    isLoading,
    disabled,
    suggestions = [],
}: CommandInputProps) {
    const { t } = useLanguage();
    const [prompt, setPrompt] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Rotate placeholder examples
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((i) => (i + 1) % t.commandInput.placeholders.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [t.commandInput.placeholders.length]);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
        }
    }, [prompt]);

    const handleSubmit = useCallback(() => {
        const trimmed = prompt.trim();
        if (!trimmed || isLoading || disabled) return;
        onSubmit(trimmed);
        setPrompt("");
    }, [prompt, isLoading, disabled, onSubmit]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
            }
        },
        [handleSubmit]
    );

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div
                className={`relative rounded-xl border transition-all duration-300 ${isLoading
                        ? "border-primary/50 glow-border shimmer"
                        : "border-border hover:border-primary/30 focus-within:border-primary/50 focus-within:glow-border"
                    }`}
            >
                {/* AI indicator */}
                <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        {isLoading ? t.commandInput.generatingInsight : t.commandInput.askYourData}
                    </span>
                </div>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.commandInput.placeholders[placeholderIndex]}
                    disabled={disabled || isLoading}
                    rows={1}
                    className="w-full resize-none bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />

                {/* Bottom bar with submit */}
                <div className="flex items-center justify-between px-3 pb-3">
                    <span className="text-[11px] text-muted-foreground">
                        {disabled
                            ? t.commandInput.connectFirst
                            : t.commandInput.enterToSend}
                    </span>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!prompt.trim() || isLoading || disabled}
                        className="h-8 gap-1.5"
                    >
                        {isLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Send className="h-3.5 w-3.5" />
                        )}
                        {isLoading ? t.commandInput.thinking : t.commandInput.generate}
                    </Button>
                </div>
            </div>

            {/* Suggestion chips */}
            {suggestions.length > 0 && !disabled && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                    <Sparkles className="h-3 w-3 text-primary shrink-0" />
                    {suggestions.map((suggestion, i) => (
                        <button
                            key={i}
                            onClick={() => onSubmit(suggestion)}
                            disabled={isLoading}
                            className="shrink-0 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-all disabled:opacity-50"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

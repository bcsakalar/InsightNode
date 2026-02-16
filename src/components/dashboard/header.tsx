// ============================================================================
// Dashboard Header — with language toggle
// ============================================================================

"use client";

import { Database, Sparkles, Zap, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

interface HeaderProps {
    isConnected: boolean;
    connectionName: string | null;
    onConnectClick: () => void;
}

export function Header({
    isConnected,
    connectionName,
    onConnectClick,
}: HeaderProps) {
    const { locale, t, toggleLocale } = useLanguage();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                        <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">
                            <span className="gradient-text">{t.header.brand}</span>
                        </h1>
                        <p className="text-[11px] text-muted-foreground -mt-0.5">
                            {t.header.subtitle}
                        </p>
                    </div>
                </div>

                {/* Connection Status + Actions */}
                <div className="flex items-center gap-4">
                    {isConnected ? (
                        <div className="flex items-center gap-2">
                            <Badge variant="success" className="gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                                {t.header.connected}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {connectionName}
                            </span>
                        </div>
                    ) : (
                        <Badge variant="outline" className="text-muted-foreground gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                            {t.header.noConnection}
                        </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={onConnectClick}>
                        <Database className="h-4 w-4" />
                        {isConnected ? t.header.change : t.header.connectDb}
                    </Button>

                    <div className="h-6 w-px bg-border" />

                    {/* Language Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLocale}
                        className="gap-1.5 text-xs font-medium"
                        title={locale === "en" ? "Türkçe'ye geç" : "Switch to English"}
                    >
                        <Globe className="h-4 w-4" />
                        {locale === "en" ? "TR" : "EN"}
                    </Button>

                    <div className="h-6 w-px bg-border" />

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        {t.header.poweredBy}
                    </div>
                </div>
            </div>
        </header>
    );
}

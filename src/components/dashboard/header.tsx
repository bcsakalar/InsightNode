// ============================================================================
// Dashboard Header — with language toggle, theme toggle, saved connections, logout
// ============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Database,
    Sparkles,
    Zap,
    Globe,
    Sun,
    Moon,
    LogOut,
    ChevronDown,
    Trash2,
    Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import {
    getConnections,
    deleteConnection,
    type SavedConnection,
} from "@/lib/storage/connections";
import { toast } from "sonner";

interface HeaderProps {
    isConnected: boolean;
    connectionName: string | null;
    onConnectClick: () => void;
    onLoadConnection?: (conn: SavedConnection) => void;
}

export function Header({
    isConnected,
    connectionName,
    onConnectClick,
    onLoadConnection,
}: HeaderProps) {
    const { locale, t, toggleLocale } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [savedConns, setSavedConns] = useState<SavedConnection[]>([]);
    const [showSaved, setShowSaved] = useState(false);

    // Load saved connections
    useEffect(() => {
        setSavedConns(getConnections());
    }, []);

    const handleDeleteSaved = useCallback(
        (id: string, e: React.MouseEvent) => {
            e.stopPropagation();
            deleteConnection(id);
            setSavedConns(getConnections());
            toast.success(t.toasts.connectionDeleted);
        },
        [t.toasts]
    );

    const handleLoadSaved = useCallback(
        (conn: SavedConnection) => {
            onLoadConnection?.(conn);
            setShowSaved(false);
        },
        [onLoadConnection]
    );

    const handleLogout = useCallback(async () => {
        try {
            await fetch("/api/auth", { method: "DELETE" });
            window.location.href = "/login";
        } catch {
            // If auth is not enabled, just ignore
        }
    }, []);

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
                <div className="flex items-center gap-3">
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

                    {/* Saved connections dropdown */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSavedConns(getConnections());
                                if (savedConns.length > 0) {
                                    setShowSaved(!showSaved);
                                } else {
                                    onConnectClick();
                                }
                            }}
                        >
                            <Database className="h-4 w-4" />
                            {isConnected ? t.header.change : t.header.connectDb}
                            {savedConns.length > 0 && (
                                <ChevronDown className="h-3 w-3 ml-1" />
                            )}
                        </Button>

                        {showSaved && savedConns.length > 0 && (
                            <div className="absolute right-0 top-full mt-1 z-50 w-72 rounded-lg border border-border bg-popover shadow-lg">
                                <div className="p-2 border-b border-border">
                                    <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                                        {t.header.savedConnections}
                                    </p>
                                </div>
                                <div className="max-h-48 overflow-y-auto p-1">
                                    {savedConns.map((conn) => (
                                        <div
                                            key={conn.id}
                                            role="button"
                                            tabIndex={0}
                                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted transition-colors group/item cursor-pointer"
                                            onClick={() => handleLoadSaved(conn)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLoadSaved(conn); }}
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span
                                                    className="h-2 w-2 rounded-full shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            conn.type === "postgresql"
                                                                ? "#336791"
                                                                : conn.type === "mysql"
                                                                ? "#4479A1"
                                                                : "#47A248",
                                                    }}
                                                />
                                                <span className="truncate font-medium">
                                                    {conn.name}
                                                </span>
                                                <Badge variant="outline" className="text-[9px] shrink-0">
                                                    {conn.type}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <button
                                                    className="opacity-0 group-hover/item:opacity-100 p-0.5 rounded hover:bg-destructive/10 text-destructive transition-all"
                                                    onClick={(e) =>
                                                        handleDeleteSaved(conn.id, e)
                                                    }
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-1 border-t border-border">
                                    <button
                                        className="flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs text-primary hover:bg-muted transition-colors"
                                        onClick={() => {
                                            setShowSaved(false);
                                            onConnectClick();
                                        }}
                                    >
                                        <Database className="h-3 w-3" />
                                        {t.header.connectDb}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-px bg-border" />

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={toggleTheme}
                        title={theme === "dark" ? t.header.lightMode : t.header.darkMode}
                    >
                        {theme === "dark" ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </Button>

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

                    {/* Logout */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={handleLogout}
                        title={t.header.logout}
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}

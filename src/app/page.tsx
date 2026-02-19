// ============================================================================
// Main Dashboard Page — with streaming, chat history, suggestions, export
// ============================================================================

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/header";
import { ConnectionModal } from "@/components/dashboard/connection-modal";
import { CommandInput } from "@/components/dashboard/command-input";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ChartCard } from "@/components/charts/chart-card";
import { QueryProgress, type QueryStep } from "@/components/dashboard/query-progress";
import { useLanguage } from "@/lib/i18n";
import {
    getActiveConnection,
    setActiveConnection,
    type SavedConnection,
} from "@/lib/storage/connections";
import {
    addChatMessage,
    getChatHistory,
    clearChatHistory,
} from "@/lib/storage/chat-history";
import type { ConnectionFormData, DatabaseSchema } from "@/types/database";
import type { DashboardQueryResponse } from "@/types/chart";
import type { ConversationMessage } from "@/types/api";

export default function DashboardPage() {
    const { locale, t } = useLanguage();

    // Connection state
    const [modalOpen, setModalOpen] = useState(false);
    const [connection, setConnection] = useState<ConnectionFormData | null>(null);
    const [schema, setSchema] = useState<DatabaseSchema | null>(null);

    // Query state
    const [isQuerying, setIsQuerying] = useState(false);
    const [queryStep, setQueryStep] = useState<QueryStep>(null);
    const [charts, setCharts] = useState<DashboardQueryResponse[]>([]);

    // Suggestion state
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);

    // Chat history for multi-turn conversation
    const chatHistoryRef = useRef<ConversationMessage[]>([]);

    // ── Restore active connection on mount ──────────────────────────
    useEffect(() => {
        const saved = getActiveConnection();
        if (saved) {
            // Re-connect to the saved connection
            handleReconnect(saved);
        }
        // Load chat history
        const history = getChatHistory();
        chatHistoryRef.current = history.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Silently reconnect to a saved connection */
    const handleReconnect = useCallback(
        async (conn: ConnectionFormData) => {
            try {
                const res = await fetch("/api/connections", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(conn),
                });
                const data = await res.json();
                if (data.success && data.data?.schema) {
                    setConnection(conn);
                    setSchema(data.data.schema);
                    setActiveConnection(conn);
                    // Fetch suggestions for this schema
                    fetchSuggestions(data.data.schema);
                }
            } catch {
                // Silent fail — user can reconnect manually
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    /** Fetch AI-powered query suggestions */
    const fetchSuggestions = useCallback(
        async (dbSchema: DatabaseSchema) => {
            setSuggestionsLoading(true);
            try {
                const res = await fetch("/api/suggestions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ schema: dbSchema, locale }),
                });
                const data = await res.json();
                if (data.success && data.data?.suggestions) {
                    setSuggestions(data.data.suggestions);
                }
            } catch {
                // Non-critical
            } finally {
                setSuggestionsLoading(false);
            }
        },
        [locale]
    );

    /** Handle successful database connection */
    const handleConnected = useCallback(
        (conn: ConnectionFormData, dbSchema: DatabaseSchema) => {
            setConnection(conn);
            setSchema(dbSchema);
            setCharts([]);
            setActiveConnection(conn);
            clearChatHistory();
            chatHistoryRef.current = [];
            toast.success(`${t.toasts.connectedTo} "${conn.name}"`, {
                description: `${dbSchema.tables.length} ${t.toasts.tablesFound}`,
            });
            fetchSuggestions(dbSchema);
        },
        [t.toasts, fetchSuggestions]
    );

    /** Handle loading a saved connection from header dropdown */
    const handleLoadConnection = useCallback(
        (saved: SavedConnection) => {
            handleReconnect(saved);
        },
        [handleReconnect]
    );

    /** Handle query submission — streaming pipeline */
    const handleQuerySubmit = useCallback(
        async (prompt: string) => {
            if (!connection || !schema) {
                toast.error(t.toasts.connectDbFirst);
                return;
            }

            setIsQuerying(true);
            setQueryStep("generating");

            // Add user message to chat history
            addChatMessage({ role: "user", content: prompt });
            chatHistoryRef.current.push({ role: "user", content: prompt });

            try {
                const res = await fetch("/api/query", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        prompt,
                        locale,
                        connection: { ...connection, id: "active-connection" },
                        streaming: true,
                        conversationHistory: chatHistoryRef.current.slice(-10),
                    }),
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || "Request failed");
                }

                const contentType = res.headers.get("content-type") || "";

                if (contentType.includes("application/x-ndjson") && res.body) {
                    // Streaming response
                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    let buffer = "";
                    let finalResult: DashboardQueryResponse | null = null;

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");
                        buffer = lines.pop() || "";

                        for (const line of lines) {
                            if (!line.trim()) continue;
                            try {
                                const chunk = JSON.parse(line);
                                if (chunk.step) {
                                    setQueryStep(chunk.step as QueryStep);
                                }
                                if (chunk.data) {
                                    finalResult = chunk.data;
                                }
                                if (chunk.error) {
                                    throw new Error(chunk.error);
                                }
                            } catch (e) {
                                if (e instanceof SyntaxError) continue;
                                throw e;
                            }
                        }
                    }

                    if (finalResult) {
                        setCharts((prev) => [finalResult!, ...prev]);
                        const assistantMsg = `Chart: ${finalResult.chartConfig.title} (${finalResult.rowCount} rows)`;
                        addChatMessage({ role: "assistant", content: assistantMsg });
                        chatHistoryRef.current.push({
                            role: "assistant",
                            content: assistantMsg,
                        });
                        toast.success(t.toasts.chartGenerated, {
                            description: `${finalResult.rowCount} ${t.toasts.rowsIn} ${finalResult.executionTimeMs}ms`,
                        });
                    }
                } else {
                    // Non-streaming fallback
                    const data = await res.json();
                    if (data.success && data.data) {
                        setCharts((prev) => [data.data, ...prev]);
                        const assistantMsg = `Chart: ${data.data.chartConfig.title} (${data.data.rowCount} rows)`;
                        addChatMessage({ role: "assistant", content: assistantMsg });
                        chatHistoryRef.current.push({
                            role: "assistant",
                            content: assistantMsg,
                        });
                        toast.success(t.toasts.chartGenerated, {
                            description: `${data.data.rowCount} ${t.toasts.rowsIn} ${data.data.executionTimeMs}ms`,
                        });
                    } else {
                        toast.error(data.error || t.toasts.connectionFailed);
                    }
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : t.toasts.networkError;
                toast.error(message);
            } finally {
                setIsQuerying(false);
                setQueryStep(null);
            }
        },
        [connection, schema, locale, t.toasts]
    );

    /** Delete a chart */
    const handleDeleteChart = useCallback(
        (index: number) => {
            setCharts((prev) => prev.filter((_, i) => i !== index));
            toast.success(t.toasts.chartDeleted);
        },
        [t.toasts]
    );

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header
                isConnected={!!connection}
                connectionName={connection?.name || null}
                onConnectClick={() => setModalOpen(true)}
                onLoadConnection={handleLoadConnection}
            />

            {/* Main content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
                {/* Command Input */}
                <div className="mb-6">
                    <CommandInput
                        onSubmit={handleQuerySubmit}
                        isLoading={isQuerying}
                        disabled={!connection}
                        suggestions={suggestions}
                    />
                </div>

                {/* Query Progress */}
                <QueryProgress currentStep={queryStep} />

                {/* Charts or Empty State */}
                {charts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 mt-4">
                        {charts.map((chart, index) => (
                            <ChartCard
                                key={`chart-${index}-${chart.chartConfig.title}`}
                                data={chart}
                                index={index}
                                onDelete={handleDeleteChart}
                            />
                        ))}
                    </div>
                ) : (
                    !isQuerying && (
                        <EmptyState
                            isConnected={!!connection}
                            suggestions={suggestions}
                            suggestionsLoading={suggestionsLoading}
                            onSuggestionClick={handleQuerySubmit}
                        />
                    )
                )}
            </main>

            {/* Connection Modal */}
            <ConnectionModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onConnected={handleConnected}
            />

            {/* Footer */}
            <footer className="border-t border-border/50 py-4">
                <div className="mx-auto max-w-7xl px-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t.footer.brand}</span>
                    <span>{t.footer.poweredBy}</span>
                </div>
            </footer>
        </div>
    );
}

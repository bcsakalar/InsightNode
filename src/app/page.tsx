// ============================================================================
// Main Dashboard Page
// ============================================================================

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/header";
import { ConnectionModal } from "@/components/dashboard/connection-modal";
import { CommandInput } from "@/components/dashboard/command-input";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ChartCard } from "@/components/charts/chart-card";
import { useLanguage } from "@/lib/i18n";
import type { ConnectionFormData, DatabaseSchema } from "@/types/database";
import type { DashboardQueryResponse } from "@/types/chart";
import type { ApiResponse } from "@/types/api";

export default function DashboardPage() {
    const { locale, t } = useLanguage();

    // Connection state
    const [modalOpen, setModalOpen] = useState(false);
    const [connection, setConnection] = useState<ConnectionFormData | null>(null);
    const [schema, setSchema] = useState<DatabaseSchema | null>(null);

    // Query state
    const [isQuerying, setIsQuerying] = useState(false);
    const [charts, setCharts] = useState<DashboardQueryResponse[]>([]);

    /** Handle successful database connection */
    const handleConnected = useCallback(
        (conn: ConnectionFormData, dbSchema: DatabaseSchema) => {
            setConnection(conn);
            setSchema(dbSchema);
            setCharts([]);
            toast.success(`${t.toasts.connectedTo} "${conn.name}"`, {
                description: `${dbSchema.tables.length} ${t.toasts.tablesFound}`,
            });
        },
        [t.toasts]
    );

    /** Handle query submission */
    const handleQuerySubmit = useCallback(
        async (prompt: string) => {
            if (!connection || !schema) {
                toast.error(t.toasts.connectDbFirst);
                return;
            }

            setIsQuerying(true);

            try {
                const res = await fetch("/api/query", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        prompt,
                        locale,
                        connection: { ...connection, id: "active-connection" },
                    }),
                });

                const data = (await res.json()) as ApiResponse<DashboardQueryResponse>;

                if (data.success && data.data) {
                    setCharts((prev) => [data.data!, ...prev]);
                    toast.success(t.toasts.chartGenerated, {
                        description: `${data.data.rowCount} ${t.toasts.rowsIn} ${data.data.executionTimeMs}ms`,
                    });
                } else {
                    toast.error(data.error || t.toasts.connectionFailed);
                }
            } catch {
                toast.error(t.toasts.networkError);
            } finally {
                setIsQuerying(false);
            }
        },
        [connection, schema, locale, t.toasts]
    );

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header
                isConnected={!!connection}
                connectionName={connection?.name || null}
                onConnectClick={() => setModalOpen(true)}
            />

            {/* Main content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
                {/* Command Input */}
                <div className="mb-10">
                    <CommandInput
                        onSubmit={handleQuerySubmit}
                        isLoading={isQuerying}
                        disabled={!connection}
                    />
                </div>

                {/* Charts or Empty State */}
                {charts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {charts.map((chart, index) => (
                            <ChartCard
                                key={`chart-${index}-${chart.chartConfig.title}`}
                                data={chart}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState isConnected={!!connection} />
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

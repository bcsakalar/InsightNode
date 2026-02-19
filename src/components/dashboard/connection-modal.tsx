// ============================================================================
// Database Connection Modal — per-database-type forms
// ============================================================================

"use client";

import { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Database,
    Loader2,
    CheckCircle2,
    XCircle,
    ShieldCheck,
    Link2,
    Settings2,
    Save,
} from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_PORTS } from "@/utils/validators";
import { useLanguage } from "@/lib/i18n";
import { saveConnection } from "@/lib/storage/connections";
import type { ConnectionFormData, DatabaseType } from "@/types/database";
import type { ApiResponse, ConnectionTestResponse } from "@/types/api";
import type { DatabaseSchema } from "@/types/database";

interface ConnectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConnected: (connection: ConnectionFormData, schema: DatabaseSchema) => void;
}

const DB_TABS: { value: DatabaseType; label: string; color: string }[] = [
    { value: "postgresql", label: "PostgreSQL", color: "#336791" },
    { value: "mysql", label: "MySQL", color: "#4479A1" },
    { value: "mongodb", label: "MongoDB", color: "#47A248" },
];

export function ConnectionModal({
    open,
    onOpenChange,
    onConnected,
}: ConnectionModalProps) {
    const { t } = useLanguage();
    const [dbType, setDbType] = useState<DatabaseType>("postgresql");
    const [mongoMode, setMongoMode] = useState<"uri" | "manual">("uri");
    const [testing, setTesting] = useState(false);
    const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");
    const [form, setForm] = useState<Partial<ConnectionFormData>>({
        name: "",
        type: "postgresql",
        host: "localhost",
        port: DEFAULT_PORTS.postgresql,
        user: "",
        password: "",
        database: "",
        ssl: false,
        connectionString: "",
        connectionMode: "manual",
    });

    const updateField = useCallback(
        (field: keyof ConnectionFormData, value: string | number | boolean | DatabaseType) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            setTestStatus("idle");
        },
        []
    );

    const handleTabChange = useCallback(
        (value: string) => {
            const newType = value as DatabaseType;
            setDbType(newType);
            updateField("type", newType);
            updateField("port", DEFAULT_PORTS[newType]);
            if (newType === "mongodb") {
                updateField("connectionMode", mongoMode);
            } else {
                updateField("connectionMode", "manual");
            }
        },
        [updateField, mongoMode]
    );

    const handleMongoModeChange = useCallback(
        (mode: "uri" | "manual") => {
            setMongoMode(mode);
            updateField("connectionMode", mode);
        },
        [updateField]
    );

    const handleTestConnection = useCallback(async () => {
        setTesting(true);
        setTestStatus("idle");

        try {
            const res = await fetch("/api/connections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, type: dbType }),
            });

            const data = (await res.json()) as ApiResponse<
                ConnectionTestResponse & { schema?: DatabaseSchema }
            >;

            if (data.success && data.data) {
                setTestStatus("success");
                toast.success(data.data.message);

                // Save connection to localStorage
                try {
                    saveConnection({ ...form, type: dbType } as ConnectionFormData);
                } catch {
                    // Non-critical, ignore save errors
                }

                if (data.data.schema) {
                    onConnected(
                        { ...form, type: dbType } as ConnectionFormData,
                        data.data.schema
                    );
                    onOpenChange(false);
                }
            } else {
                setTestStatus("error");
                toast.error(data.error || t.toasts.connectionFailed);
            }
        } catch {
            setTestStatus("error");
            toast.error(t.toasts.networkError);
        } finally {
            setTesting(false);
        }
    }, [form, dbType, onConnected, onOpenChange, t.toasts]);

    // ── Shared fields: Connection Name ──────────────────────────────
    const renderNameField = () => (
        <div className="grid gap-2">
            <Label htmlFor="name">{t.connectionModal.connectionName}</Label>
            <Input
                id="name"
                placeholder={t.connectionModal.connectionNamePlaceholder}
                value={form.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
            />
        </div>
    );

    // ── SQL fields: host, port, user, pass, db, ssl ─────────────────
    const renderSqlFields = () => (
        <>
            {/* Host & Port */}
            <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 grid gap-2">
                    <Label htmlFor="host">{t.connectionModal.host}</Label>
                    <Input
                        id="host"
                        placeholder="localhost"
                        value={form.host || ""}
                        onChange={(e) => updateField("host", e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="port">{t.connectionModal.port}</Label>
                    <Input
                        id="port"
                        type="number"
                        value={form.port || ""}
                        onChange={(e) => updateField("port", parseInt(e.target.value, 10))}
                    />
                </div>
            </div>

            {/* User & Password */}
            <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                    <Label htmlFor="user">{t.connectionModal.username}</Label>
                    <Input
                        id="user"
                        placeholder={t.connectionModal.usernamePlaceholder}
                        value={form.user || ""}
                        onChange={(e) => updateField("user", e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">{t.connectionModal.password}</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={form.password || ""}
                        onChange={(e) => updateField("password", e.target.value)}
                    />
                </div>
            </div>

            {/* Database Name */}
            <div className="grid gap-2">
                <Label htmlFor="database">{t.connectionModal.databaseName}</Label>
                <Input
                    id="database"
                    placeholder={t.connectionModal.databasePlaceholder}
                    value={form.database || ""}
                    onChange={(e) => updateField("database", e.target.value)}
                />
            </div>

            {/* SSL Toggle */}
            <div className="flex items-center gap-2">
                <input
                    id="ssl"
                    type="checkbox"
                    className="h-4 w-4 rounded border-input accent-primary cursor-pointer"
                    checked={form.ssl || false}
                    onChange={(e) => updateField("ssl", e.target.checked)}
                />
                <Label htmlFor="ssl" className="cursor-pointer">
                    {t.connectionModal.useSsl}
                </Label>
            </div>
        </>
    );

    // ── MongoDB URI fields ──────────────────────────────────────────
    const renderMongoUriFields = () => (
        <>
            {/* Connection String */}
            <div className="grid gap-2">
                <Label htmlFor="connectionString">{t.connectionModal.mongoUri}</Label>
                <Input
                    id="connectionString"
                    placeholder={t.connectionModal.mongoUriPlaceholder}
                    value={form.connectionString || ""}
                    onChange={(e) => updateField("connectionString", e.target.value)}
                    className="font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                    {t.connectionModal.mongoUriHint}
                </p>
            </div>

            {/* Database Name (still needed for URI mode) */}
            <div className="grid gap-2">
                <Label htmlFor="database">{t.connectionModal.databaseName}</Label>
                <Input
                    id="database"
                    placeholder={t.connectionModal.databasePlaceholder}
                    value={form.database || ""}
                    onChange={(e) => updateField("database", e.target.value)}
                />
            </div>
        </>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        {t.connectionModal.title}
                    </DialogTitle>
                    <DialogDescription>
                        {t.connectionModal.description}
                    </DialogDescription>
                </DialogHeader>

                {/* Security notice */}
                <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 p-3">
                    <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">{t.connectionModal.securityBold}</strong>{" "}
                        {t.connectionModal.securityNotice}
                    </p>
                </div>

                {/* Database type tabs */}
                <Tabs value={dbType} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-3">
                        {DB_TABS.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: tab.color }}
                                />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* PostgreSQL — standard SQL fields */}
                    <TabsContent value="postgresql">
                        <div className="grid gap-4 py-2">
                            {renderNameField()}
                            {renderSqlFields()}
                        </div>
                    </TabsContent>

                    {/* MySQL — standard SQL fields */}
                    <TabsContent value="mysql">
                        <div className="grid gap-4 py-2">
                            {renderNameField()}
                            {renderSqlFields()}
                        </div>
                    </TabsContent>

                    {/* MongoDB — URI or Manual sub-tabs */}
                    <TabsContent value="mongodb">
                        <div className="grid gap-4 py-2">
                            {renderNameField()}

                            {/* URI / Manual switcher */}
                            <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
                                <button
                                    type="button"
                                    onClick={() => handleMongoModeChange("uri")}
                                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${mongoMode === "uri"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <Link2 className="h-3.5 w-3.5" />
                                    {t.connectionModal.mongoUriTab}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMongoModeChange("manual")}
                                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${mongoMode === "manual"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <Settings2 className="h-3.5 w-3.5" />
                                    {t.connectionModal.mongoManualTab}
                                </button>
                            </div>

                            {mongoMode === "uri" ? renderMongoUriFields() : renderSqlFields()}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Test & Connect button + status */}
                <div className="flex items-center justify-between pt-2">
                    <div>
                        {testStatus === "success" && (
                            <Badge variant="success" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {t.connectionModal.connectedBadge}
                            </Badge>
                        )}
                        {testStatus === "error" && (
                            <Badge variant="destructive" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                {t.connectionModal.failedBadge}
                            </Badge>
                        )}
                    </div>
                    <Button onClick={handleTestConnection} disabled={testing}>
                        {testing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t.connectionModal.testing}
                            </>
                        ) : (
                            <>
                                <Database className="h-4 w-4" />
                                {t.connectionModal.testAndConnect}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ============================================================================
// Connection Storage — localStorage persistence for saved connections
// ============================================================================

import type { ConnectionFormData } from "@/types/database";

export interface SavedConnection extends ConnectionFormData {
    id: string;
    savedAt: number;
}

const STORAGE_KEY = "insightnode_connections";
const ACTIVE_KEY = "insightnode_active_connection";

/** Obfuscate password for storage (not encryption, just not plaintext) */
function obfuscate(value: string): string {
    try {
        return btoa(encodeURIComponent(value));
    } catch {
        return value;
    }
}

/** De-obfuscate password from storage */
function deobfuscate(value: string): string {
    try {
        return decodeURIComponent(atob(value));
    } catch {
        return value;
    }
}

/** Get all saved connections from localStorage */
export function getConnections(): SavedConnection[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const connections = JSON.parse(raw) as SavedConnection[];
        return connections.map((c) => ({
            ...c,
            password: deobfuscate(c.password),
            connectionString: c.connectionString ? deobfuscate(c.connectionString) : c.connectionString,
        }));
    } catch {
        return [];
    }
}

/** Save a new connection or update an existing one */
export function saveConnection(conn: ConnectionFormData): SavedConnection {
    const connections = getConnections();
    const saved: SavedConnection = {
        ...conn,
        id: conn.name + "-" + Date.now(),
        savedAt: Date.now(),
    };

    // Check for duplicate name, replace if exists
    const existingIndex = connections.findIndex((c) => c.name === conn.name);
    if (existingIndex >= 0) {
        saved.id = connections[existingIndex].id;
        connections[existingIndex] = saved;
    } else {
        connections.push(saved);
    }

    // Store with obfuscated passwords
    const toStore = connections.map((c) => ({
        ...c,
        password: obfuscate(c.password),
        connectionString: c.connectionString ? obfuscate(c.connectionString) : c.connectionString,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    return saved;
}

/** Delete a saved connection by ID */
export function deleteConnection(id: string): void {
    const connections = getConnections();
    const filtered = connections.filter((c) => c.id !== id);
    const toStore = filtered.map((c) => ({
        ...c,
        password: obfuscate(c.password),
        connectionString: c.connectionString ? obfuscate(c.connectionString) : c.connectionString,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));

    // If the active connection was deleted, clear it
    const active = getActiveConnection();
    if (active?.id === id) {
        localStorage.removeItem(ACTIVE_KEY);
    }
}

/** Get the currently active connection */
export function getActiveConnection(): SavedConnection | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(ACTIVE_KEY);
        if (!raw) return null;
        const conn = JSON.parse(raw) as SavedConnection;
        return {
            ...conn,
            password: deobfuscate(conn.password),
            connectionString: conn.connectionString ? deobfuscate(conn.connectionString) : conn.connectionString,
        };
    } catch {
        return null;
    }
}

/** Set the currently active connection */
export function setActiveConnection(conn: ConnectionFormData | SavedConnection): void {
    const toStore = {
        ...conn,
        id: "id" in conn ? (conn as SavedConnection).id : "active",
        savedAt: "savedAt" in conn ? (conn as SavedConnection).savedAt : new Date().toISOString(),
        password: obfuscate(conn.password),
        connectionString: conn.connectionString ? obfuscate(conn.connectionString) : conn.connectionString,
    };
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(toStore));
}

/** Clear the active connection */
export function clearActiveConnection(): void {
    localStorage.removeItem(ACTIVE_KEY);
}

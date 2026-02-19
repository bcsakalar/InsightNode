// ============================================================================
// Dashboard Storage — localStorage persistence for saved dashboards
// ============================================================================

import type { DashboardQueryResponse } from "@/types/chart";

export interface SavedDashboard {
    id: string;
    name: string;
    charts: DashboardQueryResponse[];
    layout: DashboardLayoutItem[];
    createdAt: number;
    updatedAt: number;
}

export interface DashboardLayoutItem {
    i: string; // chart id
    x: number;
    y: number;
    w: number;
    h: number;
}

const DASHBOARDS_KEY = "insightnode_dashboards";
const ACTIVE_DASHBOARD_KEY = "insightnode_active_dashboard";

/** Get all saved dashboards */
export function getDashboards(): SavedDashboard[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(DASHBOARDS_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as SavedDashboard[];
    } catch {
        return [];
    }
}

/** Save or update a dashboard */
export function saveDashboard(dashboard: SavedDashboard): void {
    const dashboards = getDashboards();
    const existingIndex = dashboards.findIndex((d) => d.id === dashboard.id);
    if (existingIndex >= 0) {
        dashboards[existingIndex] = { ...dashboard, updatedAt: Date.now() };
    } else {
        dashboards.push(dashboard);
    }
    localStorage.setItem(DASHBOARDS_KEY, JSON.stringify(dashboards));
}

/** Delete a dashboard by ID */
export function deleteDashboard(id: string): void {
    const dashboards = getDashboards();
    const filtered = dashboards.filter((d) => d.id !== id);
    localStorage.setItem(DASHBOARDS_KEY, JSON.stringify(filtered));
    const active = getActiveDashboardId();
    if (active === id) {
        localStorage.removeItem(ACTIVE_DASHBOARD_KEY);
    }
}

/** Get/set the active dashboard ID */
export function getActiveDashboardId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACTIVE_DASHBOARD_KEY);
}

export function setActiveDashboardId(id: string): void {
    localStorage.setItem(ACTIVE_DASHBOARD_KEY, id);
}

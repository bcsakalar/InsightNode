// ============================================================================
// Utility: cn() — Tailwind class merging helper (shadcn pattern)
// ============================================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names intelligently.
 * Combines clsx for conditional classes with tailwind-merge to resolve conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// ============================================================================
// Client Providers — wraps the app with client-only context providers
// ============================================================================

"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
    );
}

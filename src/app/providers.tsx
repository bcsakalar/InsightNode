// ============================================================================
// Client Providers — wraps the app with client-only context providers
// ============================================================================

"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n";

export function Providers({ children }: { children: ReactNode }) {
    return <LanguageProvider>{children}</LanguageProvider>;
}

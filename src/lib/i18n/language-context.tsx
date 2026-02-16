// ============================================================================
// Language Context — Global locale state provider
// ============================================================================

"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import { translations, type Locale, type Translations } from "./translations";

interface LanguageContextType {
    locale: Locale;
    t: Translations;
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
    }, []);

    const toggleLocale = useCallback(() => {
        setLocaleState((prev) => (prev === "en" ? "tr" : "en"));
    }, []);

    const value: LanguageContextType = {
        locale,
        t: translations[locale],
        setLocale,
        toggleLocale,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

/**
 * Hook to access the current locale and translation strings.
 * Must be used within a LanguageProvider.
 */
export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

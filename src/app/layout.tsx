// ============================================================================
// Root Layout — Dark Mode Shell
// ============================================================================

import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "InsightNode — AI-Powered Dashboard Builder",
    description:
        "Connect your database and ask natural language questions to generate beautiful, interactive charts powered by Google Gemini.",
    keywords: ["dashboard", "AI", "business intelligence", "charts", "database"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen bg-background text-foreground antialiased">
                <Providers>
                    {children}
                </Providers>
                <Toaster
                    theme="dark"
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: "#0a0a0f",
                            border: "1px solid #27272a",
                            color: "#fafafa",
                        },
                    }}
                />
            </body>
        </html>
    );
}

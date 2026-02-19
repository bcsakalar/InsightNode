// ============================================================================
// API Route: /api/auth
// ============================================================================
// POST: Simple password authentication — validates against ADMIN_PASSWORD env var.
// ============================================================================

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { password: string };
        const adminPassword = process.env.ADMIN_PASSWORD;

        // If no ADMIN_PASSWORD is set, auth is disabled — always allow
        if (!adminPassword) {
            return NextResponse.json({ success: true });
        }

        if (!body.password) {
            return NextResponse.json(
                { success: false, error: "Password is required." },
                { status: 400 }
            );
        }

        if (body.password !== adminPassword) {
            return NextResponse.json(
                { success: false, error: "Invalid password." },
                { status: 401 }
            );
        }

        // Generate a simple session token
        const token = generateToken();

        // Set httpOnly cookie
        const cookieStore = await cookies();
        cookieStore.set("insightnode_auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Also store the token server-side for validation
        // Using a simple approach: hash the password + a secret
        globalThis.__insightnode_tokens = globalThis.__insightnode_tokens || new Set<string>();
        (globalThis.__insightnode_tokens as Set<string>).add(token);

        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Auth error.";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

/** POST /api/auth?action=logout */
export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete("insightnode_auth");
    return NextResponse.json({ success: true });
}

function generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Extend globalThis for token storage
declare global {
    // eslint-disable-next-line no-var
    var __insightnode_tokens: Set<string> | undefined;
}

// ============================================================================
// Middleware — Auth protection for all routes
// ============================================================================
// Checks for auth cookie. Redirects to /login if not authenticated.
// Auth is disabled if ADMIN_PASSWORD env var is not set.
// ============================================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Routes that don't require authentication */
const PUBLIC_PATHS = ["/login", "/api/auth"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip auth check for public paths and static assets
    if (
        PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // If ADMIN_PASSWORD is not set, auth is disabled
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
        return NextResponse.next();
    }

    // Check for auth cookie
    const authToken = request.cookies.get("insightnode_auth")?.value;
    if (!authToken) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};

// File:  middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
    const token = request.cookies.get("accessToken")?.value;

    // If no cookie at all → redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If cookie exists, we’ll do a quick “lightweight” check:
    // Forward the request to /api/auth/me in the background (no body needed).
    // If /api/auth/me returns 401, that means the token is expired/invalid → redirect.
    // Note: this is optional but ensures that even expired tokens cannot access /admin.
    try {
        const meRes = await fetch(new URL("/api/auth/me", request.url).href, {
            headers: { cookie: `accessToken=${token}; refreshToken=${request.cookies.get("refreshToken")?.value}` },
        });
        if (meRes.status === 401) {
            // AUTH FAILED
            return NextResponse.redirect(new URL("/", request.url));
        }
    } catch (err) {
        console.error("Middleware /api/auth/me check failed:", err);
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};

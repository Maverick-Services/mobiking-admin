// File:  app/api/auth/me/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * GET /api/auth/me
 *
 * 1) If accessToken cookie exists and decodes properly, return user from JWT payload.
 * 2) Otherwise, if refreshToken exists, forward to backend /users/refresh-token to get a new pair.
 *    • On success, set new cookies and return user.
 * 3) If neither cookie is valid, return 401.
 *
 * Note: This assumes your backend’s JWT payload embeds at least:
 *   { _id, name, email, role, permissions }
 */

export async function GET(request) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // 1) If there is a valid accessToken, decode it (no signature check) and return the user.
    if (accessToken) {
        try {
            const payload = jwt.decode(accessToken);
            if (!payload || typeof payload !== "object") {
                throw new Error("Unable to decode accessToken");
            }

            const { _id, name, email, role, permissions } = payload

            if (!_id || !email || !role) {
                throw new Error("Incomplete token payload");
            }

            return NextResponse.json({
                success: true,
                user: { _id, name, email, role, permissions },
            });
        } catch (err) {
            // If decode fails, we’ll try to refresh below
            console.warn("Failed to decode accessToken:", err);
        }
    }

    // 2) No valid accessToken → try to refresh using refreshToken:
    if (!refreshToken) {
        return NextResponse.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    try {
        // Forward refreshToken to backend’s /users/refresh-token
        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/refresh-token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            }
        );

        if (!backendRes.ok) {
            const errData = await backendRes.json();
            return NextResponse.json(errData, { status: backendRes.status });
        }

        const parsed = await backendRes.json();
        const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user,
        } = parsed.data;

        // Prepare two new HTTP-only cookies:
        function createCookie(name, value, options = {}) {
            let cookie = `${name}=${value}; Path=/; HttpOnly; SameSite=Strict`;
            if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
            if (options.secure) cookie += `; Secure`;
            return cookie;
        }

        const cookieAccess = createCookie("accessToken", newAccessToken, {
            maxAge: 900, // 15 minutes
            secure: process.env.NODE_ENV === "production",
        });
        const cookieRefresh = createCookie("refreshToken", newRefreshToken, {
            maxAge: 604800, // 7 days
            secure: process.env.NODE_ENV === "production",
        });

        const response = NextResponse.json({
            success: true,
            user,
        });
        response.headers.set("Set-Cookie", cookieAccess);
        response.headers.append("Set-Cookie", cookieRefresh);
        return response;
    } catch (err) {
        console.error("API /api/auth/me error:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

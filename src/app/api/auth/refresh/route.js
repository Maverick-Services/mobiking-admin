// File:  app/api/auth/refresh/route.js

import { NextResponse } from "next/server";

/**
 * POST /api/auth/refresh
 *
 * Reads the `refreshToken` cookie, forwards it to backend’s /users/refresh-token,
 * sets new cookies, and returns { user } on success.
 */

export async function POST(request) {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
        return NextResponse.json(
            { success: false, message: "No refresh token" },
            { status: 401 }
        );
    }

    try {
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

        function createCookie(name, value, options = {}) {
            let cookie = `${name}=${value}; Path=/; HttpOnly; SameSite=Strict`;
            if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
            if (options.secure) cookie += `; Secure`;
            return cookie;
        }

        const cookieAccess = createCookie("accessToken", newAccessToken, {
            maxAge: 900,
            secure: process.env.NODE_ENV === "production",
        });
        const cookieRefresh = createCookie("refreshToken", newRefreshToken, {
            maxAge: 604800,
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
        console.error("API /api/auth/refresh error:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

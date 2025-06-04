// File:  app/api/auth/login/route.js
import { NextResponse } from "next/server";

function createCookie(name, value, options = {}) {
    let cookie = `${name}=${value}; Path=/; HttpOnly; SameSite=Strict`;
    if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
    if (options.secure) cookie += `; Secure`;
    if (options.domain) cookie += `; Domain=${options.domain}`;

    return cookie;
}

export async function POST(request) {
    try {
        const { email, password, role } = await request.json();

        if (!email || !password || !role) {
            return NextResponse.json(
                { success: false, message: "Missing fields" },
                { status: 400 }
            );
        }

        // 1) Forward login to your real backend:
        const backendRes = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + "/users/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, role }),
            }
        );

        // If backend returns non-200, just pass it through:
        if (!backendRes.ok) {
            const errData = await backendRes.json();
            return NextResponse.json(errData, { status: backendRes.status });
        }

        const parsed = await backendRes.json();
        const { accessToken, refreshToken, user } = parsed.data;

        const cookieAccess = createCookie("accessToken", accessToken, {
            maxAge: 900,
            secure: process.env.NODE_ENV === "production",
        });
        const cookieRefresh = createCookie("refreshToken", refreshToken, {
            maxAge: 604_800,
            secure: process.env.NODE_ENV === "production",
        });

        // 3) Return a response that sets both cookies:
        const response = NextResponse.json({
            success: true,
            message: "Logged in successfully",
            user,
        });

        response.headers.set("Set-Cookie", cookieAccess);
        // If you want to set multiple cookies, append by comma:
        response.headers.append("Set-Cookie", cookieRefresh);

        return response;
    } catch (err) {
        console.error("API /api/auth/login error:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// File: app/admin/layout.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import LayoutDashboard from "@/components/dashboard/LayoutDashboard";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({ children }) {
    // 1) Create QueryClient unconditionally
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: false,
                    },
                },
            })
    );

    // 2) Zustand + router + checking flag
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    // 3) On mount, rehydrate user via /api/auth/me
    useEffect(() => {
        // Only fetch if no user in store
        if (!user) {
            fetch("/api/auth/me")
                .then(async (res) => {
                    if (!res.ok) {
                        router.replace("/");
                        return null;
                    }
                    const data = await res.json();
                    setUser(data.user);
                })
                .catch(() => {
                    router.replace("/");
                })
                .finally(() => {
                    setIsChecking(false);
                });
        } else {
            setIsChecking(false);
        }
    }, [user, setUser, router]);

    // 4) While checking (fetching /api/auth/me), show a loader
    if (isChecking) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading…
            </div>
        );
    }

    // 5) If still no user after check, we’ve already redirected; render nothing
    if (!user) {
        return null;
    }

    // 6) Now that we have a valid user, render the dashboard + React Query
    return (
        <QueryClientProvider client={queryClient}>
            <LayoutDashboard>{children}</LayoutDashboard>
            {process.env.NODE_ENV === "development" && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
}

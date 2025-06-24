"use client"
import { useTotalOrders } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

export default function TotalOrders() {
    const { data, isLoading, isError, error } = useTotalOrders();

    return (
        <div className="p-4 flex flex-col items-center justify-center text-center bg-white rounded-xl shadow-sm gap-3">
            <p className="text-muted-foreground text-sm">Total Orders</p>
            {isLoading ? (
                <Loader2 className="animate-spin" />
            ) : isError ? (
                <p className="text-sm text-red-500">Error loading</p>
            ) : (
                <p className="text-2xl font-bold">{data?.totalOrders ?? 0}</p>
            )}
        </div>
    );
}

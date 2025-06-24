"use client"
import { useTotalSales } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

export default function TotalSales() {
    const { data, isLoading, isError } = useTotalSales();

    const formattedSales = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(data?.totalSales || 0);

    return (
        <div className="p-4 flex flex-col items-center justify-center text-center bg-white rounded-xl shadow-sm gap-3">
            <p className="text-muted-foreground text-sm">Total Sales</p>
            {isLoading ? (
                <Loader2 className="animate-spin" />
            ) : isError ? (
                <p className="text-sm text-red-500">Error loading</p>
            ) : (
                <p className="text-2xl font-bold">{formattedSales}</p>
            )}
        </div>
    );
}

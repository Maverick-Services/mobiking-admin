"use client"
import { useTotalCustomers } from "@/hooks/useDashboard";
import { Loader2 } from "lucide-react";

export default function TotalCustomers() {
    const { data, isLoading, isError, error } = useTotalCustomers();

    // console.log(data)

    return (
        <div className="p-4 flex flex-col items-center justify-center text-center bg-white rounded-xl shadow-sm gap-3">
            <p className="text-muted-foreground text-sm">Total Customers</p>
            {isLoading ? (
                <Loader2 className="animate-spin" />
            ) : isError ? (
                <p className="text-sm text-red-500">Error loading</p>
            ) : (
                <p className="text-2xl font-bold">{data?.totalCustomers ?? 0}</p>
            )}
        </div>
    );
}

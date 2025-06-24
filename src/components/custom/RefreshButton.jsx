"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"

export default function RefreshButton({
    /** function to call on click, e.g. query.refetch or () => queryClient.invalidateQueries(key) */
    onRefresh,
    /** boolean loading state, e.g. query.isFetching */
    isRefreshing,
    variant = "outline",
}) {
    return (
        <Button
            onClick={onRefresh}
            variant={'outline'}
            disabled={isRefreshing}
            aria-label={'refresh button'}
            className="flex items-center !px-4"
        >
            {isRefreshing ? (
                <Loader2 className="animate-spin" size={16} />
            ) : (
                <RefreshCw size={16} />
            )}
        </Button>
    )
}

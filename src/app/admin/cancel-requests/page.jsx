"use client"
import React, { useEffect, useState } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import DateRangeSelector from '@/components/custom/DateRangeSelector';
import { format } from 'date-fns';
import { useOrders } from '@/hooks/useOrders';
import TableSkeleton from "@/components/custom/TableSkeleton"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { getPaginationRange } from "@/lib/services/getPaginationRange"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select"
import CancelOrdersTable from './components/CancelOrdersTable';


function page() {
    // Date range
    const today = new Date()
    const pastDate = new Date()
    const from = pastDate.setDate(today.getDate() - 6)

    const initialRange = { from: from, to: today }
    const [range, setRange] = useState(initialRange)

    useEffect(() => {
        setRange(initialRange)
    }, [])

    const formattedStart = format(range.from, 'dd MMM yyyy')
    const formattedEnd = format(range.to, 'dd MMM yyyy')

    const startDate = format(range.from, 'yyyy-MM-dd')
    const endDate = format(range.to, 'yyyy-MM-dd')

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const { getCancelRequestOrders } = useOrders();
    const { data: cancelReqOrders, isFetching, error } = getCancelRequestOrders({ requestType: 'Cancel', startDate, endDate, page, limit });

    const totalPages = cancelReqOrders?.pagination?.totalPages || 1
    const paginationRange = getPaginationRange(page, totalPages)

    const ordersData = cancelReqOrders?.orders;
    // console.log(cancelReqOrders)

    return (
        <InnerDashboardLayout>
            {/* Header */}
            <div className="w-full flex items-center justify-between gap-4 border-b border-gray-500 pb-4">
                <div>
                    <h1 className="text-primary font-semibold sm:text-2xl lg:text-4xl">
                        Cancel Requests
                    </h1>
                    <p className='text-xs text-gray-600 mt-2'>Showing Summary: <strong>{formattedStart}</strong> - <strong>{formattedEnd}</strong></p>
                </div>
                {/* date range selector */}
                <div className="space-x-1 flex">
                    <DateRangeSelector onChange={setRange} defaultRange={initialRange} />
                </div>
            </div>

            {isFetching ?
                <TableSkeleton showHeader={false} showPagination={false} />
                : <CancelOrdersTable
                    error={error}
                    orders={ordersData}
                />
            }

            {/* pagination */}
            <div className="flex w-full justify-end gap-2 items-center mt-4">
                {/* Limit Dropdown */}
                <Select value={String(limit)} onValueChange={(val) => { setPage(1); setLimit(Number(val)) }}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 5, 10, 20, 50].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                                {n} / page
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Pagination */}
                <Pagination className={'inline justify-end mx-1 w-fit'}>
                    <PaginationContent>
                        {page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious href="#" onClick={() => setPage((p) => p - 1)} />
                            </PaginationItem>
                        )}

                        {paginationRange.map((p, i) => (
                            <PaginationItem key={i}>
                                {p === 'ellipsis-left' || p === 'ellipsis-right' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        href="#"
                                        isActive={p === page}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setPage(p)
                                        }}
                                    >
                                        {p}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        {page < totalPages && (
                            <PaginationItem>
                                <PaginationNext href="#" onClick={() => setPage((p) => p + 1)} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>

        </InnerDashboardLayout>
    )
}

export default page
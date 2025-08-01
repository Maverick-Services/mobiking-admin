'use client'
import React, { useEffect, useState } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useQueries } from '@/hooks/useQueries'
import QueryTable from './components/QueryTable'
import QueryCards from './components/QueryCards'
import TableSkeleton from '@/components/custom/TableSkeleton'
import { format, startOfMonth, startOfToday, subDays } from 'date-fns'
import DateRangeSelector from '@/components/custom/DateRangeSelector'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination"
import { getPaginationRange } from "@/lib/services/getPaginationRange"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select"
import NotAuthorizedPage from '@/components/notAuthorized'

function Page() {
    // Date range
    const today = new Date()
    const pastDate = new Date()
    const from = pastDate.setDate(today.getDate() - 6)

    const initialRange = { from: from, to: today }
    const [range, setRange] = useState(initialRange)

    useEffect(() => {
        setRange(initialRange)
    }, [])

    function useDebouncedValue(value, delay = 500) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const handler = setTimeout(() => setDebouncedValue(value), delay);
            return () => clearTimeout(handler);
        }, [value, delay]);

        return debouncedValue;
    }
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearch = useDebouncedValue(searchTerm, 500);

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const formattedStart = format(range.from, 'dd MMM yyyy')
    const formattedEnd = format(range.to, 'dd MMM yyyy')

    const startDate = format(range.from, 'yyyy-MM-dd')
    const endDate = format(range.to, 'yyyy-MM-dd')

    const { queriesQuery, getQueriesByDate, permissions: { canView, canAdd, canEdit, canDelete } } = useQueries();

    const { data: customQueriesData, isFetching, error } = getQueriesByDate({ page, limit, startDate, endDate, searchQuery: debouncedSearch })
    const displayQueries = customQueriesData ?? [];

    const allQueries = queriesQuery?.data?.data || []
    const [filteredData, setFilteredData] = useState()

    const totalPages = displayQueries?.pagination?.totalPages || 1;
    const paginationRange = getPaginationRange(page, totalPages);

    useEffect(() => {
        setFilteredData(displayQueries?.queries)
    }, [displayQueries])

    if (!canView) return <NotAuthorizedPage />

    return (
        <InnerDashboardLayout>
            <div className="w-full flex items-center justify-between text-primary mb-5">
                <div>
                    <h1 className="font-bold sm:text-2xl lg:text-4xl w-full">Queries</h1>
                    <p className='text-xs text-gray-600 mt-2'>Showing Summary: <strong>{formattedStart}</strong> - <strong>{formattedEnd}</strong></p>
                </div>
                <DateRangeSelector onChange={setRange} defaultRange={initialRange} />
            </div>

            <div>
                {/* Search Bar */}
                <Input
                    placeholder="Search queries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border-gray-300 w-full mb-2"
                />
            </div>

            <QueryCards
                queries={displayQueries?.queries}
                onTabChange={(tab) => {
                    if (tab === 'all') {
                        setFilteredData(displayQueries?.queries)
                    } else if (tab === 'pending') {
                        setFilteredData(displayQueries?.queries.filter(q => !q.isResolved))
                    } else if (tab === 'resolved') {
                        setFilteredData(displayQueries?.queries.filter(q => q.isResolved))
                    }
                }}
            />

            {queriesQuery.isLoading || isFetching
                ? <TableSkeleton showHeader={false} />
                : <QueryTable data={filteredData} canEdit={canEdit} />
            }

            <div className="flex w-full justify-end gap-2 items-center mt-3">
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

export default Page

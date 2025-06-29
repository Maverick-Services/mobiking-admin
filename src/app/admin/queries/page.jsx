'use client'
import React, { useEffect, useState } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useQueries } from '@/hooks/useQueries'
import QueryTable from './components/QueryTable'
import QueryCards from './components/QueryCards'
import TableSkeleton from '@/components/custom/TableSkeleton'

function Page() {
    const { queriesQuery } = useQueries()
    const allQueries = queriesQuery?.data?.data || []
    const [filteredData, setFilteredData] = useState(allQueries)

    useEffect(() => {
        setFilteredData(allQueries)
    }, [allQueries])

    return (
        <InnerDashboardLayout>
            <div className="w-full flex items-center justify-between text-primary mb-5">
                <h1 className="font-bold sm:text-2xl lg:text-4xl w-full">Queries</h1>
            </div>

            <QueryCards
                queries={allQueries}
                onTabChange={(tab) => {
                    if (tab === 'all') {
                        setFilteredData(allQueries)
                    } else if (tab === 'pending') {
                        setFilteredData(allQueries.filter(q => !q.isResolved))
                    } else if (tab === 'resolved') {
                        setFilteredData(allQueries.filter(q => q.isResolved))
                    }
                }}
            />

            {queriesQuery.isLoading
                ? <TableSkeleton showHeader={false} />
                : <QueryTable data={filteredData} />
            }
        </InnerDashboardLayout>
    )
}

export default Page

"use client"
import React from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useQueries } from '@/hooks/useQueries'
import QueryTable from './components/QueryTable' // Adjust path if needed

function Page() {
    const { queriesQuery } = useQueries()
    const allQueries = queriesQuery?.data?.data || []

    return (
        <InnerDashboardLayout>
            <div className="w-full flex items-center justify-between text-primary mb-5">
                <h1 className="font-bold sm:text-2xl lg:text-4xl w-full">Queries</h1>
            </div>
            <QueryTable data={allQueries} />
        </InnerDashboardLayout>
    )
}

export default Page

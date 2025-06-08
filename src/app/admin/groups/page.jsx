import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import React from 'react'

function page() {
    return (
        <InnerDashboardLayout>
            <div className="w-full items-center justify-between">
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-3">Product Groups</h1>
            </div>
        </InnerDashboardLayout>
    )
}

export default page
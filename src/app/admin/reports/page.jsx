import React from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { Button } from '@/components/ui/button'

function page() {
    return (
        <InnerDashboardLayout>
            <div className='flex items-center justify-between w-full mb-3'>
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-3">Reports</h1>

                <Button variant={'outline'}>
                    Generate Report
                </Button>
            </div>

        </InnerDashboardLayout>
    )
}

export default page
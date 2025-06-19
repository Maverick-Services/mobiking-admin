"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { Button } from '@/components/ui/button'
import { useGroups } from '@/hooks/useGroups'
import { CirclePlus } from 'lucide-react'
import React from 'react'

function page() {

    const { groupsQuery } = useGroups()

    console.log(groupsQuery.data?.data)

    return (
        <InnerDashboardLayout>
            <div className='w-full flex items-center justify-between text-primary mb-5'>
                <h1 className='font-bold sm:text-2xl lg:text-4xl w-full'>Design Studio</h1>

                <Button>
                    <CirclePlus className="mr-2 h-4 w-4" /> Add New
                </Button>



            </div>
        </InnerDashboardLayout>
    )
}

export default page
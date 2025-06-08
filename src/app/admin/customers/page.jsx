"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react';
import React, { useState } from 'react'
import UsersTable from './UsersTable';

function page() {

    return (
        <div>
            <InnerDashboardLayout>
                <div className='w-full flex items-center text-primary mb-4'>
                    <h1 className='font-bold sm:text-2xl lg:text-4xl w-full'>Customers</h1>

                    <Button >
                        <CirclePlus className="mr-2 h-4 w-4" /> Add New User
                    </Button>

                </div>


                <UsersTable />

            </InnerDashboardLayout>
        </div>
    )
}

export default page

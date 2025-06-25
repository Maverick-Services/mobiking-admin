"use client"
import PCard from '@/components/custom/PCard';
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import { useOrders } from '@/hooks/useOrders';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { format } from 'date-fns'
import UpperDetailss from './components/UpperDetailss';
import PersonalDetails from './components/PersonalDetails';
import PaymentDetails from './components/PaymentDetails';
import ItemsTable from './components/ItemsTable';

function page() {
    const params = useParams();
    const id = params.id;

    const { getSingleOrderQuery } = useOrders()
    const { data: orderResp, isLoading, error } = getSingleOrderQuery(id)
    const order = orderResp?.data || {}

    console.log(order)

    if (isLoading) return <p>Loading…</p>
    if (error) return <p>Error: {error.message}</p>


    return (
        <InnerDashboardLayout>
            <div className="w-full flex items-center justify-between gap-4 mb-6">
                <h1 className="text-primary font-bold sm:text-xl lg:text-2xl">
                    View Order
                </h1>
                <div>
                    {/* Buttons */}
                </div>
            </div>
            <div className='space-y-3'>
                {/* Upper Details */}
                <UpperDetailss order={order} />

                <PersonalDetails order={order} />
                <PaymentDetails order={order} />
                <ItemsTable order={order} />
            </div>
        </InnerDashboardLayout>
    )
}

export default page
"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useOrders } from '@/hooks/useOrders'
import React from 'react'
import OrdersListView from './components/OrdersListView';

function page() {
    const { ordersQuery } = useOrders();
    const ordersData = ordersQuery.data
    const finalData = ordersData?.data || []
    console.log(ordersQuery.data)

    return (
        <InnerDashboardLayout>
            <div className="w-full flex flex-col gap-4">
                <h1 className="text-primary font-bold sm:text-2xl lg:text-4xl">
                    Orders
                </h1>
            </div>

            <OrdersListView
                error={ordersQuery.error}
                orders={finalData}
            />

        </InnerDashboardLayout>
    )
}

export default page
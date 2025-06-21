'use client'
import React, { useState, useMemo } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useOrders } from '@/hooks/useOrders'
import { DateRangePicker } from '@/components/custom/date-range-picker'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCcw } from 'lucide-react'
import OrdersListView from './components/OrdersListView'
import POS from '@/components/POS'

const TABS = [
    { key: 'all', label: 'ALL ORDERS' },
    { key: 'website', label: 'WEBSITE' },
    { key: 'app', label: 'APP' },
    { key: 'regular', label: 'REGULAR' },
    { key: 'pos', label: 'POS' },
    { key: 'abandoned', label: 'ABANDONED CHECKOUT ORDERS' },
    { key: 'returns', label: 'RETURNS' },
    { key: 'cancelled', label: 'Cancel Requests' },
    { key: 'warranty', label: 'WARRANTY' },
]

const STATUS_CARDS = [
    'New',
    'Accepted',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned',
    'Replaced',
    'Hold'
]

const STATUS_BORDER = {
    New: 'border-blue-500',
    Accepted: 'border-green-500',
    Shipped: 'border-yellow-500',
    Delivered: 'border-teal-500',
    Cancelled: 'border-red-500',
    Returned: 'border-indigo-500',
    Replaced: 'border-purple-500',
    Hold: 'border-orange-500',
}

export default function Page() {
    const { ordersQuery } = useOrders()
    const allOrders = ordersQuery.data?.data || []
    const [statusFilter, setStatusFilter] = useState(null)

    const [activeTab, setActiveTab] = useState('all')
    // helper to get last request in the requests-array
    const lastRequestOf = (order) =>
        Array.isArray(order.requests) && order.requests.length > 0
            ? order.requests[order.requests.length - 1]
            : null

    const { filteredOrders, counts, statusCounts } = useMemo(() => {
        const counts = {}
        TABS.forEach(({ key }) => counts[key] = 0)

        // 1) First, filter by activeTab & statusFilter
        const filteredOrders = allOrders.filter((o) => {
            // if a status card has been clicked, short‑circuit
            if (statusFilter) {
                return o.status === statusFilter
            }

            const lastReq = lastRequestOf(o)
            switch (activeTab) {
                case 'website': return !o.isAppOrder && o.type === 'Regular'
                case 'app': return o.isAppOrder && o.type === 'Regular'
                case 'regular': return o.type === 'Regular'
                case 'pos': return o.type === 'Pos'
                case 'abandoned': return o.abondonedOrder
                case 'returns': return lastReq?.type === 'Return' && lastReq.isRaised
                case 'cancelled': return lastReq?.type === 'Cancel' && lastReq.isRaised && lastReq.status === 'Pending'
                case 'warranty': return lastReq?.type === 'Warranty' && lastReq.isRaised
                default: return true   // 'all'
            }
        })

        // 2) Compute tab counts (ignoring statusFilter here)
        TABS.forEach(({ key }) => {
            counts[key] = allOrders.filter((o) => {
                const lastReq = lastRequestOf(o)
                switch (key) {
                    case 'website': return !o.isAppOrder && o.type === 'Regular'
                    case 'app': return o.isAppOrder && o.type === 'Regular'
                    case 'regular': return o.type === 'Regular'
                    case 'pos': return o.type === 'Pos'
                    case 'abandoned': return o.abondonedOrder
                    case 'returns': return lastReq?.type === 'Return' && lastReq.isRaised
                    case 'cancelled': return lastReq?.type === 'Cancel' && lastReq.isRaised && lastReq.status === 'Pending'
                    case 'warranty': return lastReq?.type === 'Warranty' && lastReq.isRaised
                    default: return true
                }
            }).length
        })

        // 3) Compute your status‑card counts
        const statusCounts = {}
        STATUS_CARDS.forEach((status) => {
            statusCounts[status] = allOrders.filter(o => o.status === status).length
        })

        return { filteredOrders, counts, statusCounts }
    }, [allOrders, activeTab, statusFilter])


    return (
        <InnerDashboardLayout>
            <div className="w-full flex items-center justify-between gap-4 mb-6">
                <h1 className="text-primary font-bold sm:text-2xl lg:text-4xl">
                    Orders
                </h1>
                <div className="space-x-1 flex">
                    <DateRangePicker />
                    <Button><Plus /></Button>
                    <POS>
                        <Button>POS</Button>
                    </POS>
                    <Button><RefreshCcw /></Button>
                </div>
            </div>

            {/* ─── STATUS CARDS ─────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
                {STATUS_CARDS.map((status) => (
                    <div
                        key={status}
                        className={`
        cursor-pointer 
        bg-white 
        ${STATUS_BORDER[status] || 'border-gray-300'} 
        border 
        rounded-lg 
        p-4 
        text-center 
        hover:shadow-sm 
        transition
      `}
                        onClick={() => {
                            setStatusFilter(status)
                            setActiveTab('all')
                        }}
                    >
                        <h2 className="text-2xl font-bold">{statusCounts[status]}</h2>
                        <p className="text-sm text-gray-600">{status}</p>
                    </div>
                ))}
            </div>


            {/* Tab bar */}
            <div className="flex space-x-4 border-b mb-4 justify-between w-full overflow-x-auto">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`pb-2 uppercase text-sm ${activeTab === key
                            ? 'border-b-2 border-black text-black'
                            : 'border-b-2 border-transparent text-gray-500 hover:text-black'
                            }`}
                        onClick={() => {
                            setActiveTab(key)
                            setStatusFilter(null)
                        }}

                    >
                        {label} ({counts[key]})
                    </button>
                ))}
            </div>

            {/* Table */}
            <OrdersListView
                error={ordersQuery.error}
                orders={filteredOrders}
            />
        </InnerDashboardLayout>
    )
}

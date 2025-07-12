'use client'
import React, { useState, useMemo, useEffect } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useOrders } from '@/hooks/useOrders'
import { DateRangePicker } from '@/components/custom/date-range-picker'
import { Button } from '@/components/ui/button'
import OrdersListView from './components/OrdersListView'
import POS from '@/components/POS'
import TableSkeleton from '@/components/custom/TableSkeleton'
import DateRangeSelector from '@/components/custom/DateRangeSelector'
import { format, startOfMonth, startOfToday, subDays } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import AmountCards from './components/AmountCards'
import { ChevronDown } from 'lucide-react'
import { LayoutGroup, motion } from 'framer-motion'
import PosButton from '@/components/custom/PosButton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const TABS = [
    { key: 'all', label: 'ALL ORDERS' },
    { key: 'website', label: 'WEBSITE' },
    { key: 'app', label: 'APP' },
    // { key: 'regular', label: 'REGULAR' },
    { key: 'pos', label: 'POS' },
    { key: 'returns', label: 'RETURNS' },
    { key: 'cancelled', label: 'CANCEL REQUESTS' },
    { key: 'warranty', label: 'WARRANTY' },
    { key: 'abandoned', label: 'ABANDONED CHECKOUT ORDERS' },
]

const STATUS_CARDS = [
    'New',
    'Accepted',
    'Shipped',
    'Delivered',
    'Cancelled',
    // 'Hold'
]

const STATUS_BORDER = {
    New: 'border-indigo-500',
    Accepted: 'border-green-500',
    Shipped: 'border-yellow-500',
    Delivered: 'border-teal-500',
    Cancelled: 'border-red-500',
    Returned: 'border-indigo-500',
    Replaced: 'border-purple-500',
    Hold: 'border-purple-500',
}

const STATUS_BG = {
    New: 'bg-indigo-500',
    Accepted: 'bg-green-500',
    Shipped: 'bg-yellow-500',
    Delivered: 'bg-teal-500',
    Cancelled: 'bg-red-500',
    Returned: 'bg-indigo-500',
    Replaced: 'bg-purple-500',
    Hold: 'bg-purple-500',
}

export default function Page() {
    const [showAmountCards, setShowAmountCards] = useState(false)

    // Date range
    const today = new Date()
    const pastDate = new Date()
    const from = pastDate.setDate(today.getDate() - 6)

    const initialRange = { from: from, to: today }
    const [range, setRange] = useState(initialRange)

    useEffect(() => {
        setRange(initialRange)
    }, [])

    const { getOrdersByDate } = useOrders();

    const formattedStart = format(range.from, 'dd MMM yyyy')
    const formattedEnd = format(range.to, 'dd MMM yyyy')

    const startDate = format(range.from, 'yyyy-MM-dd')
    const endDate = format(range.to, 'yyyy-MM-dd')

    // Data fetching
    const { data: customOrdersData, isFetching, error } = getOrdersByDate({ startDate, endDate })
    const displayOrders = customOrdersData ?? [];

    const [statusFilter, setStatusFilter] = useState(null)
    console.log(statusFilter)

    const [activeTab, setActiveTab] = useState('all')

    // helper to get last request in the requests-array
    const lastRequestOf = (order) =>
        Array.isArray(order.requests) && order.requests.length > 0
            ? order.requests[order.requests.length - 1]
            : null

    const { filteredOrders, counts, statusCounts } = useMemo(() => {
        const counts = {}
        TABS.forEach(({ key }) => counts[key] = 0)

        // First, filter by activeTab & statusFilter
        const filteredOrders = displayOrders.filter((o) => {

            // if a status card has been clicked, short‑circuit
            if (statusFilter) {
                return o.status === statusFilter && !o.abondonedOrder
            }

            const lastReq = lastRequestOf(o)

            switch (activeTab) {
                case 'website': return !o.isAppOrder && o.type === 'Regular' && !o.abondonedOrder
                case 'app': return o.isAppOrder && o.type === 'Regular' && !o.abondonedOrder
                case 'regular': return o.type === 'Regular' && !o.abondonedOrder
                case 'pos': return o.type === 'Pos'
                case 'abandoned': return o.abondonedOrder
                case 'returns': return lastReq?.type === 'Return' && lastReq.isRaised
                case 'cancelled': return lastReq?.type === 'Cancel' && lastReq.isRaised && lastReq.status === 'Pending'
                case 'warranty': return lastReq?.type === 'Warranty' && lastReq.isRaised
                default: return !o.abondonedOrder
            }
        })

        // Compute tab counts (ignoring statusFilter here)
        TABS.forEach(({ key }) => {
            counts[key] = displayOrders.filter((o) => {
                const lastReq = lastRequestOf(o)
                switch (key) {
                    case 'website': return !o.isAppOrder && o.type === 'Regular' && !o.abondonedOrder
                    case 'app': return o.isAppOrder && o.type === 'Regular' && !o.abondonedOrder
                    case 'regular': return o.type === 'Regular' && !o.abondonedOrder
                    case 'pos': return o.type === 'Pos'
                    case 'abandoned': return o.abondonedOrder
                    case 'returns': return lastReq?.type === 'Return' && lastReq.isRaised
                    case 'cancelled': return lastReq?.type === 'Cancel' && lastReq.isRaised && lastReq.status === 'Pending'
                    case 'warranty': return lastReq?.type === 'Warranty' && lastReq.isRaised
                    default: return !o.abondonedOrder
                }
            }).length
        })

        // 3) Compute your status‑card counts
        const statusCounts = {}
        STATUS_CARDS.forEach((status) => {
            statusCounts[status] = displayOrders.filter(o => o.status === status && !o.abondonedOrder).length
        })

        return { filteredOrders, counts, statusCounts }
    }, [displayOrders, activeTab, statusFilter])

    return (
        <InnerDashboardLayout>
            {/* Header */}
            <div className="w-full flex items-center justify-between gap-4 border-b border-gray-500 pb-4">
                <div>
                    <h1 className="text-primary font-semibold sm:text-2xl lg:text-4xl">
                        Orders
                    </h1>
                    <p className='text-xs text-gray-600 mt-2'>Showing Summary: <strong>{formattedStart}</strong> - <strong>{formattedEnd}</strong></p>
                </div>
                <div className="space-x-1 flex">
                    {/* button to open and collapse amount cards */}
                    <Button variant="outline" onClick={() => setShowAmountCards(prev => !prev)}>
                        <ChevronDown className={`transition-transform duration-300 ${showAmountCards ? '' : 'rotate-180'}`} />
                    </Button>

                    <DateRangeSelector onChange={setRange} defaultRange={initialRange} />
                    {/* <Button>POS</Button> */}
                    <PosButton />
                    {/* <POS>
                    </POS> */}
                </div>
            </div>

            {/* Amount Cards */}
            <div
                className={`transition-all mb-6 duration-500 overflow-hidden ${showAmountCards ? 'max-h-[1000px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}
            >
                <AmountCards orders={displayOrders} />
            </div>

            {/* ─── STATUS CARDS ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                {STATUS_CARDS.map((status) => (
                    <div
                        key={status}
                        className={`
                            cursor-pointer 
                            ${statusFilter === status ? `${STATUS_BG[status]} text-white` : 'bg-white'}
                            ${STATUS_BORDER[status] || 'border-gray-300'} 
                            border 
                            rounded-lg 
                            p-2 lg:p-4
                            text-center 
                            hover:shadow-sm 
                            transition-all duration-300
                       `}
                        onClick={() => {
                            setStatusFilter(prev => prev === status ? null : status)
                            setActiveTab('all')
                        }}
                    >
                        <h2 className="text-2xl font-bold">{statusCounts[status]}</h2>
                        <p className={`text-xs lg:text-sm ${statusFilter === status ? `text-white` : 'text-gray-600'}`}>
                            {status}
                        </p>
                    </div>
                ))}
            </div>

            {/* Search & filter */}
            <div className='flex items-center gap-3 mb-3 '>
                {/* Search bar */}
                <Input
                    type={'text'}
                    placeholder="Search"
                    className={'border-gray-300'}
                />

                {/* filter by */}
                <Select>
                    <SelectTrigger className="min-w-[150px] border-gray-300">
                        <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="order">Order</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tab bar */}
            <LayoutGroup>
                <div className="flex gap-2 mb-0 overflow-x-auto bg-white scrollbar-hide relative">
                    {TABS.map(({ key, label }) => {
                        const isActive = activeTab === key
                        return (
                            <button
                                key={key}
                                onClick={() => {
                                    setActiveTab(key)
                                    setStatusFilter(null)
                                }}
                                className={`
            relative px-4 py-6 text-sm font-medium transition-all duration-300 flex gap-1 w-full min-w-fit
            ${isActive ? 'font-bold text-black' : 'text-gray-600'}
          `}
                            >
                                <span>{label}</span>
                                <span>({counts[key]})</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full"
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </LayoutGroup>

            {/* Table */}
            {isFetching ?
                <TableSkeleton showHeader={false} />
                : <OrdersListView
                    // error={ordersQuery.error}
                    orders={filteredOrders}
                />
            }
        </InnerDashboardLayout>
    )
}

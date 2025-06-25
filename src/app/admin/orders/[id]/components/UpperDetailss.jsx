import PCard from '@/components/custom/PCard'
import React from 'react'

export default function UpperDetailss({ order }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <PCard className="px-5 bg-white">
                <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase text-gray-400">Order ID</span>
                    <span className="mt-2 text-lg font-semibold text-gray-900">{order.orderId}</span>
                </div>
            </PCard>

            <PCard className="px-5 bg-white">
                <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase text-gray-400">Payment Method</span>
                    <span className="mt-2 text-lg font-semibold text-gray-900">{order.method}</span>
                </div>
            </PCard>

            <PCard className="px-5 bg-white">
                <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase text-gray-400">Payment Status</span>
                    <span className="mt-2 text-lg font-semibold text-gray-900">{order.paymentStatus}</span>
                </div>
            </PCard>

            <PCard className="px-5 bg-white">
                <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase text-gray-400">Order Amount</span>
                    <span className="mt-2 text-lg font-semibold text-gray-900">₹{order.orderAmount}</span>
                </div>
            </PCard>
        </div>
    )
}

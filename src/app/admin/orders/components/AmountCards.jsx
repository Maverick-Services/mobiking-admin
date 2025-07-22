import PCard from '@/components/custom/PCard'
import React from 'react'
import { formatINRCurrency } from './../../../../lib/services/formatters';

function AmountCards({ orders }) {
    if (!orders) return null

    console.log(orders)

    const excludedStatuses = ['Cancelled', 'Rejected', 'Returned', 'Hold']

    const realOrders = orders.filter(o =>
        !o.abondonedOrder &&
        !excludedStatuses.includes(o.status)
    )

    const getCountAndAmount = (filterFn) => {
        const filtered = realOrders.filter(filterFn)
        const count = filtered.length
        const amount = filtered.reduce((total, order) => total + (order.orderAmount || 0), 0)
        return { count, amount }
    }

    const { count: totalOrders, amount: totalOrderAmount } = getCountAndAmount(() => true)
    const { count: regularOrders, amount: regularOrdersAmount } = getCountAndAmount(o => o.type === 'Regular')
    const { count: posOrders, amount: posOrdersAmount } = getCountAndAmount(o => o.type === 'Pos')
    const { count: codOrders, amount: codOrdersAmount } = getCountAndAmount(o => o.method === 'COD')
    const { count: onlineOrders, amount: onlineOrdersAmount } = getCountAndAmount(o => o.method === 'Online')
    const { count: cashOrders, amount: cashOrdersAmount } = getCountAndAmount(o => o.method === 'Cash')
    const { count: upiOrders, amount: upiOrdersAmount } = getCountAndAmount(o => o.method === 'UPI')

    const cards = [
        { title: 'Total Orders', count: totalOrders, amount: totalOrderAmount },
        { title: 'Regular Orders', count: regularOrders, amount: regularOrdersAmount },
        { title: 'POS Orders', count: posOrders, amount: posOrdersAmount },
        { title: 'COD Orders', count: codOrders, amount: codOrdersAmount },
        { title: 'Online Orders', count: onlineOrders, amount: onlineOrdersAmount },
        { title: 'Cash Orders', count: cashOrders, amount: cashOrdersAmount },
        { title: 'UPI Orders', count: upiOrders, amount: upiOrdersAmount },
    ]

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center mt-6'>
            {cards.map(({ title, count, amount }) => (
                <PCard key={title} className='flex justify-between items-center px-4'>
                    <div className='mb-0'>
                        <p className='text-xl font-bold'>{count}</p>
                        <p className='text-gray-500 text-sm'>{title}</p>
                    </div>
                    <div>
                        <p className='text-xl font-bold'>{formatINRCurrency(amount)}</p>
                        <p className='text-gray-500 text-sm'>Amount</p>
                    </div>
                </PCard>
            ))}
        </div>
    )
}

export default AmountCards

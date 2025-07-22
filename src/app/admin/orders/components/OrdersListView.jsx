'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Download, Eye, MessageSquare, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { FaWhatsapp } from 'react-icons/fa'
import AcceptDialog from './AcceptDialog'
import { OrderViewDialog } from './OrderViewDialog'
import { motion, AnimatePresence } from 'framer-motion'
import GSTBillDownload from '@/components/GSTBill'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UpdateStatus from '../[id]/components/UpdateStatus'
import StatusUpdate from './StatusUpdate'


// Map each order status to a Badge variant
const STATUS_VARIANTS = {
    New: 'default',           // neutral
    Accepted: 'success',      // green
    Shipped: 'warning',       // yellow/orange
    Delivered: 'success',     // green
    Cancelled: 'destructive', // red
    Returned: 'destructive',  // red
    Replaced: 'outline',      // purple/outline
    Hold: 'secondary',        // gray or custom secondary
}

export default function OrdersListView({ error, orders = [] }) {
    const router = useRouter()

    if (error) {
        return (
            <div className="text-red-600 p-4">
                Error: {error.message}
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="p-4 text-gray-500 text-center">
                No orders found.
            </div>
        )
    }

    const openWhatsApp = (phone) => {
        // sanitize phone: remove non-digits
        const digits = phone.replace(/\D/g, '')
        const url = `https://wa.me/${digits}`
        window.open(url, '_blank')
    }

    // console.log(orders)

    return (
        <div>
            <Table className={'p-4 rounded-none shadow-none overflow-hidden scrollbar-hide'}>
                <TableHeader className={''}>
                    <TableRow className="bg-gray-50">
                        <TableHead>#</TableHead>
                        <TableHead>Order No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className={'scrollbar-hide'}>
                    <AnimatePresence mode="wait">
                        {orders.map((o, i) => {
                            const customerOrderNumber = o?.userId?.orders?.length || 0
                            const variant = STATUS_VARIANTS[o.status] || 'default'

                            const returnedOrders = (o?.userId?.orders?.filter(item => item.status === 'Returned'))?.length;
                            const returnPercent = ((returnedOrders / customerOrderNumber) * 100).toFixed(1)

                            const cancelledOrders = (o?.userId?.orders?.filter(item => item.status === 'Cancelled'))?.length;
                            const cancelPercent = ((cancelledOrders / customerOrderNumber) * 100).toFixed(1)

                            // console.log(cancelPercent)

                            return (
                                <motion.tr
                                    key={o._id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="hover:bg-gray-100 scrollbar-hide"
                                >
                                    <TableCell>{i + 1}</TableCell>

                                    <TableCell
                                        className={'cursor-pointer'}
                                        onClick={() => router.push(`/admin/orders/${o._id}`)}
                                    >
                                        {o._id.slice(0, 6).toUpperCase()}
                                    </TableCell>

                                    <TableCell className="capitalize flex-col">
                                        {o.name || '—'}
                                        <div className='flex gap-1 mt-1'>
                                            <span className="bg-purple-100 text-purple-700 px-1 font-medium rounded text-[10px]">
                                                RTO: {returnPercent} %
                                            </span>
                                            <span className="bg-amber-100 text-amber-700 px-1 font-medium rounded text-[10px]">
                                                Cancel: {cancelPercent} %
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell >
                                        <div className="flex items-center space-x-2">
                                            <span>{o.phoneNo}</span>
                                            {o.phoneNo &&
                                                <FaWhatsapp
                                                    className="cursor-pointer text-green-500 hover:text-green-600"
                                                    size={18}
                                                    onClick={() => openWhatsApp(o.phoneNo)}
                                                />
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell>₹{o.orderAmount.toFixed(2)}</TableCell>
                                    <TableCell>{o.method}</TableCell>

                                    <TableCell>
                                        <StatusUpdate
                                            orderId={o?._id}
                                            status={o?.status}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <div>{format(new Date(o.createdAt), 'dd MMM yyyy')}</div>
                                        <div className="text-gray-500">
                                            {format(new Date(o.createdAt), 'hh:mm a')}
                                        </div>
                                    </TableCell>

                                    {/* action buttons */}
                                    <TableCell className="text-center space-x-2 flex items-center justify-center">
                                        {/* {o.abondonedOrder && */}
                                        <OrderViewDialog order={o}>
                                            <Button variant="outline">
                                                <Eye />
                                            </Button>
                                        </OrderViewDialog>
                                        {/* } */}

                                        {/* {!o.abondonedOrder &&
                                            <Button
                                                // className={'h-7 w-7'}
                                                variant="outline"
                                                onClick={() => router.push(`/admin/orders/${o._id}`)}
                                            >
                                                <Eye />
                                            </Button>
                                        } */}
                                        {!o.abondonedOrder &&
                                            <GSTBillDownload billData={o} />
                                        }

                                    </TableCell>
                                </motion.tr>
                            )
                        })}
                    </AnimatePresence>
                </TableBody>
            </Table>
        </div>
    )
}

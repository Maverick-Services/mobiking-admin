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
                <TableBody className={' scrollbar-hide'}>
                    <AnimatePresence mode="wait">
                        {orders.map((o, i) => {
                            const customerOrderNumber = o?.userId?.orders?.length || 0
                            const variant = STATUS_VARIANTS[o.status] || 'default'
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
                                    <TableCell>{o._id.slice(0, 6).toUpperCase()}</TableCell>
                                    <TableCell className="capitalize">
                                        {o.name || '—'}{' '}
                                        <span className="bg-green-100 text-green-700 px-2 py-1 ml-1 font-semibold rounded-full text-[10px]">
                                            {customerOrderNumber}
                                        </span>
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
                                        <Badge variant={variant}>
                                            {o.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div>{format(new Date(o.createdAt), 'dd MMM yyyy')}</div>
                                        <div className="text-gray-500">
                                            {format(new Date(o.createdAt), 'hh:mm a')}
                                        </div>
                                    </TableCell>

                                    {/* action buttons */}
                                    <TableCell className="text-center space-x-2 flex items-center justify-center">
                                        {o.abondonedOrder &&
                                            <OrderViewDialog order={o}>
                                                <Button variant="outline">
                                                    <Eye />
                                                </Button>
                                            </OrderViewDialog>
                                        }

                                        {!o.abondonedOrder &&
                                            <Button
                                                // className={'h-7 w-7'}
                                                variant="outline"
                                                onClick={() => router.push(`/admin/orders/${o._id}`)}
                                            >
                                                <Eye />
                                            </Button>
                                        }
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

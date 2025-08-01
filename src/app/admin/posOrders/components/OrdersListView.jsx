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
import StatusUpdate from './StatusUpdate'
import Link from 'next/link'

export default function OrdersListView({ error, orders = [], canEditPos }) {
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
            <Table className={'p-4 rounded-none shadow-none scrollbar-hide'}>
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
                    {/* <AnimatePresence mode="wait"> */}
                    {orders.map((o, i) => {
                        const customerOrderNumber = o?.userId?.orders?.length || 0;
                        const returnedOrders = o?.userId?.orders?.filter(item => item.status === 'Returned')?.length || 0;
                        const returnPercent = customerOrderNumber > 0
                            ? ((returnedOrders / customerOrderNumber) * 100).toFixed(1)
                            : '0.0';

                        const cancelledOrders = o?.userId?.orders?.filter(item => item.status === 'Cancelled')?.length || 0;
                        const cancelPercent = customerOrderNumber > 0
                            ? ((cancelledOrders / customerOrderNumber) * 100).toFixed(1)
                            : '0.0';

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
                                >
                                    <Link href={`/admin/posOrders/${o._id}`}>
                                        {o.orderId}
                                    </Link>
                                </TableCell>

                                <TableCell className="capitalize flex-col">
                                    {o.name || '—'}
                                    <div className='flex gap-1 mt-1'>
                                        <span className="bg-purple-100 text-purple-700 px-1 font-medium rounded text-[10px]">
                                            RTO: {returnPercent || 0} %
                                        </span>
                                        <span className="bg-amber-100 text-amber-700 px-1 font-medium rounded text-[10px]">
                                            Cancel: {cancelPercent || 0} %
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
                                <TableCell>
                                    <div className='text-xs flex flex-col gap-1 items-center'>
                                        <p className='font-semibold'>{o.method}</p>
                                        {o.paymentStatus == "Paid" ?
                                            <Badge className={'bg-emerald-600 text-white'} >Paid</Badge>
                                            : <Badge variant="destructive">Pending</Badge>
                                        }
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <StatusUpdate
                                        order={o}
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
                                    <OrderViewDialog order={o} canEditPos={canEditPos}>
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
                    {/* </AnimatePresence> */}
                </TableBody>
            </Table>
        </div>
    )
}

'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { useOrders } from '@/hooks/useOrders'
import AcceptDialog from './AcceptDialog'
import CancelDialog from './CancelDialog'

// Map each order status to a Badge variant
const STATUS_VARIANTS = {
    New: 'default',
    Accepted: 'success',
    Rejected: 'destructive',
    Shipped: 'warning',
    Delivered: 'success',
    Cancelled: 'destructive',
    Returned: 'destructive',
    Replaced: 'outline',
    Hold: 'secondary',
}

export function OrderViewDialog({ order, children }) {
    const safe = (value) => (value !== null && value !== undefined && value !== '' ? value : '-')
    const [acceptDialog, setAcceptDialog] = useState(false)
    const [rejectDialog, setRejectDialog] = useState(false)

    // console.log(order)

    const lastRequestOf = (order) =>
        Array.isArray(order.requests) && order.requests.length > 0
            ? order.requests[order.requests.length - 1]
            : null

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>

                <DialogContent className="max-w-3xl overflow-auto max-h-[90vh]">
                    <DialogHeader>
                        <div className="flex justify-between items-center">
                            <DialogTitle>Order #{safe(order.orderId)}</DialogTitle>
                        </div>
                        <DialogDescription>
                            <Badge variant={STATUS_VARIANTS[order.status] || 'default'}>
                                {safe(order.status)}
                            </Badge>
                            {' • '}{safe(order.type)}{' • '}{safe(order.method)}{' • '}
                            {order.isAppOrder ? 'App' : 'Website'}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Customer & Shipping Info */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 text-sm">
                        <div>
                            <h4 className="font-medium">Customer</h4>
                            <p><strong>Name:</strong> {safe(order.name)}</p>
                            <p><strong>Email:</strong> {safe(order.email)}</p>
                            <p><strong>Phone:</strong> {safe(order.phoneNo)}</p>
                            <p><strong>Address:</strong> {safe(order.address)}</p>
                        </div>
                        <div>
                            <h4 className="font-medium">Shipping</h4>
                            <p><strong>Created:</strong>{' '}{order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a') : '-'}</p>
                            <p><strong>Ship Status:</strong> {safe(order.shippingStatus)}</p>
                            <p><strong>AWB:</strong> {safe(order.awbCode)}</p>
                            <p><strong>Courier:</strong> {safe(order.courierName)}</p>
                            <p>
                                <strong>ETA:</strong>{' '}
                                {order.expectedDeliveryDate ? format(new Date(order.expectedDeliveryDate), 'dd MMM yyyy') : '-'}
                            </p>
                        </div>
                    </section>

                    {/* Items Table */}
                    <Table className="text-sm">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead>#</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Variant</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(order.items || []).map((it, i) => (
                                <TableRow key={i}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{safe(it.productId?.name)}</TableCell>
                                    <TableCell>{safe(it.variantName)}</TableCell>
                                    <TableCell>{safe(it.quantity)}</TableCell>
                                    <TableCell>{it.price != null ? `₹${it.price}` : '-'}</TableCell>
                                    <TableCell>{it.price != null && it.quantity != null ? `₹${(it.price * it.quantity).toFixed(2)}` : '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pricing Summary */}
                    <section className="mt-4 space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span><span>₹{order.subtotal != null ? order.subtotal.toFixed(2) : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>GST</span><span>₹{order.gst ? parseFloat(order.gst).toFixed(2) : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Charge</span><span>₹{order.deliveryCharge != null ? order.deliveryCharge.toFixed(2) : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount</span><span>₹{order.discount != null ? order.discount.toFixed(2) : '-'}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-1">
                            <span>Total</span><span>₹{order.orderAmount != null ? order.orderAmount.toFixed(2) : '-'}</span>
                        </div>
                    </section>

                    {/* Requests History */}
                    {order.requests && order.requests.length > 0 && (
                        <section className="mt-6 text-sm">
                            <h4 className="font-medium mb-2">Request History</h4>
                            <ul className="space-y-2">
                                {order.requests.map((r, i) => (
                                    <li key={i} className="border rounded p-2">
                                        <p><strong>Type:</strong> {safe(r.type)}</p>
                                        <p><strong>Raised: </strong>
                                            {r.isRaised ? `Yes at ${format(new Date(r.raisedAt), 'dd MMM yyyy hh:mm a')}` : 'No'}
                                        </p>
                                        <p><strong>Status:</strong> {safe(r.status)}</p>
                                        <p><strong>Reason:</strong> {safe(r.reason)}</p>
                                        <p><strong>Resolved: </strong>
                                            {r.resolvedAt ? format(new Date(r.resolvedAt), 'dd MMM yyyy hh:mm a') : '-'}
                                        </p>
                                    </li>
                                ))}

                            </ul>
                        </section>
                    )}

                    {/* Action buttons */}
                    <DialogFooter className="mt-6 flex gap-1">

                        {/* accept order */}
                        {order.status === 'New' &&
                            <div className=" flex gap-1">
                                <Button variant="outline" onClick={() => { setAcceptDialog(true) }}>Accept</Button>
                                <Button variant="outline">Reject</Button>
                            </div>
                        }

                        {/* cancel order */}
                        {order.requests && order.requests.length > 0
                            && lastRequestOf(order).type === 'Cancel' && lastRequestOf(order).isRaised && lastRequestOf(order).status === 'Pending'
                            && <div className=" flex flex-col gap-1">
                                <p className='text-sm text-gray-500'>Cancel Request</p>
                                <div className=" flex gap-1">
                                    <Button variant="outline" onClick={() => { setRejectDialog(true) }}>Accept</Button>
                                    <Button variant="outline">Reject</Button>
                                </div>
                            </div>
                        }

                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AcceptDialog
                open={acceptDialog}
                onOpenChange={setAcceptDialog}
                order={order}
            />

            <CancelDialog
                open={rejectDialog}
                onOpenChange={setRejectDialog}
                order={order}
            />
        </>
    )
}

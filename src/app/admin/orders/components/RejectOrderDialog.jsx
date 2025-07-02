'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useOrders } from '@/hooks/useOrders'
import LoaderButton from '@/components/custom/LoaderButton'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function RejectDialog({ open, onOpenChange, order }) {
    const { rejectOrder } = useOrders()
    const [reason, setReason] = useState('')

    const handleReject = () => {
        if (!order?._id || !reason.trim()) return
        try {
            rejectOrder.mutateAsync({
                orderId: order._id,
                reason: reason
            })
            onOpenChange(false)
        } catch (error) {
            
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Reject Order?</DialogTitle>
                    {/* <DialogDescription> */}
                        <div className="mt-2 space-y-1 text-sm">
                            <p><strong>Order ID:</strong> {order?.orderId || '-'}</p>
                            <p><strong>Customer:</strong> {order?.name || '-'} ({order?.phoneNo || '-'})</p>
                            <p><strong>Total:</strong> ₹{order?.orderAmount?.toFixed(2) ?? '-'}</p>
                        </div>
                    {/* </DialogDescription> */}
                </DialogHeader>

                {/* Reason Input */}
                <div className="mt-4 space-y-1">
                    <Label htmlFor="reason">Reason for Rejection</Label>
                    <Textarea
                        id="reason"
                        placeholder="Please provide a reason..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={rejectOrder.isPending}
                    />
                </div>

                <DialogFooter className="flex justify-end space-x-2 mt-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={rejectOrder.isLoading}
                    >
                        Cancel
                    </Button>
                    <LoaderButton
                        onClick={handleReject}
                        loading={rejectOrder.isPending}
                        disabled={!reason.trim() || rejectOrder.isPending}
                    >
                        Reject
                    </LoaderButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

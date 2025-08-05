'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useOrders } from '@/hooks/useOrders'
import LoaderButton from '@/components/custom/LoaderButton'

export default function ReturnDialog({ open, onOpenChange, order }) {
    const { returnOrder } = useOrders()

    const handleReturn = () => {
        if (!order?._id) return
        try {
            returnOrder.mutateAsync({
                orderId: order._id,
            })
            onOpenChange(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Accept Return Request?</DialogTitle>
                    <div className="mt-2 space-y-1 text-sm">
                        <p><strong>Order ID:</strong> {order?.orderId || '-'}</p>
                        <p><strong>Customer:</strong> {order?.name || '-'} ({order?.phoneNo || '-'})</p>
                        <p><strong>Total:</strong> ₹{order?.orderAmount?.toFixed(2) ?? '-'}</p>
                    </div>
                </DialogHeader>

                {/* Textarea for "Other" */}
                {/* {selectedReason === "Other" && (
                    <div className="mt-3 space-y-1">
                        <Label htmlFor="customReason">Please provide a reason</Label>
                        <Textarea
                            id="customReason"
                            placeholder="Type your reason..."
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            disabled={rejectOrder.isPending}
                        />
                    </div>
                )} */}

                <DialogFooter className="flex justify-end space-x-2 mt-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={returnOrder.isLoading}
                    >
                        Cancel
                    </Button>
                    <LoaderButton
                        onClick={handleReturn}
                        loading={returnOrder.isPending}
                        disabled={
                            returnOrder.isPending
                        }
                    >
                        Accept
                    </LoaderButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

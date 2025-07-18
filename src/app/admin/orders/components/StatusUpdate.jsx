import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOrders } from '@/hooks/useOrders'
import React from 'react'
import toast from 'react-hot-toast'

function StatusUpdate({ orderId, status }) {
    const { updateOrder } = useOrders()

    const STATUSES = [
        "New",
        "Accepted",
        "Shipped",
        "Delivered",
    ]

    async function handleUpdateStatus(value) {
        const toastId = toast.loading('Updating Status...')
        const data = {
            status: value
        }
        try {
            const res = await updateOrder.mutateAsync({
                id: orderId,
                data: data
            })
            console.log(res)
            // toast.success('Status updated', { id: toastId })
        } catch (error) {
            toast.error('Error in updating status', { id: toastId })

        }
    }

    return (
        <div>
            <Select defaultValue={status} onValueChange={(e) => handleUpdateStatus(e)}>
                <SelectTrigger className={'max-h-6 text-xs p-1'}>
                    <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                    {STATUSES.map((item, idx) => (
                        <SelectItem key={idx} value={item}>{item}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default StatusUpdate

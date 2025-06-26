import React from "react"
import PCard from "@/components/custom/PCard"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Minus, MinusSquareIcon, Plus, PlusSquare } from "lucide-react"
import MiniLoaderButton from "@/components/custom/MiniLoaderButton"
import { useOrders } from "@/hooks/useOrders"

function ItemsTable({ order }) {
    const items = order?.items || []
    console.log(items)

    const { addItemInOrder, removeItemFromOrder } = useOrders()

    async function handleIncrement(item) {
        const data = {
            orderId: order._id,
            productId: item.productId._id,
            variantName: item.variantName,
        }
        // console.log({...data})
        try {
            await addItemInOrder.mutateAsync({ ...data })

        } catch (error) {
            console.log(error)
        }
    }

    async function handleDecrement(item) {
        const data = {
            orderId: order._id,
            productId: item.productId._id,
            variantName: item.variantName,
        }
        // console.log({...data})
        try {
            await removeItemFromOrder.mutateAsync({ ...data })

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <PCard className="p-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Items</h2>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Selling Price</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, idx) => {
                            const product = item.productId
                            const image = product?.images?.[0]
                            const name = product?.fullName || product?.name
                            const variant = item.variantName
                            const quantity = item.quantity
                            const sellingPrice = product?.sellingPrice?.[0]?.price || item.price // fallback
                            const totalPrice = sellingPrice * quantity

                            return (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <img
                                            src={image}
                                            alt={name}
                                            className="h-12 w-12 rounded-md object-cover border"
                                        />
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <p className="font-medium text-sm text-wrap">{name}</p>
                                    </TableCell>
                                    <TableCell>{variant}</TableCell>
                                    <TableCell>{quantity}</TableCell>
                                    <TableCell>₹{sellingPrice}</TableCell>
                                    <TableCell>₹{totalPrice}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <MiniLoaderButton
                                                variant={'outline'}
                                                onClick={() => { handleIncrement(item) }}
                                                loading={addItemInOrder.isPending}
                                            >
                                                <Plus className="cursor-pointer hover:text-green-600 transition-all duration-200 ease-in-out" />
                                            </MiniLoaderButton>

                                            <MiniLoaderButton 
                                            variant={'outline'}
                                            onClick={() => { handleDecrement(item) }}
                                                loading={removeItemFromOrder.isPending}
                                            >
                                                <Minus className="cursor-pointer hover:text-red-600 transition-all duration-200 ease-in-out" />
                                            </MiniLoaderButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                {/* Summary */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                    <div className="flex items-center justify-between sm:min-w-[250px] border rounded-md p-3 shadow-sm bg-muted/50">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="font-medium">₹{order.subtotal}</span>
                    </div>
                    <div className="flex items-center justify-between sm:min-w-[250px] border rounded-md p-3 shadow-sm bg-muted/50">
                        <span className="text-sm text-gray-600">Delivery Charges:</span>
                        <span className="font-medium">₹{order.deliveryCharge}</span>
                    </div>
                    <div className="flex items-center justify-between sm:min-w-[250px] border rounded-md p-3 shadow bg-primary/10">
                        <span className="text-sm font-semibold text-primary">Total Amount:</span>
                        <span className="font-bold text-primary">₹{order.orderAmount}</span>
                    </div>
                </div>
            </div>
        </PCard>
    )
}

export default ItemsTable

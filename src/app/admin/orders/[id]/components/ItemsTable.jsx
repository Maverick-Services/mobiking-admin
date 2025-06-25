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

function ItemsTable({ order }) {
    const items = order?.items || []

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

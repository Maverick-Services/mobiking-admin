'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@/components/ui/tabs'
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function OrdersListView({ error, orders = [] }) {
    const statusTypes = [
        { key: 'New', label: 'New Orders', border: 'border-black' },
        { key: 'Accepted', label: 'Accepted Orders', border: 'border-purple-500' },
        { key: 'Shipped', label: 'Shipped Orders', border: 'border-yellow-400' },
        { key: 'Delivered', label: 'Delivered Orders', border: 'border-green-400' },
        { key: 'Cancelled', label: 'Cancelled Orders', border: 'border-red-400' },
    ]

    const counts = statusTypes.map(({ key }) => ({
        key,
        count: orders.filter(o => o.status === key).length,
    }))

    const router = useRouter()

    if (error) {
        return (
            <div className="text-red-600 p-4">
                Error: {error.message}
            </div>
        )
    }

    const abandoned = orders.filter((o) => o.abondonedOrder)
    const completed = orders.filter((o) => !o.abondonedOrder)

    function renderTable(rows) {
        if (rows.length === 0) {
            return (
                <div className="p-4 text-gray-500 text-center">
                    No orders in this tab.
                </div>
            )
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead>#</TableHead>
                        <TableHead>Order No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((o, i) => {
                        const amount = (o.subtotal ?? 0) + (o.gst ?? 0)
                        const firstItem = o.items?.[0]?.productId
                        return (
                            <TableRow key={o._id} className="even:bg-gray-50 hover:bg-gray-100">
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{o._id.slice(0, 6).toUpperCase()}</TableCell>
                                <TableCell>{firstItem?.name || '—'}</TableCell>
                                <TableCell>₹{amount.toLocaleString()}</TableCell>
                                <TableCell>
                                    {new Date(o.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            o.status === 'New'
                                                ? ''
                                                : o.status === 'Delivered'
                                                    ? 'success'
                                                    : 'default'
                                        }
                                    >
                                        {o.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{o.method}</TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => router.push(`/admin/orders/${o._id}/view`)}
                                    >
                                        <Eye size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }

    return (
        <div className="w-full mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
                {statusTypes.map(({ key, label, border }, i) => (
                    <div
                        key={key}
                        className={cn(
                            "border rounded-lg p-4 text-center",
                            border
                        )}
                    >
                        <h2 className="text-2xl font-bold">
                            {counts[i].count}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {label}
                        </p>
                    </div>
                ))}
            </div>

            <Tabs defaultValue="all" className="w-full">
                {/* ─── Tab Bar ────────────────────────────────────────── */}
                <TabsList className="flex space-x-6 overflow-x-auto border-b border-gray-200">
                    {[
                        ["all", `ALL ORDERS `],
                        ["website", `WEBSITE ORDERS `],
                        ["regular", `REGULAR ORDERS `],
                        ["pos", `POS ORDERS`],
                        ["abandoned", `ABANDONED CHECKOUT ORDERS`],
                        ["returns", `RETURNS`],
                    ].map(([value, label]) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className={`
              whitespace-nowrap
              py-3
              text-sm
              uppercase
              tracking-wide
              border-b-2
              transition
              ${
                                /* Active */
                                "data-[state=active]:border-black data-[state=active]:text-black" +
                                /* Inactive */
                                " data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-black"
                                }
            `}
                        >
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* ─── Tab Panels (your table or cards…) ──────────────── */}
                <TabsContent value="all">
                    {renderTable(completed)}
                </TabsContent>
                <TabsContent value="abandoned">
                    {renderTable(abandoned)}
                </TabsContent>
                {/* …etc */}
            </Tabs>


        </div>
    )
}

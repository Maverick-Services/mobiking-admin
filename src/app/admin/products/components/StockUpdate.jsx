import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { format } from "date-fns"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'

const formSchema = z.object({
    variantName: z.string({
        required_error: 'Variant Name is required',
    }),
    vendor: z.string().optional(),
    quantity: z.coerce.number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number',
    }),
    purchasePrice: z.number().optional()
});

function StockUpdate({ open, onOpenChange, product }) {
    const { addProductStock } = useProducts({ page: 1, limit: 10 })

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit'
    })

    const SProduct = product || {}

    // console.log(SProduct)

    const stockHistory = product?.stock || []

    console.log(product)

    async function onSubmit(values) {
        const data = {
            ...values,
            productId: product._id
        }
        await addProductStock.mutateAsync(data)

        form.reset()
        onOpenChange(false)
    }


    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className={'w-full md:min-w-2xl overflow-y-auto pb-5'}>
                <SheetHeader>
                    <SheetTitle>Add Stock</SheetTitle>
                    <SheetDescription>{SProduct?.fullName}</SheetDescription>
                </SheetHeader>

                <div className='px-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                            <div className='grid grid-cols-2 gap-2'>
                                <FormField
                                    control={form.control}
                                    name='variantName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Navy Blue" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='vendor'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vendor</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ABC Enterprises" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-2'>
                                <FormField
                                    control={form.control}
                                    name='quantity'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Qty</FormLabel>
                                            <FormControl>
                                                <Input placeholder="12" type={'number'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='purchasePrice'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Purchase Price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="2500" type={'number'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : "Add"}
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className="flex flex-wrap gap-2 px-4">
                    {SProduct?.variants && Object.entries(SProduct.variants).length > 0 &&
                        Object.entries(SProduct.variants).map(([key, value], idx) => (
                            <div key={idx} className="bg-gray-100 rounded p-3 text-sm flex gap-1">
                                <strong>{key}:</strong>
                                <p>{value}</p>
                            </div>
                        ))
                    }
                </div>


                <div className="mt-6 px-4">
                    <h3 className="text-lg font-semibold mb-2">Stock History</h3>

                    {stockHistory?.length === 0 ? (
                        <p className="text-sm text-gray-500">No stock history available.</p>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Variant</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Purchase Price</TableHead>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Updated At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stockHistory.map((stock, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{stock?.variantName || '-'}</TableCell>
                                            <TableCell>{stock?.quantity || '-'}</TableCell>
                                            <TableCell>₹{stock?.purchasePrice || '-'}</TableCell>
                                            <TableCell>{stock?.vendor || '-'}</TableCell>
                                            <TableCell>
                                                {(() => {
                                                    try {
                                                        return format(new Date(stock.updatedAt), "dd MMM yyyy, hh:mm a");
                                                    } catch (e) {
                                                        return "-";
                                                    }
                                                })()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

            </SheetContent>
        </Sheet>
    )
}

export default StockUpdate
"use client"
import React, { useEffect, useState } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PCard from '@/components/custom/PCard'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUsers } from '@/hooks/useUsers'
import { useProducts } from '@/hooks/useProducts'
import UserDialog from '../customers/components/UserDialog'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import LoaderButton from '@/components/custom/LoaderButton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PosItemsTable from './components/PosItemsTable'
import { useOrders } from '@/hooks/useOrders'

const posSchema = z.object({
    userId: z.string().min(1, 'User is required'),
    name: z.string().min(1, 'User Name is required'),
    phoneNo: z.string().min(1, 'Phone Number is required'),
    gst: z.string().optional(),
    method: z.string().min(1, 'Please select payment method'),
    subtotal: z.number().min(0),
    discount: z.number().min(0),
    orderAmount: z.number().min(0),
    items: z.array(
        z.object({
            productId: z.string().min(1, 'Product ID is required'),
            variantName: z.string().optional(),
            quantity: z.number().min(1, 'Quantity must be at least 1'),
            unitPrice: z.number().min(0),
            price: z.number().min(0),
        })
    ).min(1, 'At least one item is required'),
});

function OrderItemRow({ index, allProducts, onRemove }) {
    const { control, getValues, setValue } = useFormContext()
    const productId = useWatch({ control, name: `items.${index}.productId` })
    const quantity = useWatch({ control, name: `items.${index}.quantity` })

    const selected = allProducts.find((p) => p._id === productId)
    const variants = selected ? Object.keys(selected.variants || {}) : []
    const unitPrice = selected?.sellingPrice?.slice(-1)[0]?.price || 0

    // reset variant when product changes
    useEffect(() => {
        const cur = getValues(`items.${index}.variantName`)
        if (cur && !variants.includes(cur)) setValue(`items.${index}.variantName`, "")
    }, [productId, variants, getValues, setValue, index])

    // sync unitPrice
    useEffect(() => {
        if (getValues(`items.${index}.unitPrice`) !== unitPrice) {
            setValue(`items.${index}.unitPrice`, unitPrice)
        }
    }, [unitPrice, getValues, setValue, index])

    // sync total
    useEffect(() => {
        const total = unitPrice * (quantity || 0)
        if (getValues(`items.${index}.price`) !== total) {
            setValue(`items.${index}.price`, total)
        }
    }, [quantity, unitPrice, getValues, setValue, index])

    return (
        <div className="flex gap-4 items-end">
            <FormField control={control} name={`items.${index}.productId`} render={({ field }) => (
                <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                        <select {...field} className="w-full border rounded px-2 py-1 flex-grow">
                            <option value="">Select…</option>
                            {allProducts.map((p) => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={control} name={`items.${index}.variantName`} render={({ field }) => (
                <FormItem>
                    <FormLabel>Variant</FormLabel>
                    <FormControl>
                        <select {...field} disabled={!productId} className="w-full border rounded px-2 py-1">
                            <option value="">Select variant…</option>
                            {variants.map((v) => (<option key={v} value={v}>{v}</option>))}
                        </select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={control} name={`items.${index}.quantity`} render={({ field }) => (
                <FormItem>
                    <FormLabel>Qty</FormLabel>
                    <FormControl>
                        <Input type="number" className={'w-20'} min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={control} name={`items.${index}.unitPrice`} render={({ field }) => (
                <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl><Input className={'w-20'} type="number" {...field} disabled /></FormControl>
                </FormItem>
            )} />

            <FormField control={control} name={`items.${index}.price`} render={({ field }) => (
                <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl><Input className={'w-20'} type="number" {...field} disabled /></FormControl>
                </FormItem>
            )} />

            <Button variant="destructive" size="icon" type="button" onClick={onRemove}>&times;</Button>
        </div>
    )
}

function page() {
    // users data
    const { usersQuery } = useUsers()
    const allUsers = usersQuery("user")?.data?.data || []

    // products data
    const { productsQuery } = useProducts()
    const allProducts = productsQuery?.data?.data || []

    const {createPosOrder} = useOrders()

    const [addUserDialog, setAddUserDialog] = useState(false)

    // form hook
    const form = useForm({
        resolver: zodResolver(posSchema),
        mode: "onSubmit",
        defaultValues: {
            userId: "",
            name: "",
            phoneNo: "",
            gst: "",
            method: "",
            subtotal: 0,
            discount: 0,
            orderAmount: 0,
            items: [
                {
                    productId: "",
                    variantName: "",
                    quantity: 1,
                    price: 0,
                }
            ]
        }
    })

    const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" })
    const items = useWatch({ control: form.control, name: "items" })

    // recalc order amount
    useEffect(() => {
        const sum = items.reduce((a, i) => a + (i.price || 0), 0)
        if (form.getValues("orderAmount") !== sum) form.setValue("orderAmount", sum)
        if (form.getValues("subtotal") !== sum) form.setValue("subtotal", sum)
    }, [items, form])

    // phoneNo lookup
    const [phoneQuery, setPhoneQuery] = useState("")
    const [suggestions, setSuggestions] = useState([])

    // Suggestions of user
    function acb() {
        if (phoneQuery) {
            setSuggestions(
                phoneQuery
                    ? allUsers.filter((u) => u.phoneNo.includes(phoneQuery.trim()))
                    : []
            )
        }
    }

    useEffect(() => {
        acb();
    }, [phoneQuery, allUsers])

    const onPhoneSelect = (u) => {
        form.setValue("userId", u._id)
        form.setValue("name", u.name)
        form.setValue("phoneNo", u.phoneNo)
        setSuggestions([])
    }

    function onSubmit(values) {
        // console.log(values)
        try {
            createPosOrder.mutateAsync(values)
        } catch (error) {
            
        }
    }

    return (
        <InnerDashboardLayout>
            <div className='flex items-center justify-between w-full mb-3'>
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-3">Create POS Order</h1>
            </div>
            <div className='flex flex-col sm:flex-col gap-3 w-full'>
                {/* User Form */}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <PCard className={'w-full'}>

                            {/* heading and add user button */}
                            <div className='flex gap-2 justify-between items-center'>
                                <h2 className='font-semibold text-xl uppercase text-gray-600'>User Details</h2>
                                <Button
                                    variant="outline"
                                    type="button"
                                    size={'icon'}
                                    onClick={() => { setAddUserDialog(true) }}
                                >
                                    <Plus />
                                </Button>
                            </div>

                            <Separator />
                            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                                {/* Existing user according to phone number */}
                                <FormField
                                    control={form.control}
                                    name="phoneNo"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Start typing phone…"
                                                    type={'number'}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setPhoneQuery(e.target.value)
                                                    }} />
                                            </FormControl>
                                            <FormMessage />
                                            {suggestions.length > 0 && (
                                                <ul className="absolute z-10 bg-white border w-full mt-14 max-h-40 overflow-auto">
                                                    {suggestions.map((u, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => onPhoneSelect(u)}
                                                        >
                                                            {u.phoneNo} — {u.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </FormItem>
                                    )} />

                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Customer name"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                {/* GST */}
                                <FormField
                                    control={form.control}
                                    name="gst"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GST Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter customer's GST number"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )} />

                                <FormField
                                    control={form.control}
                                    name="method"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method</FormLabel>
                                            <FormControl>
                                                <Select {...field}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className={'w-full'}>
                                                        <SelectValue
                                                            placeholder="Select Payment Method"
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="COD">COD</SelectItem>
                                                        {/* <SelectItem value="upi">UPI</SelectItem> */}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </PCard>

                        <PCard>
                            <div className="space-y-4">
                                <div className='flex gap-2 justify-between items-center mb-4'>
                                    <h2 className='font-semibold text-xl uppercase text-gray-600'>Items</h2>
                                    <Button variant="outline" type="button" onClick={() => append({ productId: "", variantName: "", quantity: 1, unitPrice: 0, price: 0 })}>
                                        + Add Item
                                    </Button>
                                </div>

                                {fields.map((item, i) => (
                                    <OrderItemRow key={item.id} index={i} allProducts={allProducts} onRemove={() => remove(i)} />
                                ))}

                            </div>
                        </PCard>

                        {/* submit Button */}
                        <LoaderButton
                            loading={createPosOrder.isPending}
                            // disabled={createPosOrder.isPending}
                            type="submit"
                        >
                            Create Order
                        </LoaderButton>
                    </form>
                </Form>
            </div>

            {/* User Details */}
            <UserDialog
                open={addUserDialog}
                onOpenChange={setAddUserDialog}
            />
        </InnerDashboardLayout >
    )
}

export default page

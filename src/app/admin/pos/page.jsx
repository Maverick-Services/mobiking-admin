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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { useUsers } from '@/hooks/useUsers'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import UserDialog from '../customers/components/UserDialog'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import LoaderButton from '@/components/custom/LoaderButton'

const posSchema = z.object({
    userId: z.string().optional(),
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
            price: z.number().min(0),
        })
    ).min(1, 'At least one item is required'),
});

function OrderItemRow({ index, allProducts, onRemove }) {
    const { control, getValues, setValue } = useFormContext()
    const productId = useWatch({ control, name: `items.${index}.productId` })
    const quantity = useWatch({ control, name: `items.${index}.quantity` })

    const selected = allProducts.find((p) => p._id === productId)
    const variants = selected ? Object.entries(selected.variants || {}) : []
    const price = selected?.sellingPrice?.slice(-1)[0]?.price || 0

    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false)

    // reset variant when product changes
    useEffect(() => {
        const cur = getValues(`items.${index}.variantName`)
        const hasKey = variants.some(([key]) => key === cur)
        if (cur && !hasKey) setValue(`items.${index}.variantName`, '')
    }, [productId, variants, getValues, setValue, index])

    // sync price
    useEffect(() => {
        if (getValues(`items.${index}.price`) !== price) {
            setValue(`items.${index}.price`, price)
        }
    }, [quantity, productId, price, getValues, setValue, index])

    const total = (quantity || 0) * price

    const filteredProducts = allProducts.filter((p) =>
        p.fullName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex gap-2 items-end w-full">
            {/* Product with searchable popover */}
            <FormField
                control={control}
                name={`items.${index}.productId`}
                render={({ field }) => (
                    <FormItem className="flex-[2]">
                        <FormLabel>Product</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant="outline" role="combobox" className="w-full truncate justify-between">
                                        {selected?.fullName || 'Select product...'}
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 min-w-[300px] max-w-[400px]">
                                <Command>
                                    <CommandInput
                                        placeholder="Search product..."
                                        className="h-9"
                                        value={search}
                                        onValueChange={setSearch}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No product found.</CommandEmpty>
                                        {filteredProducts.map((p) => (
                                            <CommandItem
                                                key={p._id}
                                                value={p.fullName}
                                                onSelect={() => {
                                                    field.onChange(p._id)
                                                    setOpen(false)
                                                    setSearch('')
                                                }}
                                            >
                                                {p.fullName}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Variant */}
            <FormField
                control={control}
                name={`items.${index}.variantName`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Variant</FormLabel>
                        <FormControl>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!productId}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select variant…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {variants.map(([key, qty]) => (
                                        <SelectItem key={key} value={key}>
                                            {key} ({qty} in stock)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Quantity */}
            <FormField
                control={control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Qty</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                className="w-20"
                                min={1}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Price */}
            <FormField
                control={control}
                name={`items.${index}.price`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input className="w-20" type="number" {...field} disabled />
                        </FormControl>
                    </FormItem>
                )}
            />

            {/* Total static */}
            <div className="flex flex-col">
                <FormLabel className="mb-2">Total</FormLabel>
                <div className="pt-2 font-medium border py-1 rounded-md px-3">₹{total}</div>
            </div>

            <Button variant="destructive" size="icon" type="button" onClick={onRemove}>
                &times;
            </Button>
        </div>
    )
}


function page() {
    // users data
    const { usersQuery } = useUsers()
    const allUsers = usersQuery("user")?.data?.data || []

    const { createCustomer, updateUser } = useUsers();

    // products data
    const { productsQuery } = useProducts()
    const allProducts = productsQuery?.data?.data || []

    const { createPosOrder } = useOrders()

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

    const { watch } = form;
    const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" })
    const items = useWatch({ control: form.control, name: "items" })
    const discount = watch('discount')

    useEffect(() => {
        const subtotal = items.reduce((a, i) => a + (i.price || 0) * (i.quantity || 0), 0)
        const orderAmount = subtotal - discount

        if (form.getValues("subtotal") !== subtotal) form.setValue("subtotal", subtotal)
        if (form.getValues("orderAmount") !== orderAmount) form.setValue("orderAmount", orderAmount)
    }, [items, discount, form])

    const watchSubTotal = watch('subtotal')
    const watchOrderAmount = watch('orderAmount')

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

    async function onSubmit(values) {
        try {
            let finalUserId = values.userId

            // If user not selected (means not found in suggestions), create a new user
            if (!finalUserId) {
                const res = await createCustomer.mutateAsync({
                    name: values.name,
                    phoneNo: values.phoneNo,
                    role: 'user',
                })
                // console.log(res)
                finalUserId = res?.data?.data?._id

                form.setValue('userId', finalUserId)
            }

            // Final order values with ensured userId
            const payload = {
                ...values,
                userId: finalUserId,
            }

            // Create the POS order
            await createPosOrder.mutateAsync(payload)
        } catch (err) {
            console.error('Error in creating order:', err)
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
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                    }}
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

                                {/* method */}
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
                                                            placeholder="Method"
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {/* <SelectItem value="COD">COD</SelectItem> */}
                                                        <SelectItem value="UPI">UPI</SelectItem>
                                                        <SelectItem value="Cash">Cash</SelectItem>
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
                                    <Button variant="outline" type="button" onClick={() => append({
                                        productId: "",
                                        variantName: "",
                                        quantity: 1,
                                        price: 0
                                    })}>
                                        + Add Item
                                    </Button>
                                </div>

                                {fields.map((item, i) => (
                                    <OrderItemRow key={item.id} index={i} allProducts={allProducts} onRemove={() => remove(i)} />
                                ))}

                            </div>
                        </PCard>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                            <div className="flex items-center justify-between sm:min-w-[250px] bg-white border rounded-md p-3 shadow-sm">
                                <span className="text-sm text-gray-600">Subtotal:</span>
                                <span className="font-medium">₹{watchSubTotal}</span>
                            </div>

                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                                className="sm:min-w-[250px]"
                                                placeholder="Enter discount"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <div className="flex items-center justify-between sm:min-w-[250px] border rounded-md p-3 shadow bg-primary/10">
                                <span className="text-sm font-semibold text-primary">Total Amount:</span>
                                <span className="font-bold text-primary">₹{watchOrderAmount}</span>
                            </div>
                        </div>

                        {/* submit Button */}
                        <LoaderButton
                            loading={createPosOrder.isPending || createCustomer.isPending}
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

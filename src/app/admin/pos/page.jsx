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
import { useUsers } from '@/hooks/useUsers'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import UserDialog from '../customers/components/UserDialog'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import LoaderButton from '@/components/custom/LoaderButton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BsCashCoin } from "react-icons/bs";
import { PiCreditCardDuotone } from "react-icons/pi";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from 'next/navigation'

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

    const total = (quantity || 0) * price

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

    return (
        <div className="flex gap-2 items-center w-full p-2 border-b">
            <div className="w-12 h-12 flex-shrink-0">
                {selected?.images?.[0] ? (
                    <img
                        src={selected.images[0]}
                        alt={selected.fullName}
                        className="w-full h-full object-cover rounded-md"
                    />
                ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-md w-full h-full" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate max-w-[300px] text-wrap">{selected?.fullName || 'Product not selected'}</p>
                {selected?.variants && (
                    <p className="text-xs text-gray-500 truncate">
                        {getValues(`items.${index}.variantName`) || 'No variant selected'}
                    </p>
                )}
            </div>

            <FormField
                control={control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                    <FormItem className="w-20">
                        <FormControl>
                            <Input
                                type="number"
                                min={1}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className="text-center"
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <div className="w-20 text-right font-medium">₹{price}</div>
            <div className="w-20 text-right font-bold">₹{total}</div>

            <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700"
            >
                &times;
            </Button>
        </div>
    )
}

function ProductCard({ product, onAddItem }) {
    const [selectedVariant, setSelectedVariant] = useState('');
    const variants = Object.entries(product.variants || {});
    const price = product?.sellingPrice?.slice(-1)[0]?.price || 0;

    const handleAddToCart = () => {
        onAddItem({
            productId: product._id,
            variantName: variants.length > 0 ? selectedVariant : undefined,
            quantity: 1,
            price: price
        });

        // Reset variant selection after adding
        if (variants.length > 0) setSelectedVariant('');
    };

    return (
        <Card className="h-full flex py-0 shadow-none rounded">
            <div className="p-3 pb-0">
                <div className="aspect-square w-full bg-gray-100 rounded-md overflow-hidden">
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-md w-full h-full" />
                    )}
                </div>
            </div>
            <div className="p-3 flex-1">
                <h3 className="font-medium text-xs">{product.fullName}</h3>
                <p className="text-primary font-bold mt-1">₹{price}</p>

                {variants.length > 0 && (
                    <div className="my-2">
                        <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select variant" />
                            </SelectTrigger>
                            <SelectContent>
                                {variants.filter(([key, qty]) => qty > 0)?.map(([key, qty]) => (
                                    <SelectItem key={key} value={key}>
                                        {key} <Badge variant="outline" className="ml-2">{qty} in stock</Badge>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <Button
                    size="sm"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={variants.length > 0 && !selectedVariant}
                >
                    Add to Cart
                </Button>
            </div>
        </Card>
    );
}

function ProductGrid({ allProducts, onAddItem }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = allProducts.filter(product =>
        product.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="bg-white rounded-lg p-2 sticky top-0 z-10 shadow-sm">
                <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 flex-1">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onAddItem={onAddItem}
                    />
                ))}
            </div>
        </div>
    );
}

function page() {
    const router = useRouter();
    const { allUsersQuery, createCustomer } = useUsers();
    // users data
    const allUsers = allUsersQuery?.data?.data || []
    // console.log(allUsers)
    // users data
    // const { usersQuery } = useUsers()
    // const allUsers = usersQuery("user")?.data?.data || []

    // const { createCustomer } = useUsers();

    // products data
    const { productsQuery } = useProducts()
    const allProducts = productsQuery?.data || []
    // console.log(allProducts)

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
            items: []
        }
    })

    const { watch, setValue } = form;
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

            // If user not selected, create a new user
            if (!finalUserId) {
                const res = await createCustomer.mutateAsync({
                    name: values.name,
                    phoneNo: values.phoneNo,
                    role: 'user',
                })
                finalUserId = res?.data?.data?._id
                form.setValue('userId', finalUserId)
            }

            const payload = {
                ...values,
                userId: finalUserId,
            }

            await createPosOrder.mutateAsync(payload)
            router.push('/admin/orders')
        } catch (err) {
            console.error('Error in creating order:', err)
        }
    }

    return (
        <InnerDashboardLayout>
            <div className='flex items-center justify-between w-full mb-3'>
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-0">Create POS Order</h1>
            </div>

            <div className='flex flex-col lg:flex-row gap-4 w-full'>
                {/* Left Column: Product Grid (70% width) */}
                <div className="w-full lg:w-7/12">
                    <PCard className="h-full">
                        <h2 className="font-semibold text-xl uppercase text-gray-600 mb-4">Products</h2>
                        <ProductGrid
                            allProducts={allProducts}
                            onAddItem={(item) => append(item)}
                        />
                    </PCard>
                </div>

                {/* Right Column: Order Form (30% width) */}
                <div className="w-full lg:w-5/12">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <PCard>
                                <div className="flex gap-2 justify-between items-center mb-3">
                                    <h2 className='font-semibold text-xl uppercase text-gray-600'>Customer Details</h2>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        size={'icon'}
                                        onClick={() => setAddUserDialog(true)}
                                    >
                                        <Plus />
                                    </Button>
                                </div>
                                <Separator className="mb-4" />

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                    <FormField
                                        control={form.control}
                                        name="phoneNo"
                                        render={({ field }) => (
                                            <FormItem className="relative col-span-2 sm:col-span-1">
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter phone number"
                                                        type={'tel'}
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setPhoneQuery(e.target.value)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                {suggestions.length > 0 && (
                                                    <ul className="absolute z-10 bg-white border w-full mt-1 max-h-40 overflow-auto rounded-md shadow-lg">
                                                        {suggestions.map((u, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                                onClick={() => onPhoneSelect(u)}
                                                            >
                                                                {u.phoneNo} — {u.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2 sm:col-span-1">
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Customer name"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="gst"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>GST Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter GST number"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="method"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Payment Method</FormLabel>
                                                <FormControl>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {/* Cash Option */}
                                                        <div
                                                            className={`border rounded-md p-3 flex gap-2 items-center justify-center cursor-pointer transition-all ${field.value === "Cash"
                                                                ? "border-primary bg-primary/10"
                                                                : "border-gray-300 hover:border-primary/50"
                                                                }`}
                                                            onClick={() => field.onChange("Cash")}
                                                        >
                                                            <BsCashCoin className="w-6 h-6 text-gray-600" />
                                                            <span>Cash</span>
                                                        </div>

                                                        {/* Card Option */}
                                                        <div
                                                            className={`border rounded-md p-3 flex gap-2 items-center justify-center cursor-pointer transition-all ${field.value === "Card"
                                                                ? "border-primary bg-primary/10"
                                                                : "border-gray-300 hover:border-primary/50"
                                                                }`}
                                                            onClick={() => field.onChange("Card")}
                                                        >
                                                            <PiCreditCardDuotone className="w-6 h-6 text-gray-600" />
                                                            <span>Card</span>
                                                        </div>

                                                        {/* UPI Option */}
                                                        <div
                                                            className={`border rounded-md p-3 flex gap-2 items-center justify-center cursor-pointer transition-all ${field.value === "UPI"
                                                                ? "border-primary bg-primary/10"
                                                                : "border-gray-300 hover:border-primary/50"
                                                                }`}
                                                            onClick={() => field.onChange("UPI")}
                                                        >
                                                            <FaGoogle className="w-6 h-6 text-gray-600" />
                                                            <span>UPI</span>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </PCard>

                            <PCard>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className='font-semibold text-xl uppercase text-gray-600'>Order Items</h2>
                                    <div className="text-sm text-gray-500">
                                        {items.length} item{items.length !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    {fields.length === 0 ? (
                                        <div className="py-10 text-center text-gray-500">
                                            No items added. Select products from the left panel.
                                        </div>
                                    ) : (
                                        <ScrollArea className="max-h-64">
                                            {fields.map((item, i) => (
                                                <OrderItemRow
                                                    key={item.id}
                                                    index={i}
                                                    allProducts={allProducts}
                                                    onRemove={() => remove(i)}
                                                />
                                            ))}
                                        </ScrollArea>
                                    )}
                                </div>
                            </PCard>

                            <PCard>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">₹{watchSubTotal}</span>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="discount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex justify-between items-center">
                                                    <FormLabel>Discount</FormLabel>
                                                    <span className="text-sm text-gray-500">Enter amount</span>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={watchSubTotal}
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                                        placeholder="Enter discount"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Amount:</span>
                                        <span className="text-primary">₹{watchOrderAmount}</span>
                                    </div>
                                </div>
                            </PCard>

                            <LoaderButton
                                loading={createPosOrder.isPending || createCustomer.isPending}
                                type="submit"
                                className="w-full mb-5"
                            >
                                Create Order
                            </LoaderButton>
                        </form>
                    </Form>
                </div>
            </div>

            <UserDialog
                open={addUserDialog}
                onOpenChange={setAddUserDialog}
            />
        </InnerDashboardLayout>
    )
}

export default page




//   const { allUsersQuery, createCustomer, updateUser } = useUsers();
//     // users data
//     const allUsers = allUsersQuery?.data?.data || []
//     console.log(allUsers)
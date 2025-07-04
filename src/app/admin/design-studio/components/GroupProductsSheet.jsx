'use client'
import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useProducts } from '@/hooks/useProducts'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover'
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

function GroupProductsSheet({ open, onOpenChange, group, onProductsAdd, updatingProducts, updateProductsError }) {
    const { productsQuery } = useProducts()
    const allProducts = productsQuery?.data?.data || []

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([])
    const [visibleProducts, setVisibleProducts] = useState([])

    const filteredProducts = allProducts
        .filter(p => p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 10); // only show top 10


    // Initialize local state whenever the sheet opens or the group changes
    useEffect(() => {
        if (!open) return
        const ids = group?.products?.map(p => p._id || p) ?? []
        setSelectedProducts(ids)
        setVisibleProducts(group?.products ?? [])
    }, [open, group])

    const handleRemove = (productId) => {
        setSelectedProducts(ids => ids.filter(id => id !== productId))
        setVisibleProducts(list => list.filter(p => (p._id || p) !== productId))
    }

    const handleToggle = (productId) => {
        if (selectedProducts.includes(productId)) {
            // remove
            handleRemove(productId)
        } else {
            // add
            const p = allProducts.find(x => x._id === productId)
            if (!p) return
            setSelectedProducts(ids => [...ids, productId])
            setVisibleProducts(list => [...list, p])
        }
    }

    const handleSave = async () => {

        const data = {
            products: [...selectedProducts],
            groupId: group._id
        }

        try {
            await onProductsAdd(data)
            onOpenChange(false)

        } catch (error) {
            console.log(error)
        }
        if (updateProductsError) {
            console.log(updateProductsError)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full md:min-w-xl overflow-y-auto pb-5">
                <SheetHeader>
                    <SheetTitle>{group?.name}</SheetTitle>
                    <SheetDescription>Add Products in Group</SheetDescription>
                </SheetHeader>

                <div className="space-y-4 px-4">
                    <div className="space-y-3">
                        <Label>Add Products</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div
                                    className={cn(
                                        "min-h-[44px] w-full flex flex-wrap items-center gap-1 px-3 py-2 border rounded-md cursor-pointer"
                                    )}
                                >
                                    {selectedProducts.length === 0
                                        ? <span className="text-gray-400">Select Products...</span>
                                        : <span className="text-sm text-muted-foreground">
                                            {selectedProducts.length} selected
                                        </span>}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder="Search products..."
                                        onValueChange={setSearchTerm}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No products found.</CommandEmpty>
                                        {filteredProducts.map(product => (
                                            <CommandItem
                                                key={product._id}
                                                onSelect={() => handleToggle(product._id)}
                                                className="cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product._id)}
                                                    readOnly
                                                    className="mr-2 h-4 w-4 text-indigo-600 rounded"
                                                />
                                                {product.fullName}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {visibleProducts.length === 0 && (
                        <p className="text-sm text-gray-500">No products in this group.</p>
                    )}

                    {visibleProducts.map(product => (
                        <div
                            key={product._id}
                            className="border p-3 rounded-lg flex gap-4 items-center"
                        >
                            <img
                                src={product.images?.[0]}
                                alt={product.fullName}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{product.fullName}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    ₹{product.sellingPrice?.[product.sellingPrice.length - 1]?.price ?? 'N/A'}
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemove(product._id)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>

                {selectedProducts.length > 0 && (
                    <div className="mt-6 px-4">
                        <Button className="w-full" onClick={handleSave} disabled={updatingProducts}>
                            {updatingProducts && <Loader2 className='animate-spin' />}
                            Save Changes
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default GroupProductsSheet

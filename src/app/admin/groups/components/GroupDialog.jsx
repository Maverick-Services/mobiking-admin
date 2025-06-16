import React from 'react'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import ImageSelector from '@/components/ImageSelector';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, } from '@/components/ui/command';

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sequenceNo: z.coerce.number({ required_error: "Sequence number is required" }),
    active: z.boolean(),
    banner: z.string().nullable(),
    products: z.array(z.string()).optional(),
});

function GroupDialog({ open, onOpenChange, selectedGroup, onCreate, onUpdate, isSubmitting, error, products }) {
    // console.log(selectedGroup)
    // console.log(products?.data)
    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: selectedGroup || {
            name: "",
            sequenceNo: "",
            active: true,
            banner: "",
            products: [],
        }
    });
    const { watch, setValue, control, reset } = form;

    useEffect(() => {
        if (selectedGroup) {
            reset({
                name: selectedGroup.name,
                sequenceNo: selectedGroup.sequenceNo,
                active: selectedGroup.active,
                banner: selectedGroup.banner,
                products: selectedGroup.products,
            });
        } else {
            reset({
                name: "",
                sequenceNo: 0,
                active: true,
                banner: "",
                products: [],
            });
        }
    }, [selectedGroup, reset]);

    const watchName = form.watch("name");
    // useEffect(() => {
    //     const slug = watchName
    //         ?.toLowerCase()
    //         .replace(/\s+/g, "-")
    //         .replace(/[^a-z0-9-]/g, "");
    //     form.setValue("slug", slug);
    // }, [watchName]);

    const banner = watch('banner')
    const [bannerDialog, setBannerDialog] = useState(false)

    const allProducts = products?.data || []
    const selectedProducts = watch('products') || [];


    const toggleSelect = (field, id) => {
        const curr = watch(field) || [];
        if (curr.includes(id)) {
            setValue(
                field,
                curr.filter((x) => x !== id),
                { shouldValidate: true }
            );
        } else {
            setValue(field, [...curr, id], { shouldValidate: true });
        }
    };

    async function onSubmit(values) {
        console.log(values)
        // if (selectedGroup) {
        //     await onUpdate({ id: selectedGroup._id, data: values })
        // } else {
        //     await onCreate(values)
        // }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {selectedGroup ? "Edit Product" : "Add Product"}
                    </DialogTitle>
                </DialogHeader>

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                            {/* name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="JBL Smartwatch" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* seq number */}
                            <FormField
                                control={form.control}
                                name="sequenceNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sequence No<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Active */}
                            <FormField
                                control={form.control}
                                name="active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Active</FormLabel>
                                            <DialogDescription>This product is visible to users</DialogDescription>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="checkbox"
                                                className="w-5 h-5"
                                                checked={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="banner"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group Banner<span className="text-red-500"> *</span></FormLabel>

                                        {/* Preview or placeholder */}
                                        {!banner ? (
                                            <div
                                                className="border-2 border-dashed border-gray-300 rounded-lg h-28 flex items-center justify-center cursor-pointer"
                                                onClick={() => setBannerDialog(true)}
                                            >
                                                <span className="text-gray-500">Click to select banner</span>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-28 border rounded-lg mb-2">
                                                <Image
                                                    src={banner}
                                                    alt="Selected Banner"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        )}

                                        {/* Change / Select button */}
                                        <Button
                                            type='button'
                                            variant="outline"
                                            onClick={() => setUpperDialog(true)}
                                            className="mt-1"
                                        >
                                            {banner ? "Change Icon" : "Select Icon"}
                                        </Button>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="products"
                                render={({ field }) => (
                                    <FormItem>
                                        <div>
                                            <FormLabel>Products</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <div className='border border-gray-100 rounded-sm grid grid-cols-3 gap-1 p-1'>
                                                        {selectedProducts.length === 0 && (
                                                            <span className="text-gray-400">Select products...</span>
                                                        )}
                                                        {selectedProducts.map((id, idx) => {
                                                            const tag = allProducts.find((t) => t._id === id);
                                                            return (
                                                                <span
                                                                    key={idx}
                                                                    className="flex items-center bg-green-100 text-green-800 px-2 py-0.5 rounded-sm text-sm"
                                                                >
                                                                    {tag?.name}
                                                                    <X
                                                                        className="ml-1 cursor-pointer"
                                                                        size={12}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            toggleSelect('products', id);
                                                                        }}
                                                                    />
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search Products..." />
                                                        <CommandList>
                                                            <CommandEmpty>No Products found.</CommandEmpty>
                                                            {allProducts.map((cat) => (
                                                                <CommandItem
                                                                    key={cat._id}
                                                                    onSelect={() => toggleSelect('products', cat._id)}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedProducts.includes(cat._id)}
                                                                        readOnly
                                                                        className="mr-2"
                                                                    />
                                                                    {cat.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="animate-spin mr-1" />}
                                    {selectedGroup ? "Update" : "Create"}
                                </Button>
                                {/* <Button>Submit</Button> */}
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>

            <ImageSelector
                open={bannerDialog}
                onOpenChange={setBannerDialog}
                setImage={(url) => {
                    setValue("banner", url, { shouldValidate: true });
                    setBannerDialog(false);
                }}
            />

        </Dialog>
    )
}

export default GroupDialog
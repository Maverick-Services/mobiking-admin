import React from 'react'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PCard from '@/components/custom/PCard';
import { Loader2, X } from 'lucide-react';
import MultiImageSelector from '@/components/MultiImageSelector';
import Image from 'next/image';

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    fullName: z.string().min(1, "Full name is required"),
    price: z.number().min(0, "Price must be a positive number"),
    slug: z.string().min(1, "Slug is required"),
    active: z.boolean(),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().min(1, "Category is required"),
    images: z.array(z.string().min(1, "At least one image is required")),
});

function ProductDialog({ open, onOpenChange, selectedProduct, onCreate, onUpdate, isSubmitting, error, categories }) {
    // console.log(selectedProduct)
    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onBlur',
        defaultValues: selectedProduct || {
            name: "",
            fullName: "",
            price: 0,
            slug: "",
            active: true,
            description: "",
            categoryId: "",
            images: [],
        }
    });
    const { watch, setValue, control, reset } = form;

    useEffect(() => {
        if (selectedProduct) {
            reset({
                name: selectedProduct.name,
                fullName: selectedProduct.fullName,
                price: selectedProduct?.sellingPrice[selectedProduct.sellingPrice?.length - 1].price,
                slug: selectedProduct.slug,
                active: selectedProduct.active,
                description: selectedProduct.description,
                categoryId: selectedProduct.category?._id || "",
                images: selectedProduct.images || [],
            });
        } else {
            // or back to your blank defaults
            reset({
                name: "",
                fullName: "",
                sellingPrice: 0,
                slug: "",
                active: true,
                description: "",
                categoryId: "",
                images: [],
            });
        }
    }, [selectedProduct, reset]);

    const watchName = form.watch("name");
    useEffect(() => {
        const slug = watchName
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        form.setValue("slug", slug);
    }, [watchName]);

    const images = watch("images") || [];
    const [photosDialogOpen, setPhotosDialogOpen] = useState(false);
    // console.log(categories)

    async function onSubmit(values) {
        console.log(values)
        if (selectedProduct) {
            await onUpdate({ id: selectedProduct._id, data: values })
        } else {
            await onCreate(values)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {selectedProduct ? "Edit Product" : "Add Product"}
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
                            {/* Slug */}
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="jbl-smartwatch" {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* full name */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="JBL Limited Edition Smartwatch" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                rows={3}
                                                placeholder="Write something about the product..."
                                                className="w-full p-2 border rounded-md resize-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* category */}
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category<span className="text-red-500"> *</span></FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories?.map((category) => (
                                                    <SelectItem key={category._id} value={category._id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Selling price */}
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Selling Price<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="1999"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
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
                                    </FormItem>
                                )}
                            />

                            {/* Images */}
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center w-full">
                                    <span className="font-medium mb-2">Select Images</span>
                                    <Button type={'button'} onClick={() => setPhotosDialogOpen(true)}>
                                        Add Images
                                    </Button>
                                </div>
                                {images.length > 0 ? (
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {images.map((url, idx) => (
                                            <div key={idx} className="relative border rounded-lg overflow-hidden group">
                                                <Image
                                                    src={url}
                                                    alt={`Selected image ${idx + 1}`}
                                                    height={200}
                                                    width={200}
                                                    className="object-cover h-32 w-full"
                                                />
                                                <button
                                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md 
                     hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const updatedImages = [...images];
                                                        updatedImages.splice(idx, 1); // remove by index
                                                        setValue("images", updatedImages, { shouldValidate: true });
                                                    }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">No images selected</div>
                                )}

                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="animate-spin mr-1" />}
                                    {selectedProduct ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>


            <MultiImageSelector
                open={photosDialogOpen}
                onOpenChange={setPhotosDialogOpen}
                onChange={(newUrls) => {
                    setValue("images", [...(images || []), ...newUrls], {
                        shouldValidate: true,
                    });
                }}
            />
        </Dialog>
    )
}

export default ProductDialog
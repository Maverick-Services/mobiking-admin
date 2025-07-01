import React from 'react'
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Loader2, Plus, X } from 'lucide-react';
import MultiImageSelector from '@/components/MultiImageSelector';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    fullName: z.string().min(1, "Full name is required"),
    price: z.number().min(0, "Selling Price is required"),
    basePrice: z.number().min(0, "Base Price is required"),
    gst: z.number().min(0, "GST must be a positive number"),
    slug: z.string().min(1, "Slug is required"),
    active: z.boolean(),
    description: z.string().min(1, "Description is required"),
    descriptionPoints: z.array(z.string()).nullable(),
    keyInformation: z.array(z.object({
        title: z.string(),
        content: z.string()
    })).nullable(),
    categoryId: z.string().min(1, "Category is required"),
    images: z.array(z.string().min(1, "At least one image is required")),
});

function ProductDialog({ open, onOpenChange, selectedProduct, onCreate, onUpdate, isSubmitting, error, categories }) {
    // console.log(selectedProduct)
    // console.log(selectedProduct)
    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: selectedProduct || {
            name: "",
            fullName: "",
            price: 0,
            gst: 0,
            basePrice: 0,
            slug: "",
            active: true,
            description: "",
            descriptionPoints: [],
            keyInformation: [],
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
                gst: selectedProduct.gst,
                basePrice: selectedProduct.basePrice,
                slug: selectedProduct.slug,
                active: selectedProduct.active,
                description: selectedProduct.description,
                descriptionPoints: selectedProduct.descriptionPoints,
                keyInformation: selectedProduct.keyInformation,
                categoryId: selectedProduct.category?._id || "",
                images: selectedProduct.images || [],
            });
        } else {
            reset({
                name: "",
                fullName: "",
                price: 0,
                gst: 0,
                basePrice: 0,
                slug: "",
                active: true,
                description: "",
                descriptionPoints: [],
                keyInformation: [],
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

    // setting value of base price
    const watchPrice = watch('price')
    const watchGst = watch('gst')
    useEffect(() => {
        const valBase = (watchPrice * (100 / (100 + +watchGst))).toFixed(2)
        setValue('basePrice', Number(valBase))
    }, [watchPrice, watchGst])

    const images = watch("images") || [];
    const [photosDialogOpen, setPhotosDialogOpen] = useState(false);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "descriptionPoints",
    });

    const {
        fields: keyInfoFields,
        append: appendKeyInfo,
        remove: removeKeyInfo,
    } = useFieldArray({
        control,
        name: 'keyInformation',
    })


    async function onSubmit(values) {
        console.log(values)
        if (selectedProduct) {
            await onUpdate({ id: selectedProduct._id, data: values })
            // console.log(values)
        } else {
            await onCreate(values)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto">
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
                            <div className='hidden'>
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
                            </div>

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
                                            <Textarea
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
                                    <FormItem className={''}>
                                        <FormLabel>Category<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className={'w-full'}>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent className={'w-full'}>
                                                    {categories?.map((category) => (
                                                        <SelectItem key={category._id} value={category._id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex gap-2'>
                                {/* Base price */}
                                <FormField
                                    control={form.control}
                                    name="basePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Base Price<span className="text-red-500"> *</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="1699"
                                                    {...field}
                                                    disabled
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* GST */}
                                <FormField
                                    control={form.control}
                                    name="gst"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GST (%)<span className="text-red-500"> *</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="18"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
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
                            </div>
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

                            {/* Description Points */}
                            <div className='bg-gray-100 rounded p-4'>
                                <p className='font-semibold mb-3'>Description Points</p>

                                <div className='space-y-2'>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className='flex gap-2 items-center'>
                                            <FormField
                                                control={control}
                                                name={`descriptionPoints.${index}`}
                                                render={({ field }) => (
                                                    <FormItem className={'flex-1'}>
                                                        <FormControl>
                                                            <Input placeholder={`Point ${index + 1}`} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type='button'
                                                variant={'destructive'}
                                                onClick={() => remove(index)}
                                            >
                                                <X />
                                            </Button>
                                        </div>
                                    ))}

                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-3"
                                    onClick={() => append("")}
                                >
                                    <Plus size={16} className="mr-1" /> Add Point
                                </Button>
                            </div>

                            {/* Key Information */}
                            <div className='bg-gray-100 rounded p-4'>
                                <p className='font-semibold mb-3'>Key Information</p>
                                <div className='space-y-2'>
                                    {keyInfoFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 border p-3 rounded-md relative items-start">
                                            {/* Title */}
                                            <FormField
                                                control={control}
                                                name={`keyInformation.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={"e.g. Brand Name"} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {/* Content */}
                                            <FormField
                                                control={control}
                                                name={`keyInformation.${index}.content`}
                                                render={({ field }) => (
                                                    <FormItem className={'flex-1'}>
                                                        <FormLabel>Content</FormLabel>
                                                        <FormControl>
                                                            <Textarea className={'bg-white'} placeholder="e.g. Up to 10 hours" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Remove Button */}
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className=""
                                                onClick={() => removeKeyInfo(index)}
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => appendKeyInfo({ title: "", content: "" })}
                                    >
                                        <Plus size={16} className="mr-1" />
                                        Add Key Info
                                    </Button>
                                </div>
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
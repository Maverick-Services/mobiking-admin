"use client"

import dynamic from 'next/dynamic';
// Dynamically import MultiImageSelector to avoid SSR issues
const MultiImageSelector = dynamic(
    () => import('@/components/MultiImageSelector'),
    { ssr: false }
);

import React, { useRef } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageSelector from "@/components/ImageSelector";
import { useCategories } from '@/hooks/useCategories';
import PCard from '@/components/custom/PCard';
import LoaderButton from '@/components/custom/LoaderButton';
import { Textarea } from '@/components/ui/textarea';
import { toast, Toaster } from 'sonner';
import { uploadImage } from '@/lib/services/uploadImage';

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required").refine(val => !/\s/.test(val), {
        message: "Slug cannot contain spaces",
    }),
    sequenceNo: z.number().optional(),
    icon: z.string().min(1, "Icon is required"),
    active: z.boolean(),
    featured: z.boolean(),
    categoryId: z.string().min(1, "Category is required"),
    photos: z.array(z.string()).optional().nullable(),
    upperBanner: z.string().nullable(),
    lowerBanner: z.string().nullable(),
    deliveryCharge: z.coerce.number().optional(),
    minOrderAmount: z.coerce.number().optional(),
    minFreeDeliveryOrderAmount: z.coerce.number().optional(),
});

export default function SubCategoryForm({ defaultValues, onSubmit, loading, error }) {
    const { categoriesQuery } = useCategories()

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: defaultValues || {
            name: "",
            slug: "",
            icon: "",
            active: true,
            featured: false,
            sequenceNo: 0,
            categoryId: "",
            photos: [],
            upperBanner: '',
            lowerBanner: '',
            deliveryCharge: 0,
            minOrderAmount: 0,
            minFreeDeliveryOrderAmount: 0,
        },
    });

    const { watch, setValue, control, reset } = form;

    // slug generation
    const watchName = form.watch("name");
    useEffect(() => {
        const slug = watchName
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        form.setValue("slug", slug);
    }, [watchName]);

    // fill in exactly the shape your formSchema expects
    useEffect(() => {
        if (defaultValues) {
            reset({
                ...defaultValues,
                categoryId: defaultValues?.parentCategory?._id || ''
            })
        }
    }, [defaultValues, reset])


    const photos = watch("photos") || [];
    const [photosDialogOpen, setPhotosDialogOpen] = useState(false);
    // console.log(photos)

    // const upperBanner = watch('upperBanner')
    // const [upperDialog, setUpperDialog] = useState(false)

    const upperInputRef = useRef(null)
   const onUpperClick = ()=> upperInputRef.current?.click();

    // const lowerBanner = watch('lowerBanner')
    // const [lowerDialog, setLowerDialog] = useState(false)

    const lowerInputRef = useRef(null)

    // 1. trigger native picker
    const onLowerClick = () => lowerInputRef.current?.click()

    // 2. handle file selection + upload
    const onLowerChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const toastId = toast.loading('Uploading...')
        // Optional: you can show a spinner here
        const reader = new FileReader()
        reader.onloadend = async () => {
            try {
                const url = await uploadImage(reader.result)
                setValue('lowerBanner', url, { shouldValidate: true })
                toast.success('Image Uploaded', { id: toastId })
            } catch (err) {
                console.error(err)
                toast.error('Error', { id: toastId })
            }
        }
        reader.readAsDataURL(file)
    }

     const onUpperChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const toastId = toast.loading('Uploading...')
        const reader = new FileReader()
        reader.onloadend = async () => {
            try {
                const url = await uploadImage(reader.result)
                setValue('upperBanner', url, { shouldValidate: true })
                toast.success('Image Uploaded', { id: toastId })
            } catch (err) {
                console.error(err)
                toast.error('Error'+ err, { id: toastId })
            }
        }
        reader.readAsDataURL(file)
    }

    if (error) {
        console.log(error)
    }

    // console.log(categoriesQuery.data.data)

    return (

        <div className="">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >

                    <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <PCard className={'space-y-4'}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Boat Headphones" {...field} />
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
                                            <Input placeholder="boat-headphones" {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Parent Category */}
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Category<span className="text-red-500"> *</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={'w-full'}>
                                                    <SelectValue placeholder="Select Parent category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categoriesQuery?.data?.data?.map((cat) => (
                                                    <SelectItem key={cat._id} value={cat._id}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="deliveryCharge"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Delivery Charge<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="120" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PCard>

                        <PCard>
                            {/* Icon */}
                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Paste an svg icon here." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Sequence Number */}
                            {/* <FormField
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
                            /> */}

                            {/* Active */}
                            <FormField
                                control={form.control}
                                name="active"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between">
                                        <FormLabel>Active</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Featured */}
                            <FormField
                                control={form.control}
                                name="featured"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between">
                                        <FormLabel>Featured</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </PCard>

                        {/* <PCard> */}
                            {/* delivery charge */}
                            

                            {/* min order amount */}
                            {/* <FormField
                                control={form.control}
                                name="minOrderAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minimum Order Amount<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="2000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            {/* min free delivery order amount */}
                            {/* <FormField
                                control={form.control}
                                name="minFreeDeliveryOrderAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minimum Free Delivery Order Amount<span className="text-red-500"> *</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="2000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                        {/* </PCard> */}

                        {/* <PCard>
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center w-full">
                                    <span className="font-medium mb-2">Select Category Images</span>
                                    <Button type={'button'} onClick={() => setPhotosDialogOpen(true)}>
                                        Add Images
                                    </Button>
                                </div>
                                {photos.length > 0 ? (
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {photos.map((url, idx) => (
                                            <div
                                                key={idx}
                                                className="relative border rounded-lg overflow-hidden group max-h-32"
                                            >
                                                <Image
                                                    src={url}
                                                    alt="asfdasd"
                                                    width={200}
                                                    height={200}
                                                    className="object-contain max-h-32 w-auto"
                                                />
                                                <button
                                                    type='button'
                                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md 
                                                 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setValue(
                                                            "photos",
                                                            photos.filter((p) => p !== url),
                                                            { shouldValidate: true }
                                                        );
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
                        </PCard> */}

                            {/* upper Banner */}
                        <PCard>
                            <input
                            type="file"
                            accept="image/*,.gif"
                            ref={upperInputRef}
                            className="hidden"
                            onChange={onUpperChange}
                        />
                            <FormField
                                control={control}
                                name="upperBanner"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upper Banner<span className="text-red-500">*</span></FormLabel>

                                        {/* 3. on click, open file picker */}
                                        {!field.value ? (
                                            <div
                                                className="border-2 border-dashed border-gray-300 rounded-lg mt-3 h-36 flex flex-col items-center justify-center cursor-pointer"
                                                onClick={onUpperClick}
                                            >                         
                                                                   <span className="text-gray-500">Upper banner: 1080w * 540h</span>
                                                <p className="text-gray-500 text-xs">Max size - 5mb</p>
                                            </div>
                                        ) : (
                                            <div className="relative w-full aspect-[2/1] border rounded-lg mb-2">
                                                <Image
                                                    src={field.value}
                                                    alt="Selected Upper Banner"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>

                                        )}

                                        {/* change button also triggers picker */}
                                        {field.value && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={onUpperClick}
                                                className="mt-1"
                                            >
                                                Change Upper Banner
                                            </Button>
                                        )}

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PCard>


                        <input
                            type="file"
                            accept="image/*,.gif"
                            ref={lowerInputRef}
                            className="hidden"
                            onChange={onLowerChange}
                        />
                        <PCard>
                            {/* Lower Banner */}
                            <FormField
                                control={control}
                                name="lowerBanner"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lower Banner<span className="text-red-500">*</span></FormLabel>

                                        {/* 3. on click, open file picker */}
                                        {!field.value ? (
                                            <div
                                                className="border-2 border-dashed border-gray-300 rounded-lg mt-3 h-36 flex flex-col items-center justify-center cursor-pointer"
                                                onClick={onLowerClick}
                                            >
                                                <span className="text-gray-500">Lower banner: 720w * 320h</span>
                                                <p className="text-gray-500 text-xs">Max size - 5mb</p>
                                            </div>
                                        ) : (
                                            <div className="relative w-full aspect-[2/1] border rounded-lg mb-2">
                                                <Image
                                                    src={field.value}
                                                    alt="Selected lower Banner"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>

                                        )}

                                        {/* change button also triggers picker */}
                                        {field.value && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={onLowerClick}
                                                className="mt-1"
                                            >
                                                Change Lower Banner
                                            </Button>
                                        )}

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </PCard>
                    </div>
                    <div className='flex items-end justify-end mt-3'>
                        <LoaderButton
                            loading={loading}
                            type="submit"
                        >
                            {defaultValues ? "Update Sub Category" : "Create Sub Category"}
                        </LoaderButton>
                    </div>
                </form>
            </Form>

            {/* <ImageSelector
                open={upperDialog}
                onOpenChange={setUpperDialog}
                setImage={(url) => {
                    setValue("upperBanner", url, { shouldValidate: true });
                    setUpperDialog(false);
                }}
            /> */}

            {/* <ImageSelector
                open={lowerDialog}
                onOpenChange={setLowerDialog}
                setImage={(url) => {
                    setValue("lowerBanner", url, { shouldValidate: true });
                    setLowerDialog(false);
                }}
            /> */}

            <MultiImageSelector
                open={photosDialogOpen}
                onOpenChange={setPhotosDialogOpen}
                onChange={(newUrls) => {
                    setValue("photos", [...(photos || []), ...newUrls], {
                        shouldValidate: true,
                    });
                }}
            />
            <Toaster position='top-right' richColors />
        </div>
    )
}
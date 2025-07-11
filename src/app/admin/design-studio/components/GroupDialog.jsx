import React, { useRef } from 'react'
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
import toast from 'react-hot-toast';
import { uploadImage } from '@/lib/services/uploadImage';

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sequenceNo: z.coerce.number({ required_error: "Sequence number is required" }),
    active: z.boolean(),
    isBannerVisble: z.boolean(),
    isBackgroundColorVisible: z.boolean(),
    banner: z.string().nullable(),
    backgroundColor: z.string().optional(),
});


function GroupDialog({ open, onOpenChange, selectedGroup, onCreate, onUpdate, isSubmitting, error, }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: selectedGroup || {
            name: "",
            sequenceNo: 0,
            active: true,
            banner: "",
            isBannerVisble: false,
            isBackgroundColorVisible: false,
            backgroundColor: "#ffffff", // default white
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
                isBannerVisble: selectedGroup.isBannerVisble,
                isBackgroundColorVisible: selectedGroup.isBackgroundColorVisible,
                backgroundColor: selectedGroup?.backgroundColor || "#ffffff"
            });
        } else {
            reset({
                name: "",
                sequenceNo: 0,
                active: true,
                banner: "",
                isBannerVisble: false,
                isBackgroundColorVisible: false,
                backgroundColor: "#ffffff"
            });
        }
    }, [selectedGroup, reset]);

    const bannerRef = useRef(null)
    const onBannerClick = () => bannerRef.current?.click()

    const onBannerChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const toastId = toast.loading('Uploading...')
        // Optional: you can show a spinner here
        const reader = new FileReader()
        reader.onloadend = async () => {
            try {
                const url = await uploadImage(reader.result)
                setValue('banner', url, { shouldValidate: true })
                toast.success('Banner Uploaded', { id: toastId })
            } catch (err) {
                console.error(err)
                toast.error('Error uploading banner', { id: toastId })
            }
        }
        reader.readAsDataURL(file)
    }

    async function onSubmit(values) {
        // console.log(values)
        if (selectedGroup) {
            await onUpdate({ id: selectedGroup._id, data: values })
            onOpenChange(false)
        } else {
            await onCreate(values)
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className=" max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {selectedGroup ? "Edit Product Group" : "Add Product Group"}
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
                                    <FormItem className="flex flex-row items-center justify-between rounded border border-gray-500 p-3">
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

                            {/* isBannerVisble */}
                            <FormField
                                control={form.control}
                                name="isBannerVisble"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded border border-gray-500 p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Show Banner</FormLabel>
                                            <DialogDescription>Want to show the banner on App? </DialogDescription>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="checkbox"
                                                className="w-5 h-5"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Banner */}
                            <input
                                type="file"
                                accept="image/*,.gif"
                                ref={bannerRef}
                                className="hidden"
                                onChange={onBannerChange}
                            />
                            <FormField
                                control={control}
                                name="banner"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group Banner (720w * 256h)<span className="text-red-500"> *</span></FormLabel>

                                        {!field.value ? (
                                            <div
                                                className="border-2 border-dashed border-gray-300 rounded-lg mt-3 h-36 flex items-center justify-center cursor-pointer"
                                                onClick={onBannerClick}
                                            >
                                                <span className="text-gray-500">Click to select Upper banner</span>
                                            </div>
                                        ) : (
                                            <div className="relative w-full aspect-[720/256] border rounded-lg mb-2">
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
                                                onClick={onBannerClick}
                                                className="mt-1"
                                            >
                                                Change Banner
                                            </Button>
                                        )}

                                        <FormMessage />

                                    </FormItem>
                                )}
                            />

                            {/* Background color */}
                            <FormField
                                control={form.control}
                                name="backgroundColor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Background Color</FormLabel>
                                        <FormControl>
                                            <input
                                                type="color"
                                                className="h-10 w-full p-0 border rounded cursor-pointer"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* isBackgroundColorVisible */}
                            <FormField
                                control={form.control}
                                name="isBackgroundColorVisible"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded border border-gray-500 p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Show Background Color</FormLabel>
                                            <DialogDescription>Want to show the background color in App? </DialogDescription>
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


                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="animate-spin mr-1" />}
                                    {selectedGroup ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default GroupDialog
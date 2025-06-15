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
import Image from 'next/image';
import ImageSelector from '@/components/ImageSelector';

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sequenceNo: z.coerce.number({ required_error: "Sequence number is required" }),
    active: z.boolean(),
    banner: z.string().nullable(),
    products: z.array(z.string()).optional(),
});

function GroupDialog({ open, onOpenChange, selectedGroup, onCreate, onUpdate, isSubmitting, error, categories }) {
    console.log(selectedGroup)
    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onBlur',
        defaultValues: selectedGroup || {
            name: "",
            sequenceNo: "",
            active: true,
            banner: "",
            products: [],
        }
    });
    const { watch, setValue, control, reset } = form;

    // useEffect(() => {
    //     if (selectedGroup) {
    //         reset({
    //             name: selectedGroup.name,
    //             fullName: selectedGroup.fullName,
    //             price: selectedGroup?.sellingPrice[selectedGroup.sellingPrice?.length - 1].price,
    //             slug: selectedGroup.slug,
    //             active: selectedGroup.active,
    //             description: selectedGroup.description,
    //             categoryId: selectedGroup.category?._id || "",
    //             images: selectedGroup.images || [],
    //         });
    //     } else {
    //         // or back to your blank defaults
    //         reset({
    //             name: "",
    //             fullName: "",
    //             sellingPrice: 0,
    //             slug: "",
    //             active: true,
    //             description: "",
    //             categoryId: "",
    //             images: [],
    //         });
    //     }
    // }, [selectedGroup, reset]);

    const watchName = form.watch("name");
    useEffect(() => {
        const slug = watchName
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        form.setValue("slug", slug);
    }, [watchName]);

    const banner = watch('banner')
    const [bannerDialog, setBannerDialog] = useState(false)

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
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
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

                            <DialogFooter>
                                {/* <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="animate-spin mr-1" />}
                                    {selectedGroup ? "Update" : "Create"}
                                </Button> */}
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
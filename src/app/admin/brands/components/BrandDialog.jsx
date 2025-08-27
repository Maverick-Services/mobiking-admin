'use client'
import { useEffect, useRef, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { Loader2 } from 'lucide-react';
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { uploadImage } from "@/lib/services/uploadImage";
import toast from "react-hot-toast";

export default function BrandDialog({
    open,
    onOpenChange,
    selectedBrand,
    onCreate,
    onUpdate,
    isSubmitting,
    error,
    image,
    setImage
}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setValue
    } = useForm();

    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (open) {
            if (selectedBrand) {
                reset({
                    name: selectedBrand.name,
                    active: selectedBrand.active,
                });
                setImage(selectedBrand.image || null);
            } else {
                reset({
                    name: '',
                    active: true,
                });
                setImage(null);
            }
        }
    }, [open, selectedBrand, reset, setImage]);

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toastId = toast.loading('Uploading...')
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                setIsUploading(true);
                const imageUrl = await uploadImage(reader.result);
                setImage(imageUrl);
                toast.success('Image uploaded', { id: toastId });
            } catch (err) {
                console.error(err);
                toast.error('Upload failed', { id: toastId });
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                image: image,
            };

            console.log()

            if (selectedBrand?._id) {
                const finalData = { brandId: selectedBrand?._id, ...payload }
                await onUpdate({ data: finalData });
            } else {
                await onCreate({ data: payload });
            }

            onOpenChange(false);
            setImage(null);
        } catch (error) {
            console.error('Submit Error:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {selectedBrand ? "Edit Brand" : "Add Brand"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">

                        {/* Image Upload */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {!image ? (
                            <div
                                className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer h-48"
                                onClick={handleImageClick}
                            >
                                <span className="text-gray-500">Click to select image</span>
                            </div>
                        ) : (
                            <>
                                <div className="h-full w-full border rounded-xl">
                                    <Image
                                        height={100}
                                        width={100}
                                        quality={100}
                                        src={image}
                                        alt="brand image"
                                        className="w-full h-44 object-contain"
                                    />
                                </div>
                                <Button type="button" onClick={handleImageClick} className="mt-2">
                                    Change Image
                                </Button>
                            </>
                        )}

                        {/* Name */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="name" className="text-right mt-2">
                                Name<span className="text-red-500"> *</span>
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="name"
                                    {...register("name", { required: "Name is required" })}
                                    className={clsx("w-full", {
                                        "border-red-500": errors.name,
                                    })}
                                    placeholder="boAt / SkullCandy"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Active */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="active" className="text-right mt-2">
                                Active<span className="text-red-500"> *</span>
                            </Label>
                            <div className="col-span-3">
                                <Switch
                                    checked={watch('active')}
                                    onCheckedChange={(checked) => setValue('active', checked)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-600 mb-5 text-sm">Error: {error}</p>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting || isUploading}>
                            {(isSubmitting) && <Loader2 className="animate-spin mr-1" />}
                            {selectedBrand ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

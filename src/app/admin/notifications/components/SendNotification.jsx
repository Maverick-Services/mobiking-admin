"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { useRef, useState } from "react"
import LoaderButton from "@/components/custom/LoaderButton"

export default function SendNotification({ open, onOpenChange }) {
    const form = useForm({
        defaultValues: {
            title: "",
            platform: "",
            message: "",
            image: null,
            redirect: "",
        },
    })

    const fileInputRef = useRef(null)
    const [imagePreview, setImagePreview] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file && file.size < 1024 * 1024) {
            form.setValue("image", file)
            setImagePreview(URL.createObjectURL(file))
        } else {
            alert("File must be under 1MB")
        }
    }

    const removeImage = () => {
        form.setValue("image", null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = null
    }

    const onSubmit = (values) => {
        console.log("Sending Notification:", values)
        onOpenChange(false)
        setImagePreview(null)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Compose new notification</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title or subject</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter title" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="platform"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Platform (optional)</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className={'w-full'}>
                                                <SelectValue placeholder="Select platform" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="android">Android</SelectItem>
                                            <SelectItem value="ios">iOS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message or body</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write your notification message..." rows={5} {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="space-y-1">
                            <Label className={'mb-2'}>Upload image (optional)</Label>
                            {!imagePreview ? (
                                <div
                                    className="h-36 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer relative"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <p className="text-center text-sm text-muted-foreground">
                                        Click to upload image<br />
                                        Recommended size: 1280x536, max 1MB
                                    </p>
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mt-2 rounded border w-full max-h-48 object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                        title="Remove image"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="redirect"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Redirect To (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="URL or Page ID" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <LoaderButton type="submit" className="w-full">
                            Send Notification
                        </LoaderButton>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

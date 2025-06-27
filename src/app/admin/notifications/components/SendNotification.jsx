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
import ImageSelector from "@/components/ImageSelector"
import axios from "axios"

export default function SendNotification({ open, onOpenChange }) {
    const form = useForm({
        defaultValues: {
            title: "",
            message: "",
            image: null,
            redirect: "",
        },
    })

    const {watch, setValue} = form;

    const image = watch("image")
    const [imagePicker, setImagePicker] = useState(false)

    const onSubmit = (values) => {
        console.log("Sending Notification:", values)
        try {
            const res = axios.post('/api/send-notification', values)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
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
                            {!image ? (
                                <div
                                    className="h-36 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer relative"
                                    onClick={() => setImagePicker(true)}
                                >
                                    <p className="text-center text-sm text-muted-foreground">
                                        Click to upload image<br />
                                        Recommended size: 1280x536, max 1MB
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={image}
                                        alt="Preview"
                                        className="mt-2 rounded border w-full max-h-48 object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={()=> setValue("image", null)}
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
                <ImageSelector
                onOpenChange={setImagePicker}
                open={imagePicker}
                setImage={(url) => {
                    setValue("image", url, { shouldValidate: true });
                    setImagePicker(false);
                }}
                />
            </DialogContent>
        </Dialog>
    )
}

"use client"
import React, { useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import LoaderButton from "@/components/custom/LoaderButton"
import { Form } from "@/components/ui/form"
import FormInputField from "@/components/custom/FormInputField"
import { useCoupons } from "@/hooks/useCoupons"

const formSchema = z.object({
    code: z.string().min(1, "Code is required"),
    value: z.string().min(1, "Value is required"),
    percent: z.string().min(1, "Percent is required"),
    startDate: z.string().min(1, "Start Date is required"),
    endDate: z.string().min(1, "End Date is required")
})

export default function CouponDialog({ open, onOpenChange, selectedCoupon = {} }) {
    const { createCoupon, updateCoupon } = useCoupons()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            value: "",
            percent: "",
            startDate: "",
            endDate: ""
        }
    })

    function formatDateTimeLocal(date) {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // shift to local time
        return d.toISOString().slice(0, 16);
    }

    useEffect(() => {
        if (selectedCoupon.code) {
            form.reset({
                code: selectedCoupon.code,
                value: selectedCoupon.value,
                percent: selectedCoupon.percent,
                startDate: formatDateTimeLocal(selectedCoupon.startDate),
                endDate: formatDateTimeLocal(selectedCoupon.endDate)
            })
        }
    }, [selectedCoupon, form])

    const onSubmit = async (values) => {
        try {
            if (selectedCoupon.code) {
                // editing
                await updateCoupon.mutateAsync({ id: selectedCoupon._id, ...values })
            } else {
                // creating
                await createCoupon.mutateAsync(values)
            }
            onOpenChange(false)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {selectedCoupon.code ? "Edit" : "Create"} Coupon
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 pt-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInputField
                                control={form.control}
                                name="code"
                                disabled={selectedCoupon._id}
                                label="Coupon Code"
                                placeholder="Enter coupon code"
                            />
                            <FormInputField
                                control={form.control}
                                name="value"
                                disabled={selectedCoupon._id}
                                label="Discount Value"
                                placeholder="e.g. 500"
                            />
                            <FormInputField
                                control={form.control}
                                name="percent"
                                disabled={selectedCoupon._id}
                                label="Discount Percent"
                                placeholder="e.g. 10"
                            />
                            <FormInputField
                                control={form.control}
                                name="startDate"
                                label="Start Date & Time"
                                type="datetime-local"
                            />
                            <FormInputField
                                control={form.control}
                                name="endDate"
                                label="End Date & Time"
                                type="datetime-local"
                            />
                        </div>

                        <DialogFooter>
                            <LoaderButton
                                loading={createCoupon.isPending || updateCoupon.isPending}
                                type="submit"
                            >
                                Save Coupon
                            </LoaderButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

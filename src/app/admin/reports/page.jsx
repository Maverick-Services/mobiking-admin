"use client"
import React, { useState, useEffect } from "react"
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import LoaderButton from "@/components/custom/LoaderButton"
import { useReports } from "@/hooks/useReports"
import { exportToExcel } from "@/lib/exportToExcel"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NotAuthorizedPage from "@/components/notAuthorized"

// Zod schema
const reportSchema = z.object({
    model: z.enum([
        "Order",
        "Category",
        "Group",
        "Product",
        "SubCategory",
        "User",
    ]),
    columns: z.array(z.string()).min(1, "At least one column is required"),
})

// All possible fields per model
const columnOptions = {
    User: [
        "name", "email", "phoneNo", "address", "role", "departments",
        "profilePicture", "documents", "createdBy", "orders", "wishlist", "cart",
        "createdAt", "updatedAt",
    ],
    Order: [
        "status", "holdReason", "shippingStatus", "paymentStatus",
        "shipmentId", "awbCode", "courierName", "pickupDate",
        "expectedDeliveryDate", "orderId", "type", "method",
        "orderAmount", "deliveryCharge", "discount", "gst",
        "subtotal", "name", "email", "phoneNo", "address",
        "addressId", "userId", "items", "createdAt", "updatedAt",
    ],
    Category: [
        "name", "image", "slug", "active", "subCategories",
        "createdAt", "updatedAt",
    ],
    Group: [
        "name", "sequenceNo", "banner", "active", "isBannerVisble",
        "isSpecial", "products", "createdAt", "updatedAt",
    ],
    Product: [
        "name", "fullName", "slug", "description", "active",
        "newArrival", "liked", "bestSeller", "recommended",
        "sellingPrice", "gst", "category", "variants", "images",
        "totalStock", "stock", "orders", "groups",
        "createdAt", "updatedAt",
    ],
    SubCategory: [
        "name", "slug", "sequenceNo", "upperBanner", "lowerBanner",
        "active", "featured", "deliveryCharge", "minOrderAmount",
        "minFreeDeliveryOrderAmount", "photos", "parentCategory",
        "products", "createdAt", "updatedAt",
    ],
}

export default function Page() {
    const { reportMutation, permissions: {
        canView,
        canAdd,
        canEdit,
        canDelete,
    } } = useReports()

    const form = useForm({
        resolver: zodResolver(reportSchema),
        mode: "onSubmit",
        defaultValues: { model: "User", columns: [] },
    })
    const { control, watch, setValue, handleSubmit, formState: { errors } } = form
    const selectedModel = watch("model")
    const selectedCols = watch("columns")
    const [selectAll, setSelectAll] = useState(false)

    // Reset selectAll when model changes
    useEffect(() => {
        setSelectAll(false)
        setValue("columns", [])
    }, [selectedModel, setValue])

    const toggleColumn = (column) => {
        const current = form.getValues("columns")
        const next = current.includes(column)
            ? current.filter(c => c !== column)
            : [...current, column]
        setValue("columns", next)
    }

    const toggleSelectAll = () => {
        if (selectAll) {
            setValue("columns", [])
        } else {
            setValue("columns", [...columnOptions[selectedModel]])
        }
        setSelectAll(!selectAll)
    }

    const onSubmit = async (values) => {
        const res = await reportMutation.mutateAsync(values)
        const data = res?.data?.data || []
        exportToExcel(values.columns, data, `${values.model}-report.xlsx`)
    }

    if (!canView) {
        return <NotAuthorizedPage />
    }

    return (
        <InnerDashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-primary font-bold text-2xl">Generate Report</h1>
                {canAdd &&
                    <LoaderButton
                        loading={reportMutation.isPending}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Generate Report
                    </LoaderButton>
                }
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Report Configuration</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Select data model and columns to include in your report
                    </p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Model Selection */}
                            <FormField
                                control={control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data Model</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a model" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.keys(columnOptions).map((model) => (
                                                    <SelectItem key={model} value={model}>
                                                        {model}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator />

                            {/* Columns Selection */}
                            <FormField
                                control={control}
                                name="columns"
                                render={() => (
                                    <FormItem>
                                        <div className="flex justify-between items-center mb-4">
                                            <FormLabel>Columns to Include</FormLabel>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={toggleSelectAll}
                                            >
                                                {selectAll ? "Deselect All" : "Select All"}
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-2 border rounded-lg">
                                            {columnOptions[selectedModel].map((column) => (
                                                <div key={column} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={column}
                                                        checked={selectedCols.includes(column)}
                                                        onCheckedChange={() => toggleColumn(column)}
                                                    />
                                                    <label
                                                        htmlFor={column}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {column}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        {errors.columns && (
                                            <p className="text-sm font-medium text-destructive mt-2">
                                                {errors.columns.message}
                                            </p>
                                        )}

                                        <div className="mt-4">
                                            <FormLabel>Selected Columns:</FormLabel>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedCols.length > 0 ? (
                                                    selectedCols.map(col => (
                                                        <Badge key={col} variant="secondary">{col}</Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">No columns selected</span>
                                                )}
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </InnerDashboardLayout>
    )
}
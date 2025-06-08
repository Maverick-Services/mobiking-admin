"use client"

import React, { useState } from "react"
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout"
import { useProducts } from "@/hooks/useProducts"
import { useSubCategories } from "@/hooks/useSubCategories"
import Loader from "@/components/Loader"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CirclePlus } from "lucide-react"
import ProductsListView from "./components/ProductsTable"

export default function page() {
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")

    const {
        productsQuery,
        deleteProduct: { mutateAsync: deleteAsync, isPending: isDeleting, error: deleteError },
        permissions: { canView, canAdd, canDelete, canEdit },
    } = useProducts()

    const { subCategoriesQuery } = useSubCategories()
    const subCategories = subCategoriesQuery.data?.data || []

    if (productsQuery.isLoading || subCategoriesQuery.isLoading) {
        return <Loader />
    }

    const allProducts = productsQuery.data?.data || []

    // 1️⃣ Filter by category ID if set
    const afterCategoryFilter = allProducts.filter((prod) => {
        if (categoryFilter === "all") return true
        return prod.parentCategory === categoryFilter
    })

    // 2️⃣ Filter by search term (case-insensitive match on name)
    const finalFiltered = afterCategoryFilter.filter((prod) =>
        prod.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )

    return (
        <InnerDashboardLayout>
            <div className="w-full flex flex-col gap-4">
                <h1 className="text-primary font-bold sm:text-2xl lg:text-4xl">
                    Products
                </h1>

                {/* Toolbar */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    {/* Stats + Category Picker */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            Total: {allProducts.length}
                        </Button>
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-48 bg-white">
                                <SelectValue>
                                    {categoryFilter === "all"
                                        ? "All Categories"
                                        : subCategories.find((c) => c._id === categoryFilter)?.name ||
                                        "Unknown"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sub-Categories</SelectItem>
                                {subCategories.map((c) => (
                                    <SelectItem key={c._id} value={c._id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>


                        {/* Search Bar */}
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm lg:w-xl flex-1 bg-white"
                        />
                    </div>


                    {/* Add New */}
                    <Button
                        onClick={() => {
                            /* your navigation to “Add Product” */
                        }}
                    >
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Add New
                    </Button>
                </div>

                {/* Table */}
                <ProductsListView
                    error={productsQuery.error}
                    products={finalFiltered}
                    onDelete={deleteAsync}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    canDelete={canDelete}
                    canEdit={canEdit}
                />
            </div>
        </InnerDashboardLayout>
    )
}

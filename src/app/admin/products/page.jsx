"use client"

import React, { useState } from "react"
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout"
import { useProducts } from "@/hooks/useProducts"
import { useSubCategories } from "@/hooks/useSubCategories"
import Loader from "@/components/Loader"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CirclePlus } from "lucide-react"
import ProductsListView from "./components/ProductsTable"
import ProductDialog from "./components/ProductDialog"
import StockUpdate from "./components/StockUpdate"
import TableSkeleton from "@/components/custom/TableSkeleton"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { getPaginationRange } from "@/lib/services/getPaginationRange"

export default function page() {
    const [categoryFilter, setCategoryFilter] = useState("all")

    const [searchTerm, setSearchTerm] = useState("")

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState();

    const [stockEditing, setStockEditing] = useState(false)
    const [selectedStockProduct, setSelectedStockProduct] = useState()

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    // console.log(selectedStockProduct)

    const {
        productsQuery,
        productsPaginationQuery,
        createProduct: { mutateAsync: createProductAsync, isPending: creating, error: createError, reset: resetCreate },
        updateProduct: { mutateAsync: updateProductAsync, isPending: updating, error: updateError, reset: resetUpdate },
        permissions: { canView, canAdd, canDelete, canEdit },
    } = useProducts()

    const { subCategoriesQuery } = useSubCategories()
    const subCategories = subCategoriesQuery.data?.data || []

    const products = productsPaginationQuery({ page: page, limit: limit })

    // console.log(ab?.data)

    const allProducts = products.data?.products || []
    const totalPages = products.data?.pagination?.totalPages || 1
    const paginationRange = getPaginationRange(page, totalPages)

    // Filter by category ID if set
    const afterCategoryFilter = allProducts.filter((prod) => {
        if (categoryFilter === "all") return true
        return prod.parentCategory === categoryFilter
    })

    // Filter by search term (case-insensitive match on name)
    const finalFiltered = afterCategoryFilter.filter((prod) =>
        prod.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )

    // open dialog to add new 
    const handleAddClick = () => {
        resetCreate();
        resetUpdate();
        // resetDelete();
        setSelectedProduct(undefined);
        setIsDialogOpen(true);
    };

    const handleEditClick = (p) => {
        resetCreate();
        resetUpdate();
        // resetDelete();
        setSelectedProduct(p);
        setIsDialogOpen(true);
    };

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

                        {/* Search Bar */}
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm lg:w-xl flex-1 bg-white"
                        />
                    </div>


                    {/* Add New */}
                    <Button onClick={handleAddClick}>
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Add New
                    </Button>
                </div>

                {/* Table */}
                {(productsQuery.isLoading || subCategoriesQuery.isLoading)
                    ? <TableSkeleton showHeader={false} />
                    : <><ProductsListView
                        error={productsQuery.error}
                        products={finalFiltered}
                        // onDelete={deleteAsync}
                        // isDeleting={isDeleting}
                        // deleteError={deleteError}
                        canDelete={canDelete}
                        canEdit={canEdit}
                        onEdit={handleEditClick}
                        setStockEditing={setStockEditing}
                        setSelectedProduct={setSelectedStockProduct}
                    />
                    </>
                }


                <div className="flex w-full justify-end gap-2 items-center">
                    {/* Limit Dropdown */}
                    <Select value={String(limit)} onValueChange={(val) => { setPage(1); setLimit(Number(val)) }}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Items per page" />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 5, 10, 20, 50].map((n) => (
                                <SelectItem key={n} value={String(n)}>
                                    {n} / page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Pagination */}
                    <Pagination className={'inline justify-end mx-1 w-fit'}>
                        <PaginationContent>
                            {page > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious href="#" onClick={() => setPage((p) => p - 1)} />
                                </PaginationItem>
                            )}

                            {paginationRange.map((p, i) => (
                                <PaginationItem key={i}>
                                    {p === 'ellipsis-left' || p === 'ellipsis-right' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            href="#"
                                            isActive={p === page}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setPage(p)
                                            }}
                                        >
                                            {p}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            {page < totalPages && (
                                <PaginationItem>
                                    <PaginationNext href="#" onClick={() => setPage((p) => p + 1)} />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                </div>

                <ProductDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    selectedProduct={selectedProduct}
                    categories={subCategories}
                    isSubmitting={creating || updating}
                    error={createError || updateError}
                    onCreate={createProductAsync}
                    onUpdate={updateProductAsync}
                />

                <StockUpdate
                    open={stockEditing}
                    onOpenChange={setStockEditing}
                    product={selectedStockProduct}
                />
            </div>
        </InnerDashboardLayout>
    )
}

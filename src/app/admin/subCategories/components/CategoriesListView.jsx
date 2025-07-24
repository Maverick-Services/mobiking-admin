"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Loader2, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Image from "next/image";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog ";
import TableSkeleton from "@/components/custom/TableSkeleton";
import { useSubCategories } from "@/hooks/useSubCategories";
import toast from "react-hot-toast";

export default function CategoriesListView({
    isLoading,
    error,
    categories,
    onDelete,
    isDeleting,
    deleteError,
}) {

    // console.log(categories)
    const { updateSubCategory, updateSubCategoryStatus } = useSubCategories();
    const [deletingCategoryId, setDeletingCategoryId] = useState(null);
    const router = useRouter();

    const handleDeleteClick = (categoryId) => {
        setDeletingCategoryId(categoryId);
    };

    const handleDeleteConfirm = async () => {
        await onDelete(deletingCategoryId);
        setDeletingCategoryId(null);
    };

    if (isLoading) return <TableSkeleton showHeader={false} />;
    if (error) return <div className="text-red-600 p-4">Error: {error.message}</div>
    if (!categories?.length) return <div className="text-center text-gray-500 p-4">No categories found!</div>

    return (
        <section className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="text-primary">
                        <TableHead className="text-center">#</TableHead>
                        <TableHead className="text-center">Image</TableHead>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Parent Category</TableHead>
                        <TableHead className="text-center">Active</TableHead>
                        <TableHead className="text-center">Products</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((item, idx) => (
                        <TableRow
                            key={item._id}
                            className="hover:bg-gray-50 transition border"
                        >
                            <TableCell className="text-center">{idx + 1}</TableCell>

                            <TableCell className="py-1">
                                <div className="flex items-center justify-center min-h-20">
                                    <Image
                                        src={item.lowerBanner}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        quality={100}
                                        className="object-contain rounded-sm"
                                    />
                                </div>
                            </TableCell>

                            <TableCell className="text-center">{item.name}</TableCell>
                            <TableCell className="text-center">{item.parentCategory?.name}</TableCell>

                            <TableCell className="text-center">
                                <Switch
                                    checked={item.active}
                                    onCheckedChange={async checked => {
                                        const toastId = toast.loading("Updating...");
                                        try {
                                            await updateSubCategoryStatus.mutateAsync({
                                                id: item._id,
                                                data: { active: checked }
                                            })
                                            toast.dismiss(toastId);
                                        } catch (error) {
                                            toast.dismiss(toastId);
                                        }
                                    }}
                                />
                            </TableCell>

                            <TableCell className="text-center">
                                {item?.products?.length ?? 0}
                            </TableCell>

                            <TableCell >
                                <div className="flex gap-2 items-center justify-center">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() =>
                                            router.push(
                                                `/admin/subCategories/${item.slug}/edit`
                                            )
                                        }
                                    >
                                        <Pencil size={16} />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteClick(item._id)}
                                    >
                                        <Trash size={16} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <DeleteConfirmationDialog
                isOpen={!!deletingCategoryId}
                onOpenChange={(open) =>
                    !open && setDeletingCategoryId(null)
                }
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                error={deleteError}
                title="Delete Category"
                description="Are you sure you want to delete this category?"
            />
        </section>
    );
}

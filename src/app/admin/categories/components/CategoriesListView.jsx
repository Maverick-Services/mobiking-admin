"use client";
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog ";
import Loader from '@/components/Loader';
import Image from 'next/image';

export default function CategoriesListView({ isLoading, error, categories, onEdit, onDelete, isDeleting, deleteError }) {
    const [deletingCategoryId, setDeletingCategoryId] = useState(null);

    const handleDeleteClick = (categoryId) => {
        setDeletingCategoryId(categoryId);
    };

    const handleDeleteConfirm = async () => {
        await onDelete(deletingCategoryId);
        setDeletingCategoryId(null);
    };

    if (isLoading) return <div className="text-center p-4">
        {/* <Loader2 className="animate-spin inline-block" /> */}
        <Loader />
    </div>;

    if (error) return <div className="text-red-600 p-4">Error: {error.message}</div>;
    if (!categories?.length) return <div className="text-center text-gray-500 p-4">No categories Found!</div>;

    return (
        <section className="w-full">
            <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-xl border-b text-primary">
                            <th className="px-6 py-3 text-center font-semibold align-middle">#</th>
                            <th className="px-6 py-3 text-center font-semibold align-middle">Image</th>
                            <th className="px-6 py-3 text-center font-semibold align-middle">Name</th>
                            <th className="px-6 py-3 text-center font-semibold align-middle">Slug</th>
                            <th className="px-6 py-3 text-center font-semibold align-middle">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.map((item, index) => (
                            <tr
                                key={item._id || index}
                                className="even:bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <td className="px-6 py-3 border-b text-center align-middle">
                                    {index + 1}
                                </td>

                                <td className="px-6 py-0 border-b align-middle">
                                    <div className="flex items-center justify-center min-h-20 py-1">
                                        <Image
                                            height={80}
                                            width={80}
                                            quality={100}
                                            src={item.image}
                                            alt={item.name}
                                            className="object-contain rounded-sm"
                                        />
                                    </div>
                                </td>

                                <td className="px-6 py-3 border-b text-center align-middle">
                                    {item.name}
                                </td>

                                <td className="px-6 py-3 border-b text-center align-middle">
                                    {item.slug}
                                </td>

                                <td className="px-6 py-3 border-b align-middle">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => onEdit(item)}
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <DeleteConfirmationDialog
                isOpen={!!deletingCategoryId}
                onOpenChange={(open) => !open && setDeletingCategoryId(null)}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                error={deleteError}
                title="Delete Category"
                description="Are you sure you want to delete this category?"
            />
        </section>
    );
}

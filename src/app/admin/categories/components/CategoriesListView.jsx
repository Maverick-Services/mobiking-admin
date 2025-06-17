"use client";

import { Button } from '@/components/ui/button';
import { Loader2, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog ";
import Loader from '@/components/Loader';
import Image from 'next/image';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function CategoriesListView({ isLoading, error, categories, onEdit, onDelete, isDeleting, deleteError }) {
    const [deletingCategoryId, setDeletingCategoryId] = useState(null);

    const handleDeleteClick = (categoryId) => {
        setDeletingCategoryId(categoryId);
    };

    const handleDeleteConfirm = async () => {
        await onDelete(deletingCategoryId);
        setDeletingCategoryId(null);
    };

    if (isLoading) return (
        <div className="text-center p-4">
            <Loader />
        </div>
    );

    if (error) return <div className="text-red-600 p-4">Error: {error.message}</div>;
    if (!categories?.length) return <div className="text-center text-gray-500 p-4">No categories Found!</div>;

    return (
        <section className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center text-primary text-base">#</TableHead>
                            <TableHead className="text-center text-primary text-base">Image</TableHead>
                            <TableHead className="text-center text-primary text-base">Name</TableHead>
                            <TableHead className="text-center text-primary text-base">Slug</TableHead>
                            <TableHead className="text-center text-primary text-base">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {categories.map((item, index) => (
                            <TableRow key={item._id || index} className="even:bg-muted/30">
                                <TableCell className="text-center align-middle">{index + 1}</TableCell>
                                <TableCell className="text-center align-middle">
                                    <div className="flex justify-center">
                                        <Image
                                            height={80}
                                            width={80}
                                            quality={100}
                                            src={item.image}
                                            alt={item.name}
                                            className="object-contain rounded-sm"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center align-middle">{item.name}</TableCell>
                                <TableCell className="text-center align-middle">{item.slug}</TableCell>
                                <TableCell className="text-center align-middle">
                                    <div className="flex justify-center gap-2">
                                        <Button size="icon" variant="outline" onClick={() => onEdit(item)}>
                                            <Pencil size={16} />
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleDeleteClick(item._id)}>
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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

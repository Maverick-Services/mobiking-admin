'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Eye, Pencil, Trash } from 'lucide-react';
import {
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import DeleteConfirmationDialog from './DeleteConfirmationDialog ';

export default function ProductsListView({
    error,
    products,
    onDelete,
    isDeleting,
    deleteError,
    canDelete,
    canEdit
}) {

    console.log(products.data)
    const router = useRouter();
    const [deletingId, setDeletingId] = useState(null);

    const handleEdit = (service) => {
        // setSelectedService(service);
        router.push(`/admin/products/${service._id}/edit`);
    };

    const handleView = (service) => {
        // setSelectedService(service);
        router.push(`/admin/products/${service._id}/view`);
    };

    const handleDeleteClick = (id) => {
        setDeletingId(id);
    };

    const handleDeleteConfirm = async () => {
        await onDelete(deletingId);
        setDeletingId(null);
    };

    if (error) {
        return (
            <div className="text-red-600 p-4">
                Error: {error.message}
            </div>
        );
    }

    // if (!products?.length) {
    //     return (
    //         <div className="text-center text-gray-500 p-4">
    //             No products found!
    //         </div>
    //     );
    // }

    return (
        <section className="w-full">
            <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead className="">Image</TableHead>
                            <TableHead className="">Name</TableHead>
                            <TableHead className="">Full Name</TableHead>
                            <TableHead className="">Category</TableHead>
                            <TableHead className="">Price</TableHead>
                            <TableHead className="">Qty</TableHead>
                            <TableHead className="">In Stock</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products?.map((service, index) => (
                            <TableRow
                                key={service._id || index}
                                className="even:bg-gray-50 hover:bg-gray-100 transition"
                            >
                                {/* 1. Index */}
                                <TableCell className="">
                                    {index + 1}
                                </TableCell>

                                {/* 2. Image */}
                                <TableCell className="">
                                    <div className="py-2">
                                        <img
                                            src={service.images[0]}
                                            alt={service.name}
                                            width={60}
                                            height={60}
                                            className="object-contain rounded"
                                        />
                                    </div>
                                </TableCell>

                                {/* 3. Name */}
                                <TableCell className="">
                                    <div className=''>
                                        {service.name}
                                    </div>
                                </TableCell>

                                {/* 3. full Name */}
                                <TableCell className="">
                                    <div className='max-w-52 text-wrap'>
                                        {service.fullName}
                                    </div>
                                </TableCell>

                                {/* 3. category */}
                                <TableCell className="">
                                    <div className=''>
                                        {service.category.name}
                                    </div>
                                </TableCell>

                                {/* price */}
                                <TableCell className="">
                                    <div className=''>
                                        ₹{service.sellingPrice[0].price}
                                    </div>
                                </TableCell>

                                {/* quantity */}
                                <TableCell className="">
                                    <div className=''>
                                        {service.totalStock}
                                    </div>
                                </TableCell>

                                {/* 4. Categories - FIXED ALIGNMENT */}
                                <TableCell className="align-middle">
                                    {service.totalStock <= 0 ?
                                        <Badge className={'bg-emerald-600 text-white'}>Yes</Badge>
                                        : <Badge variant="destructive">No</Badge>
                                    }
                                </TableCell>

                                {/* 5. Status Switch - FIXED ALIGNMENT */}
                                <TableCell className="align-middle">
                                    <div className="flex justify-center">
                                        <Switch
                                            checked={service.active}
                                            onCheckedChange={(checked) => {
                                                // TODO: call your API/mutation to toggle `service.status`
                                            }}
                                        />
                                    </div>
                                </TableCell>

                                {/* 6. Actions Dropdown */}
                                <TableCell className="">
                                    <div className="flex items-center justify-center gap-2">
                                        {/* <ServiceDetailsDialog service={service} /> */}

                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="hover:bg-gray-100"
                                            onClick={() => handleView(service)}
                                        >
                                            <Eye size={18} className="text-gray-600" />
                                        </Button>

                                        {canEdit &&
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => handleEdit(service)}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                        }
                                        {canDelete &&
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleDeleteClick(service._id)}
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        }
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <DeleteConfirmationDialog
                isOpen={!!deletingId}
                onOpenChange={(open) => {
                    if (!open) setDeletingId(null);
                }}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                error={deleteError}
                title="Delete Product"
                description="Are you sure you want to delete this Product?"
            />
        </section>
    );
}
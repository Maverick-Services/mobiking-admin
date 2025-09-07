'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Eye, Pencil, Trash, ThumbsUp, TrendingUp, Star } from 'lucide-react';
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
import toast from 'react-hot-toast';
import { useGroups } from '@/hooks/useGroups';
import { useProducts } from '@/hooks/useProducts';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductsListView({
    error,
    products,
    onDelete,
    isDeleting,
    deleteError,
    canDelete,
    canEdit,
    onEdit,
    setStockEditing,
    setSelectedProduct,
    onUpdate
}) {

    // console.log(products)
    const router = useRouter();
    const [deletingId, setDeletingId] = useState(null);

    const { addProductInGroup, removeProductFromGroup } = useGroups();
    const { updateProductStatus } = useProducts();

    const handleView = (product) => {
        // setSelectedService(product);
        router.push(`/admin/products/${product._id}/view`);
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

    // console.log(products)

    return (
        <section className="w-full">
            <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-gray-50 ">
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead className="">Quickers</TableHead>
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
                        {products?.map((product, index) => (
                            <TableRow
                                key={product?._id || index}
                                className="even:bg-gray-50 hover:bg-gray-100 transition"
                            >
                                {/* 1. Index */}
                                <TableCell className=" text-sm">
                                    {index + 1}
                                </TableCell>

                                {/* 1. Quickers */}
                                <TableCell className=" text-sm">
                                    <div className='flex gap-2 items-center'>
                                        {/* featured products */}
                                        <Star
                                            className={`cursor-pointer scale-100 duration-200 transition-all ease-in-out hover:scale-125 ${product.groups?.some(g => g._id === '6878e1f1ffe77ca83720210e') ? 'text-red-500' : 'text-black'
                                                }`}
                                            size={18}
                                            onClick={async () => {
                                                const toastId = toast.loading("Updating...");
                                                try {
                                                    const data = {
                                                        productId: product._id,
                                                        groupId: '6878e1f1ffe77ca83720210e',
                                                    };
                                                    if (product?.groups?.some(g => g._id === "6878e1f1ffe77ca83720210e")) {
                                                        removeProductFromGroup.mutateAsync(data)
                                                    } else {
                                                        await addProductInGroup.mutateAsync(data);
                                                    }
                                                    toast.dismiss(toastId);
                                                    // toast.success("Added to Featured group");
                                                } catch (err) {
                                                    console.error(err);
                                                    toast.dismiss(toastId);
                                                    toast.error("Failed to update group");
                                                }
                                            }}
                                        />

                                        {/* Trending Products */}
                                        <TrendingUp
                                            className={`cursor-pointer scale-100 duration-200 transition-all ease-in-out hover:scale-125 ${product.groups?.some(g => g === '6878e1f1ffe77ca83720210e') ? 'text-green-500' : 'text-black'
                                                }`}
                                            size={18}
                                            onClick={async () => {
                                                const toastId = toast.loading("Updating...");
                                                try {
                                                    const data = {
                                                        productId: product._id,
                                                        groupId: '6878e1f1ffe77ca83720210e',
                                                    };
                                                    if (product?.groups?.some(g => g._id === "6878e1f1ffe77ca83720210e")) {
                                                        removeProductFromGroup.mutateAsync(data)
                                                    } else {
                                                        await addProductInGroup.mutateAsync(data);
                                                    }
                                                    toast.dismiss(toastId);
                                                } catch (err) {
                                                    console.error(err);
                                                    toast.dismiss(toastId);
                                                    toast.error("Failed to update group");
                                                }
                                            }}
                                        />
                                    </div>
                                </TableCell>

                                {/* 2. Image */}
                                <TableCell className="">
                                    <div className="py-2">
                                        <Image
                                            src={product?.images[0] || '/not-found-img.webp'}
                                            alt={product?.name}
                                            width={60}
                                            height={60}
                                            className="object-contain rounded"
                                        />
                                    </div>
                                </TableCell>

                                {/* 3. Name */}
                                <TableCell className=" text-sm">
                                    <div className='max-w-32 text-wrap text-xs'>
                                        {product?.name}
                                    </div>
                                </TableCell>

                                {/* 3. full Name */}
                                <TableCell className="">
                                    <Link href={`/admin/products/${product?._id}`}>
                                        <div className='max-w-52 text-wrap text-xs'>
                                            {product?.fullName}
                                        </div>
                                    </Link>
                                </TableCell>

                                {/* 3. category */}
                                <TableCell className="">
                                    <div className=' text-xs'>
                                        {product?.category?.name}
                                    </div>
                                </TableCell>

                                {/* price */}
                                <TableCell className="">
                                    <div className=' text-xs'>
                                        ₹{product?.sellingPrice[product?.sellingPrice?.length - 1]?.price}
                                    </div>
                                </TableCell>

                                {/* quantity */}
                                <TableCell className="">
                                    <div className=' text-xs'>
                                        {product?.totalStock}
                                    </div>
                                </TableCell>

                                {/* 4. stock */}
                                <TableCell className="align-middle">
                                    <div className='flex flex-col gap-2 items-center text-xs'>
                                        {product.totalStock > 0 ?
                                            <Badge className={'bg-emerald-600 text-white'} >Yes</Badge>
                                            : <Badge variant="destructive">No</Badge>
                                        }
                                        <div
                                            className='text-xs'
                                            onClick={() => {
                                                setStockEditing(true)
                                                setSelectedProduct(product)
                                            }}
                                        >
                                            <Badge className={'cursor-pointer'} variant={'outline'}>
                                                <Pencil size={10} /> Update
                                            </Badge>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* 5. Status Switch - FIXED ALIGNMENT */}
                                <TableCell className="align-middle">
                                    <div className="flex justify-center">
                                        <Switch
                                            checked={product.active}
                                            onCheckedChange={async checked => {
                                                const toastId = toast.loading('Updating status…');
                                                // console.log(product.categoryId)
                                                try {
                                                    await updateProductStatus.mutateAsync({
                                                        id: product._id,
                                                        data: {
                                                            active: checked,
                                                        }
                                                    });
                                                } catch (e) {
                                                    // error toast is already handled in your mutation onError
                                                } finally {
                                                    toast.dismiss(toastId);
                                                }
                                            }}
                                        />
                                    </div>
                                </TableCell>

                                {/* 6. Actions Dropdown */}
                                <TableCell className="">
                                    <div className="flex items-center justify-center gap-2">
                                        {/* <ServiceDetailsDialog product={product} /> */}
                                        {/* 
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="hover:bg-gray-100"
                                            onClick={() => handleView(product)}
                                        >
                                            <Eye size={18} className="text-gray-600" />
                                        </Button> */}

                                        {canEdit &&
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => onEdit(product)}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                        }
                                        {/* {canDelete &&
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleDeleteClick(product._id)}
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        } */}
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
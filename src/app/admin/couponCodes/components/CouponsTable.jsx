'use client';
import { useState } from 'react';
import { Pencil, TrendingUp, Star, Trash } from 'lucide-react';
import { Table, TableHeader, TableRow, TableCell, TableHead, TableBody, } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
// import DeleteConfirmationDialog from './DeleteConfirmationDialog ';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import DeleteConfirmationDialog from './DeleteConfirmationDialog ';

export default function CouponsTable({
    error,
    coupons,
    onDelete,
    isDeleting,
    deleteError,
    onEdit,
    canDelete,
    canEdit,
    setSelectedCoupon,
    onUpdate
}) {
    const [deletingId, setDeletingId] = useState(null);

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

    return (
        <section className="w-full mb-4">
            <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-gray-50 ">
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead className="">Coupon Code</TableHead>
                            <TableHead className="">Percent (%)</TableHead>
                            <TableHead className="">Max Value (₹)</TableHead>
                            <TableHead className="">Start Date</TableHead>
                            <TableHead className="">End Date</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {coupons?.map((coupon, index) => (
                            <TableRow
                                key={index}
                                className="even:bg-gray-50 hover:bg-gray-100 transition"
                            >
                                {/* 1. Index */}
                                <TableCell className="text-sm">
                                    {index + 1}
                                </TableCell>

                                {/* 2. Coupon Code */}
                                <TableCell className="">
                                    {coupon?.code}
                                </TableCell>

                                {/* 3. value */}
                                <TableCell className="text-sm">
                                    {coupon?.value}
                                </TableCell>

                                {/* 3. Max Percent % */}
                                <TableCell className="">
                                    {coupon?.percent}
                                </TableCell>

                                {/* start date */}
                                <TableCell className="">
                                    <p>
                                        {format(coupon?.startDate, 'dd MMM, yyyy')}
                                    </p>
                                    <p className='text-gray-500'>
                                        {format(coupon?.startDate, 'hh:mm a')}
                                    </p>
                                </TableCell>

                                {/* end date */}
                                <TableCell className="">
                                    <p>
                                        {format(coupon?.endDate, 'dd MMM yyyy')}
                                    </p>
                                    <p className='text-gray-500'>
                                        {format(coupon?.endDate, 'hh:mm a')}
                                    </p>
                                </TableCell>

                                {/* 6. Actions Dropdown */}
                                <TableCell className="">
                                    <div className="flex items-center justify-center gap-2">
                                        {/* <ServiceDetailsDialog coupon={coupon} /> */}
                                        {/* 
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="hover:bg-gray-100"
                                            onClick={() => handleView(coupon)}
                                        >
                                            <Eye size={18} className="text-gray-600" />
                                        </Button> */}

                                        {/* {canEdit && */}
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => onEdit(coupon)}
                                        >
                                            <Pencil size={16} />
                                        </Button>
                                        {/* // } */}
                                        {/* {canDelete && */}
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDeleteClick(coupon._id)}
                                        >
                                            <Trash size={16} />
                                        </Button>
                                        {/* } */}
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
                title="Delete Coupon"
                description="Are you sure you want to delete this Coupon?"
            />
        </section>
    );
}
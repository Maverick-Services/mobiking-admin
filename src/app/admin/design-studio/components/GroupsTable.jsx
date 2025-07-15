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
import TableSkeleton from '@/components/custom/TableSkeleton';

export default function GroupsTable({
    error,
    groups,
    onDelete,
    isDeleting,
    deleteError,
    canDelete,
    canEdit,
    onEdit,
    setGroupForProducts,
    setPrdouctsSheet,
    isLoading
}) {

    // console.log(groups.data)

    const groupsData = groups?.data || []

    const router = useRouter();
    const [deletingId, setDeletingId] = useState(null);

    const handleDeleteClick = (id) => {
        setDeletingId(id);
    };

    const handleDeleteConfirm = async () => {
        await onDelete(deletingId);
        setDeletingId(null);
    };

    if (isLoading) return <TableSkeleton showHeader={false} />;

    if (error) {
        return (
            <div className="text-red-600 p-4">
                Error: {error.message}
            </div>
        );
    }


    return (
        <section className="w-full">
            <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead className="">Banner</TableHead>
                            <TableHead className="">Name</TableHead>
                            <TableHead className="">Products</TableHead>
                            {/* <TableHead className="">Sequence</TableHead> */}
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {groupsData.map((group, index) => (
                            <TableRow
                                key={group._id || index}
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
                                            src={group?.banner}
                                            alt={group?.name || 'img'}
                                            width={60}
                                            height={60}
                                            className="object-contain rounded"
                                        />
                                    </div>
                                </TableCell>

                                {/* 3. Name */}
                                <TableCell className="">
                                    <div className=''>
                                        {group?.name}
                                    </div>
                                </TableCell>

                                {/* 3. products */}
                                <TableCell className="">
                                    <div className='flex items-center justify-start gap-2'>
                                        <Button variant={'outline'}>
                                            {group?.products.length}
                                        </Button>
                                        {canEdit &&
                                            <div
                                                onClick={() => {
                                                    setPrdouctsSheet(true)
                                                    setGroupForProducts(group)
                                                }}
                                            >
                                                <Pencil size={15} className='hover:text-black text-gray-500 cursor-pointer' />
                                            </div>
                                        }
                                    </div>
                                </TableCell>

                                {/* 3. sequence */}
                                {/* <TableCell className="">
                                    <div className=''>
                                        {group?.sequenceNo}
                                    </div>
                                </TableCell> */}


                                {/* 5. Status Switch - FIXED ALIGNMENT */}
                                <TableCell className="align-middle">
                                    <div className="flex justify-center">
                                        <Switch
                                            checked={group.active}
                                            onCheckedChange={(checked) => {
                                                // TODO: call your API/mutation to toggle `group.status`
                                            }}
                                        />
                                    </div>
                                </TableCell>

                                {/* 6. Actions Dropdown */}
                                <TableCell className="">
                                    <div className="flex items-center justify-center gap-2">

                                        {canEdit &&
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => onEdit(group)}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                        }
                                        {canDelete &&
                                            <Button
                                                variant="destructive"
                                            // onClick={() => handleDeleteClick(group._id)}
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
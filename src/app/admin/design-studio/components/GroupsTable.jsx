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
import TableSkeleton from '@/components/custom/TableSkeleton';
import { useGroups } from '@/hooks/useGroups';
import { toast } from 'react-hot-toast';
import DeleteConfirmationDialog from './DeleteConfirmationDialog ';

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
    const { updateGroupStatus } = useGroups();

    // const {
    //     mutateAsync: updateGroupAsync,
    //     isPending: updating,
    // } = updateGroupStatus;

    const groupsData = groups?.data || [];
    const [deletingId, setDeletingId] = useState(null);

    const handleDeleteClick = id => setDeletingId(id);
    const handleDeleteConfirm = async () => {
        await onDelete(deletingId);
        setDeletingId(null);
    };

    if (isLoading) return <TableSkeleton showHeader={false} />;
    if (error) return <div className="text-red-600 p-4">Error: {error.message}</div>;

    return (
        <section className="w-full">
            <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Banner</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groupsData.map((group, index) => (
                            <TableRow key={group._id || index} className="even:bg-gray-50 hover:bg-gray-100 transition">
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={group.banner}
                                        alt={group.name}
                                        width={60}
                                        height={60}
                                        className="object-contain rounded"
                                    />
                                </TableCell>
                                <TableCell>{group.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline">{group.products.length}</Button>
                                        {canEdit && (
                                            <Pencil
                                                size={15}
                                                className="hover:text-black text-gray-500 cursor-pointer"
                                                onClick={() => {
                                                    setPrdouctsSheet(true);
                                                    setGroupForProducts(group);
                                                }}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="align-middle">
                                    <div className="flex justify-center">
                                        <Switch
                                            checked={group.active}
                                            disabled={updateGroupStatus.isPending}
                                            onCheckedChange={async checked => {
                                                const toastId = toast.loading('Updating status…');
                                                try {
                                                    await updateGroupStatus.mutateAsync({ id: group._id, data: { active: checked } });
                                                } catch (e) {
                                                    // error toast is already handled in your mutation onError
                                                } finally {
                                                    toast.dismiss(toastId);
                                                }
                                            }}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                        {canEdit && (
                                            <Button size="icon" variant="outline" onClick={() => onEdit(group)}>
                                                <Pencil size={16} />
                                            </Button>
                                        )}
                                        {canDelete && (
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={() => handleDeleteClick(group._id)}
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <DeleteConfirmationDialog
                isOpen={!!deletingId}
                onOpenChange={open => open || setDeletingId(null)}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                error={deleteError}
                title="Delete Product"
                description="Are you sure you want to delete this Product?"
            />
        </section>
    );
}

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
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TableSkeleton from "@/components/custom/TableSkeleton";
import { useNotifications } from "@/hooks/useNotifications";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog ";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdRefresh } from "react-icons/io";

export default function NotificationTable() {

    const { notificationsQuery, deleteNotification } = useNotifications()

    const {
        isLoading: isLoading,
        error: error,
        data: data
    } = notificationsQuery;

    const notifications = notificationsQuery?.data?.data || []

    const {
        mutateAsync: onDelete,
        isPending: isDeleting,
        error: deleteError
    } = deleteNotification;

    const [deletingId, setDeletingId] = useState(null);

    const handleDeleteClick = (categoryId) => {
        setDeletingId(categoryId);
    };

    const handleDeleteConfirm = async () => {
        await onDelete(deletingId);
        setDeletingId(null);
    };

    if (isLoading) return <TableSkeleton showHeader={false} />;
    if (error) return <div className="text-red-600 p-4">Error: {error.message}</div>
    if (!notifications?.length) return <div className="text-center text-gray-500 p-4">No notifications found!</div>

    async function sendAgain(item){
        const toastId = toast.loading('Sending Notification')
        try {
            axios.post('/api/send-notification', {...item})            
            toast.success('Notification Sent Successfully', {id: toastId})
        } catch (error) {
            toast.error('Error in sending Notification', {id: toastId})
            console.log(error)
        }

    }

    return (
        <section className="w-full">
            <Table>
                <TableHeader>
                    <TableRow className="text-primary">
                        <TableHead className="text-center">#</TableHead>
                        <TableHead className="text-center">Image</TableHead>
                        <TableHead className="text-center">Title</TableHead>
                        <TableHead className="text-center">Message</TableHead>
                        <TableHead className="text-center">Created At</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {notifications?.map((item, idx) => (
                        <TableRow
                            key={item._id}
                            className="hover:bg-gray-50 transition border"
                        >
                            <TableCell className="text-center">{idx + 1}</TableCell>

                            <TableCell className="py-1">
                                <div className="flex items-center justify-center min-h-20">
                                    {item?.image ? 
                                    <Image
                                    src={item.image}
                                    alt={'image'}
                                    width={80}
                                        height={80}
                                        quality={100}
                                        className="object-contain rounded-sm"
                                        />
                                    : <div>-</div>
                                    }
                                </div>
                            </TableCell>

                            <TableCell className="text-center">{item.title}</TableCell>
                            <TableCell className="text-center max-w-[160px] text-wrap"><p className="text-wrap">{item.message}</p></TableCell>
                            <TableCell className="text-center">{format(item.createdAt, 'dd MMM yyyy')}</TableCell>

                            <TableCell >
                                <div className="flex gap-2 items-center justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => sendAgain(item)}
                                    >
                                        <IoMdRefresh size={16} />
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
                isOpen={!!deletingId}
                onOpenChange={(open) =>
                    !open && setDeletingId(null)
                }
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                error={deleteError}
                title="Notification"
                description="Are you sure you want to delete this Notification?"
            />
        </section>
    );
}

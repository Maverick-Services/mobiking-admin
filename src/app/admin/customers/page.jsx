"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { Button } from '@/components/ui/button'
import { useUsers } from '@/hooks/useUsers';
import { CirclePlus } from 'lucide-react';
import React, { useState } from 'react'
import UsersListView from './components/UsersListView';
import UserDialog from './components/UserDialog';
// import UsersTable from './UsersTable';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select"
import { getPaginationRange } from "@/lib/services/getPaginationRange"

function page() {
    const [roleFilter, setRoleFilter] = useState('user')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    // fetch users query
    const {
        usersQuery,
        updateUser,
        deleteUser,
        permissions: {
            canView,
            canAdd,
            canDelete,
            canEdit,
            onlyAdmin }
    } = useUsers();

    const users = usersQuery({ roleFilter, page, limit });

    const allUsers = users.data?.data?.users || []
    const totalPages = users.data?.data?.pagination?.totalPages || 1
    const paginationRange = getPaginationRange(page, totalPages)

    // destructure updateUser mutation
    const {
        mutateAsync: updateUserAsync,
        isPending: isUpdating,
        error: updateError,
        reset: resetUpdate,
    } = updateUser;

    // destructure deleteUser mutation
    const {
        mutateAsync: deleteUserAsync,
        isPending: isDeleting,
        error: deleteError,
        reset: resetDelete,
    } = deleteUser;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState();

    // open dialog to add new tag
    const handleAddClick = () => {
        resetUpdate();
        resetDelete();
        setSelectedUser(undefined);
        setIsDialogOpen(true);
    };

    // open dialog to edit
    const handleEditClick = (id) => {
        resetCreate();
        resetUpdate();
        resetDelete();
        setSelectedUser(id);
        setIsDialogOpen(true);
    };

    return (
        <div>
            <InnerDashboardLayout>
                <div className='w-full flex items-center justify-between text-primary mb-5'>
                    <h1 className='font-bold sm:text-2xl lg:text-4xl w-full'>Customers</h1>

                    {canAdd &&
                        <Button onClick={handleAddClick}>
                            <CirclePlus className="mr-2 h-4 w-4" /> Add New
                        </Button>
                    }
                </div>

                {canView &&
                    <UsersListView
                        isLoading={users.isLoading}
                        error={users.error}
                        users={allUsers || []}
                        onEdit={handleEditClick}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        onDelete={deleteUserAsync}
                        isDeleting={isDeleting}
                        deleteError={deleteError}
                    />
                }
                <div className="flex w-full justify-end gap-2 items-center mt-4">
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

                {/* <UsersTable /> */}

                <UserDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    selectedUser={selectedUser}
                    onUpdate={updateUserAsync}
                    // isSubmitting={isCreating}
                    isSubmitting={isUpdating}
                    // error={createError?.message}
                    error={updateError?.message}
                    // changePassword={changePassword}
                    // onlyAdmin={onlyAdmin}
                    canEdit={canEdit}
                />

            </InnerDashboardLayout>
        </div>
    )
}

export default page

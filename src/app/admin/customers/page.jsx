"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { Button } from '@/components/ui/button'
import { useUsers } from '@/hooks/useUsers';
import { CirclePlus } from 'lucide-react';
import React, { useState } from 'react'
import UsersListView from './components/UsersListView';
import UserDialog from './components/UserDialog';
// import UsersTable from './UsersTable';

function page() {
    const [roleFilter, setRoleFilter] = useState('user')
    // const [page, setPage] = useState(1)
    // const [pageSize, setPageSize] = useState(10)

    // fetch users query
    const {
        usersQuery,
        updateUser,
        deleteUser,
        // changePassword,
        permissions: {
            canView,
            canAdd,
            canDelete,
            canEdit,
            onlyAdmin }
    } = useUsers();
    // } = useUsers({ role: roleFilter, page, pageSize });

    const users = usersQuery(roleFilter)
    console.log(users.data)
    // console.log(usersQuery?.data)

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
                        users={users?.data?.data || []}
                        // page={page}
                        // pageCount={Math.ceil((usersQuery.data?.totalCount || 0) / pageSize)}
                        // onPageChange={setPage}
                        onEdit={handleEditClick}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        onDelete={deleteUserAsync}
                        isDeleting={isDeleting}
                        deleteError={deleteError}
                    />
                }

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

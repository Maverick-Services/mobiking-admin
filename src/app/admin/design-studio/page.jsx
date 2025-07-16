"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import GroupDialog from './components/GroupDialog';
import { useProducts } from '@/hooks/useProducts';
import { useGroups } from '@/hooks/useGroups';
import GroupsTable from './components/GroupsTable';
import GroupProductsSheet from './components/GroupProductsSheet';
import NotAuthorizedPage from '@/components/notAuthorized';

function page() {
    const { productsQuery } = useProducts()
    const { groupsQuery, createGroup, updateGroup, updateProductsInGroup, permissions: {
        canView,
        canAdd,
        canEdit,
        canDelete
    } } = useGroups()
    const [selectedGroup, setSelectedGroup] = useState(null)

    const [prdouctsSheet, setPrdouctsSheet] = useState(false)
    const [groupForProducts, setGroupForProducts] = useState()

    const groupsData = groupsQuery?.data || []

    const {
        mutateAsync: createGroupAsync,
        isPending: creating,
        error: createError,
        reset: resetCreate,
    } = createGroup;

    const {
        mutateAsync: updateGroupAsync,
        isPending: updating,
        error: updateError,
        reset: resetUpdate,
    } = updateGroup;

    const {
        mutateAsync: updateProductsInGroupAsync,
        isPending: updatingProducts,
        error: updateProductsError,
    } = updateProductsInGroup;

    // console.log(groupsQuery.data)

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // open dialog to add new 
    const handleAddClick = () => {
        resetCreate();
        resetUpdate();
        // resetDelete();
        setSelectedGroup(undefined)
        // setSelectedProduct(undefined);
        setIsDialogOpen(true);
    };

    const handleEditClick = (group) => {
        resetCreate();
        resetUpdate();
        setIsDialogOpen(true);
        setSelectedGroup(group)
    }

    if (!canView) {
        return <NotAuthorizedPage />
    }


    return (
        <InnerDashboardLayout>
            <div className='flex items-center justify-between w-full mb-3'>
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-3">Design Studio</h1>

                {canAdd &&
                    <Button onClick={handleAddClick}>
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Add New
                    </Button>
                }
            </div>

            <GroupsTable
                groups={groupsData}
                onEdit={handleEditClick}
                isLoading={groupsQuery.isLoading}
                setGroupForProducts={setGroupForProducts}
                setPrdouctsSheet={setPrdouctsSheet}
                canDelete={canDelete}
                canEdit={canEdit}
            // onDelete={}
            />

            <GroupDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                products={productsQuery.data}
                onCreate={createGroupAsync}
                selectedGroup={selectedGroup}
                isSubmitting={creating || updating}
                error={createError || updateError}
                onUpdate={updateGroupAsync}
            />

            <GroupProductsSheet
                open={prdouctsSheet}
                onOpenChange={setPrdouctsSheet}
                group={groupForProducts}
                onProductsAdd={updateProductsInGroupAsync}
                updatingProducts={updatingProducts}
                updateProductsError={updateProductsError}
            />
        </InnerDashboardLayout >
    )
}

export default page
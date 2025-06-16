"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import GroupDialog from './components/GroupDialog';
import { useProducts } from '@/hooks/useProducts';
import { useGroups } from '@/hooks/useGroups';
import GroupsTable from './components/GroupsTable';

function page() {
    const { productsQuery } = useProducts()
    const { groupsQuery, createGroup, updateGroup } = useGroups()
    const [selectedGroup, setSelectedGroup] = useState(null)

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

    console.log(groupsQuery.data)

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


    // console.log(productsQuery.data)

    return (
        <InnerDashboardLayout>
            <div className='flex items-center justify-between w-full mb-3'>
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-3">Product Groups</h1>

                <Button onClick={handleAddClick}>
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>

            <GroupsTable
                groups={groupsData}
                onEdit={handleEditClick}
            />

            <GroupDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                products={productsQuery.data}
                onCreate={createGroupAsync}
                // isSubmitting={creating}
                // error={createError}
                selectedGroup={selectedGroup}
                // selectedProduct={selectedProduct}
                // categories={subCategories}
                isSubmitting={creating || updating}
                error={createError || updateError}
                // onCreate={createProductAsync}
                onUpdate={updateGroupAsync}
            />
        </InnerDashboardLayout >
    )
}

export default page
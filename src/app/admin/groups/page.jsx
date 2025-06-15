"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import GroupDialog from './components/GroupDialog';

function page() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // open dialog to add new 
    const handleAddClick = () => {
        // resetCreate();
        // resetUpdate();
        // resetDelete();
        // setSelectedProduct(undefined);
        setIsDialogOpen(true);
    };

    return (
        <InnerDashboardLayout>
            <div>
                <div className="w-full items-center justify-between">
                    <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-3">Product Groups</h1>
                </div>
                <Button onClick={handleAddClick}>
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>

            <GroupDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            // selectedProduct={selectedProduct}
            // categories={subCategories}
            // isSubmitting={creating || updating}
            // error={createError || updateError}
            // onCreate={createProductAsync}
            // onUpdate={updateProductAsync}
            />
        </InnerDashboardLayout>
    )
}

export default page
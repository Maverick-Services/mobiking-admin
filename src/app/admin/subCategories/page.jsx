'use client';
import { CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import CategoriesListView from './components/CategoriesListView';
import { useSubCategories } from '@/hooks/useSubCategories';
import { useCategories } from '@/hooks/useCategories';
import { useRouter } from 'next/navigation';
import NotAuthorizedPage from '@/components/notAuthorized';

export default function Page() {
    const router = useRouter()
    // fetch categories query
    const { subCategoriesQuery, deleteSubCategory, permissions: { canView, canAdd, canEdit, canDelete } } = useSubCategories();
    const { categoriesQuery } = useCategories()
    console.log(subCategoriesQuery.data)
    // destructure deleteSubCategory mutation
    const {
        mutateAsync: deleteSubCategoryAsync,
        isPending: isDeleting,
        error: deleteError,
        reset: resetDelete,
    } = deleteSubCategory;

    // open dialog to add new tag
    const handleAddClick = () => {
        router.push('/admin/subCategories/add')
    };

    if (!canView) return <NotAuthorizedPage />


    return (
        <InnerDashboardLayout>
            <div className="w-full items-center justify-between">
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-3">Sub Categories</h1>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4 mt-4">
                    <Button variant="outline">
                        Total: {subCategoriesQuery.data?.data?.length || 0}
                    </Button>
                    {canAdd &&
                        <Button onClick={handleAddClick}>
                            <CirclePlus className="mr-2 h-4 w-4" /> Add New
                        </Button>
                    }
                </div>

                <CategoriesListView
                    categories={subCategoriesQuery?.data?.data}
                    isLoading={subCategoriesQuery.isLoading}
                    error={subCategoriesQuery.error}
                    onDelete={deleteSubCategoryAsync}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    canEdit={canEdit}
                    canDelete={canDelete}
                />
            </div>
        </InnerDashboardLayout>
    );
}
'use client';
import { CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import CategoriesListView from './components/CategoriesListView';
import { useSubCategories } from '@/hooks/useSubCategories';
import { useCategories } from '@/hooks/useCategories';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function Page() {
    const router = useRouter()
    // fetch categories query
    const { subCategoriesQuery, deleteSubCategory } = useSubCategories();
    const { categoriesQuery } = useCategories()
    console.log(categoriesQuery.data)
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

    return (
        <InnerDashboardLayout>
            <div className="w-full items-center justify-between">
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-3">Sub Categories</h1>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4 mt-4">
                    <Button variant="outline">
                        Categories: {subCategoriesQuery.data?.data?.length || 0}
                    </Button>
                    <Button onClick={handleAddClick}>
                        <CirclePlus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </div>

                <CategoriesListView
                    categories={subCategoriesQuery?.data?.data}
                    isLoading={subCategoriesQuery.isLoading}
                    error={subCategoriesQuery.error}
                    onDelete={deleteSubCategoryAsync}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                />
            </div>
        </InnerDashboardLayout>
    );
}
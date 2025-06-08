"use client"
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from '@/components/ui/breadcrumb';
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import { useSubCategories } from '@/hooks/useSubCategories';
import SubCategoryForm from '../../components/SubCategoryForm';
import { useParams, useRouter } from 'next/navigation';

function page() {
  const router = useRouter()
  const params = useParams();
  const slug = params.slug;
  const { updateService, getSubServiceQuery } = useSubCategories()
  const { data: subCategory, isLoading, error } = getSubServiceQuery(slug);

  const { updateSubCategory } = useSubCategories()

  const defaultData = subCategory?.data

  console.log(defaultData)

  const handleSubmit = async (data) => {
    await updateSubCategory.mutateAsync({ id: defaultData._id, data })
    console.log('Update subCategory:', data);
    router.push('/admin/subCategories')
  };

  return (

    <InnerDashboardLayout>
      <div className="w-full items-center justify-between">
        <h1 className="text-primary font-bold sm:text-2xl lg:text-4xl mb-3">Edit Sub Category</h1>
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/subCategories">Sub Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <SubCategoryForm
        defaultValues={defaultData}
        onSubmit={handleSubmit}
        loading={updateSubCategory.isPending}
        error={updateSubCategory.error}
      />
    </InnerDashboardLayout>
  )
}

export default page
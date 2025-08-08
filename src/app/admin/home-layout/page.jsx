"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useGroups } from '@/hooks/useGroups'
import { useHome } from '@/hooks/useHome'
import React from 'react'
import GroupTable from './components/GroupTable'
import CategoryTable from './components/CategoryTable'
import { useSubCategories } from '@/hooks/useSubCategories'
import PCard from '@/components/custom/PCard'
import WebsiteBanners from './components/WebsiteBanners'
import Loader from '@/components/Loader'

function page() {
    const { homeQuery, updateHome, permissions: { canView, canAdd, canEdit, canDelete } } = useHome()
    const { groupsQuery } = useGroups()
    const { subCategoriesQuery } = useSubCategories()

    const allGroups = groupsQuery?.data?.data || []
    const allCategories = subCategoriesQuery?.data?.data || []

    const homeData = homeQuery?.data?.data || {}
    const initialData = homeData.groups || []

    const initialCategoriesData = (homeData.categories || [])

    if (homeQuery.isLoading || groupsQuery.isLoading) {
        return (
            <InnerDashboardLayout>
                <div className='w-full flex items-center justify-between text-primary mb-5'>
                    <h1 className='font-bold sm:text-2xl lg:text-4xl w-full'>Home Layout</h1>
                </div>
                <Loader />
            </InnerDashboardLayout>
        )
    }

    if (!canView) {
        return <NotAuthorizedPage />
    }

    return (
        <InnerDashboardLayout>
            <div className='w-full flex items-center justify-between text-primary mb-5'>
                <h1 className='font-bold sm:text-2xl lg:text-4xl w-full'>Design Studio</h1>
            </div>

            <div className='flex flex-col gap-4 mb-4'>
                {/* Categories section */}
                <PCard>
                    <CategoryTable
                        initialData={initialCategoriesData}
                        allCategories={allCategories}
                        onSave={(newSeq) => {
                            const data = {
                                // ...homeData,
                                categories: newSeq
                            }
                            updateHome.mutateAsync(data)
                            console.log('Categories saved:', newSeq)
                        }}
                        canEdit={canEdit}
                    />
                </PCard>
                {/* Groups section */}
                <PCard>
                    <GroupTable
                        initialData={initialData}
                        allGroups={allGroups}
                        onSave={(newSequence) => {
                            console.log('New sequence of IDs:', newSequence)
                            const data = {
                                // ...homeData,
                                groups: newSequence
                            }
                            updateHome.mutateAsync(data)
                        }}
                        canEdit={canEdit}
                    />
                </PCard>
            </div>

            <PCard className='max-w-[600px]'>
                <WebsiteBanners canEdit={canEdit} />
            </PCard>
        </InnerDashboardLayout>
    )
}

export default page
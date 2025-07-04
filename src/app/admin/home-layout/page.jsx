"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useGroups } from '@/hooks/useGroups'
import { useHome } from '@/hooks/useHome'
import React, { useEffect, useState } from 'react'
import GroupTable from './components/GroupTable'
import CategoryTable from './components/CategoryTable'
import { useSubCategories } from '@/hooks/useSubCategories'
import PCard from '@/components/custom/PCard'
import Image from 'next/image'
import MultiImageSelector from '@/components/MultiImageSelector'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

function page() {
    const { homeQuery, updateHome } = useHome()
    const { groupsQuery } = useGroups()
    const { subCategoriesQuery } = useSubCategories()

    const allGroups = groupsQuery?.data?.data || []
    const allCategories = subCategoriesQuery?.data?.data || []

    const homeData = homeQuery?.data?.data || {}
    const initialData = homeData.groups || []

    const initialCategoriesData = (homeData.categories || [])

    const [banners, setBanners] = useState([])
    const [photosDialogOpen, setPhotosDialogOpen] = useState(false);

    useEffect(() => {
        setBanners(homeData?.banners)
    }, [homeData])

    const [bannerLoading, setBannerLoading] = useState(false)


    console.log(homeData)

    return (
        <InnerDashboardLayout>
            <div className='w-full flex items-center justify-between text-primary mb-5'>
                <h1 className='font-bold sm:text-2xl lg:text-4xl w-full'>Design Studio</h1>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <PCard>
                    <GroupTable
                        initialData={initialData}
                        allGroups={allGroups}
                        onSave={(newSequence) => {
                            console.log('New sequence of IDs:', newSequence)
                            const data = {
                                ...homeData,
                                groups: newSequence
                            }
                            updateHome.mutateAsync(data)
                            // console.log(data)
                        }}
                    />
                </PCard>

                <PCard>
                    {/* Categories section */}
                    <CategoryTable
                        initialData={initialCategoriesData}
                        allCategories={allCategories}
                        onSave={(newSeq) => {
                            const data = {
                                ...homeData,
                                categories: newSeq
                            }
                            updateHome.mutateAsync(data)
                            console.log('Categories saved:', newSeq)
                        }}
                    />
                </PCard>
            </div>

            <PCard className={''}>
                <div className='w-full flex items-center justify-between text-primary mb-5'>
                    <h2 className='font-bold'>Website Banners</h2>
                    <div className='flex items-center gap-2'>
                        {bannerLoading && <Loader2 className='animate-spin text-muted-foreground' />}
                        <Button onClick={() => setPhotosDialogOpen(true)}>Add More</Button>
                        <Button
                            onClick={async () => {
                                try {
                                    setBannerLoading(true)
                                    await updateHome.mutateAsync({
                                        ...homeData,
                                        banners: banners,
                                    })
                                } finally {
                                    setBannerLoading(false)
                                }
                            }}
                        >
                            Save Banners
                        </Button>
                    </div>
                </div>

                {banners?.length === 0 ? (
                    <p className='text-muted-foreground'>No banners added yet.</p>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {banners?.map((url, idx) => (
                            <div key={idx} className='relative group'>
                                <Image
                                    src={url}
                                    alt={`banner-${idx}`}
                                    height={500}
                                    width={2000}
                                    className='h-64 w-full object-cover rounded-xl'
                                />
                                <button
                                    onClick={() => {
                                        const updatedBanners = banners.filter((_, i) => i !== idx)
                                        setBanners(updatedBanners)
                                    }}
                                    className='absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition'
                                    title='Remove Banner'
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </PCard>


            <MultiImageSelector
                open={photosDialogOpen}
                onOpenChange={setPhotosDialogOpen}
                onChange={(newUrls) => {
                    setBanners([...(banners || []), ...newUrls])
                }}
            />

        </InnerDashboardLayout>
    )
}

export default page
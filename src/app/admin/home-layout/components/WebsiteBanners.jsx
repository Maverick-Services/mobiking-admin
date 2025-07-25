'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useHome } from '@/hooks/useHome'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/services/uploadImage'
import LoaderButton from '@/components/custom/LoaderButton'
import { Reorder } from 'framer-motion'

function WebsiteBanners() {
    const { homeQuery, updateHome } = useHome()
    const homeData = homeQuery?.data?.data || {}
    const [bannerLoading, setBannerLoading] = useState(false)
    const [banners, setBanners] = useState([])

    useEffect(() => {
        if (homeData?.banners) {
            setBanners(homeData.banners)
        }
    }, [homeData])

    return (
        <div className='max-w-[600px]'>
            <div className='w-full flex items-center justify-between text-primary mb-5'>
                <h2 className='font-bold'>Website Banners</h2>
                <LoaderButton
                    loading={bannerLoading}
                    onClick={async () => {
                        try {
                            setBannerLoading(true)
                            await updateHome.mutateAsync({ banners })
                            toast.success('Banners saved successfully!')
                        } catch (err) {
                            toast.error('Failed to save banners')
                        } finally {
                            setBannerLoading(false)
                        }
                    }}
                >
                    Save Banners
                </LoaderButton>
            </div>

            {banners?.length === 0 ? (
                <p className='text-muted-foreground'>No banners added yet.</p>
            ) : (
                <Reorder.Group
                    axis='y'
                    values={banners}
                    onReorder={setBanners}
                    className='flex flex-col gap-4'
                >
                    {banners.map((url, idx) => (
                        <Reorder.Item
                            key={url}
                            value={url}
                            className='relative group cursor-grab active:cursor-grabbing'
                        >
                            <Image
                                src={url}
                                alt={`banner-${idx}`}
                                height={500}
                                width={2000}
                                className='h-64 w-full object-cover rounded-xl'
                            />
                            <button
                                onClick={() => {
                                    setBanners((prev) => prev.filter((_, i) => i !== idx))
                                }}
                                className='absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition'
                                title='Remove Banner'
                            >
                                ✕
                            </button>
                            <Button className={'w-full mt-2'}>...</Button>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}

            <input
                type='file'
                accept='image/*'
                multiple
                className='mt-4'
                onChange={async (e) => {
                    const files = e.target.files
                    if (!files || files.length === 0) return

                    const toastId = toast.loading('Uploading images...')
                    const urls = []

                    for (let file of files) {
                        const reader = new FileReader()
                        const result = await new Promise((resolve, reject) => {
                            reader.onloadend = () => resolve(reader.result)
                            reader.onerror = reject
                            reader.readAsDataURL(file)
                        })

                        try {
                            const url = await uploadImage(result)
                            urls.push(url)
                        } catch (err) {
                            console.error('Image upload failed:', err)
                        }
                    }

                    setBanners((prev) => [...prev, ...urls])
                    toast.success('Images uploaded', { id: toastId })
                    e.target.value = ''
                }}
            />
        </div>
    )
}

export default WebsiteBanners

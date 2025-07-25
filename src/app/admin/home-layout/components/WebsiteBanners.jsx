import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import MultiImageSelector from '@/components/MultiImageSelector'
import { useHome } from '@/hooks/useHome'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/services/uploadImage'

function WebsiteBanners() {
    const { homeQuery, updateHome } = useHome()
    const homeData = homeQuery?.data?.data || {}
    const [bannerLoading, setBannerLoading] = useState(false);

    const [banners, setBanners] = useState([])
    const [photosDialogOpen, setPhotosDialogOpen] = useState(false);

    useEffect(() => {
        setBanners(homeData?.banners)
    }, [homeData])

    console.log(banners)
    return (
        <>
            <div className='w-full flex items-center justify-between text-primary mb-5'>
                <h2 className='font-bold'>Website Banners</h2>
                <div className='flex items-center gap-2'>
                    {bannerLoading && <Loader2 className='animate-spin text-muted-foreground' />}
                    {/* <Button onClick={() => setPhotosDialogOpen(true)}>Add More</Button> */}
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

            <input
                type="file"
                accept="image/*"
                multiple
                className=""
                onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    const toastId = toast.loading('Uploading images...');

                    const urls = [];
                    for (let file of files) {
                        const reader = new FileReader();
                        const result = await new Promise((resolve, reject) => {
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        });
                        try {
                            const url = await uploadImage(result);
                            urls.push(url);
                        } catch (err) {
                            console.error('Image upload failed:', err);
                        }
                    }

                    setBanners(prev => [...prev, ...urls])
                    toast.success('Images uploaded', { id: toastId });

                    // Reset input
                    e.target.value = '';
                }}
            />
        </>
    )
}

export default WebsiteBanners
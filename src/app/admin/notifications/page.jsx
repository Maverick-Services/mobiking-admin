"use client"
import React, { useState } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import { Button } from '@/components/ui/button';
import SendNotification from './components/SendNotification';

function page() {
    const [notiDialog, setNotiDialog] = useState(false)

    return (
        <InnerDashboardLayout>
            <div className='flex items-center justify-between w-full mb-3'>
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-3">Notifications</h1>

                <Button onClick={() => setNotiDialog(true)}>
                    Create New Notification
                </Button>
            </div>
            <SendNotification
                open={notiDialog}
                onOpenChange={setNotiDialog}
            />
        </InnerDashboardLayout>
    )
}

export default page
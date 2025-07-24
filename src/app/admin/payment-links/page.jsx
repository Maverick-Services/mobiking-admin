"use client"

import React from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useOrders } from '@/hooks/useOrders'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FaLink, FaRupeeSign } from 'react-icons/fa'
import RefreshButton from '@/components/custom/RefreshButton'
import PaymentSkeleton from './components/PaymentSkeleton'

function Page() {
    const { getPaymentLinks } = useOrders();
    const isLoading = getPaymentLinks.isLoading;
    const linksData = getPaymentLinks?.data?.data || [];

    return (
        <InnerDashboardLayout>
            <div className="flex items-center justify-between w-full mb-4">
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl">Payment Links</h1>
                <RefreshButton queryPrefix='paymentLinks' />
            </div>

            {isLoading
                ? <PaymentSkeleton />
                : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 bg-gray-100 rounded-md">
                    {linksData.length === 0 ? (
                        <p className="text-muted-foreground">No payment links found.</p>
                    ) : (
                        linksData.map((link) => (
                            <Card key={link._id} className="bg-white shadow-md rounded-xl p-4">
                                <CardContent className="p-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h2 className="font-semibold text-lg text-gray-800">{link.name}</h2>
                                            <p className="text-sm text-gray-500">{link.email}</p>
                                            <p className="text-sm text-gray-500">{link.phoneNo}</p>
                                        </div>
                                        <Badge variant="outline" className="capitalize">
                                            {link.status}
                                        </Badge>
                                    </div>

                                    <Separator className="my-3" />

                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                        <FaRupeeSign className="text-primary" />
                                        <span className="font-medium">Amount:</span>
                                        ₹{link.amount}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Order Status:</span>
                                        <Badge variant="secondary" className="capitalize">{link.orderId?.status}</Badge>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                                        <FaLink className="text-blue-500" />
                                        <a href={link.link} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 truncate">
                                            {link.link}
                                        </a>
                                    </div>

                                    <p className="text-xs text-gray-400 mt-3">
                                        Created: {new Date(link.createdAt).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Updated: {new Date(link.updatedAt).toLocaleString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            }
        </InnerDashboardLayout>
    );
}

export default Page;

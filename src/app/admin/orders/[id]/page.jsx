"use client"
import { Car, Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import PCard from '@/components/custom/PCard';
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import { useOrders } from '@/hooks/useOrders';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { format } from 'date-fns'
import UpperDetailss from './components/UpperDetailss';
import PersonalDetails from './components/PersonalDetails';
import PaymentDetails from './components/PaymentDetails';
import ItemsTable from './components/ItemsTable';
import LoaderButton from "@/components/custom/LoaderButton";
import { shiprocketLogin } from "@/lib/services/shiprocketLogin";
import CourierDialog from "./components/CourierDialog";
import { getCouriersList } from "@/lib/services/getCouriersList";

function page() {
    const params = useParams();
    const id = params.id;
    const [loading2, setLoading2] = useState(false)
    const [courierOpen, setCourierOpen] = useState(false)
    const [courierData, setCourierData] = useState()

    const { getSingleOrderQuery } = useOrders()
    const { data: orderResp, isLoading, error } = getSingleOrderQuery(id)
    const order = orderResp?.data || {}

    // console.log(order)

    if (isLoading) return <p>Loading…</p>
    if (error) return <p>Error: {error.message}</p>


    async function handleGetCourierId() {
        setLoading2(true)
        try {
            const loginData = await shiprocketLogin();
            const data = {
                pickup_postcode: "110001",
                delivery_postcode: "124112",
                cod: 1,
                weight: 0.5
            }
            const res = await getCouriersList({ token: loginData?.token, data: data })
            setCourierData(res?.data?.data)
            setCourierOpen(true)

            setLoading2(false)
            console.log(loginData)
        } catch (error) {
            console.log(error)
            setLoading2(false)
        }
    }


    return (
        <InnerDashboardLayout>
            <div className="w-full flex items-center justify-between gap-4 mb-6">
                <h1 className="text-primary font-bold sm:text-xl lg:text-2xl">
                    View Order
                </h1>
                <div className="flex gap-2">
                    <LoaderButton
                        onClick={handleGetCourierId}
                        loading={loading2}
                        variant="outline"
                        className="gap-2"
                    >
                        <Car className="h-4 w-4" />
                        Delivery
                    </LoaderButton>
                    <Button variant="outline" className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                </div>

            </div>
            <div className='space-y-3'>
                {/* Upper Details */}
                <UpperDetailss order={order} />

                <PersonalDetails order={order} />
                <PaymentDetails order={order} />
                <ItemsTable order={order} />
            </div>
            <CourierDialog
                open={courierOpen}
                onOpenChange={setCourierOpen}
                courierData={courierData}
            />
        </InnerDashboardLayout>
    )
}

export default page
"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import CourierCard from "./CourierCard"

export default function CourierDialog({ open, onOpenChange, courierData }) {
    // assume courierData.available_courier_companies is the array
    const list = courierData?.available_courier_companies || []
    console.log(list)
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Choose a Courier</DialogTitle>
                </DialogHeader>

                <div className="mt-4 ">
                    {list.length > 0 ? (
                        list.map((c) => (
                            <CourierCard key={c.courier_company_id} courier={c} />
                        ))
                    ) : (
                        <p className="text-center text-sm text-muted-foreground">
                            No couriers available for these pins.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

import PCard from '@/components/custom/PCard'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import PersonalDetailsDialog from './PersonalDetailsDialog'

function PersonalDetails({ order }) {
    const [open, setOpen] = useState(false)

    const {
        name,
        phoneNo,
        email,
        address,
        address2,
        city,
        pincode,
        state,
        country
    } = order

    // ✅ Construct full address string
    const fullAddress = [
        address,
        address2,
        city,
        state,
        country,
        pincode
    ]
        .filter(Boolean)
        .join(', ')

    const personalFields = [
        ["Customer Name", name],
        ["Mobile Number", phoneNo],
        ["Email", email],
        ["Address", fullAddress || "—"]
    ]

    function isEditable() {
        return order.status === 'New'
    }

    return (
        <PCard>
            <div className="flex w-full justify-between items-center">
                <h2 className=" text-lg font-semibold text-gray-700">Personal Details</h2>
                {isEditable() &&
                    <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                }
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {personalFields.map(([label, value]) => (
                    <div key={label}>
                        <span className="block text-xs font-medium uppercase text-gray-400">
                            {label}
                        </span>
                        <span className="mt-1 block text-base font-semibold text-gray-900">
                            {value ?? "—"}
                        </span>
                    </div>
                ))}
            </div>

            <PersonalDetailsDialog
                open={open}
                onOpenChange={setOpen}
                user={order}
            />
        </PCard>
    )
}

export default PersonalDetails

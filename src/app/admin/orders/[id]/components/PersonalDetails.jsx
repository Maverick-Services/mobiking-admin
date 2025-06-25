import PCard from '@/components/custom/PCard'
import React from 'react'

function PersonalDetails({ order }) {
    const personalFields = [
        ["Customer Name", order.name],
        ["Mobile Number", order.phoneNo],
        ["Email", order.email],
        ["Address", order.address],
    ]

    return (
        <PCard className={''}>
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Personal Details</h2>
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
        </PCard>
    )
}

export default PersonalDetails

import React from 'react'

function InnerDashboardLayout({ children }) {
    return (
        <div className='w-full h-screen overflow-y-auto p-4'>
            {children}
        </div>
    )
}

export default InnerDashboardLayout

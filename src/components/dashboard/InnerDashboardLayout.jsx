import React from 'react'

function InnerDashboardLayout({ children }) {
    return (
        <div className='w-full h-screen p-4 scroll-smooth'>
            {children}
        </div>
    )
}

export default InnerDashboardLayout

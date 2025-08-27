import React from 'react'

function InnerDashboardLayout({ children }) {
    return (
        <div className='w-full h-screen p-4 pb-96 scroll-smooth'>
            {children}
            <div className='h-4'></div>
        </div>
    )
}

export default InnerDashboardLayout

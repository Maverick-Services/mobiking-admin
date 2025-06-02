import LayoutDashboard from '@/components/dashboard/LayoutDashboard'
import React from 'react'

function layout({ children }) {
    return (
        <LayoutDashboard>
            {children}
        </LayoutDashboard>
    )
}

export default layout
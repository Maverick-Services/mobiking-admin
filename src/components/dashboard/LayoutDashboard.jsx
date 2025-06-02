"use client"
import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Cross, Menu } from 'lucide-react';
import Image from 'next/image';

function LayoutDashboard({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <main className='flex flex-col sm:flex-row h-screen'>

            <div className="flex p-5 justify-between items-center bg-gray-900 shadow-md gap-3 sm:hidden">
                <Image
                    height={100}
                    width={300}
                    src={'/logo1.png'}
                    alt="logo"
                    className="max-h-5 w-auto"
                />

                <div onClick={() => setSidebarOpen(prev => !prev)} className="cursor-pointer text-white">
                    {sidebarOpen
                        ? <Cross className="text-2xl ease-in-out transition-all duration-300 focus:rotate-90" />
                        : <Menu className="text-2xl" />
                    }
                </div>
            </div>

            <div className=''>
                <Sidebar isOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />
            </div>

            <div className='bg-gray-100 grow h-screen overflow-auto p-2 sm:p-4 lg:p-5' onClick={() => setSidebarOpen(false)}>
                {children}
            </div>
        </main>
    )
}

export default LayoutDashboard
"use client"
import React from 'react'
import { useParams } from 'next/navigation';
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import Loader from '@/components/Loader';
import { useProducts } from '@/hooks/useProducts';
import ProductOrdersTable from './components/ProductOrdersTable';
import ProductDetails from './components/ProductDetails';

function page() {
    const params = useParams();
    const id = params.id;
    const { getProductByIdQuery } = useProducts()
    const { data: resp, isLoading, error } = getProductByIdQuery(id)
    const product = resp?.data || {};

    console.log(product)

    if (isLoading) return (
        <InnerDashboardLayout>
            <div className='flex items-center justify-between w-full mb-3'>
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-0">Product Details</h1>
            </div>
            <Loader />
        </InnerDashboardLayout>
    )
    if (error) return <p>Error: {error.message}</p>

    return (
        <InnerDashboardLayout>
            <div className='flex items-center justify-between w-full mb-3'>
                <h1 className="text-primary font-bold sm:text-2xl lg:text-3xl mb-0">Product Details</h1>
            </div>
            <div className='space-y-3'>
                <ProductDetails product={product} />
                {product?.orders &&
                    <div>
                        <div className="bg-white p-2 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">Orders</h2>
                        </div>
                        <ProductOrdersTable orders={product?.orders} />
                    </div>
                }
            </div>
        </InnerDashboardLayout>
    )
}

export default page
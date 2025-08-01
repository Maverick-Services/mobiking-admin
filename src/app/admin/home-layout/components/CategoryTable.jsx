'use client'
import React from 'react'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import CategorySequenceDialog from './CategorySequenceDialog'
import Image from 'next/image'

export default function CategoryTable({
    initialData = [],
    allCategories = [],
    onSave,
    canEdit
}) {
    return (
        <div>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="font-bold text-xl text-green-800">Product Categories</h2>
                {canEdit &&
                    <CategorySequenceDialog
                        allCategories={allCategories}
                        initialCategories={initialData.map((g) => g._id)}
                        onSave={onSave}
                    />
                }
            </div>

            <div className="overflow-auto border rounded-md shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100 text-sm text-gray-700">
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Icon</TableHead>
                            <TableHead>Upper Banner</TableHead>
                            <TableHead>Lower Banner</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Theme</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.map((cat, idx) => (
                            <TableRow key={cat._id} className="hover:bg-gray-50">
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell className="font-medium text-gray-800">{cat.name}</TableCell>

                                {/* SVG Icon */}
                                <TableCell>
                                    <div
                                        className="w-10 h-10"
                                        dangerouslySetInnerHTML={{ __html: cat.icon }}
                                    />
                                </TableCell>

                                {/* Upper Banner */}
                                <TableCell>
                                    <div className="h-12 w-20 overflow-hidden rounded-sm border">
                                        <Image
                                            src={cat.upperBanner}
                                            alt="Upper Banner"
                                            width={100}
                                            height={100}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </TableCell>

                                {/* Lower Banner */}
                                <TableCell>
                                    <div className="h-12 w-20 overflow-hidden rounded-sm border">
                                        <Image
                                            src={cat.lowerBanner}
                                            alt="Lower Banner"
                                            width={100}
                                            height={100}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </TableCell>

                                {/* Product Count */}
                                <TableCell>{cat.products?.length ?? 0}</TableCell>

                                {/* Theme Badge */}
                                <TableCell>
                                    <span
                                        className={`px-2 py-0.5 text-xs font-medium rounded
                      ${cat.theme === 'dark'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-yellow-100 text-yellow-700'}`}
                                    >
                                        {cat.theme === 'dark' ? 'Dark' : 'Light'}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

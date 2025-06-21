// app/design-studio/components/CategoryTable.jsx
'use client'
import React from 'react'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import CategorySequenceDialog from './CategorySequenceDialog'

export default function CategoryTable({
    initialData = [],           // full category objects for table rows
    allCategories = [],         // full list
    onSave,
}) {

    // console.log(allCategories)
    return (
        <div>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="font-bold text-xl text-green-800">Product Categories</h2>
                <CategorySequenceDialog
                    allCategories={allCategories}
                    initialCategories={initialData.map((g) => g._id)}
                    onSave={onSave}
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Active</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialData.map((cat, idx) => (
                        <TableRow key={cat._id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{cat.name}</TableCell>
                            <TableCell>{cat.active ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

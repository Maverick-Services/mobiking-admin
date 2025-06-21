// app/design-studio/components/GroupTable.jsx
'use client'
import React from 'react'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import GroupSequenceDialog from './GroupSequenceDialog'

export default function GroupTable({ initialData = [], allGroups = [], onSave }) {
    return (
        <div>
            <div className="flex justify-between items-center w-full mb-5">
                <h2 className="font-bold text-xl text-purple-800">Product Groups</h2>
                <GroupSequenceDialog
                    allGroups={allGroups}
                    // turn array of full group objects into array of IDs
                    initialGroups={initialData.map((g) => g._id)}
                    onSave={onSave}
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Banner</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialData.map((group, idx) => (
                        <TableRow key={group._id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{group.name}</TableCell>
                            <TableCell>{group.products?.length ?? 0}</TableCell>
                            <TableCell>{group.isBannerVisble ? 'Visible' : 'Not Visible'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

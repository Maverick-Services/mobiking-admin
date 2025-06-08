'use client'

import React, { useState } from 'react'
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, Pencil, Trash } from 'lucide-react'

export default function UsersTable() {
    const [searchTerm, setSearchTerm] = useState('')

    const users = [
        { id: 'u3', name: 'Rohit Singh', mobile: '9988776655', email: 'rohit.singh@example.com', role: 'user' },
        { id: 'u4', name: 'Sneha Gupta', mobile: '9012345678', email: 'sneha.gupta@example.com', role: 'user' },
        { id: 'u6', name: 'Priya Nair', mobile: '9776655443', email: 'priya.nair@example.com', role: 'user' },
    ]

    const filteredUsers = users
        .filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        )

    return (
        <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2">
                <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-1 max-w-sm"
                />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Mobile</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredUsers.map((user, idx) => (
                            <TableRow
                                key={user.id}
                                className="even:bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.mobile}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="capitalize">{user.role}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => console.log('View', user.id)}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => console.log('Edit', user.id)}
                                        >
                                            <Pencil size={16} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => console.log('Delete', user.id)}
                                        >
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

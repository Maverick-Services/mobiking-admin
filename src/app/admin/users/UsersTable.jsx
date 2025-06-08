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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { Eye, Pencil, Trash } from 'lucide-react'

export default function UsersTable() {
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')

    const users = [
        { id: 'u1', name: 'Aarav Sharma', mobile: '9876543210', email: 'aarav.sharma@example.com', role: 'admin' },
        { id: 'u2', name: 'Ishita Patel', mobile: '9123456780', email: 'ishita.patel@example.com', role: 'sub-admin' },
        { id: 'u3', name: 'Rohit Singh', mobile: '9988776655', email: 'rohit.singh@example.com', role: 'user' },
        { id: 'u4', name: 'Sneha Gupta', mobile: '9012345678', email: 'sneha.gupta@example.com', role: 'user' },
        { id: 'u5', name: 'Vikram Reddy', mobile: '9898989898', email: 'vikram.reddy@example.com', role: 'sub-admin' },
        { id: 'u6', name: 'Priya Nair', mobile: '9776655443', email: 'priya.nair@example.com', role: 'user' },
        { id: 'u7', name: 'Karan Kapoor', mobile: '9665544332', email: 'karan.kapoor@example.com', role: 'admin' },
    ]

    const filteredUsers = users
        .filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        )
        .filter(u =>
            roleFilter === 'all' ? true : u.role === roleFilter
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

                <Select value={roleFilter} onValueChange={setRoleFilter} className="w-48">
                    <SelectTrigger>
                        <SelectValue>
                            {roleFilter === 'all' ? 'All Roles' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="sub-admin">Sub-Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>
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

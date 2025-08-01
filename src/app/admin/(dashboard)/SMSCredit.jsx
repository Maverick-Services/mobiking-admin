'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PCard from '@/components/custom/PCard'
import { Loader2, AlertTriangle, MessageSquare } from 'lucide-react'

export default function SMSCredit() {
    const [isLoading, setIsLoading] = useState(true)
    const [credit, setCredit] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const response = await axios.get('/api/sms-balance')
                const credits = response?.data?.Data?.[0]?.Credits
                setCredit(credits)
            } catch (err) {
                setError('Failed to fetch SMS credits')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCredits()
    }, [])

    // Decide which icon to show
    const IconComponent = isLoading
        ? Loader2
        : error
            ? AlertTriangle
            : MessageSquare

    return (
        <PCard className="flex items-center justify-between h-full">
            <div className="flex flex-col items-start mb-0">
                {isLoading ? (
                    <p className="text-muted-foreground text-sm">Loading...</p>
                ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                ) : (
                    <p className="text-2xl font-bold leading-tight">{credit}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1">SMS Credits Balance</p>
            </div>

            <IconComponent
                className={`h-8 w-8 ${isLoading
                    ? 'animate-spin text-muted-foreground'
                    : error
                        ? 'text-red-500'
                        : 'text-primary'
                    }`}
            />
        </PCard>
    )
}

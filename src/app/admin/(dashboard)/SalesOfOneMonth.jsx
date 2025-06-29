'use client'

import React, { useState } from 'react'
import PCard from '@/components/custom/PCard'
import { useSalesOfOneDay } from '@/hooks/useDashboard'
import { formatINRCurrency } from '@/lib/services/formatters'
import MonthSelector from '@/components/custom/MonthSelector'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'

function SalesOfOneMonth() {
  const [range, setRange] = useState(() => {
    const today = new Date()
    return {
      startDate: format(today, 'yyyy-MM-01'),
      endDate: format(today, 'yyyy-MM-dd'),
      monthLabel: format(today, 'LLLL yyyy'),
    }
  })

  const { startDate, endDate, monthLabel } = range
  const { isLoading, error, data } = useSalesOfOneDay(startDate, endDate)
  const formattedSales = formatINRCurrency(data?.salesInRange || 0)

  return (
    <PCard className="flex items-center justify-between">
      <div className="flex flex-col gap-1 h-full items-start mb-0 justify-center">
       {isLoading ?
                    <Loader2 className="animate-spin" />
                    : <p className="text-2xl font-semibold">{formattedSales}</p>
                } <p className="text-muted-foreground text-sm">Sales - Month</p>
      </div>
      <div className="flex flex-col gap-2 items-end text-sm text-muted-foreground">
        <MonthSelector onChange={setRange} />
        <p>{monthLabel}</p>
      </div>
    </PCard>
  )
}

export default SalesOfOneMonth

'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format, startOfToday, subDays, startOfWeek, startOfMonth, endOfMonth, startOfYear } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

const quickRanges = [
  { label: 'Today', range: () => [startOfToday(), startOfToday()] },
  { label: 'Yesterday', range: () => [subDays(startOfToday(), 1), subDays(startOfToday(), 1)] },
  { label: 'This Week', range: () => [startOfWeek(new Date()), new Date()] },
  { label: 'Last 7 Days', range: () => [subDays(startOfToday(), 6), startOfToday()] },
  { label: 'Last 28 Days', range: () => [subDays(startOfToday(), 27), startOfToday()] },
  { label: 'This Month', range: () => [startOfMonth(new Date()), new Date()] },
  { label: 'Last Month', range: () => {
    const today = new Date()
    const start = startOfMonth(subDays(startOfMonth(today), 1))
    const end = endOfMonth(start)
    return [start, end]
  }},
  { label: 'This Year', range: () => [startOfYear(new Date()), new Date()] },
]

export default function DateRangeSelector({ onChange }) {
  const [range, setRange] = React.useState({ from: new Date(), to: new Date() })

  const handleRangeSelect = (selected) => {
    setRange(selected)
    onChange && onChange(selected)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <CalendarIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 flex gap-6" align="start">
        <div className="flex flex-col gap-2 text-sm w-40">
          {quickRanges.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="justify-start w-full"
              onClick={() => handleRangeSelect({ from: item.range()[0], to: item.range()[1] })}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <div className="">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

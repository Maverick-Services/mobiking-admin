'use client'

import React, { useState } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'

const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
]

export default function MonthSelector({ onChange }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleMonthSelect = (index) => {
    const year = selectedDate.getFullYear()
    const date = new Date(year, index, 1)

    const start = format(startOfMonth(date), 'yyyy-MM-dd')
    const end = format(endOfMonth(date), 'yyyy-MM-dd')

    setSelectedDate(date)
    onChange({ startDate: start, endDate: end, monthLabel: format(date, 'LLLL yyyy') })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <CalendarDays className="h-4 w-4" />
          {/* {format(selectedDate, 'LLLL yyyy')} */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="grid grid-cols-2 gap-2">
          {months.map((month, idx) => (
            <Button
              key={month}
              variant="ghost"
              className="w-full"
              onClick={() => handleMonthSelect(idx)}
            >
              {month}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

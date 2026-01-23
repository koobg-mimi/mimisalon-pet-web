'use client'

import * as React from 'react'
import { CalendarDays } from 'lucide-react'
import { format, isToday, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
  availableDates?: Date[] // Optional: specific dates that are available
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = '날짜를 선택하세요',
  disabled = false,
  minDate = new Date(),
  maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
  className,
  availableDates,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const isDateDisabled = (dateToCheck: Date) => {
    // Basic min/max date restrictions
    if (dateToCheck < minDate || dateToCheck > maxDate) {
      return true
    }

    // If availableDates is provided, only allow those dates
    if (availableDates && availableDates.length > 0) {
      return !availableDates.some((availableDate) => isSameDay(dateToCheck, availableDate))
    }

    return false
  }

  const formatSelectedDate = (selectedDate: Date) => {
    if (isToday(selectedDate)) {
      return `${format(selectedDate, 'yyyy년 M월 d일', { locale: ko })} (오늘)`
    }
    return format(selectedDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            'hover:bg-muted/50 transition-colors',
            className
          )}
          disabled={disabled}
        >
          <CalendarDays className="mr-2 h-4 w-4 opacity-50" />
          {date ? (
            <span className="font-medium">{formatSelectedDate(date)}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange?.(selectedDate)
            setOpen(false)
          }}
          disabled={isDateDisabled}
          initialFocus
          locale={ko}
          weekStartsOn={0} // Sunday
          showOutsideDays={false}
          fixedWeeks
          className="rounded-md"
          modifiers={{
            today: (date) => isToday(date),
          }}
          modifiersClassNames={{
            today: 'bg-accent text-accent-foreground font-semibold',
          }}
        />
        <div className="border-border border-t p-3">
          <p className="text-muted-foreground text-center text-xs">
            {availableDates
              ? '예약 가능한 날짜만 선택할 수 있습니다'
              : '최대 3개월 후까지 예약 가능합니다'}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  disabledDates?: Date[]
  className?: string
}

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function Calendar({ value, onChange, disabledDates, className }: CalendarProps) {
  const today = new Date()
  const [viewDate, setViewDate] = React.useState(
    value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const isDisabled = (date: Date): boolean => {
    if (!disabledDates) return false
    return disabledDates.some((d) => isSameDay(d, date))
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day)
    if (isDisabled(date)) return
    onChange?.(date)
  }

  const monthName = viewDate.toLocaleString("default", { month: "long" })

  const blanks: null[] = Array(firstDay).fill(null)
  const days: number[] = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const cells = [...blanks, ...days]

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background text-sm hover:bg-accent hover:text-accent-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {monthName} {year}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background text-sm hover:bg-accent hover:text-accent-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-muted-foreground h-8 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
        {cells.map((cell, index) => {
          if (cell === null) {
            return <div key={`blank-${index}`} className="h-8 w-8" />
          }
          const date = new Date(year, month, cell)
          const isSelected = value ? isSameDay(date, value) : false
          const isToday = isSameDay(date, today)
          const disabled = isDisabled(date)

          return (
            <button
              key={`day-${cell}`}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(cell)}
              className={cn(
                "h-8 w-8 rounded-md text-sm inline-flex items-center justify-center transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                !isSelected &&
                  isToday &&
                  "bg-accent text-accent-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {cell}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }

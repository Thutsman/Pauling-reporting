import {
  startOfWeek,
  endOfWeek,
  getISOWeek,
  format,
  addDays,
  getMonth,
  getYear,
} from 'date-fns'

export function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = startOfWeek(date, { weekStartsOn: 0 }) // Sunday
  const end = endOfWeek(date, { weekStartsOn: 0 })     // Saturday
  return { start, end }
}

export function getWeekNumber(date: Date): number {
  return getISOWeek(date)
}

export function getMonthName(month: number): string {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  return names[month - 1] || ''
}

export function getQuarterForMonth(month: number): number {
  return Math.ceil(month / 3)
}

export function formatWeekLabel(weekNumber: number, startDate: string): string {
  const start = new Date(startDate)
  const end = addDays(start, 6)
  return `Week ${weekNumber} (${format(start, 'MMM d')} - ${format(end, 'MMM d')})`
}

export function formatMonthYear(month: number, year: number): string {
  return `${getMonthName(month)} ${year}`
}

export function formatDateShort(date: Date): string {
  return format(date, 'MMM d, yyyy')
}

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function getCurrentMonth(): number {
  return getMonth(new Date()) + 1
}

export function getCurrentYear(): number {
  return getYear(new Date())
}

export function getMonthsInQuarter(quarter: number): number[] {
  const start = (quarter - 1) * 3 + 1
  return [start, start + 1, start + 2]
}

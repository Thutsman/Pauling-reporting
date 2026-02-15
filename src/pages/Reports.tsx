import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useMonthlySummary } from '@/hooks/useMonthlySummary'
import { supabase } from '@/lib/supabase'
import { exportToExcel, exportToPDF } from '@/lib/exportUtils'
import { formatCurrency } from '@/lib/formatters'
import { getMonthName } from '@/lib/dateUtils'
import { useToast } from '@/hooks/use-toast'
import type { WeeklyEntry, MonthlyEntry, CapexEntry } from '@/types/financial'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

export function Reports() {
  const [year, setYear] = useState(currentYear)
  const { summaries, loading, error, refetch } = useMonthlySummary(year)
  const { toast } = useToast()
  const [exporting, setExporting] = useState(false)
  const navigate = useNavigate()
  const isAuthError = error && (error.includes('JWT') || error.includes('refresh') || error.includes('401') || error.includes('PGRST301'))

  const handleExportExcel = async () => {
    setExporting(true)
    try {
      const { data: weeks } = await supabase
        .from('weekly_entries')
        .select('*')
        .eq('year', year)
        .order('week_number')
      const { data: monthly } = await supabase
        .from('monthly_entries')
        .select('*')
        .eq('year', year)
        .order('month')
      const { data: capex } = await supabase
        .from('capex_entries')
        .select('*')
        .eq('year', year)
        .order('month')

      const weeklyByMonth = new Map<string, WeeklyEntry[]>()
      ;(weeks ?? []).forEach((w: WeeklyEntry) => {
        const m = new Date(w.week_start_date).getMonth() + 1
        const key = `${w.year}-${m}`
        const list = weeklyByMonth.get(key) ?? []
        list.push(w)
        weeklyByMonth.set(key, list)
      })

      await exportToExcel(
        summaries,
        weeklyByMonth,
        (monthly ?? []) as MonthlyEntry[],
        (capex ?? []) as CapexEntry[],
        year
      )
      toast({ title: 'Excel exported successfully', variant: 'default' })
    } catch (err) {
      toast({
        title: 'Export failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setExporting(false)
    }
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      await exportToPDF(summaries, year)
      toast({ title: 'PDF exported successfully', variant: 'default' })
    } catch (err) {
      toast({
        title: 'Export failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Reports</h2>
          <p className="text-muted-foreground">
            Export financial data to Excel or PDF
          </p>
        </div>
<div className="flex flex-wrap items-center gap-2">
            <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v, 10))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExportExcel} disabled={exporting || loading}>
            Export Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF} disabled={exporting || loading}>
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <p className="text-muted-foreground">
                {isAuthError
                  ? 'Session expired. Please sign in again.'
                  : `Failed to load data: ${error}`}
              </p>
              <Button
                variant="outline"
                onClick={() => (isAuthError ? navigate('/login') : refetch())}
              >
                {isAuthError ? 'Sign in again' : 'Retry'}
              </Button>
            </div>
          ) : summaries.length === 0 ? (
            <p className="text-muted-foreground">No data for this year</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">COGS</TableHead>
                  <TableHead className="text-right">Gross Profit</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Net Profit</TableHead>
                  <TableHead className="text-right">Free Cash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{getMonthName(s.month)} {s.year}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.total_revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.total_cogs)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.gross_profit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.total_expenses)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.net_profit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(s.total_free_cash)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

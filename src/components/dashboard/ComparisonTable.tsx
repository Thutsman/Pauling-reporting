import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatPercentage, formatTrend } from '@/lib/formatters'
import type { ChangeMetric } from '@/types/financial'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WeekComparison, MonthComparison, QuarterComparison } from '@/types/financial'

function TrendIcon({ trend }: { trend: ChangeMetric['trend'] }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
}

function ChangeCell({
  metric,
  positiveIsGood,
}: {
  metric: ChangeMetric
  positiveIsGood: boolean
}) {
  const isPositive = metric.absolute_change > 0
  const color =
    metric.absolute_change === 0
      ? 'text-muted-foreground'
      : positiveIsGood
        ? isPositive
          ? 'text-green-600'
          : 'text-red-600'
        : isPositive
          ? 'text-red-600'
          : 'text-green-600'

  return (
    <TableCell className={cn('font-medium', color)}>
      <span className="flex items-center gap-1">
        <TrendIcon trend={metric.trend} />
        {formatTrend(metric.percentage_change)}
      </span>
    </TableCell>
  )
}

const WOW_ROWS: { label: string; key: keyof WeekComparison['changes']; positiveIsGood: boolean }[] = [
  { label: 'Total Revenue', key: 'total_revenue', positiveIsGood: true },
  { label: 'Cafe Revenue', key: 'cafe_revenue', positiveIsGood: true },
  { label: 'Hotel Revenue', key: 'hotel_revenue', positiveIsGood: true },
  { label: 'Car Hire Revenue', key: 'car_hire_revenue', positiveIsGood: true },
  { label: 'Total COGS', key: 'total_cogs', positiveIsGood: false },
  { label: 'Gross Profit', key: 'gross_profit', positiveIsGood: true },
  { label: 'COGS %', key: 'cogs_percentage', positiveIsGood: false },
]

const MOM_ROWS: { label: string; key: keyof MonthComparison['changes']; positiveIsGood: boolean }[] = [
  { label: 'Total Revenue', key: 'total_revenue', positiveIsGood: true },
  { label: 'Total COGS', key: 'total_cogs', positiveIsGood: false },
  { label: 'Gross Profit', key: 'gross_profit', positiveIsGood: true },
  { label: 'Total Expenses', key: 'total_expenses', positiveIsGood: false },
  { label: 'Net Profit', key: 'net_profit', positiveIsGood: true },
]

const QOQ_ROWS: { label: string; key: keyof QuarterComparison['changes']; positiveIsGood: boolean }[] = [
  { label: 'Total Revenue', key: 'total_revenue', positiveIsGood: true },
  { label: 'Total COGS', key: 'total_cogs', positiveIsGood: false },
  { label: 'Gross Profit', key: 'gross_profit', positiveIsGood: true },
  { label: 'Total Expenses', key: 'total_expenses', positiveIsGood: false },
  { label: 'Net Profit', key: 'net_profit', positiveIsGood: true },
]

interface ComparisonTableProps {
  weekComparison: WeekComparison | null
  monthComparison: MonthComparison | null
  quarterComparison: QuarterComparison | null
  loading?: boolean
}

export function ComparisonTable({
  weekComparison,
  monthComparison,
  quarterComparison,
  loading,
}: ComparisonTableProps) {
  const [activeTab, setActiveTab] = useState('mom')

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border bg-card p-4">
      <h3 className="mb-4 font-semibold">Comparisons</h3>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="wow" className="flex-1 sm:flex-none">WoW</TabsTrigger>
          <TabsTrigger value="mom" className="flex-1 sm:flex-none">MoM</TabsTrigger>
          <TabsTrigger value="qoq" className="flex-1 sm:flex-none">QoQ</TabsTrigger>
        </TabsList>
        <TabsContent value="wow" className="mt-4 overflow-x-auto">
          {!weekComparison ? (
            <p className="text-muted-foreground">No week-over-week data</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Previous</TableHead>
                  <TableHead>Change ($)</TableHead>
                  <TableHead>Change (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {WOW_ROWS.map(({ label, key, positiveIsGood }) => {
                  const m = weekComparison.changes[key]
                  return (
                    <TableRow key={key}>
                      <TableCell>{label}</TableCell>
                      <TableCell className="text-right">
                        {key === 'cogs_percentage'
                          ? formatPercentage(m.current_value)
                          : formatCurrency(m.current_value)}
                      </TableCell>
                      <TableCell className="text-right">
                        {key === 'cogs_percentage'
                          ? formatPercentage(m.previous_value)
                          : formatCurrency(m.previous_value)}
                      </TableCell>
                      <TableCell>
                        {key !== 'cogs_percentage' && formatCurrency(m.absolute_change)}
                      </TableCell>
                      <ChangeCell metric={m} positiveIsGood={positiveIsGood} />
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        <TabsContent value="mom" className="mt-4 overflow-x-auto">
          {!monthComparison ? (
            <p className="text-muted-foreground">No month-over-month data</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Previous</TableHead>
                  <TableHead>Change ($)</TableHead>
                  <TableHead>Change (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOM_ROWS.map(({ label, key, positiveIsGood }) => {
                  const m = monthComparison.changes[key]
                  return (
                    <TableRow key={key}>
                      <TableCell>{label}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(m.current_value)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(m.previous_value)}
                      </TableCell>
                      <TableCell>{formatCurrency(m.absolute_change)}</TableCell>
                      <ChangeCell metric={m} positiveIsGood={positiveIsGood} />
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        <TabsContent value="qoq" className="mt-4 overflow-x-auto">
          {!quarterComparison ? (
            <p className="text-muted-foreground">No quarter-over-quarter data</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Previous</TableHead>
                  <TableHead>Change ($)</TableHead>
                  <TableHead>Change (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {QOQ_ROWS.map(({ label, key, positiveIsGood }) => {
                  const m = quarterComparison.changes[key]
                  return (
                    <TableRow key={key}>
                      <TableCell>{label}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(m.current_value)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(m.previous_value)}
                      </TableCell>
                      <TableCell>{formatCurrency(m.absolute_change)}</TableCell>
                      <ChangeCell metric={m} positiveIsGood={positiveIsGood} />
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

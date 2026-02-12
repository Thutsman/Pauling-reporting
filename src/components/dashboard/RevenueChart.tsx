import { useMemo } from 'react'
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/formatters'
import type { RevenueBreakdown } from '@/types/financial'
const CAFE_COLOR = '#3b82f6'
const HOTEL_COLOR = '#22c55e'
const CAR_HIRE_COLOR = '#f59e0b'

interface RevenueChartProps {
  data: RevenueBreakdown[]
  loading?: boolean
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      name: d.date,
    }))
  }, [data])

  if (loading) {
    return <Skeleton className="h-80 w-full" />
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-muted-foreground">No revenue data available</p>
      </div>
    )
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number | undefined) => value != null ? formatCurrency(value) : ''}
            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
          />
          <Legend />
          <Bar dataKey="cafe" name="Cafe" stackId="a" fill={CAFE_COLOR} />
          <Bar dataKey="hotel" name="Hotel" stackId="a" fill={HOTEL_COLOR} />
          <Bar dataKey="car_hire" name="Car Hire" stackId="a" fill={CAR_HIRE_COLOR} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

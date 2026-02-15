import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/formatters'
import type { WaterfallData } from '@/types/financial'

interface WaterfallChartProps {
  data: WaterfallData[]
  loading?: boolean
}

export function WaterfallChart({ data, loading }: WaterfallChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      fill: d.type === 'positive' ? '#22c55e' : d.type === 'negative' ? '#ef4444' : '#3b82f6',
    }))
  }, [data])

  if (loading) {
    return <Skeleton className="h-80 w-full" />
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-muted-foreground">No P&L data available</p>
      </div>
    )
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} />
          <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number | undefined) => value != null ? formatCurrency(value) : ''}
            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
          />
          <Bar dataKey="value" name="Amount">
            {chartData.map((_, i) => (
              <Cell key={i} fill={chartData[i].fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

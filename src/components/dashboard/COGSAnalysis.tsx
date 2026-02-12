import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/formatters'
import type { COGSBreakdown } from '@/types/financial'

const COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#6366f1',
]

interface COGSAnalysisProps {
  pieData: COGSBreakdown[]
  trendData: { month: number; cogs_percentage: number }[]
  loading?: boolean
}

export function COGSAnalysis({ pieData, trendData, loading }: COGSAnalysisProps) {
  const pieChartData = useMemo(() => {
    return pieData
      .filter((d) => d.amount > 0)
      .map((d, i) => ({
        ...d,
        fill: COLORS[i % COLORS.length],
      }))
  }, [pieData])

  const lineChartData = useMemo(() => {
    return trendData.map((d) => ({
      month: `M${d.month}`,
      cogs: d.cogs_percentage,
    }))
  }, [trendData])

  if (loading) {
    return <Skeleton className="h-80 w-full" />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 font-semibold">COGS by Category</h3>
        {pieChartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            No COGS data
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={false}
                >
                  {pieChartData.map((_, i) => (
                    <Cell key={i} fill={pieChartData[i].fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number | undefined) => v != null ? formatCurrency(v) : ''} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 font-semibold">COGS % Trend</h3>
        {lineChartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            No trend data
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number | undefined) => v != null ? [`${v}%`, 'COGS %'] : ''} />
                <Line type="monotone" dataKey="cogs" stroke="#3b82f6" strokeWidth={2} name="COGS %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

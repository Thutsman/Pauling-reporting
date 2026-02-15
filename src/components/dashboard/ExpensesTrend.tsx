import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/formatters'
import type { ExpenseTrend } from '@/types/financial'

const COLORS = {
  wages: '#3b82f6',
  utilities: '#22c55e',
  taxes: '#f59e0b',
  other: '#ef4444',
  total: '#8b5cf6',
}

interface ExpensesTrendProps {
  data: ExpenseTrend[]
  loading?: boolean
}

export function ExpensesTrend({ data, loading }: ExpensesTrendProps) {
  const [visible, setVisible] = useState({
    wages: true,
    utilities: true,
    taxes: true,
    other: true,
    total: true,
  })

  const toggle = (key: keyof typeof visible) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) {
    return <Skeleton className="h-80 w-full" />
  }

  if (data.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['wages', 'utilities', 'taxes', 'other', 'total'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              visible[key]
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number | undefined) => v != null ? formatCurrency(v) : ''} />
            <Legend />
            {visible.wages && (
              <Line
                type="monotone"
                dataKey="wages"
                stroke={COLORS.wages}
                strokeWidth={2}
                name="Wages"
                dot={false}
              />
            )}
            {visible.utilities && (
              <Line
                type="monotone"
                dataKey="utilities"
                stroke={COLORS.utilities}
                strokeWidth={2}
                name="Utilities"
                dot={false}
              />
            )}
            {visible.taxes && (
              <Line
                type="monotone"
                dataKey="taxes"
                stroke={COLORS.taxes}
                strokeWidth={2}
                name="Taxes"
                dot={false}
              />
            )}
            {visible.other && (
              <Line
                type="monotone"
                dataKey="other"
                stroke={COLORS.other}
                strokeWidth={2}
                name="Other"
                dot={false}
              />
            )}
            {visible.total && (
              <Line
                type="monotone"
                dataKey="total"
                stroke={COLORS.total}
                strokeWidth={2}
                name="Total"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

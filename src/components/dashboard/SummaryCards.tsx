import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatPercentage } from '@/lib/formatters'
import type { DashboardSummary } from '@/types/financial'

interface SummaryCardsProps {
  summary: DashboardSummary | null
  loading?: boolean
}

const cardConfig = [
  {
    key: 'current_week_revenue',
    label: 'Current Week Revenue',
    getValue: (s: DashboardSummary) => s.current_week.revenue,
    format: formatCurrency,
    positiveIsGood: true,
  },
  {
    key: 'current_month_revenue',
    label: 'Current Month Revenue',
    getValue: (s: DashboardSummary) => s.current_month.revenue,
    format: formatCurrency,
    positiveIsGood: true,
  },
  {
    key: 'month_net_profit',
    label: 'Month Net Profit',
    getValue: (s: DashboardSummary) => s.current_month.net_profit,
    format: formatCurrency,
    positiveIsGood: true,
  },
  {
    key: 'month_cogs_pct',
    label: 'Month COGS %',
    getValue: (s: DashboardSummary) => s.current_month.cogs_percentage,
    format: formatPercentage,
    positiveIsGood: false,
  },
  {
    key: 'ytd_revenue',
    label: 'YTD Revenue',
    getValue: (s: DashboardSummary) => s.ytd.revenue,
    format: formatCurrency,
    positiveIsGood: true,
  },
  {
    key: 'ytd_net_profit',
    label: 'YTD Net Profit',
    getValue: (s: DashboardSummary) => s.ytd.net_profit,
    format: formatCurrency,
    positiveIsGood: true,
  },
]

export function SummaryCards({ summary, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cardConfig.map((c) => (
          <Card key={c.key}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cardConfig.map((c) => (
          <Card key={c.key}>
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">—</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cardConfig.map((c) => {
        let value: number
        try {
          value = c.getValue(summary)
        } catch {
          value = 0
        }
        const isValid = typeof value === 'number' && !Number.isNaN(value)
        return (
          <Card key={c.key}>
            <CardHeader className="pb-2">
              <p className="truncate text-sm font-medium text-muted-foreground">{c.label}</p>
            </CardHeader>
            <CardContent>
              <p className="truncate text-xl font-bold sm:text-2xl">
                {isValid ? c.format(value) : '—'}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

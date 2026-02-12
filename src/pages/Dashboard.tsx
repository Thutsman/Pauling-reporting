import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFilterStore } from '@/stores/filterStore'
import { useDashboard } from '@/hooks/useDashboard'
import { useComparisons } from '@/hooks/useComparisons'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { COGSAnalysis } from '@/components/dashboard/COGSAnalysis'
import { WaterfallChart } from '@/components/dashboard/WaterfallChart'
import { ComparisonTable } from '@/components/dashboard/ComparisonTable'
import { ExpensesTrend } from '@/components/dashboard/ExpensesTrend'
import { CapexTracker } from '@/components/dashboard/CapexTracker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

export function Dashboard() {
  const fiscalYear = useFilterStore((s) => s.fiscalYear)
  const setFiscalYear = useFilterStore((s) => s.setFiscalYear)

  const {
    dashboardSummary,
    revenueBreakdown,
    cogsBreakdown,
    cogsTrend,
    waterfallData,
    expenseTrends,
    loading,
  } = useDashboard()

  const { weekComparison, monthComparison, quarterComparison, loading: comparisonsLoading } =
    useComparisons(fiscalYear)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Financial overview and analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Fiscal Year</span>
          <Select value={fiscalYear.toString()} onValueChange={(v) => setFiscalYear(parseInt(v, 10))}>
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
        </div>
      </div>

      <SummaryCards summary={dashboardSummary} loading={loading} />

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">
            Stacked by business unit (Cafe, Hotel, Car Hire)
          </p>
        </CardHeader>
        <CardContent>
          <RevenueChart data={revenueBreakdown} loading={loading} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>COGS Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <COGSAnalysis
              pieData={cogsBreakdown}
              trendData={cogsTrend}
              loading={loading}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>P&L Waterfall</CardTitle>
            <p className="text-sm text-muted-foreground">
              Revenue to Net Profit cascade
            </p>
          </CardHeader>
          <CardContent>
            <WaterfallChart data={waterfallData} loading={loading} />
          </CardContent>
        </Card>
      </div>

      <ComparisonTable
        weekComparison={weekComparison}
        monthComparison={monthComparison}
        quarterComparison={quarterComparison}
        loading={comparisonsLoading}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensesTrend data={expenseTrends} loading={loading} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CAPEX Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <CapexTracker />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

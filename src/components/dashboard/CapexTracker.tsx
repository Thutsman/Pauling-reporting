import { useMemo } from 'react'
import { useFilterStore } from '@/stores/filterStore'
import { supabase } from '@/lib/supabase'
import { useQuery } from '@/hooks/useDashboardData'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/formatters'
import type { CapexEntry } from '@/types/financial'
import { CAPEX_FIELDS } from '@/lib/constants'

const CAPEX_AMOUNT_KEYS = [
  'icombi_ovens',
  'seating_area_expansion',
  'aluminium_patio_seating',
  'airconditioning',
  'art_soft_furnishings',
  'landscaping_plants',
  'training_consulting',
  'cold_chain_facilities',
  'refrigerators',
  'building_improvements',
  'outstanding_creditors',
  'st_faiths',
  'wood_furniture_replacements',
  'legal_retainer',
  'licensing',
] as const

export function CapexTracker() {
  const fiscalYear = useFilterStore((s) => s.fiscalYear)
  const [entries, loading] = useQuery(
    async () => {
      const { data } = await supabase
        .from('capex_entries')
        .select('*')
        .eq('year', fiscalYear)
        .order('month', { ascending: true })
      return (data ?? []) as CapexEntry[]
    },
    [fiscalYear]
  )

  const { byCategory, total, monthlyTable } = useMemo(() => {
    const list = entries ?? []
    const byCategory: Record<string, number> = {}
    CAPEX_AMOUNT_KEYS.forEach((key) => {
      const label = CAPEX_FIELDS[key]?.label ?? key
      byCategory[label] = list.reduce((sum, e) => sum + (e[key] as number), 0)
    })
    const total = list.reduce((sum, e) => sum + e.total_capex, 0)
    const monthlyTable = list.map((e) => ({
      month: e.month,
      year: e.year,
      total: e.total_capex,
    }))
    return { byCategory, total, monthlyTable }
  }, [entries])

  if (loading) {
    return <Skeleton className="h-80 w-full" />
  }

  const categories = Object.entries(byCategory).filter(([, v]) => v > 0)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold">YTD CAPEX by Category</h3>
        <div className="space-y-2">
          {categories.map(([label, amount]) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: total > 0 ? `${(amount / total) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-medium">
          Total YTD: {formatCurrency(total)}
        </p>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Monthly Timeline</h3>
        <div className="max-h-40 overflow-auto rounded border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-2 text-left">Month</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTable.map(({ month, year, total: t }) => (
                <tr key={`${year}-${month}`} className="border-b">
                  <td className="p-2">
                    {month}/{year}
                  </td>
                  <td className="p-2 text-right">{formatCurrency(t)}</td>
                </tr>
              ))}
              {monthlyTable.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-muted-foreground">
                    No CAPEX entries this year
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { buildChangeMetric, buildQuarterSummary } from '@/lib/calculations'
import type {
  WeeklyEntry,
  MonthlySummary,
  WeekComparison,
  MonthComparison,
  QuarterComparison,
} from '@/types/financial'

export function useComparisons(year: number) {
  const [weekComparison, setWeekComparison] = useState<WeekComparison | null>(null)
  const [monthComparison, setMonthComparison] = useState<MonthComparison | null>(null)
  const [quarterComparison, setQuarterComparison] = useState<QuarterComparison | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchWeekComparison = useCallback(async () => {
    const { data: weeks } = await supabase
      .from('weekly_entries')
      .select('*')
      .eq('year', year)
      .order('week_number', { ascending: false })
      .limit(2)

    const entries = (weeks ?? []) as WeeklyEntry[]
    const current = entries[0]
    const previous = entries[1] ?? null

    if (!current) {
      setWeekComparison(null)
      return
    }

    setWeekComparison({
      current_week: current,
      previous_week: previous,
      changes: {
        total_revenue: buildChangeMetric(
          current.total_revenue,
          previous?.total_revenue ?? 0
        ),
        cafe_revenue: buildChangeMetric(
          current.bowery_cafe_revenue,
          previous?.bowery_cafe_revenue ?? 0
        ),
        hotel_revenue: buildChangeMetric(
          current.hotel_revenue,
          previous?.hotel_revenue ?? 0
        ),
        car_hire_revenue: buildChangeMetric(
          current.car_hire_revenue,
          previous?.car_hire_revenue ?? 0
        ),
        total_cogs: buildChangeMetric(
          current.total_cogs,
          previous?.total_cogs ?? 0
        ),
        gross_profit: buildChangeMetric(
          current.gross_profit,
          previous?.gross_profit ?? 0
        ),
        cogs_percentage: buildChangeMetric(
          current.cogs_percentage,
          previous?.cogs_percentage ?? 0
        ),
      },
    })
  }, [year])

  const fetchMonthComparison = useCallback(async () => {
    const { data: months } = await supabase
      .from('monthly_summary')
      .select('*')
      .eq('year', year)
      .order('month', { ascending: false })
      .limit(2)

    const entries = (months ?? []) as MonthlySummary[]
    const current = entries[0]
    const previous = entries[1] ?? null

    if (!current) {
      setMonthComparison(null)
      return
    }

    setMonthComparison({
      current_month: current,
      previous_month: previous,
      changes: {
        total_revenue: buildChangeMetric(
          current.total_revenue,
          previous?.total_revenue ?? 0
        ),
        total_cogs: buildChangeMetric(
          current.total_cogs,
          previous?.total_cogs ?? 0
        ),
        gross_profit: buildChangeMetric(
          current.gross_profit,
          previous?.gross_profit ?? 0
        ),
        total_expenses: buildChangeMetric(
          current.total_expenses,
          previous?.total_expenses ?? 0
        ),
        net_profit: buildChangeMetric(
          current.net_profit,
          previous?.net_profit ?? 0
        ),
      },
    })
  }, [year])

  const fetchQuarterComparison = useCallback(async () => {
    const { data: currYearMonths } = await supabase
      .from('monthly_summary')
      .select('*')
      .eq('year', year)
      .order('month', { ascending: true })
    const { data: prevYearMonths } = await supabase
      .from('monthly_summary')
      .select('*')
      .eq('year', year - 1)
      .order('month', { ascending: true })

    const currSummaries = (currYearMonths ?? []) as MonthlySummary[]
    const prevSummaries = (prevYearMonths ?? []) as MonthlySummary[]

    const currentQuarterNum = Math.ceil((new Date().getMonth() + 1) / 3)
    const prevQuarterNum = currentQuarterNum === 1 ? 4 : currentQuarterNum - 1
    const prevYear = currentQuarterNum === 1 ? year - 1 : year

    const qMonths = (q: number) => [(q - 1) * 3 + 1, (q - 1) * 3 + 2, (q - 1) * 3 + 3]
    const currentMonths = currSummaries.filter((m) =>
      qMonths(currentQuarterNum).includes(m.month)
    )
    const prevMonths = prevSummaries.filter((m) =>
      qMonths(prevQuarterNum).includes(m.month)
    )

    const currentQuarter = buildQuarterSummary(
      currentMonths,
      currentQuarterNum,
      year
    )
    const previousQuarter = prevMonths.length > 0
      ? buildQuarterSummary(prevMonths, prevQuarterNum, prevYear)
      : null

    setQuarterComparison({
      current_quarter: currentQuarter,
      previous_quarter: previousQuarter,
      changes: {
        total_revenue: buildChangeMetric(
          currentQuarter.total_revenue,
          previousQuarter?.total_revenue ?? 0
        ),
        total_cogs: buildChangeMetric(
          currentQuarter.total_cogs,
          previousQuarter?.total_cogs ?? 0
        ),
        gross_profit: buildChangeMetric(
          currentQuarter.gross_profit,
          previousQuarter?.gross_profit ?? 0
        ),
        total_expenses: buildChangeMetric(
          currentQuarter.total_expenses,
          previousQuarter?.total_expenses ?? 0
        ),
        net_profit: buildChangeMetric(
          currentQuarter.net_profit,
          previousQuarter?.net_profit ?? 0
        ),
      },
    })
  }, [year])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchWeekComparison(),
      fetchMonthComparison(),
      fetchQuarterComparison(),
    ]).finally(() => setLoading(false))
  }, [fetchWeekComparison, fetchMonthComparison, fetchQuarterComparison])

  return {
    weekComparison,
    monthComparison,
    quarterComparison,
    loading,
  }
}

import { useMemo } from 'react'
import { useFilterStore } from '@/stores/filterStore'
import { useMonthlySummary } from './useMonthlySummary'
import { supabase } from '@/lib/supabase'
import { useQuery } from './useDashboardData'
import type {
  RevenueBreakdown,
  COGSBreakdown,
  ExpenseTrend,
  WaterfallData,
  DashboardSummary,
} from '@/types/financial'
import {
  aggregateWeeklyToMonthly,
  buildCOGSBreakdown,
  buildWaterfallData,
  buildExpenseTrends,
} from '@/lib/calculations'
import type { WeeklyEntry, MonthlyEntry } from '@/types/financial'

function useWeeklyEntries(year: number) {
  return useQuery(async () => {
    const { data } = await supabase
      .from('weekly_entries')
      .select('*')
      .eq('year', year)
      .order('week_number', { ascending: true })
    return (data ?? []) as WeeklyEntry[]
  }, [year])
}

function useMonthlyEntries(year: number) {
  return useQuery(async () => {
    const { data } = await supabase
      .from('monthly_entries')
      .select('*')
      .eq('year', year)
      .order('month', { ascending: true })
    return (data ?? []) as MonthlyEntry[]
  }, [year])
}

export function useDashboard() {
  const fiscalYear = useFilterStore((s) => s.fiscalYear)
  const { summaries, loading: summaryLoading } = useMonthlySummary(fiscalYear)
  const [weeklyData, weeklyLoading] = useWeeklyEntries(fiscalYear)
  const [monthlyData, monthlyLoading] = useMonthlyEntries(fiscalYear)

  const weeklyEntries = weeklyData ?? []
  const monthlyEntries = monthlyData ?? []
  const loading = summaryLoading || weeklyLoading || monthlyLoading

  const dashboardSummary = useMemo((): DashboardSummary | null => {
    if (summaries.length === 0) return null
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const currentWeekNum = Math.ceil(now.getDate() / 7)
    const currentMonthSummary = summaries.find(
      (s) => s.month === currentMonth && s.year === currentYear
    )
    const currentWeekEntry = weeklyEntries.find(
      (w) => w.year === currentYear && w.week_number === currentWeekNum
    )

    const ytdSummaries = summaries.filter((s) => s.year === fiscalYear)
    const ytd = ytdSummaries.reduce(
      (acc, s) => ({
        revenue: acc.revenue + s.total_revenue,
        cogs: acc.cogs + s.total_cogs,
        gross_profit: acc.gross_profit + s.gross_profit,
        expenses: acc.expenses + s.total_expenses,
        net_profit: acc.net_profit + s.net_profit,
      }),
      { revenue: 0, cogs: 0, gross_profit: 0, expenses: 0, net_profit: 0 }
    )

    return {
      current_week: {
        revenue: currentWeekEntry?.total_revenue ?? 0,
        cogs: currentWeekEntry?.total_cogs ?? 0,
        gross_profit: currentWeekEntry?.gross_profit ?? 0,
        cogs_percentage: currentWeekEntry?.cogs_percentage ?? 0,
      },
      current_month: {
        revenue: currentMonthSummary?.total_revenue ?? 0,
        cogs: currentMonthSummary?.total_cogs ?? 0,
        gross_profit: currentMonthSummary?.gross_profit ?? 0,
        expenses: currentMonthSummary?.total_expenses ?? 0,
        net_profit: currentMonthSummary?.net_profit ?? 0,
        cogs_percentage: currentMonthSummary?.cogs_percentage ?? 0,
      },
      ytd,
    }
  }, [summaries, weeklyEntries, fiscalYear])

  const revenueBreakdown = useMemo((): RevenueBreakdown[] => {
    return summaries.map((s) => {
      const weeks = weeklyEntries.filter(
        (w) => w.year === s.year && new Date(w.week_end_date).getMonth() + 1 === s.month
      )
      const agg = aggregateWeeklyToMonthly(weeks)
      return {
        date: `M${s.month}`,
        cafe: agg.cafeRevenue,
        hotel: agg.hotelRevenue,
        car_hire: agg.carHireRevenue,
        total: s.total_revenue,
      }
    })
  }, [summaries, weeklyEntries])

  const cogsBreakdown = useMemo((): COGSBreakdown[] => {
    if (weeklyEntries.length === 0) return []
    const latestWeek = weeklyEntries[weeklyEntries.length - 1]
    return buildCOGSBreakdown(latestWeek)
  }, [weeklyEntries])

  const cogsTrend = useMemo(() => {
    return summaries.map((s) => ({
      month: s.month,
      cogs_percentage: s.cogs_percentage,
    }))
  }, [summaries])

  const waterfallData = useMemo((): WaterfallData[] => {
    const latest = summaries[summaries.length - 1]
    if (!latest) return []
    return buildWaterfallData(latest)
  }, [summaries])

  const expenseTrends = useMemo((): ExpenseTrend[] => {
    return buildExpenseTrends(monthlyEntries)
  }, [monthlyEntries])

  return {
    dashboardSummary,
    revenueBreakdown,
    cogsBreakdown,
    cogsTrend,
    waterfallData,
    expenseTrends,
    summaries,
    weeklyEntries,
    monthlyEntries,
    loading,
    fiscalYear,
  }
}

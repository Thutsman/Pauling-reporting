import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { MonthlyEntry, MonthlyEntryInput } from '@/types/financial'

async function recomputeSummary(month: number, year: number) {
  await supabase.rpc('recompute_monthly_summary', { p_month: month, p_year: year })
}

export function useMonthlyData() {
  const userId = useAuthStore((s) => s.user?.id)
  const [entries, setEntries] = useState<MonthlyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('monthly_entries')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(24)
    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }
    setEntries((data ?? []) as MonthlyEntry[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const create = useCallback(
    async (input: MonthlyEntryInput) => {
      if (!userId) throw new Error('Not authenticated')
      const { data, error: err } = await supabase
        .from('monthly_entries')
        .insert({
          ...input,
          created_by: userId,
        })
        .select('*')
        .single()
      if (err) throw err
      await recomputeSummary(input.month, input.year)
      return data as MonthlyEntry
    },
    [userId]
  )

  const update = useCallback(
    async (id: string, input: Partial<MonthlyEntryInput>) => {
      if (!userId) throw new Error('Not authenticated')
      const { data, error: err } = await supabase
        .from('monthly_entries')
        .update(input)
        .eq('id', id)
        .eq('created_by', userId)
        .select('*')
        .single()
      if (err) throw err
      const entry = data as MonthlyEntry
      await recomputeSummary(entry.month, entry.year)
      return entry
    },
    [userId]
  )

  const getByMonthYear = useCallback(
    async (month: number, year: number): Promise<MonthlyEntry | null> => {
      const { data, error: err } = await supabase
        .from('monthly_entries')
        .select('*')
        .eq('month', month)
        .eq('year', year)
        .single()
      if (err || !data) return null
      return data as MonthlyEntry
    },
    []
  )

  return {
    entries,
    loading,
    error,
    create,
    update,
    getByMonthYear,
    refetch: fetchEntries,
  }
}

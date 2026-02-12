import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { WeeklyEntry, WeeklyEntryInput } from '@/types/financial'

export function useWeeklyData() {
  const userId = useAuthStore((s) => s.user?.id)
  const [entries, setEntries] = useState<WeeklyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('weekly_entries')
      .select('*')
      .order('year', { ascending: false })
      .order('week_number', { ascending: false })
      .limit(50)
    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }
    setEntries((data ?? []) as WeeklyEntry[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  useEffect(() => {
    const channel = supabase
      .channel('weekly_entries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weekly_entries' }, () => {
        fetchEntries()
      })
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR' && err) {
          console.warn('[Realtime] weekly_entries subscription failed, using REST only:', err.message)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchEntries])

  const recomputeSummary = useCallback(async (month: number, year: number) => {
    await supabase.rpc('recompute_monthly_summary', { p_month: month, p_year: year })
  }, [])

  const create = useCallback(
    async (input: WeeklyEntryInput, status: 'draft' | 'submitted' = 'draft') => {
      if (!userId) throw new Error('Not authenticated')
      const { data, error: err } = await supabase
        .from('weekly_entries')
        .insert({
          ...input,
          created_by: userId,
          status,
        })
        .select('*')
        .single()
      if (err) throw err
      const month = new Date(input.week_start_date).getMonth() + 1
      const year = new Date(input.week_start_date).getFullYear()
      await recomputeSummary(month, year)
      return (data as WeeklyEntry)
    },
    [userId, recomputeSummary]
  )

  const update = useCallback(
    async (id: string, input: Partial<WeeklyEntryInput>, status?: 'draft' | 'submitted') => {
      if (!userId) throw new Error('Not authenticated')
      const payload: Record<string, unknown> = { ...input }
      if (status !== undefined) payload.status = status
      const { data, error: err } = await supabase
        .from('weekly_entries')
        .update(payload)
        .eq('id', id)
        .eq('created_by', userId)
        .select('*')
        .single()
      if (err) throw err
      const entry = data as WeeklyEntry
      const month = new Date(entry.week_start_date).getMonth() + 1
      const year = entry.year
      await recomputeSummary(month, year)
      return entry
    },
    [userId, recomputeSummary]
  )

  const remove = useCallback(async (id: string) => {
    const entry = entries.find((e) => e.id === id)
    if (!entry) throw new Error('Entry not found')
    const { error: err } = await supabase
      .from('weekly_entries')
      .delete()
      .eq('id', id)
    if (err) throw err
    await recomputeSummary(new Date(entry.week_start_date).getMonth() + 1, entry.year)
  }, [entries])

  const getById = useCallback(
    async (id: string): Promise<WeeklyEntry | null> => {
      const { data, error: err } = await supabase
        .from('weekly_entries')
        .select('*')
        .eq('id', id)
        .single()
      if (err || !data) return null
      return data as WeeklyEntry
    },
    []
  )

  const recentEntries = entries.slice(0, 8)

  return {
    entries,
    recentEntries,
    loading,
    error,
    create,
    update,
    remove,
    getById,
    refetch: fetchEntries,
  }
}

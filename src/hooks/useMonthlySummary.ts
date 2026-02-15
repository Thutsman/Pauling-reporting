import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { MonthlySummary } from '@/types/financial'

// Module-level cache so data persists across route navigation
const summaryCache = new Map<number, MonthlySummary[]>()

export function useMonthlySummary(year: number) {
  const cached = summaryCache.get(year)
  const [summaries, setSummaries] = useState<MonthlySummary[]>(cached ?? [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<string | null>(null)
  const yearRef = useRef(year)
  yearRef.current = year

  const fetchSummaries = useCallback(async (showLoading = true) => {
    if (showLoading && !summaryCache.has(yearRef.current)) setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('monthly_summary')
        .select('*')
        .eq('year', yearRef.current)
        .order('month', { ascending: true })
      if (fetchError) {
        setError(fetchError.message)
        return
      }
      const result = (data ?? []) as MonthlySummary[]
      summaryCache.set(yearRef.current, result)
      setSummaries(result)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data when year changes
  useEffect(() => {
    // If we have cached data, show it immediately and refresh in background
    const cached = summaryCache.get(year)
    if (cached) {
      setSummaries(cached)
      setLoading(false)
      fetchSummaries(false) // background refresh
    } else {
      fetchSummaries(true)
    }
  }, [year, fetchSummaries])

  // Realtime subscription — stable lifecycle, won't re-create on year change
  useEffect(() => {
    const channel = supabase
      .channel(`monthly_summary_${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'monthly_summary' }, () => {
        fetchSummaries(false)
      })
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR' && err) {
          console.warn('[Realtime] monthly_summary subscription failed, using REST only:', err.message)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchSummaries])

  return {
    summaries,
    loading,
    error,
    refetch: fetchSummaries,
  }
}

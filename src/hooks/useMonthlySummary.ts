import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { MonthlySummary } from '@/types/financial'

export function useMonthlySummary(year: number) {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const yearRef = useRef(year)
  yearRef.current = year

  const fetchSummaries = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
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
      setSummaries((data ?? []) as MonthlySummary[])
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  // Fetch data when year changes
  useEffect(() => {
    fetchSummaries(true)
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

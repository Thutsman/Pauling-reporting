import { useEffect, useState, useCallback, useRef } from 'react'

export function useQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): [T | null, boolean] {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const hasData = useRef(false)

  const fetchData = useCallback(fetcher, deps)

  useEffect(() => {
    let cancelled = false
    // Only show full loading state on first fetch; subsequent fetches
    // keep showing stale data to avoid skeleton flash on re-navigation
    if (!hasData.current) setLoading(true)
    fetchData()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          hasData.current = true
        }
      })
      .catch(() => {
        if (!cancelled) setData(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [fetchData])

  return [data, loading]
}

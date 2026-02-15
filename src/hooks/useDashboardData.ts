import { useEffect, useState, useCallback } from 'react'

// Module-level cache so data persists across route navigation
const queryCache = new Map<string, unknown>()

export function useQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): [T | null, boolean] {
  const cacheKey = JSON.stringify(deps)
  const cached = queryCache.get(cacheKey) as T | undefined
  const [data, setData] = useState<T | null>(cached ?? null)
  const [loading, setLoading] = useState(!cached)

  const fetchData = useCallback(fetcher, deps)

  useEffect(() => {
    let cancelled = false
    const cached = queryCache.get(cacheKey)
    if (cached) {
      setData(cached as T)
      setLoading(false)
    } else {
      setLoading(true)
    }
    fetchData()
      .then((result) => {
        if (!cancelled) {
          queryCache.set(cacheKey, result)
          setData(result)
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
  }, [fetchData, cacheKey])

  return [data, loading]
}

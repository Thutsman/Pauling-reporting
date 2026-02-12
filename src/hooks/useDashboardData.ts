import { useEffect, useState, useCallback } from 'react'

export function useQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): [T | null, boolean] {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(fetcher, deps)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchData()
      .then((result) => {
        if (!cancelled) {
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
  }, [fetchData])

  return [data, loading]
}

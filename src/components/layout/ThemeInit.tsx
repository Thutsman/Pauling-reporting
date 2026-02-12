import { useEffect } from 'react'

const STORAGE_KEY = 'pauling-theme'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): 'light' | 'dark' | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return null
}

export function ThemeInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = getStoredTheme() ?? getSystemTheme()
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])

  return <>{children}</>
}

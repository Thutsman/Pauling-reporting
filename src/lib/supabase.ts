import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Safari (especially iOS) has a buggy navigator.locks implementation that can
// cause infinite deadlocks when Supabase acquires locks during auth operations.
// Detect Safari and disable the lock mechanism to fall back to a tab-based
// approach that avoids the deadlock entirely.
const isSafari = typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authOptions: any = isSafari
  ? { lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<unknown>) => await fn() }
  : {}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: authOptions,
})

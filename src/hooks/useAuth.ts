import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types/financial'

async function fetchUserRole(userId: string): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  if (error) return null
  return data?.role as UserRole ?? null
}

// Standalone auth actions — safe to call from any component without creating subscriptions.
// These run OUTSIDE the onAuthStateChange callback, so they don't deadlock with Supabase's
// internal navigator.locks that are held during signInWithPassword.
export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  // Don't fetch role here — the onAuthStateChange callback handles it.
  // Calling supabase.from() inside signIn would deadlock because
  // signInWithPassword holds a lock that getSession() also needs.
}

export async function signUp(email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
}

export async function signOut() {
  await supabase.auth.signOut()
  useAuthStore.getState().reset()
}

// Hook — only call this ONCE in App to manage the auth subscription.
// Do NOT call from Login or other pages.
export function useAuth() {
  const { setUser, setRole, setLoading } = useAuthStore()

  useEffect(() => {
    let mounted = true
    let initialized = false

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // IMPORTANT: This callback must be synchronous (no await) to avoid
        // deadlocking with Supabase's internal navigator.locks.
        // Defer async work (fetchUserRole) outside the callback.
        if (!mounted) return
        if (session?.user) {
          setUser(session.user)
          // Fetch role asynchronously outside the lock context.
          // On iOS/Safari the request can hang or fail; always clear loading and set role (or null).
          const rolePromise = Promise.race([
            fetchUserRole(session.user.id),
            new Promise<UserRole | null>((_, reject) =>
              setTimeout(() => reject(new Error('Role fetch timeout')), 8000)
            ),
          ])
          rolePromise
            .then((role) => {
              if (!mounted) return
              setRole(role)
              initialized = true
              setLoading(false)
            })
            .catch(() => {
              if (!mounted) return
              setRole(null)
              initialized = true
              setLoading(false)
            })
        } else {
          setUser(null)
          setRole(null)
          initialized = true
          setLoading(false)
        }
      }
    )

    // Safety net: if auth hasn't resolved after 3s, stop loading
    const timeout = setTimeout(() => {
      if (!initialized && mounted) {
        setLoading(false)
      }
    }, 3000)

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [setUser, setRole, setLoading])
}

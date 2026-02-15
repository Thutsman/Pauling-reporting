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

export function useAuth() {
  const { setUser, setRole, setLoading } = useAuthStore()

  useEffect(() => {
    let mounted = true
    let initialized = false

    // Use onAuthStateChange as the single source of truth.
    // Supabase v2 fires INITIAL_SESSION immediately, so no need for getSession().
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return
        if (session?.user) {
          setUser(session.user)
          const role = await fetchUserRole(session.user.id)
          if (!mounted) return
          setRole(role)
        } else {
          setUser(null)
          setRole(null)
        }
        initialized = true
        setLoading(false)
      }
    )

    // Safety net: if onAuthStateChange hasn't fired after 5s, stop loading
    const timeout = setTimeout(() => {
      if (!initialized && mounted) {
        setLoading(false)
      }
    }, 5000)

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [setUser, setRole, setLoading])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setLoading(false)
      throw error
    }
    if (data.user) {
      const role = await fetchUserRole(data.user.id)
      setUser(data.user)
      setRole(role)
    }
    setLoading(false)
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setLoading(false)
      throw error
    }
    if (data.user) {
      const role = await fetchUserRole(data.user.id)
      setUser(data.user)
      setRole(role)
    }
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    useAuthStore.getState().reset()
  }

  return { signIn, signUp, signOut }
}

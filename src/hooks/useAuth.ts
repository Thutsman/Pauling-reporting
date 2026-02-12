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

    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      if (session?.user) {
        setUser(session.user)
        const role = await fetchUserRole(session.user.id)
        setRole(role)
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return
        if (session?.user) {
          setUser(session.user)
          const role = await fetchUserRole(session.user.id)
          setRole(role)
        } else {
          setUser(null)
          setRole(null)
        }
        setLoading(false)
      }
    )

    return () => {
      mounted = false
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

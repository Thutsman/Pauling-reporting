import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/types/financial'

interface AuthState {
  user: User | null
  role: UserRole | null
  loading: boolean
  setUser: (user: User | null) => void
  setRole: (role: UserRole | null) => void
  setLoading: (loading: boolean) => void
  isAuthenticated: () => boolean
  isBranchManager: () => boolean
  isBusinessOwner: () => boolean
  reset: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  role: null,
  loading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),
  isAuthenticated: () => get().user !== null,
  isBranchManager: () => get().role === 'branch_manager',
  isBusinessOwner: () => get().role === 'business_owner',
  reset: () => set({ user: null, role: null, loading: false }),
}))

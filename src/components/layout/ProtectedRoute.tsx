import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types/financial'

interface ProtectedRouteProps {
  requiredRole?: UserRole
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, role, loading } = useAuthStore()
  const location = useLocation()

  // Show spinner only while auth is still loading. If loading is done and we have user but no role
  // (e.g. role fetch failed or timed out on iOS), redirect to login to avoid infinite spinner.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && role !== requiredRole) {
    const defaultPath = role === 'branch_manager' ? '/weekly-entry' : '/dashboard'
    return <Navigate to={defaultPath} replace />
  }

  return <Outlet />
}

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types/financial'

interface ProtectedRouteProps {
  requiredRole?: UserRole
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, role, loading } = useAuthStore()
  const location = useLocation()

  // Show spinner while auth is resolving OR while user is set but role hasn't loaded yet.
  // This prevents the brief flash of wrong content (e.g. branch_manager seeing Dashboard).
  if (loading || (user && !role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && role !== requiredRole) {
    const defaultPath = role === 'branch_manager' ? '/weekly-entry' : '/dashboard'
    return <Navigate to={defaultPath} replace />
  }

  return <Outlet />
}

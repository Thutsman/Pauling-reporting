import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { WeeklyEntry } from '@/pages/WeeklyEntry'
import { MonthlyEntry } from '@/pages/MonthlyEntry'
import { Reports } from '@/pages/Reports'

function DefaultRedirect() {
  const { role, loading } = useAuthStore()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }
  if (!role) {
    return <Navigate to="/login" replace />
  }
  const defaultPath = role === 'branch_manager' ? '/weekly-entry' : '/dashboard'
  return <Navigate to={defaultPath} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="business_owner" />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/reports" element={<Reports />} />
          <Route element={<ProtectedRoute requiredRole="branch_manager" />}>
            <Route path="/weekly-entry" element={<WeeklyEntry />} />
            <Route path="/weekly-entry/:id" element={<WeeklyEntry />} />
            <Route path="/monthly-entry" element={<MonthlyEntry />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  )
}

export default function App() {
  useAuth()

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types/financial'

const navItems: { to: string; label: string; icon: typeof LayoutDashboard; roles: UserRole[] }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['business_owner'] },
  { to: '/weekly-entry', label: 'Weekly Entry', icon: Calendar, roles: ['branch_manager'] },
  { to: '/monthly-entry', label: 'Monthly Entry', icon: Calendar, roles: ['branch_manager'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['branch_manager', 'business_owner'] },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const role = useAuthStore((s) => s.role)

  const visibleItems = navItems.filter((item) =>
    role && item.roles.includes(role)
  )

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    )

  return (
    <nav className="flex flex-col gap-1">
      {visibleItems.map((item) => {
        const Icon = item.icon
        return (
        <NavLink
          key={item.to}
          to={item.to}
          className={linkClass}
          onClick={onNavigate}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {item.label}
        </NavLink>
        )
      })}
    </nav>
  )
}

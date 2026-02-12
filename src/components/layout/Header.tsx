import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Moon, Sun, LogOut } from 'lucide-react'

interface HeaderProps {
  title: string
  mobileMenu?: React.ReactNode
}

export function Header({ title, mobileMenu }: HeaderProps) {
  const { toggleTheme, theme } = useTheme()
  const { signOut } = useAuth()
  const user = useAuthStore((s) => s.user)

  const initials = user?.email
    ?.slice(0, 2)
    .toUpperCase()
    .padEnd(2, '?') ?? '?'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {mobileMenu && <div className="shrink-0 md:hidden">{mobileMenu}</div>}
        <h1 className="min-w-0 truncate text-base font-semibold sm:text-lg">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Sun className="h-4 w-4 shrink-0" />
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
          <Moon className="h-4 w-4 shrink-0" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            className="w-[min(14rem,calc(100vw-2rem))] max-w-56"
          >
            <DropdownMenuItem disabled className="max-w-full truncate font-normal">
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4 shrink-0" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

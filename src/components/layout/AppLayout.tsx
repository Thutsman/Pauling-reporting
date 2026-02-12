import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/weekly-entry': 'Weekly Entry',
  '/weekly-entry/new': 'New Weekly Entry',
  '/monthly-entry': 'Monthly Entry',
  '/reports': 'Reports',
}

function getPageTitle(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname]
  if (pathname.startsWith('/weekly-entry/')) return 'Edit Weekly Entry'
  return 'Dashboard'
}

export function AppLayout() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const title = getPageTitle(location.pathname)

  const handleSheetNavigate = () => {
    setOpen(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar-background md:block">
        <div className="flex h-14 items-center border-b px-6">
          <span className="font-semibold">Pauling Reporting</span>
        </div>
        <div className="p-4">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <div className="fixed left-4 top-4 z-50 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0" aria-describedby={undefined}>
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex h-14 items-center border-b px-6">
              <span className="font-semibold">Pauling Reporting</span>
            </div>
            <div className="p-4">
              <Sidebar onNavigate={handleSheetNavigate} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 flex-col">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

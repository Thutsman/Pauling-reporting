import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeInit } from '@/components/layout/ThemeInit'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

const App = lazy(() => import('./App.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeInit>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <App />
        </Suspense>
      </ErrorBoundary>
      <Toaster />
    </ThemeInit>
  </StrictMode>,
)

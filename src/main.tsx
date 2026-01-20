import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './routes'
import { AuthProvider } from './context/AuthProvider'
import { ToastProvider } from './context/ToastProvider'
import { NotificationsProvider } from './context/NotificationsProvider'
import { initSentry } from './services/logger'
import { AppErrorBoundary } from './components/AppErrorBoundary'

// Initialize Sentry for error tracking
initSentry()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <AuthProvider>
        <NotificationsProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </NotificationsProvider>
      </AuthProvider>
    </AppErrorBoundary>
  </StrictMode>
)

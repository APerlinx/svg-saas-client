import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import './index.css'
import { router } from './routes'
import { AuthProvider } from './context/AuthProvider'
import { AuthCapabilitiesProvider } from './context/AuthCapabilitiesContext'
import { ToastProvider } from './context/ToastProvider'
import { NotificationsProvider } from './context/NotificationsProvider'
import { initSentry } from './services/logger'
import { AppErrorBoundary } from './components/AppErrorBoundary'

// Initialize Sentry for error tracking
initSentry()

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <PayPalScriptProvider
        options={{
          clientId: paypalClientId,
          vault: true,
          intent: 'subscription',
        }}
      >
        <AuthProvider>
          <AuthCapabilitiesProvider>
            <NotificationsProvider>
              <ToastProvider>
                <RouterProvider router={router} />
              </ToastProvider>
            </NotificationsProvider>
          </AuthCapabilitiesProvider>
        </AuthProvider>
      </PayPalScriptProvider>
    </AppErrorBoundary>
  </StrictMode>,
)

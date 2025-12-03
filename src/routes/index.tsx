import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Dashboard from '../pages/Dashboard'
import ErrorBoundary from '../components/ErrorBoundary'
import Pricing from '../pages/Pricing'
import SignIn from '../pages/auth/SignIn'
import SignUp from '../pages/auth/SignUp'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPssword'
import OAuthCallback from '../pages/auth/OAuthCallback'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'pricing',
        element: <Pricing />,
      },
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'auth/callback',
        element: <OAuthCallback />,
      },
    ],
  },
])

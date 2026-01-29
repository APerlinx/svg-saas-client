import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Dashboard from '../pages/Dashboard'
import ErrorBoundary from '../components/ErrorBoundary'
import NotFound from '../components/NotFound'
import Pricing from '../pages/Pricing'
import Docs from '../pages/Docs'
import Gallery from '../pages/Gallery'
import UserHistory from '../pages/UserHistory'
import Contact from '../pages/Contact'
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
        path: 'gallery',
        element: <Gallery />,
      },
      {
        path: 'history',
        element: <UserHistory />,
      },
      {
        path: 'pricing',
        element: <Pricing />,
      },
      {
        path: 'docs',
        element: <Docs />,
      },
      {
        path: 'contact',
        element: <Contact />,
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
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

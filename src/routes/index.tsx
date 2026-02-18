import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import ErrorBoundary from '../components/ErrorBoundary'
import NotFound from '../components/NotFound'
import Pricing from '../pages/Pricing'
import Docs from '../pages/Docs'
import Gallery from '../pages/Gallery'
import UserHistory from '../pages/UserHistory'
import Contact from '../pages/Contact'
import Admin from '../pages/Admin'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsOfService from '../pages/TermsOfService'
import Status from '../pages/Status'
import SignIn from '../pages/auth/SignIn'
import SignUp from '../pages/auth/SignUp'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPssword'
import OAuthCallback from '../pages/auth/OAuthCallback'
import ApiKeys from '../pages/ApiKeys'
import PayPalReturn from '../pages/PayPalReturn'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'app',
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
        path: 'privacy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terms',
        element: <TermsOfService />,
      },
      {
        path: 'api-keys',
        element: <ApiKeys />,
      },
      {
        path: 'status',
        element: <Status />,
      },
      {
        path: 'admin',
        element: <Admin />,
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
        path: 'billing/paypal/success',
        element: <PayPalReturn />,
      },
      {
        path: 'billing/paypal/cancel',
        element: <PayPalReturn />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

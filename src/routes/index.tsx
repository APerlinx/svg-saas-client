import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Dashboard from '../pages/Dashboard'
import ErrorBoundary from '../components/ErrorBoundary'
import Pricing from '../pages/Pricing'
import SignIn from '../pages/auth/SignIn'
import SignUp from '../pages/auth/SignUp'

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
    ],
  },
])

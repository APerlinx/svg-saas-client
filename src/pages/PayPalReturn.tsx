import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PayPalReturn() {
  const location = useLocation()
  const { checkAuth } = useAuth()
  const isSuccess = location.pathname.includes('success')

  useEffect(() => {
    if (isSuccess) {
      // Give the webhook a moment to process, then refresh user data
      const timer = setTimeout(() => void checkAuth(), 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, checkAuth])

  return (
    <div className="w-full max-w-lg mx-auto py-20 px-4 text-center">
      {isSuccess ? (
        <>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Subscription confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your support! Your plan will be upgraded shortly once
            PayPal confirms the payment. This usually takes just a few seconds.
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Subscription cancelled
          </h1>
          <p className="text-gray-600 mb-6">
            No worries — you can subscribe anytime. Your current plan remains
            unchanged.
          </p>
        </>
      )}

      <div className="flex gap-3 justify-center">
        <Link
          to="/pricing"
          className="inline-flex items-center px-5 py-2.5 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          Back to plans
        </Link>
        <Link
          to="/app"
          className="inline-flex items-center px-5 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}

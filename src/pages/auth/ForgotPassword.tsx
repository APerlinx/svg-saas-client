import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { forgotPassword } from '../../services/authService'
import { logger } from '../../services/logger'

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await forgotPassword({ email })
      setEmailSent(true)
    } catch (error) {
      logger.error('Forgot password error', error, { email })
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to send reset email. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent a password reset link"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="pt-4 space-y-2">
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full"
            >
              Try different email
            </Button>
            <Link to="/signin">
              <Button variant="secondary" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email to receive a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>

      <div className="text-center mt-6">
        <Link
          to="/signin"
          className="text-sm text-wizard-orange hover:text-wizard-orange/80 font-medium"
        >
          ← Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  )
}

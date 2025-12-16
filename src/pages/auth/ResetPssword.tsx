import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { resetPassword } from '../../services/authService'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { logger } from '../../services/logger'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' }
    if (password.length < 8) return { strength: 1, label: 'Weak' }

    let strength = 1
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    const strengthValue = Math.min(strength, 3)
    const labels = ['', 'Weak', 'Medium', 'Strong']
    return { strength: strengthValue, label: labels[strengthValue] }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)
  const passwordsMatch =
    formData.newPassword === formData.confirmPassword &&
    formData.confirmPassword.length > 0

  // Redirect to sign in after success
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        navigate('/signin')
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [success, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid or expired reset token')
      return
    }

    setIsLoading(true)

    try {
      await resetPassword({ token, newPassword: formData.newPassword })
      setSuccess(true)
    } catch (error) {
      logger.error('Reset password error', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to reset password. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout
        title="Password reset successful!"
        subtitle="You can now sign in with your new password"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-gray-600">
            Your password has been successfully reset.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to sign in page in 3 seconds...
          </p>
          <Link to="/signin">
            <Button className="w-full">Sign In Now</Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below"
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

        {/* New Password */}
        <div className="relative">
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.newPassword && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Password strength:</span>
              <span
                className={`font-medium ${
                  passwordStrength.strength === 1
                    ? 'text-red-500'
                    : passwordStrength.strength === 2
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              >
                {passwordStrength.label}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  passwordStrength.strength === 1
                    ? 'bg-red-500 w-1/3'
                    : passwordStrength.strength === 2
                    ? 'bg-yellow-500 w-2/3'
                    : 'bg-green-500 w-full'
                }`}
              />
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>

          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className="mt-1 text-xs flex items-center gap-1">
              {passwordsMatch ? (
                <>
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-green-500">Passwords match</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-red-500">Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Password Requirements */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Password must:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li
              className={
                formData.newPassword.length >= 8 ? 'text-green-500' : ''
              }
            >
              Be at least 8 characters long
            </li>
            <li>Include uppercase and lowercase letters (recommended)</li>
            <li>Include numbers and special characters (recommended)</li>
          </ul>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!passwordsMatch || formData.newPassword.length < 8}
        >
          Reset Password
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

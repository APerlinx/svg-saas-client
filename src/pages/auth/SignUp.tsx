import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import SocialAuth from '../../components/auth/SocialAuth'
import AuthDivider from '../../components/auth/AuthDivider'
import { useAuth } from '../../hooks/useAuth'
import { logger } from '../../services/logger'

export default function SignUp() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (password.length < 8)
      return { strength: 1, label: 'Too short', color: 'text-red-500' }

    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    if (strength <= 2)
      return { strength: 33, label: 'Weak', color: 'text-red-500' }
    if (strength <= 4)
      return { strength: 66, label: 'Medium', color: 'text-yellow-500' }
    return { strength: 100, label: 'Strong', color: 'text-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword
  const passwordsDontMatch =
    formData.confirmPassword.length > 0 && !passwordsMatch

  // Check if form is valid
  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.password.length >= 8 &&
    passwordsMatch &&
    agreedToTerms

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { name, email, password } = formData
      await register(name, email, password, agreedToTerms)
      navigate('/app')
    } catch (error) {
      const { email } = formData
      logger.error('Sign up error', error, { email })
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create account. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start creating amazing SVGs today"
    >
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        {/* Left column - Main form */}
        <div className="lg:col-span-1">
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
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mt-2"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mt-2"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            {/* Password with show/hide toggle */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2.5 pr-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-wizard-orange focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

              {/* Password strength indicator */}
              {formData.password.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.label === 'Strong'
                          ? 'bg-green-500'
                          : passwordStrength.label === 'Medium'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Password requirements */}
              <div className="space-y-1 text-xs mt-2">
                <div
                  className={`flex items-center gap-1.5 ${
                    formData.password.length >= 8
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {formData.password.length >= 8 ? (
                    <svg
                      className="w-3.5 h-3.5"
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
                  ) : (
                    <svg
                      className="w-3.5 h-3.5"
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
                  )}
                  At least 8 characters
                </div>
              </div>
            </div>

            {/* Confirm Password with show/hide toggle */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2.5 pr-10 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    passwordsDontMatch
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-wizard-orange'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              </div>

              {/* Password match indicator */}
              {formData.confirmPassword.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs mt-1">
                  {passwordsMatch ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-green-600"
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
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-red-600"
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
                      <span className="text-red-600">
                        Passwords don't match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-wizard-orange focus:ring-wizard-orange"
              />
              <span>
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="text-wizard-orange hover:text-wizard-orange/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="text-wizard-orange hover:text-wizard-orange/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button type="submit" isLoading={isLoading} disabled={!isFormValid}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6 lg:hidden">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-wizard-orange hover:text-wizard-orange/80 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Right column - Social auth (hidden on mobile, visible on large screens) */}
        <div className="hidden lg:flex lg:flex-col lg:col-span-1 lg:pl-6 lg:border-l lg:border-gray-200">
          <div className="flex flex-col justify-center flex-1">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">or continue with</p>
            </div>
            <SocialAuth />
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="text-wizard-orange hover:text-wizard-orange/80 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Mobile view - Social auth below form */}
        <div className="lg:hidden mt-6">
          <AuthDivider />
          <SocialAuth />
        </div>
      </div>
    </AuthLayout>
  )
}

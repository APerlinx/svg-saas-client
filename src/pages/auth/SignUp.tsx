import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import SocialAuth from '../../components/auth/SocialAuth'
import AuthDivider from '../../components/auth/AuthDivider'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

export default function SignUp() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setIsLoading(true)

    try {
      const { name, email, password } = formData
      await register(name, email, password)
      showToast('Account created successfully! Welcome to chatSVG.', 'success')
      navigate('/')
    } catch (error) {
      console.error('Sign up error:', error)
      showToast(
        error instanceof Error
          ? error.message
          : 'Failed to create account. Please try again.',
        'error'
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
        />

        <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-600">
          <input
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-wizard-orange focus:ring-wizard-orange"
            required
          />
          <span>
            I agree to the{' '}
            <Link
              to="/terms"
              className="text-wizard-orange hover:text-wizard-orange/80"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              className="text-wizard-orange hover:text-wizard-orange/80"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button type="submit" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <AuthDivider />
      <SocialAuth />

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link
          to="/signin"
          className="text-wizard-orange hover:text-wizard-orange/80 font-medium"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

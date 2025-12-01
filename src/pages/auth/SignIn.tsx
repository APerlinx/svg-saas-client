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

export default function SignIn() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { email, password, rememberMe } = formData

      await login(email, password, rememberMe)
      showToast('Welcome back! You have successfully signed in.', 'success')
      navigate('/')
    } catch (error) {
      console.error('Sign in error:', error)
      showToast(
        error instanceof Error
          ? error.message
          : 'Failed to sign in. Please try again.',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-wizard-orange focus:ring-wizard-orange"
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData({ ...formData, rememberMe: e.target.checked })
              }
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-wizard-orange hover:text-wizard-orange/80 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <AuthDivider />
      <SocialAuth />

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="text-wizard-orange hover:text-wizard-orange/80 font-medium"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}

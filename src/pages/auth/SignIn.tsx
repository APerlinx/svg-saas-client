import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import SocialAuth from '../../components/auth/SocialAuth'
import AuthDivider from '../../components/auth/AuthDivider'

export default function SignIn() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement actual sign in logic
      console.log('Sign in:', formData)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      navigate('/')
    } catch (error) {
      console.error('Sign in error:', error)
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

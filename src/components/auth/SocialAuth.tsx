import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import GoogleLogoIcon from '../icons/GoogleLogoIcon'
import GitHubLogoIcon from '../icons/GitHubLogoIcon'

const VITE_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export default function SocialAuth() {
  const handleGoogleSignIn = () => {
    const currentPath = window.location.pathname.toLowerCase()

    const authPages = [
      '/signin',
      '/signup',
      '/forgot-password',
      '/reset-password',
    ]

    const redirectUri = authPages.includes(currentPath) ? '/' : currentPath

    window.location.href = `${VITE_API_BASE_URL}/auth/google?redirectUri=${encodeURIComponent(
      redirectUri
    )}`
  }

  const handleGitHubSignIn = () => {
    const currentPath = window.location.pathname.toLowerCase()

    const authPages = [
      '/signin',
      '/signup',
      '/forgot-password',
      '/reset-password',
    ]
    const redirectUri = authPages.includes(currentPath) ? '/' : currentPath

    window.location.href = `${VITE_API_BASE_URL}/auth/github?redirectUri=${encodeURIComponent(
      redirectUri
    )}`
  }

  return (
    <div className="space-y-3">
      <Button variant="outline" type="button" onClick={handleGoogleSignIn}>
        <span className="flex items-center justify-center gap-2">
          <GoogleLogoIcon className="w-5 h-5" />
          Continue with Google
        </span>
      </Button>

      <Button variant="outline" type="button" onClick={handleGitHubSignIn}>
        <span className="flex items-center justify-center gap-2">
          <GitHubLogoIcon className="w-5 h-5" />
          Continue with GitHub
        </span>
      </Button>

      <p className="text-xs text-center text-gray-500 mt-3">
        By signing up with Google or GitHub, you agree to our{' '}
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
      </p>
    </div>
  )
}

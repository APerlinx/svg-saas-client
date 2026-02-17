import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import GoogleLogoIcon from '../icons/GoogleLogoIcon'
import GitHubLogoIcon from '../icons/GitHubLogoIcon'

type OAuthProvider = 'google' | 'github'

interface SocialAuthProps {
  providers?: OAuthProvider[]
  agreementAction?: 'signin' | 'signup'
}

const VITE_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export default function SocialAuth({
  providers = ['google', 'github'],
  agreementAction = 'signup',
}: SocialAuthProps) {
  const showGoogle = providers.includes('google')
  const showGitHub = providers.includes('github')
  const agreementVerb =
    agreementAction === 'signin' ? 'signing in' : 'signing up'
  const googleButtonLabel =
    agreementAction === 'signup' ? 'Google' : 'Continue with Google'
  const githubButtonLabel =
    agreementAction === 'signup' ? 'GitHub' : 'Continue with GitHub'

  const handleGoogleSignIn = () => {
    const currentPath = window.location.pathname.toLowerCase()

    const authPages = [
      '/signin',
      '/signup',
      '/forgot-password',
      '/reset-password',
    ]

    const redirectUrl = authPages.includes(currentPath) ? '/app' : currentPath

    window.location.href = `${VITE_API_BASE_URL}/auth/google?redirectUrl=${encodeURIComponent(
      redirectUrl,
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
    const redirectUrl = authPages.includes(currentPath) ? '/app' : currentPath

    window.location.href = `${VITE_API_BASE_URL}/auth/github?redirectUrl=${encodeURIComponent(
      redirectUrl,
    )}`
  }

  return (
    <div className="space-y-3">
      {showGoogle && (
        <Button variant="outline" type="button" onClick={handleGoogleSignIn}>
          <span className="flex items-center justify-center gap-2">
            <GoogleLogoIcon className="w-5 h-5" />
            {googleButtonLabel}
          </span>
        </Button>
      )}

      {showGitHub && (
        <Button variant="outline" type="button" onClick={handleGitHubSignIn}>
          <span className="flex items-center justify-center gap-2">
            <GitHubLogoIcon className="w-5 h-5" />
            {githubButtonLabel}
          </span>
        </Button>
      )}

      {!showGoogle && !showGitHub && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          OAuth sign-in is currently unavailable.
        </p>
      )}

      <p className="text-xs text-center text-gray-500 mt-3">
        By {agreementVerb} with Google or GitHub, you agree to our{' '}
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

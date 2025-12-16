import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { logger } from '../../services/logger'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()

  useEffect(() => {
    let isMounted = true

    const processOAuth = async () => {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect') || '/'

      try {
        await checkAuth()
        if (isMounted) {
          navigate(redirect, { replace: true })
        }
      } catch (error) {
        logger.error('OAuth checkAuth failed', error)
        if (isMounted) {
          navigate('/signin?error=oauth_failed', { replace: true })
        }
      }
    }

    processOAuth()

    return () => {
      isMounted = false
    }
  }, [navigate, checkAuth])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

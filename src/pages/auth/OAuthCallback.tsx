import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../../utils/localStorage'
import { useAuth } from '../../hooks/useAuth'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()

  useEffect(() => {
    let isMounted = true

    const processOAuth = async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      const redirect = params.get('redirect') || '/'

      if (token) {
        setToken(token)
        await checkAuth()
        if (isMounted) navigate(redirect, { replace: true })
      } else {
        navigate('/signin?error=oauth_failed', { replace: true })
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

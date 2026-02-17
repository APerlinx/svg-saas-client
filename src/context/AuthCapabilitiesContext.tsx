import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getAuthOptions } from '../services/authService'
import {
  AuthCapabilitiesContext,
  type AuthCapabilities,
  type AuthCapabilitiesContextType,
  type OAuthProvider,
} from './AuthCapabilitiesState'

const DEFAULT_OAUTH_PROVIDERS: OAuthProvider[] = ['google', 'github']

let cachedCapabilities: AuthCapabilities | null = null
let fetchInFlight: Promise<AuthCapabilities> | null = null

function parseFallbackEmailAuthEnabled(): boolean {
  const env = import.meta.env as Record<string, string | undefined>
  const raw =
    env.NEXT_PUBLIC_ENABLE_EMAIL_AUTH_FALLBACK ??
    env.VITE_ENABLE_EMAIL_AUTH_FALLBACK

  if (!raw) return true
  return raw.toLowerCase() === 'true'
}

function getFallbackCapabilities(): AuthCapabilities {
  return {
    emailAuthEnabled: parseFallbackEmailAuthEnabled(),
    oauthProviders: DEFAULT_OAUTH_PROVIDERS,
  }
}

async function loadCapabilities(): Promise<AuthCapabilities> {
  if (cachedCapabilities) return cachedCapabilities
  if (fetchInFlight) return fetchInFlight

  fetchInFlight = getAuthOptions()
    .then((result) => {
      cachedCapabilities = result
      return result
    })
    .catch(() => {
      const fallback = getFallbackCapabilities()
      cachedCapabilities = fallback
      return fallback
    })
    .finally(() => {
      fetchInFlight = null
    })

  return fetchInFlight
}

interface AuthCapabilitiesProviderProps {
  children: ReactNode
}

export function AuthCapabilitiesProvider({
  children,
}: AuthCapabilitiesProviderProps) {
  const [capabilities, setCapabilities] = useState<AuthCapabilities>(
    () => cachedCapabilities ?? getFallbackCapabilities(),
  )
  const [isLoading, setIsLoading] = useState(!cachedCapabilities)
  const [error, setError] = useState<string | null>(null)

  const refreshCapabilities = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await loadCapabilities()
      setCapabilities(result)
      setError(null)
    } catch {
      setError('Failed to load authentication options')
      setCapabilities(getFallbackCapabilities())
    } finally {
      setIsLoading(false)
    }
  }, [])

  const forceDisableEmailAuth = useCallback(() => {
    setCapabilities((prev) => ({
      ...prev,
      emailAuthEnabled: false,
    }))

    cachedCapabilities = {
      ...(cachedCapabilities ?? getFallbackCapabilities()),
      emailAuthEnabled: false,
    }
  }, [])

  useEffect(() => {
    void refreshCapabilities()
  }, [refreshCapabilities])

  const value = useMemo<AuthCapabilitiesContextType>(
    () => ({
      capabilities,
      isLoading,
      error,
      forceDisableEmailAuth,
      refreshCapabilities,
    }),
    [
      capabilities,
      isLoading,
      error,
      forceDisableEmailAuth,
      refreshCapabilities,
    ],
  )

  return (
    <AuthCapabilitiesContext.Provider value={value}>
      {children}
    </AuthCapabilitiesContext.Provider>
  )
}

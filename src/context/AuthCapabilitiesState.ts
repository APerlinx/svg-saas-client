import { createContext } from 'react'

export type OAuthProvider = 'google' | 'github'

export interface AuthCapabilities {
  emailAuthEnabled: boolean
  oauthProviders: OAuthProvider[]
}

export interface AuthCapabilitiesContextType {
  capabilities: AuthCapabilities
  isLoading: boolean
  error: string | null
  forceDisableEmailAuth: () => void
  refreshCapabilities: () => Promise<void>
}

export const AuthCapabilitiesContext =
  createContext<AuthCapabilitiesContextType | null>(null)

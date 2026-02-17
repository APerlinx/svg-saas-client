import axios, { AxiosError } from 'axios'
import { attachCsrfInterceptor } from '../services/csrfInterceptor'
import { logger } from './logger'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // Include cookies in requests
})

attachCsrfInterceptor(api)

import type { RegisterResponse, User } from '../types/user'
import type { AuthResponse } from '../types/user'
interface ApiError {
  message?: string
  error?: string
  errorCode?: string
}

export type OAuthProvider = 'google' | 'github'

export interface AuthOptionsResponse {
  emailAuthEnabled: boolean
  oauthProviders: OAuthProvider[]
}

export class AuthApiError extends Error {
  status?: number
  errorCode?: string

  constructor(message: string, opts?: { status?: number; errorCode?: string }) {
    super(message)
    this.name = 'AuthApiError'
    this.status = opts?.status
    this.errorCode = opts?.errorCode
  }
}

// Helper to normalize and throw errors
function normalizeError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiError>
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.response?.statusText ||
      'Unexpected server error'
    throw new AuthApiError(msg, {
      status: err.response?.status,
      errorCode: err.response?.data?.errorCode,
    })
  }
  throw error as Error
}

export async function getAuthOptions(): Promise<AuthOptionsResponse> {
  try {
    const response = await api.get<{
      emailAuthEnabled: boolean
      oauthProviders: string[]
    }>('/auth/options')

    const providers = (response.data.oauthProviders || [])
      .map((provider) => provider.toLowerCase())
      .filter(
        (provider): provider is OAuthProvider =>
          provider === 'google' || provider === 'github',
      )

    return {
      emailAuthEnabled: !!response.data.emailAuthEnabled,
      oauthProviders: providers,
    }
  } catch (error) {
    logger.error('Error fetching auth options', error)
    normalizeError(error)
  }
}

// Auth service functions
export async function signIn({
  email,
  password,
  rememberMe,
}: {
  email: string
  password: string
  rememberMe: boolean
}): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
      rememberMe,
    })
    return response.data
  } catch (error) {
    logger.error('Error signing in', error, { email })
    normalizeError(error)
  }
}

export async function signUp({
  name,
  email,
  password,
  agreedToTerms,
}: {
  name: string
  email: string
  password: string
  agreedToTerms: boolean
}): Promise<AuthResponse> {
  try {
    const response = await api.post<RegisterResponse>('/auth/register', {
      name,
      email,
      password,
      agreedToTerms,
    })

    return response.data
  } catch (error) {
    logger.error('Error signing up', error, { email })
    normalizeError(error)
  }
}

export async function signOut(): Promise<{ success: boolean }> {
  try {
    const response = await api.post<{ success: boolean }>('/auth/logout')
    return response.data
  } catch (error) {
    logger.error('Error signing out', error)
    normalizeError(error)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<User>('/auth/current-user')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null
    }
    logger.error('Error fetching current user', error)
    normalizeError(error)
  }
}

export async function forgotPassword({
  email,
}: {
  email: string
}): Promise<{ message: string }> {
  try {
    const response = await api.post<{ message: string }>(
      '/auth/forgot-password',
      { email },
    )
    return response.data
  } catch (error) {
    logger.error('Error sending reset email', error, { email })
    normalizeError(error)
  }
}

export async function resetPassword({
  token,
  newPassword,
}: {
  token: string
  newPassword: string
}): Promise<{ message: string }> {
  try {
    const response = await api.post<{ message: string }>(
      '/auth/reset-password',
      { token, newPassword },
    )
    return response.data
  } catch (error) {
    logger.error('Error resetting password', error)
    normalizeError(error)
  }
}

let refreshInFlight: Promise<boolean> | null = null

export async function refreshAccessToken(): Promise<boolean> {
  // If a refresh is already running, reuse it.
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    try {
      await api.post('/auth/refresh')
      return true
    } catch {
      return false
    } finally {
      // Always release the lock
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

export async function ensureSession(): Promise<User | null> {
  try {
    const user = await getCurrentUser()
    if (user) return user

    const refreshed = await refreshAccessToken()
    if (!refreshed) return null

    return await getCurrentUser()
  } catch (error) {
    logger.error('Error ensuring session', error)
    return null
  }
}

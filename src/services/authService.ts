// src/services/authService.ts
import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // Include cookies in requests
})

import type { RegisterResponse, User } from '../types/user'
import type { AuthResponse } from '../types/user'
interface ApiError {
  message: string
}

// Helper to normalize and throw errors
function normalizeError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiError>
    const msg =
      err.response?.data?.message ||
      err.response?.statusText ||
      'Unexpected server error'
    throw new Error(msg)
  }
  throw error as Error
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
    console.error('Error signing in:', error)
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
    console.error('Error signing up:', error)
    normalizeError(error)
  }
}

export async function signOut(): Promise<{ success: boolean }> {
  try {
    const response = await api.post<{ success: boolean }>('/auth/logout')
    return response.data
  } catch (error) {
    console.error('Error signing out:', error)
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
    console.error('Error fetching current user:', error)
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
      { email }
    )
    return response.data
  } catch (error) {
    console.error('Error sending reset email:', error)
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
      { token, newPassword }
    )
    return response.data
  } catch (error) {
    console.error('Error resetting password:', error)
    normalizeError(error)
  }
}

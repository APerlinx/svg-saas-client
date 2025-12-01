// src/services/authService.ts
import axios, { AxiosError } from 'axios'
import { getToken } from '../utils/localStorage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: false,
})

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

import type { User } from '../types/user'
import type { AuthResponse } from '../types/user'
interface ApiError {
  message: string
  // optional extra fields from your backend (code, details, etc.)
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
}: {
  email: string
  password: string
}): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
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
}: {
  name: string
  email: string
  password: string
}): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
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
    // if not authenticated, your backend should probably return 401
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null
    }
    console.error('Error fetching current user:', error)
    normalizeError(error)
  }
}

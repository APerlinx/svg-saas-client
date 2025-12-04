import { useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthResponse } from '../types/user'
import * as authService from '../services/authService'
import { AuthContext, type AuthContextType } from './AuthContext.tsx'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    const response: AuthResponse = await authService.signIn({
      email,
      password,
      rememberMe,
    })

    setUser(response.user)
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    agreedToTerms: boolean
  ) => {
    const response: AuthResponse = await authService.signUp({
      name,
      email,
      password,
      agreedToTerms,
    })

    setUser(response.user)
  }

  const logout = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

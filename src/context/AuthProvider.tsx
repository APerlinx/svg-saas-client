import { useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/user'
import * as authService from '../services/authService'
import { AuthContext, type AuthContextType } from './AuthContext.tsx'
import { refreshAccessToken } from '../services/authService'
import { logger } from '../services/logger'

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
      logger.error('Unexpected error in checkAuth', error)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      try {
        await authService.bootstrapCsrf()
        const currentUser = await authService.ensureSession()
        setUser(currentUser)
      } catch (error) {
        logger.error('Unexpected error in initAuth', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void initAuth()
  }, [])

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    await authService.signIn({
      email,
      password,
      rememberMe,
    })
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      logger.error('Unexpected error in login', error)
      setUser(null)
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    agreedToTerms: boolean
  ) => {
    await authService.signUp({
      name,
      email,
      password,
      agreedToTerms,
    })
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      logger.error('Unexpected error in register', error)
      setUser(null)
    }
  }

  const logout = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      logger.error('Logout error', error)
    } finally {
      // Clear session storage on logout
      sessionStorage.removeItem('svg_prompt_draft')
      setUser(null)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    const success = await refreshAccessToken()
    if (success) {
      await checkAuth()
    }
    return success
  }

  const updateUserCredits = useCallback((credits: number) => {
    setUser((prevUser) => {
      if (!prevUser) return null
      return { ...prevUser, credits }
    })
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    refreshToken,
    updateUserCredits,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

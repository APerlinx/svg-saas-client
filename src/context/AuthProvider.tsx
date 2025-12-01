import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthResponse } from '../types/user'
import * as authService from '../services/authService'
import { setToken, getToken, removeToken } from '../utils/localStorage'
import { AuthContext, type AuthContextType } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Auth check failed:', error)
      removeToken()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await authService.signIn({ email, password })
    if (response.accessToken) {
      setToken(response.accessToken)
    }
    setUser(response.user)
  }

  const register = async (name: string, email: string, password: string) => {
    const response: AuthResponse = await authService.signUp({ name, email, password })
    if (response.accessToken) {
      setToken(response.accessToken)
    }
    setUser(response.user)
  }

  const logout = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      removeToken()
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

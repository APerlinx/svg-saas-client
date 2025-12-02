import { createContext } from 'react'
import type { User } from '../types/user'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    agreedToTerms: boolean
  ) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

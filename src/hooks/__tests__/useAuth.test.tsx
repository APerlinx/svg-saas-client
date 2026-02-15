import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { AuthContext } from '../../context/AuthContext'
import type { ReactNode } from 'react'

describe('useAuth', () => {
  const mockAuthContext = {
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      credits: 100,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateUserCredits: vi.fn(),
    refreshToken: vi.fn(),
    checkAuth: vi.fn(),
  }

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  )

  it('should return auth context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toEqual(mockAuthContext.user)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.login).toBeDefined()
    expect(result.current.logout).toBeDefined()
  })

  it('should throw error when used outside AuthProvider', () => {
    // Suppress console error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleError.mockRestore()
  })
})

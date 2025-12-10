// src/pages/auth/OAuthCallback.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import OAuthCallback from './OAuthCallback'

// ----- Mocks -----

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  )
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock useAuth from ../../hooks/useAuth
const mockCheckAuth = vi.fn()

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    checkAuth: mockCheckAuth,
  }),
}))

describe('OAuthCallback', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    mockCheckAuth.mockReset()
  })

  it('calls checkAuth and navigates to redirect on success', async () => {
    // Arrange: checkAuth resolves successfully
    mockCheckAuth.mockResolvedValueOnce(undefined)

    // Set URL: /auth/callback?redirect=/studio
    window.history.pushState({}, '', '/auth/callback?redirect=/studio')

    // Act
    render(<OAuthCallback />)

    // Assert
    await waitFor(() => {
      expect(mockCheckAuth).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/studio', { replace: true })
    })
  })

  it('navigates to root (/) if no redirect param and checkAuth succeeds', async () => {
    mockCheckAuth.mockResolvedValueOnce(undefined)

    // URL without redirect
    window.history.pushState({}, '', '/auth/callback')

    render(<OAuthCallback />)

    await waitFor(() => {
      expect(mockCheckAuth).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  it('navigates to /signin with error if checkAuth fails', async () => {
    // Arrange: checkAuth rejects
    mockCheckAuth.mockRejectedValueOnce(new Error('Auth failed'))

    window.history.pushState({}, '', '/auth/callback?redirect=/studio')

    render(<OAuthCallback />)

    await waitFor(() => {
      expect(mockCheckAuth).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/signin?error=oauth_failed', {
        replace: true,
      })
    })
  })
})

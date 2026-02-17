import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'
import { AuthContext, type AuthContextType } from '../../context/AuthContext'
import {
  NotificationsContext,
  type NotificationsState,
} from '../../context/NotificationsContext'
import type { User } from '../../types/user'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Header', () => {
  const renderHeader = (user: User | null = null) => {
    const mockAuthContext: AuthContextType = {
      user,
      isLoading: false,
      isAuthenticated: !!user,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateUserCredits: vi.fn(),
      refreshToken: vi.fn(),
      checkAuth: vi.fn(),
    }

    const mockNotificationsContext: NotificationsState = {
      notifications: [],
      unreadCount: 0,
      nextCursor: null,
      hasMore: false,
      isLoadingBadge: false,
      isLoadingNotifications: false,
      refreshBadgeCount: vi.fn(),
      loadLatestAndMarkSeen: vi.fn(),
      loadMore: vi.fn(),
      clear: vi.fn(),
    }

    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <NotificationsContext.Provider value={mockNotificationsContext}>
            <Header />
          </NotificationsContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    )
  }

  it('should render logo and navigation links', () => {
    renderHeader()

    expect(screen.getByText('ChatSVG')).toBeInTheDocument()
    expect(screen.getByText('API')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
  })

  it('should show sign in button when not authenticated', () => {
    renderHeader()

    const signInButtons = screen.getAllByText('Sign In')
    expect(signInButtons.length).toBeGreaterThan(0)
    expect(signInButtons[0]).toBeInTheDocument()
  })

  it('should show user menu when authenticated', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      credits: 100,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    }

    renderHeader(mockUser)

    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('should display user initials in avatar', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'John Doe',
      credits: 50,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    }

    renderHeader(mockUser)

    expect(screen.getByText('JD')).toBeInTheDocument()
  })
})

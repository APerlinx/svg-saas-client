import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as authService from '../authService'

// Mock the api module instead of axios directly
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        post: vi.fn(),
        get: vi.fn(),
      })),
      isAxiosError: vi.fn(),
    },
    isAxiosError: vi.fn(),
  }
})

// Mock csrfInterceptor to avoid side effects
vi.mock('../csrfInterceptor', () => ({
  attachCsrfInterceptor: vi.fn(),
}))

// Mock logger
vi.mock('../logger', () => ({
  logger: {
    error: vi.fn(),
  },
}))

// Import after mocks are set up
import axios, { type AxiosInstance } from 'axios'

const mockedAxios = vi.mocked(axios, true)
let mockApi: { post: ReturnType<typeof vi.fn>; get: ReturnType<typeof vi.fn> }

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi = {
      post: vi.fn(),
      get: vi.fn(),
    }
    mockedAxios.create.mockReturnValue(mockApi as unknown as AxiosInstance)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      }

      mockApi.post.mockResolvedValue(mockResponse)

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      })

      expect(result.user).toEqual(mockResponse.data.user)
      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      })
    })

    it('should throw error with invalid credentials', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: 'Invalid credentials' },
          status: 401,
        },
      }

      mockApi.post.mockRejectedValue(mockError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      await expect(
        authService.signIn({
          email: 'test@example.com',
          password: 'wrongpassword',
          rememberMe: false,
        }),
      ).rejects.toThrow('Invalid credentials')
    })
  })

  describe('signUp', () => {
    it('should successfully register a new user', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '1',
            email: 'newuser@example.com',
            name: 'New User',
          },
        },
      }

      mockApi.post.mockResolvedValue(mockResponse)

      const result = await authService.signUp({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        agreedToTerms: true,
      })

      expect(result.user.email).toBe('newuser@example.com')
      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        agreedToTerms: true,
      })
    })

    it('should throw error if email already exists', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: 'Email already in use' },
          status: 409,
        },
      }

      mockApi.post.mockRejectedValue(mockError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      await expect(
        authService.signUp({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
          agreedToTerms: true,
        }),
      ).rejects.toThrow('Email already in use')
    })
  })

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      }

      mockApi.get.mockResolvedValue({ data: mockUser })

      const result = await authService.getCurrentUser()

      expect(result).toEqual(mockUser)
      expect(mockApi.get).toHaveBeenCalledWith('/auth/current-user')
    })

    it('should return null when not authenticated (401)', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: 'Not authenticated' },
          status: 401,
        },
      }

      mockApi.get.mockRejectedValue(mockError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const result = await authService.getCurrentUser()

      expect(result).toBeNull()
    })

    it('should throw error for non-401 errors', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: 'Server error' },
          status: 500,
        },
      }

      mockApi.get.mockRejectedValue(mockError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      await expect(authService.getCurrentUser()).rejects.toThrow('Server error')
    })
  })

  describe('signOut', () => {
    it('should successfully log out user', async () => {
      mockApi.post.mockResolvedValue({ data: { success: true } })

      const result = await authService.signOut()

      expect(result).toEqual({ success: true })
      expect(mockApi.post).toHaveBeenCalledWith('/auth/logout')
    })
  })
})

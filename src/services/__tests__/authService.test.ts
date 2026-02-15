import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import * as authService from '../authService'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof axios.create>)

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      })

      expect(result.user).toEqual(mockResponse.data.user)
    })

    it('should throw error with invalid credentials', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: 'Invalid credentials' },
          status: 401,
        },
      }

      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockRejectedValue(mockError),
      } as unknown as ReturnType<typeof axios.create>)
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

      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof axios.create>)

      const result = await authService.signUp({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        agreedToTerms: true,
      })

      expect(result.user.email).toBe('newuser@example.com')
    })

    it('should throw error if email already exists', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: 'Email already in use' },
          status: 409,
        },
      }

      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockRejectedValue(mockError),
      } as unknown as ReturnType<typeof axios.create>)
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

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue({ data: mockUser }),
      } as unknown as ReturnType<typeof axios.create>)

      const result = await authService.getCurrentUser()

      expect(result).toEqual(mockUser)
    })

    it('should throw error when not authenticated', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: 'Not authenticated' },
          status: 401,
        },
      }

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(mockError),
      } as unknown as ReturnType<typeof axios.create>)
      mockedAxios.isAxiosError.mockReturnValue(true)

      await expect(authService.getCurrentUser()).rejects.toThrow(
        'Not authenticated',
      )
    })
  })

  describe('signOut', () => {
    it('should successfully log out user', async () => {
      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue({ data: { success: true } }),
      } as unknown as ReturnType<typeof axios.create>)

      await expect(authService.signOut()).resolves.not.toThrow()
    })
  })
})

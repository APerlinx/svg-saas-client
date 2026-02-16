import { describe, it, expect, beforeEach } from 'vitest'
import { getStoredCsrfToken, setCsrfToken, clearCsrfToken } from '../csrf'

describe('csrf utilities', () => {
  beforeEach(() => {
    clearCsrfToken()
  })

  it('should store and retrieve CSRF token', () => {
    const token = 'test-csrf-token-123'
    setCsrfToken(token)
    expect(getStoredCsrfToken()).toBe(token)
  })

  it('should return null when no token is stored', () => {
    expect(getStoredCsrfToken()).toBeNull()
  })

  it('should clear CSRF token', () => {
    setCsrfToken('test-token')
    clearCsrfToken()
    expect(getStoredCsrfToken()).toBeNull()
  })

  it('should overwrite existing token', () => {
    setCsrfToken('old-token')
    setCsrfToken('new-token')
    expect(getStoredCsrfToken()).toBe('new-token')
  })
})

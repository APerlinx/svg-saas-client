import { describe, it, expect } from 'vitest'
import { getInitials } from '../getInitials'

describe('getInitials', () => {
  it('should return initials from first and last name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('should return first initial for single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('should handle multiple spaces', () => {
    expect(getInitials('John   Doe')).toBe('JD')
  })

  it('should return first two initials from multi-word name', () => {
    expect(getInitials('John Michael Doe')).toBe('JM')
  })

  it('should handle empty string', () => {
    expect(getInitials('')).toBe('')
  })

  it('should handle only spaces', () => {
    expect(getInitials('   ')).toBe('')
  })

  it('should convert to uppercase', () => {
    expect(getInitials('john doe')).toBe('JD')
  })

  it('should handle special characters', () => {
    expect(getInitials("John O'Brien")).toBe('JO')
  })
})

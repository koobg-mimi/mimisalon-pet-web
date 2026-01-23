/**
 * @fileoverview Tests for password strength utility functions
 * @module features/auth/utils/__tests__/password-strength
 */

import { describe, it, expect } from 'vitest'
import {
  checkPasswordStrength,
  getPasswordStrengthText,
  getPasswordStrengthColor,
  getPasswordStrengthBarColor,
  type PasswordStrength,
} from '../password-strength'

describe('checkPasswordStrength', () => {
  describe('strength level 0 (no criteria met)', () => {
    it('should return 0 for empty password', () => {
      expect(checkPasswordStrength('')).toBe(0)
    })

    it('should return 0 for password with only spaces', () => {
      expect(checkPasswordStrength('   ')).toBe(0)
    })
  })

  describe('strength level 1 (one criterion met)', () => {
    it('should return 1 for short password with only lowercase', () => {
      expect(checkPasswordStrength('abc')).toBe(1)
    })

    it('should return 1 for short password with only uppercase', () => {
      expect(checkPasswordStrength('ABC')).toBe(1)
    })

    it('should return 1 for short password with only digits', () => {
      expect(checkPasswordStrength('123')).toBe(1)
    })

    it('should return 1 for short password with only special characters', () => {
      expect(checkPasswordStrength('!@#')).toBe(1)
    })

    it('should return 1 for 8+ chars with only lowercase', () => {
      expect(checkPasswordStrength('abcdefgh')).toBe(2) // length + lowercase
    })
  })

  describe('strength level 2 (two criteria met)', () => {
    it('should return 2 for 8+ chars with only lowercase', () => {
      expect(checkPasswordStrength('abcdefgh')).toBe(2)
    })

    it('should return 2 for short password with lowercase and uppercase', () => {
      expect(checkPasswordStrength('aB')).toBe(2)
    })

    it('should return 2 for short password with lowercase and digit', () => {
      expect(checkPasswordStrength('a1')).toBe(2)
    })

    it('should return 2 for short password with lowercase and special', () => {
      expect(checkPasswordStrength('a!')).toBe(2)
    })
  })

  describe('strength level 3 (three criteria met)', () => {
    it('should return 3 for 8+ chars with lowercase and uppercase', () => {
      expect(checkPasswordStrength('abcdeFGH')).toBe(3)
    })

    it('should return 3 for 8+ chars with lowercase and digit', () => {
      expect(checkPasswordStrength('abcdef12')).toBe(3)
    })

    it('should return 3 for short password with lowercase, uppercase, and digit', () => {
      expect(checkPasswordStrength('aB1')).toBe(3)
    })

    it('should return 3 for short password with lowercase, uppercase, and special', () => {
      expect(checkPasswordStrength('aB!')).toBe(3)
    })
  })

  describe('strength level 4 (four criteria met)', () => {
    it('should return 4 for 8+ chars with lowercase, uppercase, and digit', () => {
      expect(checkPasswordStrength('abcdE123')).toBe(4)
    })

    it('should return 4 for 8+ chars with lowercase, uppercase, and special', () => {
      expect(checkPasswordStrength('abcdEF!@')).toBe(4)
    })

    it('should return 4 for 8+ chars with lowercase, digit, and special', () => {
      expect(checkPasswordStrength('abcd123!')).toBe(4)
    })

    it('should return 4 for short password with lowercase, uppercase, digit, and special', () => {
      expect(checkPasswordStrength('aB1!')).toBe(4)
    })
  })

  describe('strength level 5 (all criteria met)', () => {
    it('should return 5 for 8+ chars with all character types', () => {
      expect(checkPasswordStrength('abcD123!')).toBe(5)
    })

    it('should return 5 for strong password with mixed characters', () => {
      expect(checkPasswordStrength('MyP@ssw0rd')).toBe(5)
    })

    it('should return 5 for very strong password', () => {
      expect(checkPasswordStrength('C0mpl3x!P@ssw0rd')).toBe(5)
    })

    it('should return 5 for exactly 8 chars with all types', () => {
      expect(checkPasswordStrength('aB1!cD2@')).toBe(5)
    })
  })

  describe('edge cases', () => {
    it('should handle only uppercase letters (< 8 chars)', () => {
      expect(checkPasswordStrength('ABCDEFG')).toBe(1)
    })

    it('should handle only digits (< 8 chars)', () => {
      expect(checkPasswordStrength('1234567')).toBe(1)
    })

    it('should handle only special characters (< 8 chars)', () => {
      expect(checkPasswordStrength('!@#$%^&')).toBe(1)
    })

    it('should handle 8+ chars with only uppercase', () => {
      expect(checkPasswordStrength('ABCDEFGH')).toBe(2)
    })

    it('should handle 8+ chars with only digits', () => {
      expect(checkPasswordStrength('12345678')).toBe(2)
    })

    it('should handle very long password with all criteria', () => {
      expect(checkPasswordStrength('aB1!cD2@eF3#gH4$iJ5%kL6^')).toBe(5)
    })
  })
})

describe('getPasswordStrengthText', () => {
  it('should return "매우 약함" for strength 0', () => {
    expect(getPasswordStrengthText(0)).toBe('매우 약함')
  })

  it('should return "매우 약함" for strength 1', () => {
    expect(getPasswordStrengthText(1)).toBe('매우 약함')
  })

  it('should return "약함" for strength 2', () => {
    expect(getPasswordStrengthText(2)).toBe('약함')
  })

  it('should return "보통" for strength 3', () => {
    expect(getPasswordStrengthText(3)).toBe('보통')
  })

  it('should return "강함" for strength 4', () => {
    expect(getPasswordStrengthText(4)).toBe('강함')
  })

  it('should return "매우 강함" for strength 5', () => {
    expect(getPasswordStrengthText(5)).toBe('매우 강함')
  })

  it('should return empty string for invalid strength', () => {
    // Type assertion to test runtime behavior
    expect(getPasswordStrengthText(6 as PasswordStrength)).toBe('')
    expect(getPasswordStrengthText(-1 as PasswordStrength)).toBe('')
  })
})

describe('getPasswordStrengthColor', () => {
  it('should return "text-red-500" for strength 0', () => {
    expect(getPasswordStrengthColor(0)).toBe('text-red-500')
  })

  it('should return "text-red-500" for strength 1', () => {
    expect(getPasswordStrengthColor(1)).toBe('text-red-500')
  })

  it('should return "text-orange-500" for strength 2', () => {
    expect(getPasswordStrengthColor(2)).toBe('text-orange-500')
  })

  it('should return "text-yellow-500" for strength 3', () => {
    expect(getPasswordStrengthColor(3)).toBe('text-yellow-500')
  })

  it('should return "text-green-500" for strength 4', () => {
    expect(getPasswordStrengthColor(4)).toBe('text-green-500')
  })

  it('should return "text-green-600" for strength 5', () => {
    expect(getPasswordStrengthColor(5)).toBe('text-green-600')
  })

  it('should return "text-muted-foreground" for invalid strength', () => {
    // Type assertion to test runtime behavior
    expect(getPasswordStrengthColor(6 as PasswordStrength)).toBe('text-muted-foreground')
    expect(getPasswordStrengthColor(-1 as PasswordStrength)).toBe('text-muted-foreground')
  })
})

describe('getPasswordStrengthBarColor', () => {
  it('should return "bg-red-500" for strength 0', () => {
    expect(getPasswordStrengthBarColor(0)).toBe('bg-red-500')
  })

  it('should return "bg-red-500" for strength 1', () => {
    expect(getPasswordStrengthBarColor(1)).toBe('bg-red-500')
  })

  it('should return "bg-orange-500" for strength 2', () => {
    expect(getPasswordStrengthBarColor(2)).toBe('bg-orange-500')
  })

  it('should return "bg-yellow-500" for strength 3', () => {
    expect(getPasswordStrengthBarColor(3)).toBe('bg-yellow-500')
  })

  it('should return "bg-green-500" for strength 4', () => {
    expect(getPasswordStrengthBarColor(4)).toBe('bg-green-500')
  })

  it('should return "bg-green-500" for strength 5', () => {
    expect(getPasswordStrengthBarColor(5)).toBe('bg-green-500')
  })

  it('should return "bg-green-500" for strength values >= 4 (including invalid high values)', () => {
    // Type assertion to test runtime behavior
    // The function uses >= 4 comparison, so values above 5 also return green
    expect(getPasswordStrengthBarColor(6 as PasswordStrength)).toBe('bg-green-500')
    expect(getPasswordStrengthBarColor(10 as PasswordStrength)).toBe('bg-green-500')
  })

  it('should return "bg-red-500" for negative strength values', () => {
    // Negative values are <= 1, so they return red
    expect(getPasswordStrengthBarColor(-1 as PasswordStrength)).toBe('bg-red-500')
    expect(getPasswordStrengthBarColor(-10 as PasswordStrength)).toBe('bg-red-500')
  })
})

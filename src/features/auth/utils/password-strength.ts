/**
 * Password strength checker utility
 * @module features/auth/utils/password-strength
 */

export type PasswordStrength = 0 | 1 | 2 | 3 | 4 | 5

/**
 * Calculate password strength based on multiple criteria
 * @param password - The password to check
 * @returns A strength score from 0 (weakest) to 5 (strongest)
 */
export function checkPasswordStrength(password: string): PasswordStrength {
  let strength = 0

  // Length check (8+ characters)
  if (password.length >= 8) strength++

  // Lowercase letter check
  if (/[a-z]/.test(password)) strength++

  // Uppercase letter check
  if (/[A-Z]/.test(password)) strength++

  // Digit check
  if (/\d/.test(password)) strength++

  // Special character check
  if (/[^\w\s]/.test(password)) strength++

  return strength as PasswordStrength
}

/**
 * Get human-readable password strength text
 * @param strength - Password strength score (0-5)
 * @returns Korean text describing the strength
 */
export function getPasswordStrengthText(strength: PasswordStrength): string {
  switch (strength) {
    case 0:
    case 1:
      return '매우 약함'
    case 2:
      return '약함'
    case 3:
      return '보통'
    case 4:
      return '강함'
    case 5:
      return '매우 강함'
    default:
      return ''
  }
}

/**
 * Get Tailwind CSS color class for password strength
 * @param strength - Password strength score (0-5)
 * @returns Tailwind text color class
 */
export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 0:
    case 1:
      return 'text-red-500'
    case 2:
      return 'text-orange-500'
    case 3:
      return 'text-yellow-500'
    case 4:
      return 'text-green-500'
    case 5:
      return 'text-green-600'
    default:
      return 'text-muted-foreground'
  }
}

/**
 * Get background color for password strength indicator bar
 * @param strength - Password strength score (0-5)
 * @returns Tailwind background color class
 */
export function getPasswordStrengthBarColor(strength: PasswordStrength): string {
  if (strength <= 1) return 'bg-red-500'
  if (strength === 2) return 'bg-orange-500'
  if (strength === 3) return 'bg-yellow-500'
  if (strength >= 4) return 'bg-green-500'
  return 'bg-gray-300'
}

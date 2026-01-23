import { z } from 'zod'

// Common weak passwords to avoid
const COMMON_PASSWORDS = [
  'password',
  '123456',
  '123456789',
  'qwerty',
  'abc123',
  'password123',
  '12345678',
  '111111',
  '1234567890',
  'welcome',
  'admin',
  'letmein',
  'monkey',
  '1234567',
  'dragon',
  'sunshine',
  'master',
  'football',
  'baseball',
  'superman',
  'trustno1',
  '000000',
  'shadow',
  'michael',
  'jennifer',
  'jordan',
  'passw0rd',
  '123123',
  'princess',
  'solo',
  'password1',
  'starwars',
  'hello',
  'freedom',
  'whatever',
  'qazwsx',
  'mustang',
  'batman',
  'access',
  'master',
  '1q2w3e4r',
  'qwertyuiop',
  '1234qwer',
  'zaq12wsx',
  'iloveyou',
  'password12',
  'welcome123',
]

// Korean common passwords
const KOREAN_COMMON_PASSWORDS = [
  'qwerasdf',
  'asdfqwer',
  '1q2w3e4r',
  'qwer1234',
  'asdf1234',
  '12341234',
  'qwerqwer',
  'asdfasdf',
  '1111',
  '0000',
  '2580',
  'abcd1234',
  '1qaz2wsx',
  'zxcvbnm',
  'qwaszx',
  'zxcvqwer',
]

// Sequential patterns to avoid
const SEQUENTIAL_PATTERNS = [
  /(.)\1{2,}/, // Repeated characters (aaa, 111)
  /123456|654321|abcdef|qwerty|asdfgh|zxcvbn/, // Sequential patterns
  /01234|56789|09876|87654/, // Number sequences
]

/**
 * Enhanced password validation schema with comprehensive security checks
 */
export const enhancedPasswordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .max(128, '비밀번호는 최대 128자까지 입력 가능합니다')
  .refine((password) => /[a-z]/.test(password), '비밀번호는 소문자를 포함해야 합니다')
  .refine((password) => /[A-Z]/.test(password), '비밀번호는 대문자를 포함해야 합니다')
  .refine((password) => /\d/.test(password), '비밀번호는 숫자를 포함해야 합니다')
  .refine(
    (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
    '비밀번호는 특수문자를 포함해야 합니다'
  )
  .refine(
    (password) => !COMMON_PASSWORDS.includes(password.toLowerCase()),
    '일반적으로 사용되는 비밀번호는 사용할 수 없습니다'
  )
  .refine(
    (password) => !KOREAN_COMMON_PASSWORDS.includes(password.toLowerCase()),
    '일반적으로 사용되는 비밀번호는 사용할 수 없습니다'
  )
  .refine(
    (password) => !SEQUENTIAL_PATTERNS.some((pattern) => pattern.test(password.toLowerCase())),
    '연속된 문자나 숫자는 사용할 수 없습니다'
  )
  .refine(
    (password) => !/(.{2,})\1+/.test(password.toLowerCase()),
    '반복되는 패턴은 사용할 수 없습니다'
  )

/**
 * Password strength calculation
 */
export function calculatePasswordStrength(password: string): {
  score: number
  level: 'weak' | 'medium' | 'strong' | 'very-strong'
  feedback: string[]
} {
  let score = 0
  const feedback: string[] = []

  // Length check
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1

  // Character variety
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) score += 1

  // Avoid common patterns
  if (!COMMON_PASSWORDS.includes(password.toLowerCase())) score += 1
  if (!KOREAN_COMMON_PASSWORDS.includes(password.toLowerCase())) score += 1
  if (!SEQUENTIAL_PATTERNS.some((pattern) => pattern.test(password.toLowerCase()))) score += 1

  // Determine level and feedback
  if (score <= 3) {
    feedback.push('더 강력한 비밀번호를 설정하세요')
    feedback.push('최소 8자 이상 사용하세요')
    feedback.push('대문자, 소문자, 숫자, 특수문자를 모두 포함하세요')
    return { score, level: 'weak', feedback }
  } else if (score <= 5) {
    feedback.push('비밀번호가 보통 수준입니다')
    feedback.push('12자 이상 사용하면 더 안전합니다')
    return { score, level: 'medium', feedback }
  } else if (score <= 7) {
    feedback.push('강력한 비밀번호입니다')
    return { score, level: 'strong', feedback }
  } else {
    feedback.push('매우 강력한 비밀번호입니다')
    return { score, level: 'very-strong', feedback }
  }
}

/**
 * Check if password contains personal information
 */
export function checkPersonalInfo(
  password: string,
  userInfo: {
    name?: string
    email?: string
    phone?: string
  }
): string[] {
  const warnings: string[] = []
  const lowerPassword = password.toLowerCase()

  if (userInfo.name && lowerPassword.includes(userInfo.name.toLowerCase())) {
    warnings.push('비밀번호에 이름을 포함하지 마세요')
  }

  if (userInfo.email) {
    const emailParts = userInfo.email.toLowerCase().split('@')[0]
    if (lowerPassword.includes(emailParts)) {
      warnings.push('비밀번호에 이메일 주소를 포함하지 마세요')
    }
  }

  if (userInfo.phone) {
    const phoneNumbers = userInfo.phone.replace(/\D/g, '')
    if (phoneNumbers.length >= 4 && lowerPassword.includes(phoneNumbers.slice(-4))) {
      warnings.push('비밀번호에 전화번호를 포함하지 마세요')
    }
  }

  return warnings
}

/**
 * Enhanced password validation for reset endpoint
 */
export const passwordResetValidationSchema = z
  .object({
    password: enhancedPasswordSchema,
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

// Export types
export type PasswordStrength = ReturnType<typeof calculatePasswordStrength>
export type PasswordResetValidation = z.infer<typeof passwordResetValidationSchema>

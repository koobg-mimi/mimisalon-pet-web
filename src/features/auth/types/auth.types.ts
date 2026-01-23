/**
 * Authentication domain types
 * @module features/auth/types
 */

import type { SignInInput, SignUpInput } from '@/lib/validations/auth'
import type { UserRole } from '@mimisalon/shared'

/**
 * User data sent to WebView after successful login
 */
export interface WebViewUserData {
  userId: string
  email: string
  name: string
  phoneNumber: string
  role: UserRole
}

/**
 * Verification method for email verification
 */
export type EmailVerificationMethod = 'email' | 'sms'

/**
 * Phone verification state
 */
export interface PhoneVerificationState {
  phoneVerified: boolean
  verificationCode: string
  verificationError: string
  showVerificationInput: boolean
  cooldownTime: number
  sendingCode: boolean
  verifyingCode: boolean
}

/**
 * Email verification state
 */
export interface EmailVerificationState {
  emailVerified: boolean
  showEmailVerificationSelector: boolean
  emailVerificationMethod: EmailVerificationMethod
  showEmailOTPDialog: boolean
  sendingEmailCode: boolean
}

/**
 * Re-export validation types for convenience
 */
export type { SignInInput, SignUpInput }

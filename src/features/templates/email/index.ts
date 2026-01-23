/**
 * Email Templates Module
 *
 * Re-exports email template components and generation functions
 */

// Template generation functions
export {
  generateEmailVerificationTemplate,
  generatePasswordResetTemplate,
  generateOTPEmailTemplate,
  generateEmailTemplate,
  type EmailTemplateProps,
  type EmailTemplateType,
} from './templates'

// React Email components (for direct use if needed)
export { EmailVerificationEmail } from './components/email-verification'
export { PasswordResetEmail } from './components/password-reset'
export { OTPVerificationEmail } from './components/otp-verification'
export { BaseEmailLayout } from './components/base-layout'

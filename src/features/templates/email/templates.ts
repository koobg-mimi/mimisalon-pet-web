import { render } from '@react-email/render'
import { EmailVerificationEmail } from './components/email-verification'
import { PasswordResetEmail } from './components/password-reset'
import { OTPVerificationEmail } from './components/otp-verification'

export interface EmailTemplateProps {
  name: string
  url: string
}

/**
 * Generate email verification HTML template using React Email
 */
export async function generateEmailVerificationTemplate(
  name: string,
  verificationUrl: string
): Promise<string> {
  return await render(EmailVerificationEmail({ name, verificationUrl }))
}

/**
 * Generate password reset HTML template using React Email
 */
export async function generatePasswordResetTemplate(
  name: string,
  resetUrl: string
): Promise<string> {
  return await render(PasswordResetEmail({ name, resetUrl }))
}

/**
 * Generate OTP verification HTML template using React Email
 */
export async function generateOTPEmailTemplate(
  email: string,
  otp: string,
  type: 'sign-in' | 'email-verification' | 'forget-password'
): Promise<string> {
  return await render(OTPVerificationEmail({ email, otp, type }))
}

/**
 * Email template types for type safety
 */
export type EmailTemplateType = 'email-verification' | 'password-reset' | 'otp-verification'

/**
 * Generate email template based on type
 */
export async function generateEmailTemplate(
  type: EmailTemplateType,
  props: EmailTemplateProps
): Promise<string> {
  switch (type) {
    case 'email-verification':
      return await generateEmailVerificationTemplate(props.name, props.url)
    case 'password-reset':
      return await generatePasswordResetTemplate(props.name, props.url)
    default:
      throw new Error(`Unknown email template type: ${type}`)
  }
}

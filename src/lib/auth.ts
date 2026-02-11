import { betterAuth } from 'better-auth'
import type { BetterAuthOptions } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@mimisalon/shared'
import { admin, emailOTP, phoneNumber } from 'better-auth/plugins'
import bcrypt from 'bcryptjs'
import { env } from './env'

const prisma = new PrismaClient({
  log: [],
})

/**
 * Better Auth Configuration
 *
 * Replaces NextAuth.js with better-auth for improved type safety,
 * plugin ecosystem, and better developer experience.
 *
 * Features:
 * - Email/Password authentication with bcrypt
 * - Role-based access control (CUSTOMER, GROOMER, ADMIN)
 * - Prisma adapter for PostgreSQL
 * - Session management with secure cookies
 * - Admin plugin for role management
 */
const auth = betterAuth({
  // Database configuration with Prisma adapter
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // App configuration
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  secret: env.BETTER_AUTH_SECRET,

  // Trust host in production - include both staging and production domains
  trustedOrigins: [
    env.BETTER_AUTH_URL,
    'http://localhost:3000',
    'https://mimisalon.pet',
    'https://staging.mimisalon.pet',
    "https://mimisalon-pet-deploy.vercel.app",
  ],

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Require email verification for signup
    sendResetPassword: async ({ user, url }) => {
      // Import email service dynamically to avoid build-time issues
      const { sendEmail } = await import('@/lib/email')
      const { generatePasswordResetTemplate } = await import('@/features/templates')

      const html = await generatePasswordResetTemplate(user.name || user.email, url)

      await sendEmail({
        to: user.email,
        subject: '비밀번호 재설정 - 미미살롱펫',
        html,
      })
    },
    // Custom password hashing and verification (bcrypt)
    password: {
      hash: async (password: string) => {
        return await bcrypt.hash(password, 10)
      },
      verify: async ({ hash, password }: { hash: string; password: string }) => {
        return bcrypt.compare(password, hash)
      },
    },
  },

  // Email verification configuration
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Import email service dynamically
      const { sendEmail } = await import('@/lib/email')
      const { generateEmailVerificationTemplate } = await import('@/features/templates')

      const html = await generateEmailVerificationTemplate(user.name || user.email, url)

      await sendEmail({
        to: user.email,
        subject: '이메일 인증 - 미미살롱펫',
        html,
      })
    },
    sendOnSignUp: true, // Send verification email on signup
    autoSignInAfterVerification: true, // Auto sign-in after email verification
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Account linking configuration
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['credential'],
    },
  },

  // Social providers configuration (add as needed)
  socialProviders: {
    // Example: Add Google OAuth
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // },
  },

  // Plugins for extended functionality
  plugins: [
    admin({
      impersonationSessionDuration: 60 * 60,
    }),

    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const emailEnabled =
          process.env.NODE_ENV === 'production' || process.env.EMAIL_OTP_ENABLED === 'true'

        if (!emailEnabled) {
          console.log('[email OTP][dev] email disabled. otp:', { email, otp, type })
          return
        }

        const { sendEmail } = await import('@/lib/email')
        const { generateOTPEmailTemplate } = await import('@/features/templates')

        const html = await generateOTPEmailTemplate(email, otp, type)

        await sendEmail({
          to: email,
          subject:
            type === 'sign-in'
              ? '로그인 인증코드 - 미미살롱펫'
              : type === 'email-verification'
                ? '이메일 인증코드 - 미미살롱펫'
                : '비밀번호 재설정 인증코드 - 미미살롱펫',
          html,
        })
      },
      otpLength: 6,
      expiresIn: 600,
      disableSignUp: false,
      allowedAttempts: 5,
    }),

    phoneNumber({
      async sendOTP({ phoneNumber, code }) {
        const smsEnabled =
          process.env.NODE_ENV === 'production' || process.env.TWILIO_SMS_ENABLED === 'true'

        if (!smsEnabled) {
          console.log('[phone OTP][dev] sms disabled. code:', code)
          return
        }

        const { sendSMSCode } = await import('./twilio')
        const result = await sendSMSCode(phoneNumber, code)

        if (!result.success) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[phone OTP][dev] Twilio failed, fallback to console OTP', {
              phoneNumber,
              code,
              error: result.error,
            })
            return
          }
          throw new Error(result.error || 'Failed to send SMS')
        }
      },
    }),
  ],

  // Advanced options
  advanced: {
    database: {
      generateId: () => {
        // Use cuid for ID generation (compatible with existing schema)
        return crypto.randomUUID()
      },
    },
  },
} satisfies BetterAuthOptions)
export default auth

/**
 * Type exports for better TypeScript inference
 */
export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user

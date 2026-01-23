import type { UserRole } from '@mimisalon/shared'

/**
 * better-auth Type Augmentation
 *
 * Extends better-auth types with our custom fields
 * This ensures TypeScript knows about our additional user properties
 */
declare module 'better-auth' {
  interface User {
    id: string
    email: string
    name: string | null
    role: UserRole
    phone: string | null
    phoneVerified: boolean
    emailVerified: Date | null
    image: string | null
  }

  interface Session {
    user: User
    expiresAt: Date
  }
}

/**
 * Next.js Request Extension
 *
 * Augments Next.js request types for better-auth
 */
declare module 'next/server' {
  interface NextRequest {
    auth?: {
      user: User
      session: Session
    }
  }
}

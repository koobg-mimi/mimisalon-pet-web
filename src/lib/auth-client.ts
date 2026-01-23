'use client'

import { createAuthClient } from 'better-auth/react'
import { adminClient, emailOTPClient, phoneNumberClient } from 'better-auth/client/plugins'
import auth from './auth'

/**
 * Better Auth Client Configuration
 *
 * Client-side authentication utilities for React components.
 * Provides hooks and methods for authentication operations.
 *
 * Usage in components:
 * ```tsx
 * import { authClient } from '@/lib/auth-client';
 *
 * function MyComponent() {
 *   const { data: session, isPending } = authClient.useSession();
 *   const { signIn, signOut } = authClient;
 *
 *   return ...
 * }
 * ```
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    'http://localhost:3000',
  basePath: '/api/auth',

  plugins: [
    // Admin plugin for client-side role management
    adminClient(),

    // Email OTP plugin for client-side verification
    emailOTPClient(),

    // Phone Number plugin for SMS authentication
    phoneNumberClient(),
  ],
})

/**
 * Type-safe session hook
 * Automatically infers types from server auth configuration
 */
export const useSession = authClient.useSession

/**
 * Convenience exports for common auth operations
 */
export const { signIn, signOut, signUp } = authClient

/**
 * Type exports for TypeScript inference
 */
export type Session = typeof auth.$Infer.Session

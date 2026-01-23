import auth from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

/**
 * Better Auth API Route Handler
 *
 * Handles all authentication requests at /api/auth/*
 * Replaces the previous [...nextauth]/route.ts
 *
 * Supported endpoints:
 * - POST /api/auth/sign-in/email - Email/password sign in
 * - POST /api/auth/sign-up/email - Email/password sign up
 * - POST /api/auth/sign-out - Sign out
 * - GET /api/auth/session - Get current session
 * - And more...
 */
export const { GET, POST } = toNextJsHandler(auth)

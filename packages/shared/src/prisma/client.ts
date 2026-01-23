/**
 * Prisma Client Singleton
 *
 * Ensures single Prisma Client instance across the application
 * Prevents "too many clients" errors in development with HMR
 */

import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development
// to prevent exhausting database connection limit
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export Prisma types for convenience
export type * from '@prisma/client'

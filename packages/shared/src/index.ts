/**
 * @mimisalon/shared
 *
 * Shared code for MimiSalon monorepo
 * Exports Prisma client, shared types, and utilities
 */

// Export Prisma client
export { prisma } from './prisma/client'

// Explicit Prisma exports (avoid workspace/type resolution edge cases)
export {
  Prisma,
  PrismaClient,
  BookingStatus,
  PaymentStatus,
  UserRole,
  PetType,
  BreedCategory,
} from '@prisma/client'

// Export shared types
export * from './types'

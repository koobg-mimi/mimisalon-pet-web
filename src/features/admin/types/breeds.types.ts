/**
 * Admin Breeds Feature - Type Definitions
 *
 * This module defines all TypeScript types for the admin breeds management feature.
 * Following Next.js serialization rules: Date objects from Prisma are serialized to ISO strings.
 *
 * @module features/admin/types/breeds.types
 */

import { Prisma, PetType, BreedCategory } from '@prisma/client'

// ============================================================================
// Prisma Payload Types (Server-side with Date objects)
// ============================================================================

/**
 * Breed entity with pet count relationship
 * @internal Used for Prisma queries, dates are Date objects
 */
type BreedPayload = Prisma.BreedGetPayload<{
  include: {
    _count: {
      select: {
        pets: true
      }
    }
  }
}>

// ============================================================================
// API Response Types (Client-side with serialized dates)
// ============================================================================

/**
 * Base Breed type for client-side consumption
 *
 * @remarks
 * Dates are typed as strings because Next.js serializes Date objects to ISO 8601 strings
 * when sending responses from API routes.
 *
 * @example
 * ```typescript
 * const breed: Breed = {
 *   id: "cuid",
 *   name: "푸들",
 *   petType: "DOG",
 *   category: "SMALL",
 *   displayOrder: 1,
 *   isActive: true,
 *   createdAt: "2025-11-05T10:00:00.000Z", // string, not Date
 *   updatedAt: "2025-11-05T10:00:00.000Z"
 * }
 * ```
 */
export type Breed = Omit<BreedPayload, 'createdAt' | 'updatedAt' | '_count'> & {
  /** ISO 8601 timestamp of when the breed was created */
  createdAt: string
  /** ISO 8601 timestamp of when the breed was last updated */
  updatedAt: string
}

/**
 * Breed with pet count for admin list views
 *
 * @remarks
 * Extends the base Breed type with the _count field for displaying
 * how many pets are associated with each breed.
 *
 * @example
 * ```typescript
 * const breedWithCount: BreedWithCount = {
 *   id: "cuid",
 *   name: "푸들",
 *   petType: "DOG",
 *   category: "SMALL",
 *   displayOrder: 1,
 *   isActive: true,
 *   createdAt: "2025-11-05T10:00:00.000Z",
 *   updatedAt: "2025-11-05T10:00:00.000Z",
 *   _count: {
 *     pets: 42 // Number of pets with this breed
 *   }
 * }
 * ```
 */
export type BreedWithCount = Breed & {
  /** Count of related entities */
  _count: {
    /** Number of pets associated with this breed */
    pets: number
  }
}

// ============================================================================
// API Request Types
// ============================================================================

/**
 * Input for creating multiple breeds in bulk
 *
 * @remarks
 * Used by POST /api/admin/breeds endpoint. The breedNames field accepts
 * comma-separated breed names which will be parsed and created/updated.
 *
 * @example
 * ```typescript
 * const input: CreateBreedsInput = {
 *   petType: "DOG",
 *   category: "SMALL",
 *   breedNames: "푸들, 말티즈, 비숑"
 * }
 * ```
 */
export interface CreateBreedsInput {
  /** Type of pet (DOG or CAT) */
  petType: PetType
  /** Size/hair category for the breed */
  category: BreedCategory
  /** Comma-separated list of breed names to create or update */
  breedNames: string
}

/**
 * Response from creating breeds in bulk
 *
 * @remarks
 * Returns summary of the bulk operation including how many breeds
 * were created vs updated.
 *
 * @example
 * ```typescript
 * const response: CreateBreedsResponse = {
 *   message: "품종이 저장되었습니다",
 *   created: 2,  // 2 new breeds created
 *   updated: 1,  // 1 existing breed updated
 *   total: 3     // 3 total breeds processed
 * }
 * ```
 */
export interface CreateBreedsResponse {
  /** Success message */
  message: string
  /** Number of new breeds created */
  created: number
  /** Number of existing breeds updated */
  updated: number
  /** Total number of breeds processed */
  total: number
}

/**
 * Response from GET /api/admin/breeds
 *
 * @remarks
 * Returns array of all breeds with pet counts, ordered by petType, category,
 * displayOrder, and name.
 *
 * @example
 * ```typescript
 * const response: BreedsResponse = [
 *   {
 *     id: "cuid1",
 *     name: "푸들",
 *     petType: "DOG",
 *     category: "SMALL",
 *     displayOrder: 1,
 *     isActive: true,
 *     createdAt: "2025-11-05T10:00:00.000Z",
 *     updatedAt: "2025-11-05T10:00:00.000Z",
 *     _count: { pets: 42 }
 *   },
 *   // ... more breeds
 * ]
 * ```
 */
export type BreedsResponse = BreedWithCount[]

// ============================================================================
// Error Response Types
// ============================================================================

/**
 * Standard error response from breeds API endpoints
 *
 * @example
 * ```typescript
 * const error: BreedErrorResponse = {
 *   error: "Failed to fetch breeds",
 *   message: "Database connection timeout"
 * }
 * ```
 */
export interface BreedErrorResponse {
  /** High-level error category */
  error: string
  /** Detailed error message (optional) */
  message?: string
}

import { NextResponse } from 'next/server'
import { prisma, Prisma } from '@mimisalon/shared'

// ============================================================================
// Types
// ============================================================================

export type BreedResponse = Prisma.BreedGetPayload<{
  select: {
    id: true
    petType: true
    name: true
    displayOrder: true
    isActive: true
  }
}>

export type BreedListResponse = BreedResponse[]

export interface BreedErrorResponse {
  error: string
  message?: string
}

// ============================================================================
// Route Handler
// ============================================================================

/**
 * GET /api/breeds
 *
 * Get list of active breeds ordered by pet type and display order.
 */
export async function GET(): Promise<NextResponse<BreedListResponse | BreedErrorResponse>> {
  try {
    const breeds = await prisma.breed.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        {
          petType: 'asc',
        },
        {
          displayOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    })

    return NextResponse.json<BreedListResponse>(breeds)
  } catch (error) {
    console.error('Error fetching breeds:', error)
    return NextResponse.json<BreedErrorResponse>(
      {
        error: 'Failed to fetch breeds',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

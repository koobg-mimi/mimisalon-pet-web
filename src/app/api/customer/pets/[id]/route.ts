import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { generateSignedReadUrl, extractFilenameFromUrl, isGcsUrl } from '@/lib/gcs'

// ============================================
// Type Definitions
// ============================================

/**
 * Error response type
 */
export interface ErrorResponse {
  error: string
  details?: unknown
}

/**
 * Response type for pet (with breed and images)
 */
export type PetResponse = Prisma.PetGetPayload<{
  include: {
    breed: true
    images: true
  }
}>

/**
 * Schema for updating a pet
 */
export const updatePetSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(['DOG', 'CAT']).optional(),
  breedId: z.string().optional().nullable(),
  weight: z.number().positive().optional().nullable(),
  age: z.number().int().positive().optional().nullable(),
  birthDate: z.string().datetime().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).optional().nullable(),
  hairType: z.enum(['SHORT_HAIR', 'LONG_HAIR']).optional().nullable(),
  specialNeeds: z.string().optional().nullable(),
  vaccinationStatus: z.enum(['UP_TO_DATE', 'OVERDUE', 'PARTIAL', 'UNKNOWN']).optional(),
  vaccinationDate: z.string().datetime().optional().nullable(),
})

/**
 * Request type for updating a pet
 */
export type UpdatePetRequest = z.infer<typeof updatePetSchema>

/**
 * Success response for delete operation
 */
export type DeletePetResponse = { success: boolean }

// ============================================
// API Handlers
// ============================================

/**
 * GET /api/customer/pets/[id] - Get a specific pet
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PetResponse | ErrorResponse>> {
  try {
    const { id } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const pet = await prisma.pet.findFirst({
      where: {
        id: id,
        customerId: session.user.id,
        isActive: true,
      },
      include: {
        breed: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
        },
      },
    })

    if (!pet) {
      return new NextResponse('Pet not found', { status: 404 })
    }

    // Generate signed URLs for GCS images
    if (pet.images && pet.images.length > 0) {
      pet.images = await Promise.all(
        pet.images.map(async (image) => {
          if (isGcsUrl(image.url)) {
            const filename = extractFilenameFromUrl(image.url)
            if (filename) {
              try {
                const signedUrl = await generateSignedReadUrl(filename, 60)
                return {
                  ...image,
                  url: signedUrl,
                  originalUrl: image.url,
                }
              } catch (error) {
                console.error(`Failed to generate signed URL for ${filename}:`, error)
                return image
              }
            }
          }
          return image
        })
      )
    }

    return NextResponse.json(pet)
  } catch (error) {
    console.error('Failed to fetch pet:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * PUT /api/customer/pets/[id] - Update a pet
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PetResponse | ErrorResponse>> {
  try {
    const { id } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify ownership
    const existingPet = await prisma.pet.findFirst({
      where: {
        id: id,
        customerId: session.user.id,
        isActive: true,
      },
    })

    if (!existingPet) {
      return new NextResponse('Pet not found', { status: 404 })
    }

    const body: unknown = await request.json()
    const validatedData = updatePetSchema.parse(body)

    // If changing to DOG, remove hairType
    if (validatedData.type === 'DOG') {
      validatedData.hairType = null
    }

    const pet = await prisma.pet.update({
      where: { id: id },
      data: {
        ...validatedData,
        birthDate: validatedData.birthDate
          ? new Date(validatedData.birthDate)
          : validatedData.birthDate === null
            ? null
            : undefined,
        vaccinationDate: validatedData.vaccinationDate
          ? new Date(validatedData.vaccinationDate)
          : validatedData.vaccinationDate === null
            ? null
            : undefined,
      },
      include: {
        breed: true,
        images: true,
      },
    })

    return NextResponse.json(pet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 })
    }
    console.error('Failed to update pet:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * DELETE /api/customer/pets/[id] - Soft delete a pet
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<void>> {
  try {
    const { id } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify ownership
    const existingPet = await prisma.pet.findFirst({
      where: {
        id: id,
        customerId: session.user.id,
        isActive: true,
      },
    })

    if (!existingPet) {
      return new NextResponse('Pet not found', { status: 404 })
    }

    // Soft delete by setting isActive to false
    await prisma.pet.update({
      where: { id: id },
      data: { isActive: false },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete pet:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

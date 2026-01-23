import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { deleteImage } from '@/lib/gcs'

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
 * Response type for pet image
 */
export type PetImageResponse = Prisma.PetImageGetPayload<{
  select: {
    id: true
    petId: true
    url: true
    isPrimary: true
    displayOrder: true
    createdAt: true
    updatedAt: true
  }
}>

/**
 * Schema for updating image properties
 */
export const updateImageSchema = z.object({
  isPrimary: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
})

/**
 * Request type for updating image
 */
export type UpdateImageRequest = z.infer<typeof updateImageSchema>

/**
 * Success response for delete operation
 */
export type DeleteImageResponse = { message: string }

// ============================================
// API Handlers
// ============================================

/**
 * PUT /api/customer/pets/[id]/images/[imageId] - Update image properties
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
): Promise<NextResponse<PetImageResponse | ErrorResponse>> {
  try {
    const { id, imageId } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify pet ownership
    const pet = await prisma.pet.findFirst({
      where: {
        id: id,
        customerId: session.user.id,
        isActive: true,
      },
    })

    if (!pet) {
      return new NextResponse('Pet not found', { status: 404 })
    }

    // Verify image belongs to pet
    const image = await prisma.petImage.findFirst({
      where: {
        id: imageId,
        petId: id,
      },
    })

    if (!image) {
      return new NextResponse('Image not found', { status: 404 })
    }

    const body: unknown = await request.json()
    const validatedData = updateImageSchema.parse(body)

    // If setting as primary, unset other primary images
    if (validatedData.isPrimary === true) {
      await prisma.petImage.updateMany({
        where: {
          petId: id,
          id: { not: imageId },
          isPrimary: true,
        },
        data: { isPrimary: false },
      })
    }

    // Update the image
    const updatedImage = await prisma.petImage.update({
      where: { id: imageId },
      data: validatedData,
    })

    return NextResponse.json(updatedImage)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 })
    }
    console.error('Failed to update image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * DELETE /api/customer/pets/[id]/images/[imageId] - Delete a single image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
): Promise<NextResponse<DeleteImageResponse | ErrorResponse>> {
  try {
    const { id, imageId } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify pet ownership
    const pet = await prisma.pet.findFirst({
      where: {
        id: id,
        customerId: session.user.id,
        isActive: true,
      },
    })

    if (!pet) {
      return new NextResponse('Pet not found', { status: 404 })
    }

    // Get image to delete
    const image = await prisma.petImage.findFirst({
      where: {
        id: imageId,
        petId: id,
      },
    })

    if (!image) {
      return new NextResponse('Image not found', { status: 404 })
    }

    // Delete from GCS
    try {
      const urlParts = image.url.split('/')
      const filename = urlParts.slice(-3).join('/') // pets/petId/filename
      await deleteImage(filename)
    } catch (error) {
      console.error(`Failed to delete image from GCS: ${image.url}`, error)
    }

    // Delete from database
    await prisma.petImage.delete({
      where: { id: imageId },
    })

    // If this was the primary image, set another as primary
    if (image.isPrimary) {
      const firstImage = await prisma.petImage.findFirst({
        where: { petId: id },
        orderBy: { createdAt: 'asc' },
      })

      if (firstImage) {
        await prisma.petImage.update({
          where: { id: firstImage.id },
          data: { isPrimary: true },
        })
      }
    }

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Failed to delete image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

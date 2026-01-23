import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import {
  generateImageFilename,
  generateSignedReadUrl,
  deleteImage,
  extractFilenameFromUrl,
  isGcsUrl,
  uploadBuffer,
  isAllowedImageType,
  isValidFileSize,
  ImageType,
  IMAGE_UPLOAD_CONFIG,
  isGcsConfigured,
} from '@/lib/gcs'

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
 * Schema for deleting multiple images
 */
export const deleteImagesSchema = z.object({
  imageIds: z.array(z.string()).min(1),
})

/**
 * Request type for deleting multiple images
 */
export type DeleteImagesRequest = z.infer<typeof deleteImagesSchema>

/**
 * Success response for image upload
 */
export type UploadImageResponse = {
  message: string
  images: PetImageResponse[]
  failedFiles?: string[]
}

/**
 * Success response for delete operation
 */
export type DeleteImagesResponse = { message: string }

// ============================================
// API Handlers
// ============================================

/**
 * GET /api/customer/pets/[id]/images - Get all images for a pet
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PetImageResponse[] | ErrorResponse>> {
  try {
    const { id } = await params
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
      include: {
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
        },
      },
    })

    if (!pet) {
      return new NextResponse('Pet not found', { status: 404 })
    }

    // Generate signed URLs for GCS images
    const imagesWithSignedUrls = await Promise.all(
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

    const response = NextResponse.json(imagesWithSignedUrls)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Failed to fetch pet images:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * POST /api/customer/pets/[id]/images - Direct server upload using FormData
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UploadImageResponse | ErrorResponse>> {
  try {
    const { id } = await params
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
      include: {
        images: true,
      },
    })

    if (!pet) {
      return new NextResponse('Pet not found', { status: 404 })
    }

    // Check if pet has reached max images
    if (pet.images.length >= IMAGE_UPLOAD_CONFIG.maxImagesPerPet) {
      return NextResponse.json(
        {
          error: `Maximum ${IMAGE_UPLOAD_CONFIG.maxImagesPerPet} images allowed per pet`,
        },
        { status: 400 }
      )
    }

    if (!isGcsConfigured()) {
      return NextResponse.json(
        {
          error: 'Image upload service not configured',
        },
        { status: 503 }
      )
    }

    // Handle FormData upload
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    console.log(`Processing ${files.length} files for pet ${id}`)

    const uploadedImages: PetImageResponse[] = []
    const failedFiles: string[] = []
    let processedCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      console.log(
        `Processing file ${i + 1}/${files.length}: ${file.name} (${file.type}, ${file.size} bytes)`
      )

      try {
        // Validate file type
        if (!isAllowedImageType(file.type)) {
          console.error(`Invalid file type: ${file.type} for ${file.name}`)
          failedFiles.push(file.name)
          continue
        }

        // Validate file size
        if (!isValidFileSize(file.size, ImageType.PET)) {
          console.error(`Invalid file size: ${file.size} for ${file.name}`)
          failedFiles.push(file.name)
          continue
        }

        // Generate unique filename for GCS
        const gcsFilename = generateImageFilename(file.name, id, ImageType.PET)

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to GCS
        console.log(`Uploading ${file.name} to GCS as ${gcsFilename}`)
        const publicUrl = await uploadBuffer(buffer, gcsFilename, file.type, {
          petId: id,
          uploadedBy: session.user.email || session.user.id,
        })

        console.log(`Successfully uploaded ${file.name} to GCS: ${publicUrl}`)

        // Create database record for the image
        const isPrimary: boolean = pet.images.length === 0 && processedCount === 0
        const displayOrder: number = pet.images.length + processedCount

        const petImage = await prisma.petImage.create({
          data: {
            petId: id,
            url: publicUrl,
            filename: file.name,
            mimeType: file.type,
            size: file.size,
            isPrimary,
            displayOrder,
          },
        })

        uploadedImages.push(petImage)
        processedCount++
        console.log(`Created database record for ${file.name}: ${petImage.id}`)
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
        failedFiles.push(file.name)
      }
    }

    let message = ''
    if (uploadedImages.length > 0 && failedFiles.length === 0) {
      message = `${uploadedImages.length} images uploaded successfully`
    } else if (uploadedImages.length > 0 && failedFiles.length > 0) {
      message = `${uploadedImages.length} images uploaded, ${failedFiles.length} failed`
    } else {
      message = 'No images were uploaded'
    }

    const response: UploadImageResponse = {
      message,
      images: uploadedImages,
    }

    if (failedFiles.length > 0) {
      response.failedFiles = failedFiles
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to upload images:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * DELETE /api/customer/pets/[id]/images - Delete multiple images
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DeleteImagesResponse | ErrorResponse>> {
  try {
    const { id } = await params
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

    const body: unknown = await request.json()
    const { imageIds } = deleteImagesSchema.parse(body)

    // Get images to delete
    const imagesToDelete = await prisma.petImage.findMany({
      where: {
        id: { in: imageIds },
        petId: id,
      },
    })

    // Delete from GCS if applicable
    for (const image of imagesToDelete) {
      if (isGcsUrl(image.url)) {
        const filename = extractFilenameFromUrl(image.url)
        if (filename) {
          await deleteImage(filename).catch(console.error)
        }
      }
    }

    // Delete from database
    await prisma.petImage.deleteMany({
      where: {
        id: { in: imageIds },
        petId: id,
      },
    })

    // If primary image was deleted, set another as primary
    const remainingImages = await prisma.petImage.findMany({
      where: { petId: id },
      orderBy: { createdAt: 'asc' },
    })

    if (remainingImages.length > 0 && !remainingImages.some((img) => img.isPrimary)) {
      await prisma.petImage.update({
        where: { id: remainingImages[0].id },
        data: { isPrimary: true },
      })
    }

    return NextResponse.json({ message: 'Images deleted successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 })
    }
    console.error('Failed to delete images:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

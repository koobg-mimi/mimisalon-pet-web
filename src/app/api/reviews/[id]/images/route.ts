import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma, Prisma } from '@mimisalon/shared'
import { z } from 'zod'
import {
  generateImageFilename,
  deleteImages,
  extractFilenameFromUrl,
  isGcsUrl,
  uploadBuffer,
  isAllowedImageType,
  isValidFileSize,
  ImageType,
  IMAGE_UPLOAD_CONFIG,
  isGcsConfigured,
} from '@/lib/gcs'

// ============================================================================
// Types
// ============================================================================

type ReviewImagePayload = Prisma.ReviewImageGetPayload<{
  select: {
    id: true
    reviewId: true
    url: true
    filename: true
    mimeType: true
    size: true
    order: true
    createdAt: true
  }
}>

interface GetReviewImagesResponse {
  images?: ReviewImagePayload[]
  error?: string
}

interface UploadImagesResponse {
  message: string
  images: ReviewImagePayload[]
  failedFiles?: string[]
}

interface DeleteImagesResponse {
  message: string
}

interface ErrorResponse {
  error: string
  details?: unknown
}

// ============================================================================
// Validation Schemas
// ============================================================================

const deleteImagesSchema = z.object({
  imageIds: z.array(z.string()).min(1),
})

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * GET /api/reviews/[id]/images
 * Get all images for a review
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetReviewImagesResponse | ErrorResponse>> {
  try {
    const { id } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get review with images
    const review = await prisma.review.findFirst({
      where: {
        id,
        customerId: session.user.id,
      },
      include: {
        images: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        },
      },
    })

    if (!review) {
      return NextResponse.json<ErrorResponse>({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json<GetReviewImagesResponse>({
      images: review.images as ReviewImagePayload[],
    })
  } catch (error) {
    console.error('Failed to fetch review images:', error)
    return NextResponse.json<ErrorResponse>({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * POST /api/reviews/[id]/images
 * Direct server upload using FormData
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UploadImagesResponse | ErrorResponse>> {
  try {
    const { id } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify review ownership
    const review = await prisma.review.findFirst({
      where: {
        id,
        customerId: session.user.id,
      },
      include: {
        images: true,
      },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Check if review has reached max images
    if (review.images.length >= IMAGE_UPLOAD_CONFIG.maxImagesPerReview) {
      return NextResponse.json(
        {
          error: `Maximum ${IMAGE_UPLOAD_CONFIG.maxImagesPerReview} images allowed per review`,
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

    console.log(`Processing ${files.length} files for review ${id}`)

    const uploadedImages: ReviewImagePayload[] = []
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
        if (!isValidFileSize(file.size, ImageType.REVIEW)) {
          console.error(`Invalid file size: ${file.size} for ${file.name}`)
          failedFiles.push(file.name)
          continue
        }

        // Generate unique filename for GCS
        const gcsFilename = generateImageFilename(file.name, id, ImageType.REVIEW)

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to GCS
        console.log(`Uploading ${file.name} to GCS as ${gcsFilename}`)
        const publicUrl = await uploadBuffer(buffer, gcsFilename, file.type, {
          reviewId: id,
          uploadedBy: session.user.email || session.user.id,
        })

        console.log(`Successfully uploaded ${file.name} to GCS: ${publicUrl}`)

        // Create database record for the image
        const order: number = review.images.length + processedCount

        const reviewImage = await prisma.reviewImage.create({
          data: {
            reviewId: id,
            url: publicUrl,
            filename: file.name,
            mimeType: file.type,
            size: file.size,
            order,
          },
          select: {
            id: true,
            reviewId: true,
            url: true,
            filename: true,
            mimeType: true,
            size: true,
            order: true,
            createdAt: true,
          },
        })

        uploadedImages.push(reviewImage)
        processedCount++
        console.log(`Created database record for ${file.name}: ${reviewImage.id}`)
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

    const response: UploadImagesResponse = {
      message,
      images: uploadedImages,
    }

    if (failedFiles.length > 0) {
      response.failedFiles = failedFiles
    }

    return NextResponse.json<UploadImagesResponse>(response)
  } catch (error) {
    console.error('Failed to upload images:', error)
    return NextResponse.json<ErrorResponse>({ error: 'Failed to upload images' }, { status: 500 })
  }
}

/**
 * DELETE /api/reviews/[id]/images
 * Delete review images
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DeleteImagesResponse | ErrorResponse>> {
  try {
    const { id } = await params
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify review ownership
    const review = await prisma.review.findFirst({
      where: {
        id,
        customerId: session.user.id,
      },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const body = await request.json()
    const { imageIds } = deleteImagesSchema.parse(body)

    // Get images to delete
    const imagesToDelete = await prisma.reviewImage.findMany({
      where: {
        id: { in: imageIds },
        reviewId: id,
      },
    })

    // Delete from GCS if applicable
    const gcsFilenames = imagesToDelete
      .filter((img) => isGcsUrl(img.url))
      .map((img) => extractFilenameFromUrl(img.url))
      .filter((filename): filename is string => filename !== null)

    if (gcsFilenames.length > 0) {
      await deleteImages(gcsFilenames)
    }

    // Delete from database
    await prisma.reviewImage.deleteMany({
      where: {
        id: { in: imageIds },
        reviewId: id,
      },
    })

    // Update order for remaining images
    const remainingImages = await prisma.reviewImage.findMany({
      where: { reviewId: id },
      orderBy: { order: 'asc' },
    })

    // Update order to be sequential
    for (let i = 0; i < remainingImages.length; i++) {
      if (remainingImages[i].order !== i) {
        await prisma.reviewImage.update({
          where: { id: remainingImages[i].id },
          data: { order: i },
        })
      }
    }

    return NextResponse.json<DeleteImagesResponse>({ message: 'Images deleted successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Failed to delete images:', error)
    return NextResponse.json<ErrorResponse>({ error: 'Failed to delete images' }, { status: 500 })
  }
}

// ============================================================================
// Type Exports
// ============================================================================

export type {
  ReviewImagePayload,
  GetReviewImagesResponse,
  UploadImagesResponse,
  DeleteImagesResponse,
  ErrorResponse as ReviewImagesErrorResponse,
}

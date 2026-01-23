import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import {
  generateProfileImageFilename,
  generateSignedUploadUrl,
  generateSignedReadUrl,
  deleteImage,
  extractFilenameFromUrl,
  isGcsUrl,
  getPublicUrl,
  isAllowedImageType,
  IMAGE_UPLOAD_CONFIG,
  isGcsConfigured,
} from '@/lib/gcs'

const MAX_FILE_SIZE = IMAGE_UPLOAD_CONFIG.profileImageMaxSize

// Error response type
export interface ErrorResponse {
  error: string
  details?: unknown
}

// Response types
export type DeleteProfileImageResponse = {
  success: boolean
  message: string
}

// GET - Deprecated: Direct client upload no longer supported
export async function GET(): Promise<NextResponse<{ error: string }>> {
  return NextResponse.json(
    {
      error:
        'Direct client upload not supported. Use POST /api/groomer/profile/image/upload instead.',
    },
    { status: 410 } // Gone
  )
}

// POST - Deprecated: Direct client upload no longer supported
export async function POST(): Promise<NextResponse<{ error: string }>> {
  return NextResponse.json(
    {
      error:
        'Direct client upload not supported. Use POST /api/groomer/profile/image/upload instead.',
    },
    { status: 410 } // Gone
  )
}

// DELETE - Remove profile image
export async function DELETE(): Promise<NextResponse<DeleteProfileImageResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user's image
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    })

    // Delete from GCS if it's a GCS URL
    if (currentUser?.image && isGcsUrl(currentUser.image)) {
      const filename = extractFilenameFromUrl(currentUser.image)
      if (filename) {
        await deleteImage(filename).catch(console.error)
      }
    }

    // Remove user's profile image
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Profile image removed successfully',
    })
  } catch (error) {
    console.error('Error removing profile image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

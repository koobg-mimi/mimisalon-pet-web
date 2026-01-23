import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import {
  generateProfileImageFilename,
  uploadBuffer,
  deleteImage,
  extractFilenameFromUrl,
  isGcsUrl,
  getPublicUrl,
  generateSignedReadUrl,
  isGcsConfigured,
} from '@/lib/gcs';

// Error response type
export interface ErrorResponse {
  error: string;
  details?: unknown;
}

// Request schema
export const uploadProfileImageSchema = z.object({
  imageData: z.string().min(1, 'Image data is required'),
  filename: z.string().min(1, 'Filename is required'),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif'], {
    message: 'Invalid MIME type. Only JPEG, PNG, WebP and GIF are allowed',
  }),
});

export type UploadProfileImageRequest = z.infer<typeof uploadProfileImageSchema>;

// Response types
export type UploadProfileImageResponse = {
  success: boolean;
  imageUrl: string | null;
  storageType: string;
  message: string;
};

export type DeleteProfileImageResponse = {
  success: boolean;
  message: string;
};

// POST - Upload image via Base64 (WebView friendly)
export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadProfileImageResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if GCS is configured
    if (!isGcsConfigured()) {
      return NextResponse.json({ error: 'Image upload service not configured' }, { status: 503 });
    }

    const body: unknown = await request.json();
    const validatedData = uploadProfileImageSchema.parse(body);
    const { imageData, filename, mimeType } = validatedData;

    // Convert Base64 to buffer
    let buffer: Buffer;
    try {
      // Remove data URL prefix if present
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    } catch (error) {
      console.error('Failed to parse Base64 data:', error);
      return NextResponse.json({ error: 'Invalid Base64 image data' }, { status: 400 });
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB` },
        { status: 400 }
      );
    }

    // Generate filename for GCS
    const extension =
      filename.split('.').pop() ||
      (mimeType.includes('jpeg')
        ? 'jpg'
        : mimeType.includes('png')
          ? 'png'
          : mimeType.includes('webp')
            ? 'webp'
            : mimeType.includes('gif')
              ? 'gif'
              : 'jpg');

    const gcsFilename = generateProfileImageFilename(session.user.id, extension);

    console.log('Uploading profile image via server proxy:', {
      gcsFilename,
      mimeType,
      userId: session.user.id,
      bufferSize: buffer.length,
    });

    // Delete old profile image if it exists and is stored in GCS
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    if (currentUser?.image && isGcsUrl(currentUser.image)) {
      const oldFilename = extractFilenameFromUrl(currentUser.image);
      if (oldFilename) {
        await deleteImage(oldFilename).catch(console.error);
      }
    }

    // Upload to GCS
    const publicUrl = await uploadBuffer(buffer, gcsFilename, mimeType, {
      userid: session.user.id,
      uploadedby: session.user.email || session.user.id,
    });

    // Update user's profile image URL
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: publicUrl,
      },
      select: {
        id: true,
        image: true,
      },
    });

    // Generate signed URL for the response
    let responseImageUrl = updatedUser.image;
    if (responseImageUrl && isGcsUrl(responseImageUrl)) {
      const extractedFilename = extractFilenameFromUrl(responseImageUrl);
      if (extractedFilename) {
        try {
          responseImageUrl = await generateSignedReadUrl(extractedFilename, 60);
        } catch (error) {
          console.error('Failed to generate signed URL for response:', error);
          // Fall back to public URL
        }
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: responseImageUrl,
      storageType: 'gcs',
      message: 'Image uploaded successfully via server proxy',
    });
  } catch (error) {
    console.error('Error uploading image via server proxy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove profile image
export async function DELETE(): Promise<NextResponse<DeleteProfileImageResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user's image
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    // Delete from GCS if it's a GCS URL
    if (currentUser?.image && isGcsUrl(currentUser.image)) {
      const filename = extractFilenameFromUrl(currentUser.image);
      if (filename) {
        await deleteImage(filename).catch(console.error);
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
    });

    return NextResponse.json({
      success: true,
      message: 'Profile image removed successfully',
    });
  } catch (error) {
    console.error('Error removing profile image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

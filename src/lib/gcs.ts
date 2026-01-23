import { Storage } from '@google-cloud/storage'
import * as fs from 'fs'
import { env } from './env'

// Initialize Google Cloud Storage
// Authentication:
// - Local: Application Default Credentials (gcloud auth)
// - Cloud Run: Workload Identity (automatic)
// If GOOGLE_APPLICATION_CREDENTIALS is set, use it; otherwise use ADC
const storageOptions: { projectId?: string; keyFilename?: string } = {
  projectId: env.GCS_PROJECT_ID,
}

// Only set keyFilename if the environment variable is provided AND the file exists
if (env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    // Check if the file exists before using it
    fs.accessSync(env.GOOGLE_APPLICATION_CREDENTIALS, fs.constants.R_OK)
    storageOptions.keyFilename = env.GOOGLE_APPLICATION_CREDENTIALS
    console.log('Using service account key file for GCS authentication')
  } catch {
    // File doesn't exist, fall back to ADC
    console.log('Service account key file not found, using Application Default Credentials')
  }
} else {
  console.log('Using Application Default Credentials for GCS')
}

const storage = new Storage(storageOptions)

// Lazy bucket initialization to prevent build-time errors when env vars are not available
let _appBucket: ReturnType<typeof storage.bucket> | null = null
let _bucketName: string | null = null

/**
 * Get the GCS bucket instance (lazy initialization)
 * This prevents build-time errors when environment variables are not available
 */
function getBucket() {
  if (!_appBucket) {
    _bucketName = env.GCS_APP_BUCKET
    _appBucket = storage.bucket(_bucketName)
  }
  return _appBucket
}

/**
 * Get the bucket name (lazy initialization)
 */
function getBucketName(): string {
  if (!_bucketName) {
    _bucketName = env.GCS_APP_BUCKET
  }
  return _bucketName
}

// Export as a getter to maintain API compatibility
export const appBucket = new Proxy({} as ReturnType<typeof storage.bucket>, {
  get(_, prop) {
    return (getBucket() as any)[prop]
  },
})

// Export bucket name accessor (as a function to maintain lazy initialization)
export { getBucketName as getBucketName }

// Configuration
export const IMAGE_UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxImagesPerPet: 10,
  maxImagesPerReview: 5,
  profileImageMaxSize: 5 * 1024 * 1024, // 5MB for profile
  thumbnailSizes: {
    small: { width: 150, height: 150 },
    medium: { width: 400, height: 400 },
    large: { width: 800, height: 800 },
  },
}

// Image type enum for folder structure
export enum ImageType {
  PROFILE = 'profiles',
  PET = 'pets',
  REVIEW = 'reviews',
}

/**
 * Generate a unique filename for uploaded images based on type
 */
export function generateImageFilename(
  originalName: string,
  entityId: string,
  imageType: ImageType
): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${imageType}/${entityId}/${timestamp}-${randomString}.${extension}`
}

/**
 * Generate a unique filename for profile images (overwrites existing)
 */
export function generateProfileImageFilename(userId: string, extension: string): string {
  // Profile images use a fixed name to enable overwriting
  return `${ImageType.PROFILE}/${userId}/profile.${extension}`
}

/**
 * Generate signed URL for direct upload from browser
 */
export async function generateSignedUploadUrl(
  filename: string,
  contentType: string,
  metadata?: Record<string, string>,
  maxSize?: number
): Promise<{ url: string; fields: Record<string, string> }> {
  const file = appBucket.file(filename)

  console.log(`Generating signed URL for ${filename}:`, {
    requestedSize: maxSize,
    contentType,
    bucket: getBucketName(),
    metadata,
  })

  try {
    // For uniform bucket-level access, we need to be more flexible with conditions
    // The content-length-range condition can cause issues with FormData overhead
    const conditions: Array<[string, string, string] | [string, number, number]> = [
      ['starts-with', '$Content-Type', contentType.split('/')[0]], // More flexible: "image" instead of "image/png"
    ]

    // Only add content-length-range if we have a reasonable size limit
    // Make it very permissive to account for FormData overhead
    if (maxSize && maxSize > 0) {
      // Allow up to 2x the file size for FormData overhead and metadata
      const maxAllowed = Math.min(maxSize * 2, IMAGE_UPLOAD_CONFIG.maxFileSize * 1.5)
      conditions.push(['content-length-range', 0, maxAllowed])
    }

    // Convert metadata to GCS format with x-goog-meta- prefix
    const gcsMetadata: Record<string, string> = {}
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        // GCS requires custom metadata to be prefixed with x-goog-meta-
        const metaKey = `x-goog-meta-${key.toLowerCase()}`
        gcsMetadata[metaKey] = value
        // Add condition to allow this metadata field
        conditions.push(['starts-with', `$${metaKey}`, ''])
      })
    }

    // Ensure Content-Type is included in the fields
    const policyFields = {
      ...gcsMetadata, // Include the prefixed metadata
      'Content-Type': contentType, // Must include Content-Type field
    }

    const [response] = await file.generateSignedPostPolicyV4({
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      conditions,
      fields: policyFields,
    })

    console.log(`Signed URL generated successfully for ${filename}`, {
      fieldsCount: Object.keys(response.fields).length,
      fieldKeys: Object.keys(response.fields),
    })

    return {
      url: response.url,
      fields: response.fields,
    }
  } catch (error) {
    console.error(`Failed to generate signed URL for ${filename}:`, error)
    throw error
  }
}

/**
 * Generate signed URL for reading images
 */
export async function generateSignedReadUrl(
  filename: string,
  expiresInMinutes: number = 60
): Promise<string> {
  const file = appBucket.file(filename)
  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  })
  return url
}

/**
 * Upload buffer directly to GCS (for WebView/server proxy)
 */
export async function uploadBuffer(
  buffer: Buffer,
  filename: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<string> {
  try {
    const file = appBucket.file(filename)

    // Convert metadata to GCS format with x-goog-meta- prefix
    const gcsMetadata: Record<string, string> = {}
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        gcsMetadata[`x-goog-meta-${key.toLowerCase()}`] = value
      })
    }

    console.log(`Uploading buffer to GCS: ${filename}`, {
      size: buffer.length,
      contentType,
      metadataKeys: Object.keys(gcsMetadata),
    })

    // Upload buffer
    await file.save(buffer, {
      metadata: {
        contentType,
        metadata: gcsMetadata,
      },
      resumable: false, // Use simple upload for smaller files
    })

    // Return public URL
    const publicUrl = getPublicUrl(filename)
    console.log(`Buffer uploaded successfully: ${publicUrl}`)

    return publicUrl
  } catch (error) {
    console.error(`Failed to upload buffer to ${filename}:`, error)
    throw error
  }
}

/**
 * Delete an image from GCS
 */
export async function deleteImage(filename: string): Promise<void> {
  try {
    await appBucket.file(filename).delete()
  } catch (error) {
    console.error(`Failed to delete image ${filename}:`, error)
    // Don't throw error if image doesn't exist
    if ((error as { code?: number }).code !== 404) {
      throw error
    }
  }
}

/**
 * Delete multiple images from GCS
 */
export async function deleteImages(filenames: string[]): Promise<void> {
  const deletePromises = filenames.map((filename) => deleteImage(filename))
  await Promise.allSettled(deletePromises)
}

/**
 * Get public URL for an uploaded image
 */
export function getPublicUrl(filename: string): string {
  return `https://storage.googleapis.com/${getBucketName()}/${filename}`
}

/**
 * Check if a URL is a GCS URL or base64 data URL
 */
export function isGcsUrl(url: string): boolean {
  return url.startsWith('https://storage.googleapis.com/') || url.startsWith('gs://')
}

/**
 * Check if a URL is a data URL (base64)
 */
export function isDataUrl(url: string): boolean {
  return url.startsWith('data:')
}

/**
 * Extract filename from GCS URL
 */
export function extractFilenameFromUrl(url: string): string | null {
  if (!isGcsUrl(url)) return null

  // Remove bucket prefix and return path
  const bucketName = getBucketName()
  const bucketPrefix = `https://storage.googleapis.com/${bucketName}/`
  if (url.startsWith(bucketPrefix)) {
    return url.substring(bucketPrefix.length)
  }

  // Handle gs:// format
  const gsPrefix = `gs://${bucketName}/`
  if (url.startsWith(gsPrefix)) {
    return url.substring(gsPrefix.length)
  }

  return null
}

/**
 * Check if file type is allowed
 */
export function isAllowedImageType(mimeType: string): boolean {
  return IMAGE_UPLOAD_CONFIG.allowedMimeTypes.includes(mimeType)
}

/**
 * Validate file size based on image type
 */
export function isValidFileSize(size: number, imageType?: ImageType): boolean {
  let maxSize = IMAGE_UPLOAD_CONFIG.maxFileSize

  if (imageType === ImageType.PROFILE) {
    maxSize = IMAGE_UPLOAD_CONFIG.profileImageMaxSize
  }

  return size > 0 && size <= maxSize
}

/**
 * Get environment name from bucket name
 */
export function getEnvironment(): string {
  const bucketName = getBucketName()
  if (bucketName.includes('-staging-')) return 'staging'
  if (bucketName.includes('-production-')) return 'production'
  return 'development'
}

/**
 * Check if GCS is properly configured
 */
export function isGcsConfigured(): boolean {
  return !!process.env.GCS_PROJECT_ID && !!process.env.GCS_APP_BUCKET
}

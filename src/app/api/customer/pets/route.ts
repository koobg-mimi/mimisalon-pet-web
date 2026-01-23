import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import auth from '@/lib/auth'
import { prisma, Prisma } from '@mimisalon/shared'
import { extractFilenameFromUrl, generateSignedReadUrl, isGcsUrl } from '@/lib/gcs'

/**
 * ============================================
 * EXPORTED TYPES - API Contract
 * ============================================
 */

/**
 * Pet with breed and images relations
 *
 * Note: Dates are serialized as ISO strings for API responses
 */
export type PetWithRelations = Omit<
  Prisma.PetGetPayload<{
    include: {
      breed: true
      images: true
    }
  }>,
  'createdAt' | 'updatedAt' | 'birthDate' | 'vaccinationDate'
> & {
  createdAt: string
  updatedAt: string
  birthDate: string | null
  vaccinationDate: string | null
}

/**
 * Create pet request schema
 */
export const createPetSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  type: z.enum(['DOG', 'CAT']),
  breedId: z.string().optional(),
  weight: z.number().positive().optional(),
  age: z.number().int().positive().optional(),
  birthDate: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).optional(),
  hairType: z.enum(['SHORT_HAIR', 'LONG_HAIR']).optional().nullable(),
  specialNeeds: z.string().optional(),
  vaccinationStatus: z.enum(['UP_TO_DATE', 'OVERDUE', 'PARTIAL', 'UNKNOWN']).optional(),
  vaccinationDate: z.string().datetime().optional(),
})

/**
 * Create pet input type
 */
export type CreatePetInput = z.infer<typeof createPetSchema>

// GET /api/customer/pets - Get all pets for the current customer
export async function GET(): Promise<NextResponse<PetWithRelations[]> | Response> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const pets = await prisma.pet.findMany({
      where: {
        customerId: session.user.id,
        isActive: true,
      },
      include: {
        breed: true, // Include breed relationship
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Generate signed URLs for primary images
    const petsWithSignedUrls = await Promise.all(
      pets.map(async (pet) => {
        // Early return for pets without images
        if (!pet.images || pet.images.length === 0) {
          return pet
        }

        const updatedImages = await Promise.all(
          pet.images.map(async (image) => {
            // Ensure URL is a string
            if (typeof image.url !== 'string') {
              console.warn(`Invalid image URL type: ${typeof image.url}`)
              return image
            }

            // Only process GCS URLs
            if (!isGcsUrl(image.url)) {
              return image
            }

            const filename = extractFilenameFromUrl(image.url)
            if (!filename) {
              console.warn(`Could not extract filename from GCS URL: ${image.url}`)
              return image
            }

            try {
              // Generate a signed URL valid for 1 hour
              const signedUrl = await generateSignedReadUrl(filename, 60)
              return {
                ...image,
                url: signedUrl,
              }
            } catch (error) {
              console.error(`Failed to generate signed URL for ${filename}:`, error)
              // Fall back to original URL if signed URL generation fails
              return image
            }
          })
        )

        return {
          ...pet,
          images: updatedImages,
        }
      })
    )

    const response = NextResponse.json(petsWithSignedUrls)

    // Add cache-busting headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Failed to fetch pets:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// POST /api/customer/pets - Create a new pet
export async function POST(
  request: NextRequest
): Promise<NextResponse<PetWithRelations> | Response> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPetSchema.parse(body)

    // Ensure hairType is only set for cats
    if (validatedData.type === 'DOG' && validatedData.hairType) {
      validatedData.hairType = null
    }

    const pet = await prisma.pet.create({
      data: {
        ...validatedData,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : undefined,
        vaccinationDate: validatedData.vaccinationDate
          ? new Date(validatedData.vaccinationDate)
          : undefined,
        customerId: session.user.id,
      },
      include: {
        breed: true, // Include breed data in response
        images: true,
      },
    })

    return NextResponse.json(pet)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 })
    }
    console.error('Failed to create pet:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

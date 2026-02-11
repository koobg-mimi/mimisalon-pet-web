import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import auth from '@/lib/auth'
import { prisma, Prisma } from '@mimisalon/shared'
import { geocodeAddress } from '@/lib/kakao-geocode'

/**
 * ============================================
 * EXPORTED TYPES - API Contract
 * ============================================
 */

/**
 * Address from database
 *
 * Note: Dates are serialized as ISO strings for API responses
 */
export type Address = Omit<
  Prisma.AddressGetPayload<{
    select: {
      id: true
      street: true
      city: true
      state: true
      zipCode: true
      country: true
      isDefault: true
      centerLat: true
      centerLng: true
      createdAt: true
      updatedAt: true
    }
  }>,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

/**
 * Create address request schema
 */
export const createAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().default('KR'),
  isDefault: z.boolean().default(false),
  detailAddress: z.string().optional(),
})

/**
 * Create address input type
 */
export type CreateAddressInput = z.infer<typeof createAddressSchema>

// GET /api/customer/addresses - Get all customer addresses
export async function GET(): Promise<NextResponse<Address[]> | Response> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' } as never, { status: 401 })
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' } as never, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' } as never, { status: 404 })
    }

    const addresses = await prisma.address.findMany({
      where: { customerId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Addresses fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' } as never, { status: 500 })
  }
}

// POST /api/customer/addresses - Create a new address
export async function POST(request: NextRequest): Promise<NextResponse<Address> | Response> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' } as never, { status: 401 })
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' } as never, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' } as never, { status: 404 })
    }

    const body = await request.json()

    // Validate with Zod schema
    const validationResult = createAddressSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error },
        { status: 400 }
      )
    }

    const { street, city, state, zipCode, country, isDefault, detailAddress } =
      validationResult.data

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          customerId: user.id,
          isDefault: true,
        },
        data: { isDefault: false },
      })
    }

    // Check if this is the first address - make it default
    const addressCount = await prisma.address.count({
      where: { customerId: user.id },
    })

    // Geocode the address to get coordinates
    const fullAddress = `${street}${detailAddress ? ` ${detailAddress}` : ''}`
    let centerLat: number | null = null
    let centerLng: number | null = null

    console.log('🔍 Starting geocoding for address:', {
      street,
      detailAddress,
      fullAddress,
      city,
      state,
    })

    try {
      const geocodeResult = await geocodeAddress(fullAddress)
      console.log('✅ Geocode result:', geocodeResult)
      if (geocodeResult) {
        centerLat = geocodeResult.latitude
        centerLng = geocodeResult.longitude
      } else {
        console.warn('⚠️ Geocoding returned null, address will be saved without coordinates')
      }
    } catch (error) {
      console.error('❌ Geocoding failed for address:', {
        address: fullAddress,
        error: error instanceof Error ? error.message : String(error),
      })
      console.warn('⚠️ Continuing without coordinates - user can geocode later')
      // Continue without coordinates - this is not a blocking error
    }

    console.log('📍 Address will be saved with coordinates:', {
      centerLat,
      centerLng,
      hasCoordinates: centerLat !== null && centerLng !== null,
    })

    const newAddress = await prisma.address.create({
      data: {
        street: fullAddress,
        city,
        state,
        zipCode,
        country,
        isDefault: addressCount === 0 ? true : isDefault,
        centerLat,
        centerLng,
        customerId: user.id,
      },
    })

    return NextResponse.json(newAddress, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues } as never, {
        status: 400,
      })
    }
    console.error('Address creation error:', error)
    return NextResponse.json({ error: 'Internal server error' } as never, { status: 500 })
  }
}

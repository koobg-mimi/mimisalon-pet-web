import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { geocodeAddress } from '@/lib/kakao-geocode'

// ============================================
// Type Definitions
// ============================================

/**
 * Request schema for updating an address
 */
export const updateAddressSchema = z.object({
  street: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zipCode: z.string().min(1).optional(),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
  detailAddress: z.string().optional(),
})

/**
 * Request type for updating an address
 */
export type UpdateAddressRequest = z.infer<typeof updateAddressSchema>

/**
 * Response type for address
 */
export type AddressResponse = Prisma.AddressGetPayload<object>

/**
 * Response type for delete operation
 */
export type DeleteAddressResponse = {
  message: string
}

// ============================================
// API Handlers
// ============================================

/**
 * PUT /api/customer/addresses/[id] - Update an address
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<AddressResponse>> {
  try {
    const { id } = await params
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

    // Check if the address belongs to the user
    const address = await prisma.address.findFirst({
      where: {
        id: id,
        customerId: user.id,
      },
    })

    if (!address) {
      return NextResponse.json({ error: 'Address not found' } as never, { status: 404 })
    }

    const body: unknown = await request.json()
    const validatedData = updateAddressSchema.parse(body)

    // If this is set as default, unset other default addresses
    if (validatedData.isDefault && !address.isDefault) {
      await prisma.address.updateMany({
        where: {
          customerId: user.id,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      })
    }

    // Prepare update data
    const updateData: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
      isDefault?: boolean
      centerLat?: number
      centerLng?: number
    } = {}

    // Handle address changes and geocoding
    if (validatedData.street) {
      const fullAddress = `${validatedData.street}${validatedData.detailAddress ? ` ${validatedData.detailAddress}` : ''}`
      updateData.street = fullAddress

      // Geocode the new address to get coordinates
      try {
        const geocodeResult = await geocodeAddress(fullAddress)
        if (geocodeResult) {
          updateData.centerLat = geocodeResult.latitude
          updateData.centerLng = geocodeResult.longitude
        }
      } catch (error) {
        console.warn('Failed to geocode updated customer address:', error)
        // Continue without updating coordinates - this is not a blocking error
      }
    }

    // Add other field updates
    if (validatedData.city) updateData.city = validatedData.city
    if (validatedData.state) updateData.state = validatedData.state
    if (validatedData.zipCode) updateData.zipCode = validatedData.zipCode
    if (validatedData.country) updateData.country = validatedData.country
    if (validatedData.isDefault !== undefined) updateData.isDefault = validatedData.isDefault

    const updatedAddress = await prisma.address.update({
      where: { id: id },
      data: updateData,
    })

    return NextResponse.json<AddressResponse>(updatedAddress)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues } as never, {
        status: 400,
      })
    }
    console.error('Address update error:', error)
    return NextResponse.json({ error: 'Internal server error' } as never, { status: 500 })
  }
}

/**
 * DELETE /api/customer/addresses/[id] - Delete an address
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DeleteAddressResponse>> {
  try {
    const { id } = await params
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

    // Check if the address belongs to the user
    const address = await prisma.address.findFirst({
      where: {
        id: id,
        customerId: user.id,
      },
    })

    if (!address) {
      return NextResponse.json({ error: 'Address not found' } as never, { status: 404 })
    }

    // If deleting default address, set another as default
    if (address.isDefault) {
      const otherAddress = await prisma.address.findFirst({
        where: {
          customerId: user.id,
          id: { not: id },
        },
        orderBy: { createdAt: 'desc' },
      })

      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        })
      }
    }

    await prisma.address.delete({
      where: { id: id },
    })

    return NextResponse.json<DeleteAddressResponse>({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Address deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' } as never, { status: 500 })
  }
}

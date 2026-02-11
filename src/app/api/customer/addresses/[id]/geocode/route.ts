import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { geocodeAddress } from '@/lib/kakao-geocode'

// POST /api/customer/addresses/[id]/geocode - Geocode an address and update coordinates
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    // Get the address
    const address = await prisma.address.findFirst({
      where: {
        id,
        customerId: session.user.id,
      },
    })

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Build full address string from components
    const fullAddress = `${address.street} ${address.city} ${address.state} ${address.zipCode} ${address.country}`.trim()

    console.log('🔍 Geocoding address:', {
      addressId: id,
      address: fullAddress,
    })

    // Attempt geocoding
    const geocodeResult = await geocodeAddress(fullAddress)

    if (!geocodeResult) {
      console.error('❌ Geocoding failed for address:', fullAddress)
      return NextResponse.json(
        { error: 'Failed to geocode address. Please verify the address is correct.' },
        { status: 400 }
      )
    }

    // Update address with coordinates
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        centerLat: geocodeResult.latitude,
        centerLng: geocodeResult.longitude,
      },
    })

    console.log('✅ Address geocoded successfully:', {
      addressId: id,
      latitude: geocodeResult.latitude,
      longitude: geocodeResult.longitude,
    })

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { canServiceLocation, calculateDistance } from '@/lib/geo-utils'

// GET /api/customer/groomers - Get groomers available for a specific address
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (session.user.role !== 'CUSTOMER') {
      return new NextResponse('Forbidden - Customer access only', {
        status: 403,
      })
    }

    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('addressId')

    if (!addressId) {
      return new NextResponse('addressId parameter is required', {
        status: 400,
      })
    }

    // Verify that the address belongs to the current customer
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        customerId: session.user.id,
      },
    })

    if (!address) {
      return new NextResponse('Address not found or access denied', {
        status: 404,
      })
    }

    // Get customer's coordinates (should be geocoded and stored, but if not, we need them)
    if (!address.centerLat || !address.centerLng) {
      console.error('Address not geocoded:', { addressId, address })
      return new NextResponse('Customer address must be geocoded first', {
        status: 400,
      })
    }

    console.log('🏠 Customer address:', {
      addressId,
      street: address.street,
      centerLat: address.centerLat,
      centerLng: address.centerLng,
    })

    // Find ALL active groomers with their work areas
    const groomers = await prisma.user.findMany({
      where: {
        role: 'GROOMER',
        groomerProfile: {
          isActive: true,
        },
        workAreas: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        workAreas: {
          where: {
            isActive: true,
          },
        },
        _count: {
          select: {
            groomerBookings: {
              where: {
                status: 'SERVICE_COMPLETED',
              },
            },
          },
        },
      },
    })

    console.log('💇 Found groomers:', {
      totalCount: groomers.length,
      groomers: groomers.map((g) => ({
        id: g.id,
        name: g.name,
        workAreasCount: g.workAreas.length,
        workAreas: g.workAreas.map((wa) => ({
          id: wa.id,
          name: wa.name,
          address: wa.address,
          centerLat: wa.centerLat,
          centerLng: wa.centerLng,
          radiusKm: wa.radiusKm,
        })),
      })),
    })

    // Filter groomers by service area coverage (coordinate-based)
    const serviceableGroomers = groomers
      .filter((groomer) => {
        // Check if groomer can service the customer location
        const canService = canServiceLocation(
          address.centerLat!,
          address.centerLng!,
          groomer.workAreas.map((area) => ({
            centerLat: area.centerLat,
            centerLng: area.centerLng,
            radiusKm: area.radiusKm,
          }))
        )

        if (!canService) {
          console.log(`❌ Groomer ${groomer.name} cannot service location`, {
            groomerWorkAreas: groomer.workAreas.map((wa) => ({
              name: wa.name,
              centerLat: wa.centerLat,
              centerLng: wa.centerLng,
              radiusKm: wa.radiusKm,
            })),
          })
        }

        return canService
      })
      .map((groomer) => {
        // Calculate distances to each work area
        const distances = groomer.workAreas.map((area) =>
          calculateDistance(address.centerLat!, address.centerLng!, area.centerLat, area.centerLng)
        )
        const closestDistance = Math.min(...distances)

        return {
          id: groomer.id,
          name: groomer.name || 'Unknown Groomer',
          rating: 4.5, // Placeholder - this would be calculated from reviews
          availability: [], // This will be populated by the availability API
          location: groomer.workAreas[0]?.name || 'Service Area',
          workAreas: groomer.workAreas.map((area) => ({
            id: area.id,
            name: area.name,
            address: area.address,
            distance: calculateDistance(
              address.centerLat!,
              address.centerLng!,
              area.centerLat,
              area.centerLng
            ),
          })),
          totalBookings: groomer._count.groomerBookings,
          closestDistance, // For sorting
        }
      })
      .sort((a, b) => a.closestDistance - b.closestDistance) // Sort by closest distance

    console.log('✅ Serviceable groomers:', {
      count: serviceableGroomers.length,
      groomers: serviceableGroomers.map((g) => ({
        id: g.id,
        name: g.name,
        closestDistance: g.closestDistance,
      })),
    })

    return NextResponse.json(serviceableGroomers)
  } catch (error) {
    console.error('Failed to fetch groomers:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

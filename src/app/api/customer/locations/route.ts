import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'

// GET /api/customer/locations - Get all service areas available
export async function GET() {
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

    // Get all active groomer work areas with groomer count
    const workAreas = await prisma.groomerWorkArea.findMany({
      where: {
        isActive: true,
      },
      include: {
        groomer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Group by area name and count groomers
    const locationMap = new Map()

    workAreas.forEach((area) => {
      const key = area.name
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          id: area.id, // Use the first area's id as representative
          name: area.name,
          address: area.address || '',
          groomers: [],
          groomerCount: 0,
        })
      }

      const location = locationMap.get(key)
      if (
        !location.groomers.find(
          (g: { id: string; name: string | null }) => g.id === area.groomer.id
        )
      ) {
        location.groomers.push(area.groomer)
        location.groomerCount++
      }
    })

    // Convert map to array and add some default locations for demo
    const locations = Array.from(locationMap.values())

    // Add some default service areas if none exist
    if (locations.length === 0) {
      locations.push(
        {
          id: 'default-gangnam',
          name: '강남구',
          address: '서울특별시 강남구',
          groomers: [],
          groomerCount: 3,
        },
        {
          id: 'default-hongdae',
          name: '홍대 근처',
          address: '서울특별시 마포구',
          groomers: [],
          groomerCount: 2,
        },
        {
          id: 'default-jamsil',
          name: '잠실',
          address: '서울특별시 송파구',
          groomers: [],
          groomerCount: 1,
        }
      )
    }

    // Transform to the expected format
    const formattedLocations = locations.map((location) => ({
      id: location.id,
      name: location.name,
      address: location.address,
      phone: '02-1234-5678', // Placeholder
      groomerCount: location.groomerCount,
      availableServices: ['기본 미용', '스파', '네일 케어'], // Placeholder
    }))

    return NextResponse.json(formattedLocations)
  } catch (error) {
    console.error('Failed to fetch locations:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

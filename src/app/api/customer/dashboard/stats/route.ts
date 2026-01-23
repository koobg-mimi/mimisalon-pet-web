import { ko } from 'date-fns/locale'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { format } from 'date-fns'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get user with their bookings
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        bookings: {
          include: {
            groomer: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            bookingPets: {
              include: {
                pet: true,
                services: {
                  include: {
                    service: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        pets: {
          where: { isActive: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate statistics
    const now = new Date()
    const bookings = user.bookings || []

    const totalBookings = bookings.length
    const completedBookings = bookings.filter((b) => b.status === 'SERVICE_COMPLETED').length
    const upcomingBookings = bookings.filter(
      (b) => b.status === 'GROOMER_CONFIRM' && new Date(b.serviceDate) > now
    ).length

    const totalSpent = bookings
      .filter((b) => b.status === 'SERVICE_COMPLETED')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

    // Find favorite groomer (most booked)
    const groomerCounts = new Map<
      string,
      {
        name: string
        image: string | null
        count: number
        totalRating: number
        completedCount: number
      }
    >()

    bookings.forEach((booking) => {
      if (booking.groomer) {
        const current = groomerCounts.get(booking.groomer.id) || {
          name: booking.groomer.name || 'Unknown',
          image: booking.groomer.image || null,
          count: 0,
          totalRating: 0,
          completedCount: 0,
        }
        current.count++
        // Only count ratings from completed bookings
        if (booking.status === 'SERVICE_COMPLETED' && booking.customerRating) {
          current.totalRating += booking.customerRating
          current.completedCount++
        }
        groomerCounts.set(booking.groomer.id, current)
      }
    })

    let favoriteGroomer = undefined
    let maxCount = 0
    groomerCounts.forEach((value) => {
      if (value.count > maxCount) {
        maxCount = value.count
        favoriteGroomer = {
          name: value.name,
          image: value.image,
          rating:
            value.completedCount > 0
              ? Math.round((value.totalRating / value.completedCount) * 10) / 10
              : 0,
        }
      }
    })

    // Get recent bookings (last 5)
    const recentBookings = bookings.slice(0, 5).map((booking) => ({
      id: booking.id,
      date: format(booking.serviceDate, 'yyyy-MM-dd', { locale: ko }),
      service: {
        name:
          booking.bookingPets?.[0]?.services?.[0]?.service?.name ||
          booking.serviceType ||
          'Service',
      },
      groomer: {
        name: booking.groomer?.name || 'Unassigned',
      },
      status: booking.status,
    }))

    return NextResponse.json({
      totalBookings,
      completedBookings,
      upcomingBookings,
      totalSpent,
      favoriteGroomer,
      recentBookings,
      totalPets: user.pets.length,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

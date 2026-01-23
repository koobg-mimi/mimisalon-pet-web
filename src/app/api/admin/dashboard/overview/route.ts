import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { BookingStatus, Prisma, prisma } from '@mimisalon/shared'

// ============================================================================
// Types
// ============================================================================

type DateRange = 'week' | 'month' | 'year'

/**
 * Booking with customer and groomer info
 */
type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    customer: {
      select: {
        name: true
        email: true
      }
    }
    groomer: {
      select: {
        name: true
        email: true
      }
    }
  }
}>

/**
 * Formatted recent booking for dashboard
 */
export interface RecentBooking {
  id: string
  bookingNumber: string
  customerName: string | null
  groomerName: string
  serviceDate: string // ISO string for Redux serialization
  totalPrice: number
  status: BookingStatus
  createdAt: string // ISO string for Redux serialization
}

/**
 * Dashboard metrics
 */
export interface DashboardMetrics {
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  cancelledBookings: number
  totalRevenue: number
  totalCustomers: number
  totalGroomers: number
  completionRate: number
  avgBookingValue: number
  averageRating: number
  totalReviews: number
}

/**
 * Service statistics
 */
export interface ServiceStats {
  serviceId: string
  name: string
  description: string | null
  bookingCount: number
  totalRevenue: number
}

/**
 * User growth data point
 */
export interface UserGrowthData {
  period: string // ISO date string
  newUsers: number
  cumulativeUsers: number
}

/**
 * Monthly revenue data point
 */
export interface MonthlyRevenueData {
  month: string // YYYY-MM format
  revenue: number // Total revenue in cents
  bookingCount: number // Number of bookings
}

/**
 * GET /api/admin/dashboard/overview response
 */
export interface DashboardOverviewResponse {
  metrics: DashboardMetrics
  previousMetrics: DashboardMetrics
  recentBookings: RecentBooking[]
  topServices: ServiceStats[]
  userGrowth: UserGrowthData[]
  monthlyRevenue: MonthlyRevenueData[]
  range: DateRange
  startDate: string // ISO string for Redux serialization
  endDate: string // ISO string for Redux serialization
  previousStartDate: string // ISO string for Redux serialization
  previousEndDate: string // ISO string for Redux serialization
}

interface ErrorResponse {
  error: string
}

// ============================================================================
// Handlers
// ============================================================================

export async function GET(
  request: NextRequest
): Promise<NextResponse<DashboardOverviewResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const rangeParam = searchParams.get('range')
    const range: DateRange = rangeParam === 'week' || rangeParam === 'year' ? rangeParam : 'month'

    // Calculate date ranges
    const now = new Date()
    let startDate: Date
    const endDate = new Date()

    switch (range) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Calculate previous period dates
    const periodDuration = endDate.getTime() - startDate.getTime()
    const previousEndDate = new Date(startDate.getTime() - 1) // 1ms before current period
    const previousStartDate = new Date(previousEndDate.getTime() - periodDuration)

    // Get overview statistics (current + previous period in parallel)
    const [
      totalBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      totalCustomers,
      totalGroomers,
      recentBookings,
      reviewStats,
      previousTotalBookings,
      previousCompletedBookings,
      previousTotalRevenue,
      previousTotalCustomers,
      topServicesData,
      userGrowthData,
      monthlyRevenueData,
    ] = await Promise.all([
      // Total bookings in range
      prisma.booking.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      // Completed bookings
      prisma.booking.count({
        where: {
          status: 'SERVICE_COMPLETED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      // Pending bookings (various pending states)
      prisma.booking.count({
        where: {
          status: {
            in: [
              'FIRST_PAYMENT_PENDING',
              'FIRST_PAYMENT_VERIFY',
              'GROOMER_CONFIRM_PENDING',
              'ADDITIONAL_PAYMENT_PENDING',
            ],
          },
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      // Cancelled bookings
      prisma.booking.count({
        where: {
          status: 'SERVICE_CANCELLED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      // Total revenue from completed payments
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      // Total customers
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      // Total groomers
      prisma.user.count({
        where: {
          role: 'GROOMER',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      // Recent bookings
      prisma.booking.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
          groomer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      // Review statistics
      prisma.review.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      }),
      // Previous period - Total bookings
      prisma.booking.count({
        where: {
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate,
          },
        },
      }),
      // Previous period - Completed bookings
      prisma.booking.count({
        where: {
          status: 'SERVICE_COMPLETED',
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate,
          },
        },
      }),
      // Previous period - Total revenue
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      // Previous period - Total customers
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate,
          },
        },
      }),
      // Top services by booking count
      (async () => {
        const topServices = await prisma.bookingService.groupBy({
          by: ['serviceId'],
          where: {
            bookingPet: {
              booking: {
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
                status: 'SERVICE_COMPLETED',
              },
            },
          },
          _count: {
            id: true,
          },
          _sum: {
            servicePrice: true,
          },
          orderBy: {
            _count: {
              id: 'desc',
            },
          },
          take: 10,
        })

        if (topServices.length === 0) return []

        const serviceIds = topServices.map((s) => s.serviceId)
        const services = await prisma.service.findMany({
          where: { id: { in: serviceIds } },
          select: {
            id: true,
            name: true,
            description: true,
          },
        })

        const serviceMap = new Map(services.map((s) => [s.id, s]))

        return topServices.map((ts) => {
          const service = serviceMap.get(ts.serviceId)
          return {
            serviceId: ts.serviceId,
            name: service?.name || 'Unknown Service',
            description: service?.description || null,
            bookingCount: ts._count.id,
            totalRevenue: ts._sum.servicePrice || 0,
          }
        })
      })(),
      // User growth data
      (async () => {
        // Determine grouping unit based on range
        const groupByUnit = range === 'week' ? 'day' : range === 'month' ? 'day' : 'month'

        const users = await prisma.user.findMany({
          where: {
            role: 'CUSTOMER',
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        })

        // Group users by period
        const groupedUsers = new Map<string, number>()
        users.forEach((user) => {
          const date = new Date(user.createdAt)
          let periodKey: string

          if (groupByUnit === 'day') {
            periodKey = date.toISOString().split('T')[0]
          } else {
            // month
            periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
          }

          groupedUsers.set(periodKey, (groupedUsers.get(periodKey) || 0) + 1)
        })

        // Convert to array with cumulative counts
        const sortedPeriods = Array.from(groupedUsers.keys()).sort()
        let cumulative = 0
        const growthData: UserGrowthData[] = sortedPeriods.map((period) => {
          const newUsers = groupedUsers.get(period) || 0
          cumulative += newUsers
          return {
            period,
            newUsers,
            cumulativeUsers: cumulative,
          }
        })

        return growthData
      })(),
      // Monthly revenue aggregation
      (async () => {
        // Determine number of months to query based on time range
        const monthsBack = range === 'year' ? 12 : range === 'month' ? 6 : 4
        const startOfPeriod = new Date()
        startOfPeriod.setMonth(startOfPeriod.getMonth() - monthsBack)
        startOfPeriod.setDate(1)
        startOfPeriod.setHours(0, 0, 0, 0)

        // Fetch all completed bookings in the period
        const bookings = await prisma.booking.findMany({
          where: {
            createdAt: {
              gte: startOfPeriod,
              lte: endDate,
            },
            status: 'SERVICE_COMPLETED',
          },
          select: {
            createdAt: true,
            totalPrice: true,
          },
        })

        // Group bookings by month
        const revenueByMonth = new Map<string, { revenue: number; count: number }>()
        bookings.forEach((booking) => {
          const date = new Date(booking.createdAt)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

          const existing = revenueByMonth.get(monthKey) || { revenue: 0, count: 0 }
          revenueByMonth.set(monthKey, {
            revenue: existing.revenue + booking.totalPrice,
            count: existing.count + 1,
          })
        })

        // Convert to array and fill in missing months with zero
        const monthlyData: MonthlyRevenueData[] = []
        for (let i = monthsBack - 1; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

          const data = revenueByMonth.get(monthKey) || { revenue: 0, count: 0 }
          monthlyData.push({
            month: monthKey,
            revenue: data.revenue,
            bookingCount: data.count,
          })
        }

        return monthlyData
      })(),
    ])

    // Calculate completion rate
    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0

    // Calculate average booking value
    const avgBookingValue =
      completedBookings > 0 ? (totalRevenue._sum.amount || 0) / completedBookings : 0

    // Calculate previous period metrics
    const previousCompletionRate =
      previousTotalBookings > 0 ? (previousCompletedBookings / previousTotalBookings) * 100 : 0
    const previousAvgBookingValue =
      previousCompletedBookings > 0
        ? (previousTotalRevenue._sum.amount || 0) / previousCompletedBookings
        : 0

    const overview = {
      metrics: {
        totalBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalCustomers,
        totalGroomers,
        completionRate: Math.round(completionRate * 100) / 100,
        avgBookingValue: Math.round(avgBookingValue * 100) / 100,
        averageRating: reviewStats._avg.rating || 0,
        totalReviews: reviewStats._count.id,
      },
      previousMetrics: {
        totalBookings: previousTotalBookings,
        completedBookings: previousCompletedBookings,
        pendingBookings: 0, // Not tracked for previous period
        cancelledBookings: 0, // Not tracked for previous period
        totalRevenue: previousTotalRevenue._sum.amount || 0,
        totalCustomers: previousTotalCustomers,
        totalGroomers: 0, // Not tracked for previous period
        completionRate: Math.round(previousCompletionRate * 100) / 100,
        avgBookingValue: Math.round(previousAvgBookingValue * 100) / 100,
        averageRating: 0, // Not tracked for previous period
        totalReviews: 0, // Not tracked for previous period
      },
      recentBookings: recentBookings.map((booking) => ({
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        customerName: booking.customer.name,
        groomerName: booking.groomer?.name || '미배정',
        serviceDate: booking.serviceDate.toISOString(),
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
      })),
      topServices: topServicesData,
      userGrowth: userGrowthData,
      monthlyRevenue: monthlyRevenueData,
      range,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      previousStartDate: previousStartDate.toISOString(),
      previousEndDate: previousEndDate.toISOString(),
    }

    return NextResponse.json(overview)
  } catch (error) {
    console.error('Error fetching dashboard overview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

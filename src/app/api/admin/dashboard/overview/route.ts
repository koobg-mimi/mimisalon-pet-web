import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { BookingStatus, Prisma, prisma } from '@mimisalon/shared'

type DateRange = 'week' | 'month' | 'year'

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

export interface RecentBooking {
  id: string
  bookingNumber: string
  customerName: string | null
  groomerName: string
  serviceDate: string
  totalPrice: number
  status: BookingStatus
  createdAt: string
}

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

export interface ServiceStats {
  serviceId: string
  name: string
  description: string | null
  bookingCount: number
  totalRevenue: number
}

export interface UserGrowthData {
  period: string
  newUsers: number
  cumulativeUsers: number
}

export interface MonthlyRevenueData {
  month: string
  revenue: number
  bookingCount: number
}

export interface DashboardOverviewResponse {
  metrics: DashboardMetrics
  previousMetrics: DashboardMetrics
  recentBookings: RecentBooking[]
  topServices: ServiceStats[]
  userGrowth: UserGrowthData[]
  monthlyRevenue: MonthlyRevenueData[]
  range: DateRange
  startDate: string
  endDate: string
  previousStartDate: string
  previousEndDate: string
}

interface ErrorResponse {
  error: string
}

const PENDING_STATUSES: BookingStatus[] = [
  BookingStatus.FIRST_PAYMENT_PENDING,
  BookingStatus.FIRST_PAYMENT_VERIFY,
  BookingStatus.GROOMER_CONFIRM_PENDING,
  BookingStatus.ADDITIONAL_PAYMENT_PENDING,
]

function sumStatusCount(
  grouped: Array<{ status: BookingStatus; _count: { _all: number } }>,
  targets?: BookingStatus[]
): number {
  if (!targets) return grouped.reduce((acc, g) => acc + g._count._all, 0)
  const set = new Set(targets)
  return grouped.reduce((acc, g) => acc + (set.has(g.status) ? g._count._all : 0), 0)
}

async function safeWithTimeout<T>(
  label: string,
  work: () => Promise<T>,
  fallback: T,
  timeoutMs = 1800
): Promise<T> {
  try {
    return await Promise.race([
      work(),
      new Promise<T>((resolve) =>
        setTimeout(() => {
          console.warn(`[Dashboard Overview] ${label} timeout -> fallback`)
          resolve(fallback)
        }, timeoutMs)
      ),
    ])
  } catch (error) {
    console.error(`[Dashboard Overview] ${label} failed:`, error)
    return fallback
  }
}

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

    const periodDuration = endDate.getTime() - startDate.getTime()
    const previousEndDate = new Date(startDate.getTime() - 1)
    const previousStartDate = new Date(previousEndDate.getTime() - periodDuration)

    // connection_limit=1 환경에서도 버티도록 핵심 쿼리 수/동시성 자체를 줄임
    const currentBookingGrouped = await prisma.booking.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: { _all: true },
    })

    const previousBookingGrouped = await prisma.booking.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: previousStartDate, lte: previousEndDate },
      },
      _count: { _all: true },
    })

    const totalRevenue = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    })

    const previousTotalRevenue = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: previousStartDate, lte: previousEndDate },
      },
      _sum: { amount: true },
    })

    const userRoleGrouped = await prisma.user.groupBy({
      by: ['role'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: { _all: true },
    })

    const previousCustomerCount = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: previousStartDate, lte: previousEndDate },
      },
    })

    const reviewStats = await prisma.review.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _avg: { rating: true },
      _count: { id: true },
    })

    const totalBookings = sumStatusCount(currentBookingGrouped)
    const completedBookings = sumStatusCount(currentBookingGrouped, [BookingStatus.SERVICE_COMPLETED])
    const cancelledBookings = sumStatusCount(currentBookingGrouped, [BookingStatus.SERVICE_CANCELLED])
    const pendingBookings = sumStatusCount(currentBookingGrouped, PENDING_STATUSES)

    const previousTotalBookings = sumStatusCount(previousBookingGrouped)
    const previousCompletedBookings = sumStatusCount(previousBookingGrouped, [
      BookingStatus.SERVICE_COMPLETED,
    ])

    const totalCustomers =
      userRoleGrouped.find((g) => g.role === 'CUSTOMER')?._count._all ?? 0
    const totalGroomers = userRoleGrouped.find((g) => g.role === 'GROOMER')?._count._all ?? 0

    // 비핵심 데이터는 fallback 허용
    const [recentBookings, topServicesData, userGrowthData, monthlyRevenueData] = await Promise.all([
      safeWithTimeout(
        'recentBookings',
        async () =>
          prisma.booking.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              customer: { select: { name: true, email: true } },
              groomer: { select: { name: true, email: true } },
            },
          }),
        [] as BookingWithRelations[]
      ),
      safeWithTimeout(
        'topServices',
        async () => {
          const topServices = await prisma.bookingService.groupBy({
            by: ['serviceId'],
            where: {
              bookingPet: {
                booking: {
                  createdAt: { gte: startDate, lte: endDate },
                  status: 'SERVICE_COMPLETED',
                },
              },
            },
            _count: { id: true },
            _sum: { servicePrice: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
          })

          if (topServices.length === 0) return [] as ServiceStats[]

          const serviceIds = topServices.map((s) => s.serviceId)
          const services = await prisma.service.findMany({
            where: { id: { in: serviceIds } },
            select: { id: true, name: true, description: true },
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
        },
        [] as ServiceStats[]
      ),
      safeWithTimeout(
        'userGrowth',
        async () => {
          const groupByUnit = range === 'year' ? 'month' : 'day'
          const users = await prisma.user.findMany({
            where: {
              role: 'CUSTOMER',
              createdAt: { gte: startDate, lte: endDate },
            },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' },
          })

          const groupedUsers = new Map<string, number>()
          for (const user of users) {
            const date = new Date(user.createdAt)
            const periodKey =
              groupByUnit === 'day'
                ? date.toISOString().split('T')[0]
                : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
            groupedUsers.set(periodKey, (groupedUsers.get(periodKey) || 0) + 1)
          }

          const sortedPeriods = Array.from(groupedUsers.keys()).sort()
          let cumulative = 0
          return sortedPeriods.map((period) => {
            const newUsers = groupedUsers.get(period) || 0
            cumulative += newUsers
            return {
              period,
              newUsers,
              cumulativeUsers: cumulative,
            }
          })
        },
        [] as UserGrowthData[]
      ),
      safeWithTimeout(
        'monthlyRevenue',
        async () => {
          const monthsBack = range === 'year' ? 12 : range === 'month' ? 6 : 4
          const startOfPeriod = new Date()
          startOfPeriod.setMonth(startOfPeriod.getMonth() - monthsBack)
          startOfPeriod.setDate(1)
          startOfPeriod.setHours(0, 0, 0, 0)

          const bookings = await prisma.booking.findMany({
            where: {
              createdAt: { gte: startOfPeriod, lte: endDate },
              status: 'SERVICE_COMPLETED',
            },
            select: {
              createdAt: true,
              totalPrice: true,
            },
          })

          const revenueByMonth = new Map<string, { revenue: number; count: number }>()
          for (const booking of bookings) {
            const date = new Date(booking.createdAt)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            const existing = revenueByMonth.get(monthKey) || { revenue: 0, count: 0 }
            revenueByMonth.set(monthKey, {
              revenue: existing.revenue + booking.totalPrice,
              count: existing.count + 1,
            })
          }

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
        },
        [] as MonthlyRevenueData[]
      ),
    ])

    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0
    const avgBookingValue =
      completedBookings > 0 ? (totalRevenue._sum.amount || 0) / completedBookings : 0

    const previousCompletionRate =
      previousTotalBookings > 0 ? (previousCompletedBookings / previousTotalBookings) * 100 : 0
    const previousAvgBookingValue =
      previousCompletedBookings > 0
        ? (previousTotalRevenue._sum.amount || 0) / previousCompletedBookings
        : 0

    return NextResponse.json({
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
        pendingBookings: 0,
        cancelledBookings: 0,
        totalRevenue: previousTotalRevenue._sum.amount || 0,
        totalCustomers: previousCustomerCount,
        totalGroomers: 0,
        completionRate: Math.round(previousCompletionRate * 100) / 100,
        avgBookingValue: Math.round(previousAvgBookingValue * 100) / 100,
        averageRating: 0,
        totalReviews: 0,
      },
      recentBookings: recentBookings.map((booking) => ({
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        customerName: booking.customer?.name ?? '알 수 없음',
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
    })
  } catch (error) {
    console.error('Error fetching dashboard overview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

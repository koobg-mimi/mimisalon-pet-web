import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total users count by role
    const [totalUsers, totalCustomers, totalGroomers, totalAdmins] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'GROOMER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
    ])

    // Get booking statistics
    const [totalBookings, pendingBookings, completedBookings, cancelledBookings] =
      await Promise.all([
        prisma.booking.count(),
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
          },
        }),
        prisma.booking.count({ where: { status: 'SERVICE_COMPLETED' } }),
        prisma.booking.count({ where: { status: 'SERVICE_CANCELLED' } }),
      ])

    // Get today's statistics
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [todayBookings, todayRevenue] = await Promise.all([
      prisma.booking.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.payment.aggregate({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
          status: 'COMPLETED',
        },
        _sum: {
          amount: true,
        },
      }),
    ])

    // Get monthly revenue
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthlyRevenue = await prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
        },
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    })

    // Get total revenue
    const totalRevenue = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    })

    // Get reviews statistics
    const [totalReviews, averageRating] = await Promise.all([
      prisma.review.count(),
      prisma.review.aggregate({
        _avg: {
          rating: true,
        },
      }),
    ])

    const stats = {
      totalUsers,
      totalCustomers,
      totalGroomers,
      totalAdmins,
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      todayBookings,
      todayRevenue: todayRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalReviews,
      averageRating: averageRating._avg.rating || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

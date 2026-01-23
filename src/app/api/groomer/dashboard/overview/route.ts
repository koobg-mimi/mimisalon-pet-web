import { ko } from 'date-fns/locale'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { startOfToday, endOfToday, startOfWeek, startOfMonth, endOfMonth, format } from 'date-fns'
import { GroomerOverviewStats } from '@/types/groomer'
import { BookingStatus } from '@mimisalon/shared'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groomerId = session.user.id

    console.log('[Groomer Dashboard API] Fetching overview for groomer:', groomerId)

    // Date ranges for calculations
    const todayStart = startOfToday()
    const todayEnd = endOfToday()
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday start
    const monthStart = startOfMonth(new Date())
    const monthEnd = endOfMonth(new Date())

    console.log('[Groomer Dashboard API] Date ranges:', {
      todayStart: todayStart.toISOString(),
      todayEnd: todayEnd.toISOString(),
      weekStart: weekStart.toISOString(),
      monthStart: monthStart.toISOString(),
      monthEnd: monthEnd.toISOString(),
    })

    // Get today's bookings count
    const todayBookingsCount = await prisma.booking.count({
      where: {
        groomerId,
        serviceDate: {
          gte: todayStart,
          lte: todayEnd,
        },
        status: {
          in: [
            BookingStatus.FIRST_PAYMENT_COMPLETE,
            BookingStatus.GROOMER_CONFIRM_PENDING,
            BookingStatus.GROOMER_CONFIRM,
            BookingStatus.ADDITIONAL_PAYMENT_COMPLETE,
            BookingStatus.WORK_IN_PROGRESS,
            BookingStatus.SERVICE_COMPLETED,
          ],
        },
      },
    })

    // Get weekly bookings count
    const weeklyBookingsCount = await prisma.booking.count({
      where: {
        groomerId,
        serviceDate: {
          gte: weekStart,
          lte: todayEnd,
        },
        status: {
          in: [
            BookingStatus.FIRST_PAYMENT_COMPLETE,
            BookingStatus.GROOMER_CONFIRM_PENDING,
            BookingStatus.GROOMER_CONFIRM,
            BookingStatus.ADDITIONAL_PAYMENT_COMPLETE,
            BookingStatus.WORK_IN_PROGRESS,
            BookingStatus.SERVICE_COMPLETED,
          ],
        },
      },
    })

    // Get monthly revenue from completed bookings
    const monthlyBookings = await prisma.booking.findMany({
      where: {
        groomerId,
        serviceDate: {
          gte: monthStart,
          lte: monthEnd,
        },
        status: BookingStatus.SERVICE_COMPLETED,
      },
      select: {
        totalPrice: true,
      },
    })

    const monthlyRevenue = monthlyBookings.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    )

    // Get completion rate (completed bookings / total bookings for this month)
    const totalMonthlyBookings = await prisma.booking.count({
      where: {
        groomerId,
        serviceDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })

    const completedMonthlyBookings = await prisma.booking.count({
      where: {
        groomerId,
        serviceDate: {
          gte: monthStart,
          lte: monthEnd,
        },
        status: BookingStatus.SERVICE_COMPLETED,
      },
    })

    const completionRate =
      totalMonthlyBookings > 0
        ? Math.round((completedMonthlyBookings / totalMonthlyBookings) * 100)
        : 0

    // Get average rating and total reviews
    const reviewStats = await prisma.review.aggregate({
      where: {
        booking: {
          groomerId,
        },
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    })

    const averageRating = reviewStats._avg.rating || 0
    const totalReviews = reviewStats._count.rating || 0

    console.log('[Groomer Dashboard API] Fetched data counts:', {
      todayBookings: todayBookingsCount,
      weeklyBookings: weeklyBookingsCount,
      monthlyRevenue,
      totalMonthlyBookings,
      completedMonthlyBookings,
      completionRate,
      averageRating,
      totalReviews,
      upcomingBookingsCount: 'fetching...',
      pendingBookingsCount: 'fetching...',
      recentReviewsCount: 'fetching...',
    })

    // Get today's upcoming bookings
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        groomerId,
        serviceDate: {
          gte: todayStart,
          lte: todayEnd,
        },
        status: {
          in: [BookingStatus.GROOMER_CONFIRM, BookingStatus.GROOMER_CONFIRM_PENDING],
        },
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
        bookingPets: {
          include: {
            pet: {
              select: {
                name: true,
                breed: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            services: {
              include: {
                service: {
                  select: {
                    name: true,
                    durationMinutes: true,
                  },
                },
              },
              take: 1, // Get first service for display
            },
          },
          take: 1, // Get first pet for display
        },
      },
      orderBy: {
        serviceTime: 'asc',
      },
      take: 10,
    })

    // Get pending bookings that need groomer confirmation
    const pendingBookings = await prisma.booking.findMany({
      where: {
        groomerId,
        status: {
          in: [BookingStatus.FIRST_PAYMENT_COMPLETE, BookingStatus.GROOMER_CONFIRM_PENDING],
        },
      },
      include: {
        customer: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
        customerAddress: {
          select: {
            street: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        bookingPets: {
          include: {
            pet: {
              select: {
                name: true,
                breed: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            services: {
              include: {
                service: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            selectedOptions: {
              include: {
                serviceOption: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        serviceDate: 'asc',
      },
      take: 10,
    })

    // Get recent reviews
    const recentReviews = await prisma.review.findMany({
      where: {
        booking: {
          groomerId,
        },
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })

    console.log('[Groomer Dashboard API] Additional data counts:', {
      upcomingBookingsCount: upcomingBookings.length,
      pendingBookingsCount: pendingBookings.length,
      recentReviewsCount: recentReviews.length,
    })

    // Format the response data
    const stats: GroomerOverviewStats = {
      todayBookings: todayBookingsCount,
      weeklyBookings: weeklyBookingsCount,
      monthlyRevenue: Math.round(monthlyRevenue),
      completionRate,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
      upcomingBookings: upcomingBookings.map((booking) => {
        return {
          id: booking.id,
          time: booking.serviceTime || '',
          customer: {
            name: booking.customer?.name || '고객',
          },
          pet: {
            name: booking.bookingPets[0]?.pet.name || '반려동물',
            breed: booking.bookingPets[0]?.pet.breed?.name || '정보없음',
          },
          service: {
            name: booking.bookingPets[0]?.services[0]?.service.name || '서비스',
            duration: booking.bookingPets[0]?.services[0]?.service.durationMinutes || 60,
          },
        }
      }),
      pendingBookings: pendingBookings.map((booking) => {
        // Format address if available
        const address = booking.customerAddress
          ? `${booking.customerAddress.street}, ${booking.customerAddress.city}, ${booking.customerAddress.state} ${booking.customerAddress.zipCode}`
          : undefined

        return {
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          serviceDate: format(booking.serviceDate, 'yyyy-MM-dd', { locale: ko }), // Use date-fns to avoid timezone issues
          serviceTime: booking.serviceTime,
          estimatedDurationMinutes: booking.estimatedDurationMinutes,
          customer: {
            name: booking.customer?.name || '고객',
            phone: booking.customer?.phoneNumber || undefined,
            address,
          },
          pets: booking.bookingPets.map((bp) => ({
            name: bp.pet.name,
            breed: bp.pet.breed?.name || undefined,
            services: bp.services.map((bs) => ({
              name: bs.service.name,
              price: bs.servicePrice,
            })),
            options: bp.selectedOptions.map((opt) => ({
              name: opt.serviceOption.name,
              price: opt.optionPrice,
            })),
          })),
          totalPrice: booking.totalPrice,
          specialRequests: booking.specialRequests || undefined,
        }
      }),
      recentReviews: recentReviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        content: review.comment || '',
        customer: {
          name: review.customer?.name || '고객',
        },
        createdAt: review.createdAt.toISOString(),
      })),
    }

    console.log('[Groomer Dashboard API] Response summary:', {
      todayBookings: stats.todayBookings,
      weeklyBookings: stats.weeklyBookings,
      monthlyRevenue: stats.monthlyRevenue,
      completionRate: stats.completionRate,
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
      upcomingBookingsCount: stats.upcomingBookings.length,
      pendingBookingsCount: stats.pendingBookings.length,
      recentReviewsCount: stats.recentReviews.length,
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch groomer overview stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { ko } from 'date-fns/locale';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Fetch various statistics
    const [
      totalReviews,
      reviewsWithResponse,
      thisMonthReviews,
      lastMonthReviews,
      ratingStats,
      groomerStats,
      lowRatingReviews,
    ] = await Promise.all([
      // Total reviews
      prisma.review.count(),

      // Reviews with responses
      prisma.review.count({
        where: {
          response: {
            isNot: null,
          },
        },
      }),

      // This month's reviews
      prisma.review.count({
        where: {
          createdAt: {
            gte: thisMonthStart,
            lte: thisMonthEnd,
          },
        },
      }),

      // Last month's reviews
      prisma.review.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),

      // Rating statistics
      prisma.review.findMany({
        select: {
          rating: true,
        },
      }),

      // Top groomers by average rating
      prisma.$queryRaw<
        Array<{
          groomerId: string;
          groomerName: string;
          averageRating: number;
          totalReviews: bigint;
        }>
      >`
        SELECT
          g.id as "groomerId",
          g.name as "groomerName",
          AVG(r.rating) as "averageRating",
          COUNT(r.id) as "totalReviews"
        FROM "Groomer" g
        JOIN "Booking" b ON b."groomerId" = g.id
        JOIN "Review" r ON r."bookingId" = b.id
        GROUP BY g.id, g.name
        HAVING COUNT(r.id) >= 5
        ORDER BY AVG(r.rating) DESC
        LIMIT 5
      `,

      // Recent low rating reviews (3 or below)
      prisma.review.findMany({
        where: {
          rating: {
            lte: 3,
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          booking: {
            include: {
              groomer: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    // Calculate rating distribution and average
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalRating = 0;
    ratingStats.forEach((review) => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      totalRating += review.rating;
    });

    const averageRating = ratingStats.length > 0 ? totalRating / ratingStats.length : 0;

    // Calculate response rate
    const responseRate = totalReviews > 0 ? (reviewsWithResponse / totalReviews) * 100 : 0;

    // Calculate month-over-month growth
    const monthGrowth =
      lastMonthReviews > 0 ? ((thisMonthReviews - lastMonthReviews) / lastMonthReviews) * 100 : 0;

    return NextResponse.json({
      overview: {
        totalReviews,
        publicReviews: totalReviews, // All reviews are public in current schema
        flaggedReviews: 0, // Not implemented in current schema
        averageRating: Math.round(averageRating * 10) / 10,
        responseRate: Math.round(responseRate * 10) / 10,
      },
      trends: {
        thisMonthReviews,
        lastMonthReviews,
        monthGrowth: Math.round(monthGrowth * 10) / 10,
      },
      ratingDistribution,
      topGroomers: groomerStats.map((g) => ({
        groomerId: g.groomerId,
        groomerName: g.groomerName,
        averageRating: Math.round(Number(g.averageRating) * 10) / 10,
        totalReviews: Number(g.totalReviews),
      })),
      recentLowRating: lowRatingReviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        customer: review.customer.name || 'Unknown',
        groomer: review.booking.groomer?.name || 'Unknown',
        createdAt: format(review.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { locale: ko }),
      })),
    });
  } catch (error) {
    console.error('Failed to fetch admin review stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

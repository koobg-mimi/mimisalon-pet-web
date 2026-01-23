import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groomerId = session.user.id;
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Get basic review counts and stats
    const [totalReviews, thisMonthReviews, ratingStats] = await Promise.all([
      // Total reviews count
      prisma.review.count({
        where: {
          booking: {
            groomerId: groomerId,
          },
        },
      }),

      // This month's reviews count
      prisma.review.count({
        where: {
          booking: {
            groomerId: groomerId,
          },
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      }),

      // Average rating and rating distribution
      prisma.review.findMany({
        where: {
          booking: {
            groomerId: groomerId,
          },
        },
        select: {
          rating: true,
        },
      }),
    ]);

    // Calculate average rating
    const averageRating =
      ratingStats.length > 0
        ? ratingStats.reduce((sum, review) => sum + review.rating, 0) / ratingStats.length
        : 0;

    // Calculate rating distribution
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratingStats.forEach((review) => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    const stats = {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingDistribution,
      thisMonthReviews,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch review stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id: groomerId } = await params;
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groomer = await prisma.user.findFirst({
      where: {
        id: groomerId,
        role: 'GROOMER',
      },
      include: {
        groomerProfile: {
          include: {
            commissionGrade: true,
          },
        },
        workAreas: true,
        groomerBookings: {
          where: {
            status: 'SERVICE_COMPLETED',
          },
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
            serviceDate: true,
          },
          orderBy: {
            serviceDate: 'desc',
          },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            groomerBookings: true,
          },
        },
      },
    });

    if (!groomer) {
      return NextResponse.json({ error: 'Groomer not found' }, { status: 404 });
    }

    // Calculate statistics
    const ratings = groomer.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

    // Calculate monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyBookings = groomer.groomerBookings.filter(
      (booking) => new Date(booking.createdAt) >= thirtyDaysAgo
    );
    const monthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // Get last activity
    const lastActivityAt =
      groomer.groomerBookings.length > 0 ? groomer.groomerBookings[0].createdAt : null;

    const groomerDetails = {
      id: groomer.id,
      userId: groomer.id,
      user: {
        id: groomer.id,
        email: groomer.email,
        name: groomer.name || '',
        phoneNumber: groomer.phoneNumber,
        isActive: groomer.groomerProfile?.isActive ?? true,
        createdAt: groomer.createdAt.toISOString(),
        lastLoginAt: null,
      },
      bio: null, // Could be added to GroomerProfile
      experience: 0, // Could be added to GroomerProfile
      certifications: [], // Could be added to GroomerProfile
      isActive: groomer.groomerProfile?.isActive ?? true,
      rating: Number(averageRating.toFixed(1)),
      totalReviews: groomer.reviews.length,
      totalBookings: groomer._count.groomerBookings,
      monthlyRevenue,
      profileImage: groomer.image,
      portfolio: [], // Could be added to GroomerProfile
      availableLocations: groomer.workAreas.map((wa) => ({
        id: wa.id,
        name: wa.name,
        address: wa.address || '',
        description: wa.description || '',
        centerLat: wa.centerLat,
        centerLng: wa.centerLng,
        radiusKm: wa.radiusKm,
        isActive: wa.isActive,
      })),
      services: [], // Would need to query services separately
      bankAccount: groomer.groomerProfile
        ? {
            bankName: groomer.groomerProfile.bankName || '',
            accountNumber: groomer.groomerProfile.bankAccountNumber || '',
            accountHolder: groomer.groomerProfile.bankAccountHolderName || '',
          }
        : null,
      commissionGrade: groomer.groomerProfile?.commissionGrade
        ? {
            id: groomer.groomerProfile.commissionGrade.id,
            name: groomer.groomerProfile.commissionGrade.name,
            commissionRate: groomer.groomerProfile.commissionGrade.commissionRate,
          }
        : null,
      lastActivityAt: lastActivityAt ? new Date(lastActivityAt).toISOString() : null,
      recentBookings: groomer.groomerBookings.slice(0, 10).map((booking) => ({
        id: booking.id,
        serviceDate: booking.serviceDate.toISOString(),
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt.toISOString(),
      })),
      recentReviews: groomer.reviews.slice(0, 5).map((review) => ({
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(groomerDetails);
  } catch (error) {
    console.error(`Error fetching groomer ${groomerId}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

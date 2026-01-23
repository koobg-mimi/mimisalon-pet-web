import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { Prisma } from '@mimisalon/shared';

// Response types
interface GroomerUserInfo {
  id: string;
  email: string;
  name: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: null;
}

interface CommissionGradeInfo {
  id: string;
  name: string;
  commissionRate: number;
}

interface WorkAreaInfo {
  id: string;
  name: string;
  address: string;
  description: string;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  isActive: boolean;
}

interface BankAccountInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface AdminGroomerInfo {
  id: string;
  userId: string;
  user: GroomerUserInfo;
  bio: null;
  experience: number;
  certifications: unknown[];
  isActive: boolean;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  monthlyRevenue: number;
  profileImage: string | null;
  portfolio: unknown[];
  birthDate: string | null;
  availableLocations: WorkAreaInfo[];
  services: unknown[];
  bankAccount: BankAccountInfo | null;
  commissionGrade: CommissionGradeInfo | null;
  lastActivityAt: string | null;
}

export interface AdminGroomersGetResponse {
  groomers: AdminGroomerInfo[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

interface ErrorResponse {
  error: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<AdminGroomersGetResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';
    const location = searchParams.get('location') || 'ALL';

    const skip = (page - 1) * limit;

    // Build where conditions
    const whereConditions: Prisma.UserWhereInput = {
      role: 'GROOMER',
    };

    // Add search filter
    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add status filter for GroomerProfile
    if (status !== 'ALL') {
      whereConditions.groomerProfile = {
        isActive: status === 'ACTIVE',
      };
    }

    // Add location filter
    if (location !== 'ALL') {
      whereConditions.workAreas = {
        some: {
          id: location,
        },
      };
    }

    // Get groomers with related data
    const [groomers, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereConditions,
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
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              groomerBookings: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({
        where: whereConditions,
      }),
    ]);

    // Process groomer data
    const processedGroomers = groomers.map((groomer) => {
      // Calculate average rating
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

      // Get last activity from bookings
      const lastActivityAt =
        groomer.groomerBookings.length > 0
          ? groomer.groomerBookings.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0].createdAt
          : null;

      return {
        id: groomer.id,
        userId: groomer.id,
        user: {
          id: groomer.id,
          email: groomer.email,
          name: groomer.name || '',
          phoneNumber: groomer.phoneNumber,
          isActive: groomer.groomerProfile?.isActive ?? true,
          createdAt: groomer.createdAt.toISOString(),
          lastLoginAt: null, // This would need to be tracked separately
        },
        bio: null, // Could be added to GroomerProfile model
        experience: 0, // Could be added to GroomerProfile model
        certifications: [], // Could be added to GroomerProfile model
        isActive: groomer.groomerProfile?.isActive ?? true,
        rating: Number(averageRating.toFixed(1)),
        totalReviews: groomer.reviews.length,
        totalBookings: groomer._count.groomerBookings,
        monthlyRevenue,
        profileImage: groomer.image,
        portfolio: [], // Could be added to GroomerProfile model
        birthDate: groomer.groomerProfile?.birthDate
          ? groomer.groomerProfile.birthDate.toISOString()
          : null,
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
      };
    });

    const filteredGroomers = processedGroomers;

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      groomers: filteredGroomers,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching groomers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

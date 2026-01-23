import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { Prisma } from '@mimisalon/shared';

// Response types
type AdminUserPayload = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    phoneNumber: true;
    role: true;
    createdAt: true;
    updatedAt: true;
    groomerProfile: {
      select: {
        isActive: true;
      };
    };
    workAreas: {
      select: {
        id: true;
        name: true;
        address: true;
        centerLat: true;
        centerLng: true;
        radiusKm: true;
        isActive: true;
      };
    };
    _count: {
      select: {
        bookings: true;
        groomerBookings: true;
      };
    };
  };
}>;

export interface PaginationInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface AdminUsersGetResponse extends PaginationInfo {
  users: AdminUserPayload[];
}

interface ErrorResponse {
  error: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<AdminUsersGetResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'ALL';
    const status = searchParams.get('status') || 'ALL';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Role filter
    if (role && role !== 'ALL') {
      where.role = role as Prisma.UserWhereInput['role'];
    }

    // Status filter - applied to groomerProfile for groomers
    if (status && status !== 'ALL' && role === 'GROOMER') {
      where.groomerProfile = {
        isActive: status === 'ACTIVE',
      };
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          groomerProfile: {
            select: {
              isActive: true,
            },
          },
          workAreas: {
            select: {
              id: true,
              name: true,
              address: true,
              centerLat: true,
              centerLng: true,
              radiusKm: true,
              isActive: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              groomerBookings: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

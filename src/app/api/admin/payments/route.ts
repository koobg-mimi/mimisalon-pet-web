import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { Prisma } from '@mimisalon/shared';

// Response types using Prisma Payload
type AdminPaymentPayload = Prisma.PaymentGetPayload<{
  include: {
    booking: {
      select: {
        id: true;
        bookingNumber: true;
        serviceDate: true;
        serviceTime: true;
        customer: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
        groomer: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
      };
    };
    customer: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export interface AdminPaymentsGetResponse {
  payments: AdminPaymentPayload[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

interface ErrorResponse {
  error: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<AdminPaymentsGetResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PaymentWhereInput = {};

    // Search filter - search by payment ID, order ID, order name, or booking number
    if (search) {
      where.OR = [
        { paymentId: { contains: search, mode: 'insensitive' } },
        { orderId: { contains: search, mode: 'insensitive' } },
        { orderName: { contains: search, mode: 'insensitive' } },
        {
          booking: {
            bookingNumber: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    // Status filter
    if (status && status !== 'ALL') {
      where.status = status as Prisma.PaymentWhereInput['status'];
    }

    // Get payments with pagination
    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          booking: {
            select: {
              id: true,
              bookingNumber: true,
              serviceDate: true,
              serviceTime: true,
              customer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              groomer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      payments,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

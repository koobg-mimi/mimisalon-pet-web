import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { Prisma, PaymentStatus } from '@mimisalon/shared';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build where clause
    const where: Prisma.PaymentWhereInput = {
      customerId: user.id,
    };

    // Handle multiple statuses (comma-separated)
    if (status && status !== 'ALL') {
      const statuses = status.split(',').map((s) => s.trim()) as PaymentStatus[];
      if (statuses.length > 1) {
        where.status = { in: statuses };
      } else {
        where.status = statuses[0];
      }
    }

    // Get total count
    const totalPayments = await prisma.payment.count({ where });

    // Get paginated payments
    const payments = await prisma.payment.findMany({
      where,
      include: {
        booking: {
          include: {
            bookingPets: {
              include: {
                pet: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    breed: true,
                  },
                },
                services: {
                  include: {
                    service: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform payments to match expected format
    const transformedPayments = payments.map((payment) => {
      const firstBookingPet = payment.booking?.bookingPets[0];
      const firstService = firstBookingPet?.services[0]?.service;

      return {
        id: payment.id,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        status: payment.status,
        orderName: payment.orderName,
        receiptUrl: payment.receiptUrl,
        paidAt: payment.paidAt,
        failedAt: payment.failedAt,
        cancelledAt: payment.cancelledAt,
        refundedAt: payment.refundedAt,
        failReason: payment.failReason,
        cancelReason: payment.cancelReason,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        booking: payment.booking
          ? {
              id: payment.booking.id,
              bookingNumber: payment.booking.bookingNumber,
              serviceDate: payment.booking.serviceDate,
              serviceTime: payment.booking.serviceTime,
              status: payment.booking.status,
              pet: firstBookingPet?.pet,
              service: firstService,
            }
          : null,
      };
    });

    return NextResponse.json({
      payments: transformedPayments,
      totalPayments,
      totalPages: Math.ceil(totalPayments / limit),
      page,
      limit,
    });
  } catch (error) {
    console.error('Customer payments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

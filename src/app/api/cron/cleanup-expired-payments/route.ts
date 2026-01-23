import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@mimisalon/shared';
import { env } from '@/lib/env';

// This API route is designed to be called by a cron job service
// Configure your cron service to call this endpoint every 10 minutes
// Example cron expression: */10 * * * *

// ============================================================================
// Types
// ============================================================================

export interface CleanupExpiredPaymentsResponse {
  success: true;
  message: string;
  expiredPayments: number;
  timestamp: string;
}

export interface CleanupPaymentsErrorResponse {
  success?: false;
  error: string;
}

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * GET /api/cron/cleanup-expired-payments
 *
 * Cron job endpoint to mark PENDING payments as EXPIRED after 30 minutes.
 * Also updates associated bookings to BOOKING_FAILED status.
 * Requires CRON_SECRET authorization.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<CleanupExpiredPaymentsResponse | CleanupPaymentsErrorResponse>> {
  try {
    // Verify the request is from the cron service (optional security)
    const cronSecret = env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json<CleanupPaymentsErrorResponse>(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Calculate the timeout threshold (30 minutes ago)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    // Update expired PENDING payments
    const result = await prisma.payment.updateMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lte: thirtyMinutesAgo,
        },
      },
      data: {
        status: 'EXPIRED',
        updatedAt: new Date(),
      },
    });

    // Optionally, update associated bookings if they're still in payment pending state
    const expiredPayments = await prisma.payment.findMany({
      where: {
        status: 'EXPIRED',
        updatedAt: {
          gte: new Date(Date.now() - 60 * 1000), // Just expired in the last minute
        },
        bookingId: {
          not: null,
        },
      },
      include: {
        booking: true,
      },
    });

    // Update bookings that were waiting for these payments
    for (const payment of expiredPayments) {
      if (
        payment.booking &&
        (payment.booking.status === 'FIRST_PAYMENT_PENDING' ||
          payment.booking.status === 'ADDITIONAL_PAYMENT_PENDING')
      ) {
        await prisma.booking.update({
          where: { id: payment.bookingId! },
          data: {
            status: 'BOOKING_FAILED',
            updatedAt: new Date(),
            notes: `Payment expired at ${new Date().toISOString()}`,
          },
        });
      }
    }

    console.log(`[Cron] Cleaned up ${result.count} expired payments`);

    return NextResponse.json<CleanupExpiredPaymentsResponse>({
      success: true,
      message: `Updated ${result.count} expired payments`,
      expiredPayments: result.count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Error cleaning up expired payments:', error);
    return NextResponse.json<CleanupPaymentsErrorResponse>(
      { error: 'Failed to clean up expired payments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cron/cleanup-expired-payments
 *
 * Also support POST for flexibility in cron services.
 */
export async function POST(request: NextRequest) {
  return GET(request);
}

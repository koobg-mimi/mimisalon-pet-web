import { prisma } from '@mimisalon/shared';

export async function cleanupExpiredBookings() {
  try {
    const now = new Date();
    console.log(`[Cron] Starting cleanup of expired bookings at ${now.toISOString()}`);

    // Find bookings that have expired (15 minutes after creation)
    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: 'FIRST_PAYMENT_PENDING',
        expiresAt: {
          lte: now,
        },
      },
      include: {
        payments: {
          where: {
            status: 'PENDING',
          },
        },
      },
    });

    console.log(`[Cron] Found ${expiredBookings.length} expired bookings to clean up`);

    for (const booking of expiredBookings) {
      try {
        await prisma.$transaction(async (tx) => {
          // Update booking status to BOOKING_FAILED
          await tx.booking.update({
            where: { id: booking.id },
            data: {
              status: 'BOOKING_FAILED',
              paymentStatus: 'EXPIRED',
              notes: 'Booking expired - payment not completed in time',
            },
          });

          // Update any pending payments to EXPIRED
          if (booking.payments.length > 0) {
            await tx.payment.updateMany({
              where: {
                bookingId: booking.id,
                status: 'PENDING',
              },
              data: {
                status: 'EXPIRED',
              },
            });
          }

          // Release blocked time slots
          await tx.groomerAvailability.updateMany({
            where: {
              bookingId: booking.id,
            },
            data: {
              isBooked: false,
              bookingId: null,
              isAvailable: true,
            },
          });

          console.log(
            `[Cron] Cleaned up expired booking: ${booking.id} (${booking.bookingNumber})`
          );
        });
      } catch (error) {
        console.error(`[Cron] Failed to clean up booking ${booking.id}:`, error);
      }
    }

    // Also clean up orphaned payments (payments without bookings older than 1 hour)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const orphanedPayments = await prisma.payment.findMany({
      where: {
        bookingId: null,
        status: 'PENDING',
        createdAt: {
          lte: oneHourAgo,
        },
      },
    });

    if (orphanedPayments.length > 0) {
      console.log(`[Cron] Found ${orphanedPayments.length} orphaned payments to expire`);

      await prisma.payment.updateMany({
        where: {
          id: {
            in: orphanedPayments.map((p) => p.id),
          },
        },
        data: {
          status: 'EXPIRED',
        },
      });
    }

    console.log(`[Cron] Cleanup completed at ${new Date().toISOString()}`);
    return {
      expiredBookings: expiredBookings.length,
      orphanedPayments: orphanedPayments.length,
    };
  } catch (error) {
    console.error('[Cron] Error during cleanup:', error);
    throw error;
  }
}

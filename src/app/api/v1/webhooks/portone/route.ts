import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from '@portone/server-sdk';
import { prisma } from '@mimisalon/shared';
import { Prisma, BookingStatus } from '@mimisalon/shared';
import { workerApiClient } from '@/lib/worker-api-client';
import { BookingNotificationService } from '@/lib/booking-notifications';
import { env } from '@/lib/env';

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs';

// ============================================================================
// Types
// ============================================================================

// PortOne V1 webhook types for version 2024-01-01
export interface PortOneWebhookV1 {
  payment_id: string;
  tx_id: string;
  status:
    | 'Ready'
    | 'Paid'
    | 'VirtualAccountIssued'
    | 'PartialCancelled'
    | 'Cancelled'
    | 'Failed'
    | 'PayPending'
    | 'CancelPending';
}

// PortOne V2 webhook types for version 2024-04-25
export interface PortOneWebhookV2 {
  type: string;
  timestamp: string;
  data: {
    paymentId?: string;
    transactionId?: string;
    storeId: string;
    cancellationId?: string;
    billingKey?: string;
  };
}

export interface PortOneWebhookSuccessResponse {
  received: true;
}

export interface PortOneWebhookErrorResponse {
  error: string;
  message?: string;
}

// Helper to read raw body
async function getRawBody(request: NextRequest): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) {
    throw new Error('No body available');
  }

  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    concatenated.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder().decode(concatenated);
}

/**
 * POST /api/v1/webhooks/portone
 * PortOne payment webhook handler (V1 and V2 formats)
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<PortOneWebhookSuccessResponse | PortOneWebhookErrorResponse>> {
  try {
    // Get webhook secret from environment - for now, skip verification if not set
    const webhookSecret = env.PORTONE_WEBHOOK_SECRET;

    // Get raw body
    const rawBody = await getRawBody(request);
    console.log('[Webhook] Received webhook body:', rawBody);

    if (env.NODE_ENV === 'production') {
      // Simple passthrough to external endpoint
      fetch('http://oreopie.ipdisk.co.kr:3000/api/v1/webhooks/portone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'webhook-id': request.headers.get('webhook-id') || '',
          'webhook-signature': request.headers.get('webhook-signature') || '',
          'webhook-timestamp': request.headers.get('webhook-timestamp') || '',
        },
        body: rawBody,
      }).catch((err) => console.log('[Webhook] Passthrough error:', err));
    }

    let webhook: PortOneWebhookV1 | PortOneWebhookV2;

    // Check if webhook signature verification is enabled
    const hasWebhookHeaders =
      request.headers.get('webhook-id') &&
      request.headers.get('webhook-signature') &&
      request.headers.get('webhook-timestamp');

    if (webhookSecret && hasWebhookHeaders) {
      // Get headers for verification
      const headers = {
        'webhook-id': request.headers.get('webhook-id') || '',
        'webhook-signature': request.headers.get('webhook-signature') || '',
        'webhook-timestamp': request.headers.get('webhook-timestamp') || '',
      };

      // Verify webhook signature
      try {
        void (await Webhook.verify(webhookSecret, rawBody, headers));
        console.log('[Webhook] Signature verified successfully');
        // The verified object from SDK needs to be parsed
        webhook = JSON.parse(rawBody);
      } catch (verifyError) {
        console.error('[Webhook] Signature verification failed:', verifyError);
        return NextResponse.json<PortOneWebhookErrorResponse>(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    } else {
      // Parse webhook without verification (for testing or when secret not configured)
      console.warn('[Webhook] Processing without signature verification');
      webhook = JSON.parse(rawBody);
    }

    // Check webhook format - V1 (2024-01-01) or V2 (2024-04-25)
    if ('payment_id' in webhook && 'tx_id' in webhook && 'status' in webhook) {
      // V1 format (2024-01-01)
      const { payment_id, tx_id, status } = webhook as PortOneWebhookV1;
      console.log(
        `[Webhook] Processing V1 webhook - Payment: ${payment_id}, TX: ${tx_id}, Status: ${status}`
      );

      switch (status) {
        case 'Paid':
          await handlePaymentSuccess(payment_id, tx_id, 'v1');
          break;

        case 'Failed':
          await handlePaymentFailure(payment_id, tx_id);
          break;

        case 'Cancelled':
        case 'PartialCancelled':
          await handlePaymentCancellation(payment_id, tx_id, status === 'PartialCancelled');
          break;

        case 'Ready':
        case 'VirtualAccountIssued':
          await handlePaymentReady(payment_id, tx_id);
          break;

        default:
          console.log(`[Webhook] Unhandled webhook status: ${status}`);
      }
    } else if ('type' in webhook && 'data' in webhook) {
      // V2 format (2024-04-25)
      const v2Webhook = webhook as PortOneWebhookV2;
      const { type, data } = v2Webhook;
      console.log(`[Webhook] Processing V2 webhook - Type: ${type}`);

      if (data.paymentId) {
        const { paymentId, transactionId } = data;

        switch (type) {
          case 'Transaction.Paid':
            await handlePaymentSuccess(paymentId, transactionId || '', 'v2');
            break;

          case 'Transaction.Failed':
            await handlePaymentFailure(paymentId, transactionId || '');
            break;

          case 'Transaction.Cancelled':
          case 'Transaction.PartialCancelled':
            await handlePaymentCancellation(
              paymentId,
              transactionId || '',
              type === 'Transaction.PartialCancelled'
            );
            break;

          case 'Transaction.Ready':
          case 'Transaction.VirtualAccountIssued':
            await handlePaymentReady(paymentId, transactionId || '');
            break;

          default:
            console.log(`[Webhook] Unhandled webhook type: ${type}`);
        }
      }
    } else {
      console.error('[Webhook] Unknown webhook format:', webhook);
      return NextResponse.json<PortOneWebhookErrorResponse>(
        { error: 'Unknown webhook format' },
        { status: 400 }
      );
    }

    // Return success response
    return NextResponse.json<PortOneWebhookSuccessResponse>({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json<PortOneWebhookErrorResponse>(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Handle successful payment
async function handlePaymentSuccess(
  paymentId: string,
  transactionId: string,
  version: 'v1' | 'v2' = 'v1'
) {
  try {
    console.log(
      `[Webhook] Processing payment success for ${paymentId}, TX: ${transactionId}, Version: ${version}`
    );

    // Cancel any pending cleanup job
    try {
      await workerApiClient.cancelPaymentCleanup(paymentId);
      console.log(`[Webhook] Cancelled cleanup job for successful payment: ${paymentId}`);
    } catch (cleanupError) {
      console.error('[Webhook] Failed to cancel cleanup job:', cleanupError);
    }

    // Update payment record if exists
    const existingPayment = await prisma.payment.findUnique({
      where: { paymentId },
    });

    if (!existingPayment) {
      console.warn(`[Webhook] Payment not found in database: ${paymentId}`);
      return;
    }

    // Validate payment amount with PortOne API (V2 only)
    // V1 payments cannot be validated using V2 SDK
    if (version === 'v2') {
      try {
        const { getPaymentDetails } = await import('@/lib/portone-server');
        const portOnePayment = await getPaymentDetails(paymentId);

        // PortOne payment object has amount.total structure
        const actualAmount =
          typeof portOnePayment === 'object' && portOnePayment && 'amount' in portOnePayment
            ? (portOnePayment.amount as any)?.total
            : undefined;

        if (actualAmount !== undefined && actualAmount !== existingPayment.amount) {
          console.error('[Webhook] Amount mismatch detected:', {
            paymentId,
            expected: existingPayment.amount,
            actual: actualAmount,
          });
          // Mark payment as requiring manual review
          await prisma.payment.update({
            where: { paymentId },
            data: {
              status: 'FAILED',
              failReason: `Amount mismatch: expected ${existingPayment.amount}, got ${actualAmount}`,
            },
          });
          return;
        }
        console.log(
          `[Webhook] Amount validation passed for ${paymentId}: ${existingPayment.amount}`
        );
      } catch (validationError) {
        console.error('[Webhook] Failed to validate payment amount:', validationError);
        // Continue with payment processing on validation error to avoid blocking legitimate payments
        // This should trigger monitoring alerts
      }
    } else {
      console.log(`[Webhook] Skipping V2 SDK validation for V1 payment: ${paymentId}`);
    }

    // Extract payment details
    const paymentData = {
      paymentId,
      transactionId,
      status: 'PAID' as const,
      paidAt: new Date(),
    };

    // Update payment record
    const payment = await prisma.payment.update({
      where: { paymentId },
      data: {
        status: paymentData.status,
        paidAt: paymentData.paidAt,
        pgTxId: transactionId,
      },
    });

    // Update booking status if linked - handle split payment logic
    if (payment.bookingId) {
      // Get current booking status to determine correct state transition
      const booking = await prisma.booking.findUnique({
        where: { id: payment.bookingId },
        select: { status: true },
      });

      if (booking) {
        let newStatus: BookingStatus;
        const updateData: Prisma.BookingUpdateInput = {
          paymentStatus: 'PAID',
          updatedAt: new Date(),
        };

        // Determine next status based on current booking status
        switch (booking.status) {
          case BookingStatus.FIRST_PAYMENT_PENDING:
            // 1차 결제 완료 - 미용사 확인 대기 상태로 전환
            newStatus = BookingStatus.GROOMER_CONFIRM_PENDING;
            console.log(
              `[Webhook] First payment completed for booking ${payment.bookingId} - waiting for groomer confirmation`
            );

            // 첫 결제 완료 시 미용사에게 알림 발송
            try {
              await sendGroomerFirstPaymentNotification(payment.bookingId);
            } catch (notificationError) {
              console.error('[Webhook] Failed to send groomer notification:', notificationError);
              // 알림 실패는 결제 성공을 방해하지 않음
            }
            break;

          case BookingStatus.ADDITIONAL_PAYMENT_PENDING:
          case BookingStatus.ADDITIONAL_PAYMENT_COMPLETE:
            // 추가 결제 완료 확인 - 작업 진행 상태로 전환
            newStatus = BookingStatus.WORK_IN_PROGRESS;
            console.log(
              `[Webhook] Additional payment confirmed for booking ${payment.bookingId} - resuming work`
            );

            // 미용사에게 추가 결제 완료 알림 발송
            try {
              await sendGroomerAdditionalPaymentNotification(payment.bookingId);
            } catch (notificationError) {
              console.error(
                '[Webhook] Failed to send groomer additional payment notification:',
                notificationError
              );
              // 알림 실패는 결제 성공을 방해하지 않음
            }
            break;

          default:
            // Unknown status - log warning and keep existing status
            newStatus = booking.status;
            console.warn(
              `[Webhook] Unexpected booking status ${booking.status} for payment ${paymentId} on booking ${payment.bookingId}`
            );
        }

        updateData.status = newStatus;

        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: updateData,
        });

        console.log(
          `[Webhook] Booking ${payment.bookingId} status updated: ${booking.status} → ${newStatus}`
        );
      }
    }

    console.log(`[Webhook] Payment success processed: ${paymentId}`);
  } catch (error) {
    console.error(`[Webhook] Error handling payment success:`, error);
    throw error;
  }
}

// Handle payment failure
async function handlePaymentFailure(paymentId: string, transactionId: string) {
  try {
    console.log(`[Webhook] Processing payment failure for ${paymentId}, TX: ${transactionId}`);

    // Validate paymentId before processing
    if (!paymentId) {
      console.error('[Webhook] Cannot process payment failure without paymentId');
      return;
    }

    // Execute immediate cleanup for failed payment
    try {
      await workerApiClient.executePaymentCleanup({ paymentId });
      console.log(`[Webhook] Executed immediate cleanup for failed payment: ${paymentId}`);
    } catch (cleanupError) {
      console.error('[Webhook] Failed to execute immediate cleanup:', cleanupError);
    }

    // Update payment record if exists
    const existingPayment = await prisma.payment.findUnique({
      where: { paymentId },
      include: {
        booking: true,
      },
    });

    if (existingPayment) {
      const payment = await prisma.payment.update({
        where: { paymentId },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          pgTxId: transactionId,
        },
      });

      // If payment has a linked booking, clean up the booking and release time slots
      if (payment.bookingId && existingPayment.booking) {
        const booking = existingPayment.booking;

        // Only clean up if this is the initial payment failure
        // (not for additional payment failures)
        const shouldCleanup = booking.status === 'FIRST_PAYMENT_PENDING';

        if (shouldCleanup) {
          console.log(`[Webhook] Cleaning up failed booking ${payment.bookingId}`);

          // Update booking status to BOOKING_FAILED
          await prisma.booking.update({
            where: { id: payment.bookingId },
            data: {
              status: 'BOOKING_FAILED',
              paymentStatus: 'FAILED',
              notes: 'Payment failed - automatically cleaned up',
            },
          });

          // Release the blocked time slots
          await prisma.groomerAvailability.updateMany({
            where: {
              bookingId: payment.bookingId,
            },
            data: {
              isBooked: false,
              bookingId: null,
              isAvailable: true,
            },
          });

          console.log(`[Webhook] Released time slots for failed booking ${payment.bookingId}`);
        } else {
          console.log(
            `[Webhook] Booking ${payment.bookingId} in status ${booking.status} - no cleanup needed`
          );
        }
      }
    } else {
      console.warn(`[Webhook] Payment record not found for ${paymentId}`);
    }

    console.log(`[Webhook] Payment failure processed: ${paymentId}`);
  } catch (error) {
    console.error(`[Webhook] Error handling payment failure:`, error);
    throw error;
  }
}

// Handle payment cancellation
async function handlePaymentCancellation(
  paymentId: string,
  transactionId: string,
  isPartial: boolean
) {
  try {
    // Validate paymentId before processing
    if (!paymentId) {
      console.error('[Webhook] Cannot process payment cancellation without paymentId');
      return;
    }
    console.log(
      `[Webhook] Processing payment cancellation for ${paymentId}, TX: ${transactionId}, Partial: ${isPartial}`
    );

    // Execute immediate cleanup for cancelled payment (unless partial)
    if (!isPartial) {
      try {
        await workerApiClient.executePaymentCleanup({ paymentId });
        console.log(`[Webhook] Executed immediate cleanup for cancelled payment: ${paymentId}`);
      } catch (cleanupError) {
        console.error('[Webhook] Failed to execute immediate cleanup:', cleanupError);
      }
    }

    // Update payment record if exists
    const existingPayment = await prisma.payment.findUnique({
      where: { paymentId },
    });

    if (existingPayment) {
      const payment = await prisma.payment.update({
        where: { paymentId },
        data: {
          status: isPartial ? 'PARTIAL_CANCELLED' : 'CANCELLED',
          cancelledAt: new Date(),
          pgTxId: transactionId,
        },
      });

      // Update booking status if fully cancelled
      if (!isPartial && payment.bookingId) {
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: 'SERVICE_CANCELLED',
            cancelledAt: new Date(),
            cancellationReason: 'Payment cancelled',
          },
        });

        // Release the blocked time slots when booking is cancelled
        await prisma.groomerAvailability.updateMany({
          where: {
            bookingId: payment.bookingId,
          },
          data: {
            isBooked: false,
            bookingId: null,
            isAvailable: true,
          },
        });

        console.log(`[Webhook] Released time slots for cancelled booking ${payment.bookingId}`);
      }
    } else {
      console.warn(`[Webhook] Payment record not found for ${paymentId}`);
    }

    console.log(`[Webhook] Payment cancellation processed: ${paymentId}`);
  } catch (error) {
    console.error(`[Webhook] Error handling payment cancellation:`, error);
    throw error;
  }
}

// Handle payment ready (e.g., virtual account issued)
async function handlePaymentReady(paymentId: string, transactionId: string) {
  try {
    console.log(`[Webhook] Processing payment ready for ${paymentId}, TX: ${transactionId}`);

    // Update payment record if exists
    const existingPayment = await prisma.payment.findUnique({
      where: { paymentId },
    });

    if (existingPayment) {
      await prisma.payment.update({
        where: { paymentId },
        data: {
          status: 'PENDING',
          pgTxId: transactionId,
        },
      });
    } else {
      console.warn(`[Webhook] Payment record not found for ${paymentId}`);
    }

    console.log(`[Webhook] Payment ready processed: ${paymentId}`);
  } catch (error) {
    console.error(`[Webhook] Error handling payment ready:`, error);
    throw error;
  }
}

// Send notification to groomer when first payment is completed
async function sendGroomerFirstPaymentNotification(bookingId: string): Promise<void> {
  try {
    console.log(`[Webhook] Sending groomer notification for booking ${bookingId}`);

    // 예약 정보와 관련 데이터 조회
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: {
          select: { name: true, email: true },
        },
        groomer: {
          select: { id: true, name: true },
        },
        bookingPets: {
          include: {
            pet: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!booking) {
      console.error(`[Webhook] Booking not found: ${bookingId}`);
      return;
    }

    const petNames = booking.bookingPets.map((bp) => bp.pet.name);

    const bookingData = {
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      customerName: booking.customer.name || booking.customer.email,
      groomerName: booking.groomer?.name || '미용사',
      serviceDate: booking.serviceDate,
      serviceTime: booking.serviceTime,
      petNames,
      totalPrice: booking.totalPrice,
    };

    // 미용사가 지정된 경우 해당 미용사에게만 알림
    if (booking.groomerId) {
      const success = await BookingNotificationService.notifyGroomerFirstPaymentCompleted(
        booking.groomerId,
        bookingData
      );

      if (success) {
        console.log(
          `[Webhook] Successfully sent notification to assigned groomer: ${booking.groomerId}`
        );
      } else {
        console.warn(
          `[Webhook] Failed to send notification to assigned groomer: ${booking.groomerId}`
        );
      }
    } else {
      // 미용사가 지정되지 않은 경우 모든 미용사에게 알림
      const result =
        await BookingNotificationService.notifyAllGroomersFirstPaymentCompleted(bookingData);

      console.log(
        `[Webhook] Sent notifications to all groomers: ${result.successCount} success, ${result.failureCount} failed`
      );
    }
  } catch (error) {
    console.error('[Webhook] Error sending groomer notification:', error);
    throw error;
  }
}

// Send notification to groomer when additional payment is completed
async function sendGroomerAdditionalPaymentNotification(bookingId: string): Promise<void> {
  try {
    console.log(
      `[Webhook] Sending groomer additional payment notification for booking ${bookingId}`
    );

    // 예약 정보와 관련 데이터 조회
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: {
          select: { name: true, email: true },
        },
        groomer: {
          select: { id: true, name: true },
        },
        bookingPets: {
          include: {
            pet: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!booking) {
      console.error(`[Webhook] Booking not found: ${bookingId}`);
      return;
    }

    if (!booking.groomerId) {
      console.log(`[Webhook] No groomer assigned for booking ${bookingId}`);
      return;
    }

    const petNames = booking.bookingPets.map((bp) => bp.pet.name);

    const bookingData = {
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      customerName: booking.customer.name || booking.customer.email,
      groomerName: booking.groomer?.name || '미용사',
      serviceDate: booking.serviceDate,
      serviceTime: booking.serviceTime,
      petNames,
      totalPrice: booking.totalPrice,
      totalAdditionalAmount: booking.additionalCharges || 0,
    };

    const success = await BookingNotificationService.notifyGroomerAdditionalPaymentCompleted(
      booking.groomerId,
      bookingData
    );

    if (success) {
      console.log(
        `[Webhook] Successfully sent additional payment notification to groomer: ${booking.groomerId}`
      );
    } else {
      console.warn(
        `[Webhook] Failed to send additional payment notification to groomer: ${booking.groomerId}`
      );
    }
  } catch (error) {
    console.error('[Webhook] Error sending groomer additional payment notification:', error);
    throw error;
  }
}

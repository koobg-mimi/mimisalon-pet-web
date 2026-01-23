import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { z } from 'zod';
import { BookingStatus, PaymentStatus } from '@mimisalon/shared';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { workerApiClient } from '@/lib/worker-api-client';
import { cancelPayment } from '@/lib/portone-server';

// Error response type
export interface ErrorResponse {
  error: string;
  details?: unknown;
}

// Request schema
export const updateBookingStatusSchema = z.object({
  status: z.enum(BookingStatus),
  reason: z.string().optional(),
});

export type UpdateBookingStatusRequest = z.infer<typeof updateBookingStatusSchema>;

// Response types
export type UpdateBookingStatusResponse = {
  message: string;
  booking: {
    id: string;
    status: string;
    confirmedAt: Date | null;
    startedAt: Date | null;
    completedAt: Date | null;
    cancelledAt: Date | null;
  };
  refundResults?: {
    totalPayments: number;
    successfulRefunds: number;
    failedRefunds: number;
    totalRefundAmount: number;
    failedDetails?: Array<{ paymentId: string; error: string }>;
  };
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UpdateBookingStatusResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || session.user.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 403 });
    }

    const { id: bookingId } = await params;
    const body: unknown = await request.json();
    const { status, reason } = updateBookingStatusSchema.parse(body);

    // 예약 정보 조회 및 권한 확인
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        groomer: true,
        payments: {
          where: {
            status: {
              in: [PaymentStatus.PAID, PaymentStatus.COMPLETED],
            },
          },
        },
        bookingPets: {
          include: {
            pet: true,
            services: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 });
    }

    if (booking.groomerId !== session.user.id) {
      return NextResponse.json({ error: '해당 예약에 대한 권한이 없습니다' }, { status: 403 });
    }

    // 상태 변경 유효성 검사
    const validTransitions = getValidStatusTransitions(booking.status);
    if (!validTransitions.includes(status)) {
      return NextResponse.json(
        {
          error: `현재 상태(${booking.status})에서 ${status}로 변경할 수 없습니다`,
        },
        { status: 400 }
      );
    }

    // 상태 업데이트
    const updateData: {
      status: BookingStatus;
      updatedAt: Date;
      confirmedAt?: Date;
      startedAt?: Date;
      completedAt?: Date;
      cancelledAt?: Date;
      cancellationReason?: string;
      cancelledBy?: string;
      paymentStatus?: PaymentStatus;
    } = {
      status: status as BookingStatus,
      updatedAt: new Date(),
    };

    // 상태별 추가 데이터 설정
    switch (status) {
      case 'GROOMER_CONFIRM':
        updateData.confirmedAt = new Date();
        break;
      case 'WORK_IN_PROGRESS':
        updateData.startedAt = new Date();
        break;
      case 'SERVICE_COMPLETED':
        updateData.completedAt = new Date();
        break;
      case 'SERVICE_CANCELLED':
        updateData.cancelledAt = new Date();
        updateData.cancellationReason = reason || '미용사가 예약을 거절했습니다';
        updateData.cancelledBy = session.user.id;
        break;
    }

    // SERVICE_CANCELLED의 경우 결제 취소 처리
    const refundResults = {
      successful: [] as string[],
      failed: [] as { paymentId: string; error: string }[],
      totalRefundAmount: 0,
    };

    if (status === 'SERVICE_CANCELLED' && booking.payments.length > 0) {
      console.log(`[Groomer Reject] Processing refunds for booking ${booking.bookingNumber}`);

      const cancelReason = `미용사 예약 거절 - 예약번호: ${booking.bookingNumber} (${reason || '미용사가 예약을 거절했습니다'})`;

      // 각 결제에 대해 PortOne 취소 API 호출
      for (const payment of booking.payments) {
        try {
          console.log(
            `[Groomer Reject] Processing payment cancellation for paymentId: ${payment.paymentId}`
          );

          // PortOne API를 통한 결제 취소
          await cancelPayment(payment.paymentId, cancelReason);

          refundResults.successful.push(payment.paymentId);
          refundResults.totalRefundAmount += payment.amount;
          console.log(`[Groomer Reject] Successfully cancelled payment: ${payment.paymentId}`);
        } catch (error) {
          console.error(`[Groomer Reject] Failed to cancel payment ${payment.paymentId}:`, error);

          // 이미 취소된 결제는 성공으로 처리
          if (error instanceof Error && error.message.includes('already cancelled')) {
            refundResults.successful.push(payment.paymentId);
            refundResults.totalRefundAmount += payment.amount;
          } else {
            refundResults.failed.push({
              paymentId: payment.paymentId,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      }
    }

    // 트랜잭션으로 DB 업데이트
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // 성공한 결제들의 상태 업데이트 (SERVICE_CANCELLED인 경우만)
      if (status === 'SERVICE_CANCELLED' && refundResults.successful.length > 0) {
        await tx.payment.updateMany({
          where: {
            bookingId,
            paymentId: {
              in: refundResults.successful,
            },
          },
          data: {
            status: PaymentStatus.CANCELLED,
            cancelledAt: new Date(),
            cancelReason: '미용사 예약 거절로 인한 자동 환불',
            cancelledAmount: booking.totalPrice,
          },
        });

        // 예약의 결제 상태도 업데이트
        updateData.paymentStatus = PaymentStatus.CANCELLED;
      }

      // 예약 상태 업데이트
      return tx.booking.update({
        where: { id: bookingId },
        data: updateData,
        include: {
          customer: true,
          groomer: true,
          bookingPets: {
            include: {
              pet: true,
              services: {
                include: {
                  service: true,
                },
              },
            },
          },
          payments: true,
        },
      });
    });

    // BullMQ를 통한 고객 알림 발송
    await sendNotificationViaQueue(
      {
        id: updatedBooking.id,
        serviceDate: updatedBooking.serviceDate,
        bookingNumber: updatedBooking.bookingNumber,
        cancellationReason: updatedBooking.cancellationReason || undefined,
        groomer: { name: updatedBooking.groomer?.name || '미용사' },
        bookingPets: updatedBooking.bookingPets.map((bp) => ({
          pet: { name: bp.pet.name },
        })),
        refundInfo:
          status === 'SERVICE_CANCELLED'
            ? {
                totalRefundAmount: refundResults.totalRefundAmount,
                successfulRefunds: refundResults.successful.length,
                failedRefunds: refundResults.failed.length,
              }
            : undefined,
      },
      status
    );

    // 예약이 취소된 경우 스케줄된 알림들 제거
    if (status === 'SERVICE_CANCELLED') {
      await workerApiClient.cancelBookingNotifications(bookingId);
    }

    return NextResponse.json({
      message:
        status === 'SERVICE_CANCELLED' && refundResults.successful.length > 0
          ? `예약이 취소되고 ${refundResults.totalRefundAmount.toLocaleString('ko-KR')}원이 환불 처리되었습니다`
          : '예약 상태가 성공적으로 업데이트되었습니다',
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        confirmedAt: updatedBooking.confirmedAt,
        startedAt: updatedBooking.startedAt,
        completedAt: updatedBooking.completedAt,
        cancelledAt: updatedBooking.cancelledAt,
      },
      ...(status === 'SERVICE_CANCELLED' &&
        booking.payments.length > 0 && {
          refundResults: {
            totalPayments: booking.payments.length,
            successfulRefunds: refundResults.successful.length,
            failedRefunds: refundResults.failed.length,
            totalRefundAmount: refundResults.totalRefundAmount,
            ...(refundResults.failed.length > 0 && { failedDetails: refundResults.failed }),
          },
        }),
    });
  } catch (error) {
    console.error('Booking status update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '잘못된 요청 데이터입니다', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '예약 상태 업데이트 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 상태 전환 규칙 정의
function getValidStatusTransitions(currentStatus: string): string[] {
  const transitions: Record<string, string[]> = {
    FIRST_PAYMENT_COMPLETE: ['GROOMER_CONFIRM', 'SERVICE_CANCELLED'],
    GROOMER_CONFIRM_PENDING: ['GROOMER_CONFIRM', 'SERVICE_CANCELLED'],
    GROOMER_CONFIRM: ['WORK_IN_PROGRESS', 'SERVICE_CANCELLED'],
    ADDITIONAL_PAYMENT_COMPLETE: ['WORK_IN_PROGRESS', 'SERVICE_CANCELLED'],
    WORK_IN_PROGRESS: ['SERVICE_COMPLETED', 'SERVICE_CANCELLED'],
  };

  return transitions[currentStatus] || [];
}

// BullMQ를 통한 고객 알림 발송
async function sendNotificationViaQueue(
  booking: {
    id: string;
    serviceDate: Date;
    bookingNumber?: string;
    cancellationReason?: string;
    groomer: { name: string };
    bookingPets: Array<{ pet: { name: string } }>;
    refundInfo?: {
      totalRefundAmount: number;
      successfulRefunds: number;
      failedRefunds: number;
    };
  },
  newStatus: string
) {
  try {
    const notificationMessages = {
      GROOMER_CONFIRM: {
        title: '예약이 확정되었습니다',
        body: `${booking.groomer.name} 미용사가 예약을 승인했습니다. 예약일: ${format(booking.serviceDate, 'yyyy년 MM월 dd일', { locale: ko })}`,
      },
      WORK_IN_PROGRESS: {
        title: '미용 서비스가 시작되었습니다',
        body: `${booking.bookingPets[0]?.pet.name}의 미용이 시작되었습니다.`,
      },
      SERVICE_COMPLETED: {
        title: '미용 서비스가 완료되었습니다',
        body: `${booking.bookingPets[0]?.pet.name}의 미용이 완료되었습니다. 리뷰를 작성해주세요!`,
      },
      SERVICE_CANCELLED: {
        title: '예약이 취소되었습니다',
        body:
          booking.refundInfo && booking.refundInfo.successfulRefunds > 0
            ? `죄송합니다. 예약이 취소되었습니다. ${booking.refundInfo.totalRefundAmount.toLocaleString('ko-KR')}원이 자동으로 환불 처리되었습니다. ${booking.cancellationReason || ''}`
            : `죄송합니다. 예약이 취소되었습니다. ${booking.cancellationReason || '자세한 사항은 고객센터로 문의해주세요.'}`,
      },
    };

    const message = notificationMessages[newStatus as keyof typeof notificationMessages];
    if (!message) return;

    // BullMQ를 통한 즉시 알림 발송
    await workerApiClient.sendImmediateNotification({
      type: 'status_update',
      bookingId: booking.id,
      targetAudience: 'CUSTOMER',
      title: message.title,
      body: message.body,
      data: {
        bookingId: booking.id,
        type: 'BOOKING_STATUS_UPDATE',
        status: newStatus,
        bookingNumber: booking.bookingNumber,
      },
    });

    console.log(`Queued status update notification for booking ${booking.id}: ${newStatus}`);
  } catch (error) {
    console.error('Error queuing notification:', error);
  }
}

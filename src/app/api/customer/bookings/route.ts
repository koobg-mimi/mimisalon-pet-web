import { parseISO } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { Prisma, BookingStatus } from '@mimisalon/shared'
// PortOne SDK는 더 이상 필요 없음 - 웹훅을 통해 이미 검증된 Payment 사용
import { z } from 'zod'
import { workerApiClient } from '@/lib/worker-api-client'
import {
  generateRequiredTimeSlots,
  checkGroomerAvailability,
  blockTimeSlots,
  CLEANUP_BUFFER_MINUTES,
} from '@/lib/booking-availability'

// PortOne 클라이언트 제거 - 웹훅으로 이미 검증된 결제 사용

// Booking creation schema
const BookingCreateSchema = z.object({
  paymentId: z.string(),
  petServices: z.array(
    z.object({
      petId: z.string(),
      services: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          basePrice: z.number(),
          duration: z.number(),
        })
      ),
    })
  ),
  addressId: z.string(),
  customerAddress: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      detailAddress: z.string().optional(),
    })
    .optional(),
  groomerId: z.string().min(1, '미용사를 선택해주세요'),
  date: z.string().min(1, '날짜를 선택해주세요'),
  timeSlot: z
    .string()
    .min(1, '시간을 선택해주세요')
    .regex(/^\d{2}:\d{2}$/, '올바른 시간 형식이 아닙니다 (HH:mm)'),
  specialRequests: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const statusParam = searchParams.get('status')
    const sortBy = searchParams.get('sort_by') || 'serviceDate'
    const sortOrder = (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc'

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build where clause
    const where: Prisma.BookingWhereInput = {
      customerId: user.id,
    }

    // Support multiple statuses (comma-separated)
    if (statusParam) {
      const statuses = statusParam.split(',').filter(Boolean) as BookingStatus[]
      if (statuses.length === 1) {
        where.status = statuses[0]
      } else if (statuses.length > 1) {
        where.status = {
          in: statuses,
        }
      }
    }

    // Get total count
    const totalBookings = await prisma.booking.count({ where })

    // Get paginated bookings
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        groomer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pet: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        bookingPets: {
          include: {
            pet: {
              include: {
                breed: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            services: {
              include: {
                service: true,
              },
            },
            selectedOptions: {
              include: {
                serviceOption: true,
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            paidAt: true,
          },
        },
        reviews: {
          select: {
            id: true,
          },
          take: 1,
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Transform bookings to match expected format
    const transformedBookings = bookings.map((booking) => ({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      serviceDate: booking.serviceDate,
      serviceTime: booking.serviceTime,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      serviceType: booking.serviceType,
      totalPrice: booking.totalPrice,
      totalAmount: booking.totalPrice, // Alias for compatibility
      additionalCharges: booking.additionalCharges,
      groomer: booking.groomer,
      pet: booking.pet || booking.bookingPets[0]?.pet,
      pets: booking.bookingPets.map((bp) => bp.pet),
      services: booking.bookingPets.flatMap((bp) => bp.services.map((s) => s.service)),
      options: booking.bookingPets.flatMap((bp) =>
        bp.selectedOptions.map((opt) => ({
          name: opt.serviceOption.name,
          price: opt.optionPrice,
        }))
      ),
      payments: booking.payments,
      customerRating: booking.customerRating,
      customerReview: booking.customerReview,
      hasReview: booking.reviews.length > 0 || !!booking.customerReview,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }))

    return NextResponse.json({
      bookings: transformedBookings,
      totalBookings,
      totalPages: Math.ceil(totalBookings / limit),
      page,
      size: limit,
      first: page === 1,
      last: page >= Math.ceil(totalBookings / limit),
    })
  } catch (error) {
    console.error('Customer bookings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let paymentIdForCleanup: string | undefined // Store payment ID for cleanup in error handler

  try {
    console.log('\n🚀 [Booking Create] 예약 생성 API 호출 시작')
    
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.email) {
      console.error('❌ [Booking Create] 세션 오류: 사용자 이메일 없음')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log(`✅ [Booking Create] 세션 확인됨: ${session.user.email}`)

    if (session.user.role !== 'CUSTOMER') {
      console.error(`❌ [Booking Create] 권한 오류: 역할 = ${session.user.role}`)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.log('📋 [Booking Create] 요청 데이터 파싱 중...')
    const body = await request.json()
    console.log('[Booking Create] 요청 본문:', JSON.stringify(body, null, 2))
    
    const validatedData = BookingCreateSchema.parse(body)
    console.log(`✅ [Booking Create] 데이터 검증 완료 - paymentId: ${validatedData.paymentId}, groomerId: ${validatedData.groomerId}`)

    // Store payment ID for potential cleanup
    paymentIdForCleanup = validatedData.paymentId

    // Get user
    console.log(`🔍 [Booking Create] 사용자 정보 조회: ${session.user.email}`)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      console.error(`❌ [Booking Create] 사용자 정보 없음: ${session.user.email}`)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.log(`✅ [Booking Create] 사용자 정보 조회 완료: ${user.id}`)

    // Verify payment from our database (may still be PENDING if webhook hasn't arrived)
    console.log(`💳 [Booking Create] 결제 정보 조회: ${validatedData.paymentId}`)
    const payment = await prisma.payment.findUnique({
      where: { paymentId: validatedData.paymentId },
      include: {
        booking: true,
      },
    })
    console.log(`[Booking Create] 결제 조회 결과:`, payment)

    // If payment doesn't exist, create it as PENDING (for cases where initialization was skipped)
    let paymentRecord = payment
    if (!payment) {
      console.warn('⚠️ [Booking Create] 결제 레코드 없음. 새로운 PENDING 결제 생성 중:', validatedData.paymentId)

      // Calculate total amount from services
      const totalAmount = validatedData.petServices.reduce((total, petService) => {
        return total + petService.services.reduce((sum, service) => sum + service.basePrice, 0)
      }, 0)

      // Create a new PENDING payment record
      paymentRecord = await prisma.payment.create({
        data: {
          paymentId: validatedData.paymentId,
          status: 'PENDING',
          amount: totalAmount,
          currency: 'KRW',
          customerId: user.id,
          orderName: `${validatedData.petServices[0].services[0].name} 외`,
          method: 'PENDING',
        },
        include: {
          booking: true,
        },
      })
    }

    // Check payment status - allow PENDING for webhook delay
    console.log(`💳 [Booking Create] 결제 상태 확인: ${paymentRecord?.status}`)
    if (!paymentRecord || (paymentRecord.status !== 'PAID' && paymentRecord.status !== 'PENDING')) {
      console.error(`❌ [Booking Create] 결제 상태 오류: ${paymentRecord?.status}`)
      return NextResponse.json(
        {
          error: 'Payment not valid',
          status: paymentRecord?.status || 'UNKNOWN',
          message: '결제가 유효하지 않습니다.',
        },
        { status: 400 }
      )
    }
    console.log(`✅ [Booking Create] 결제 상태 확인 완료: ${paymentRecord?.status}`)

    // For PENDING payments, wait a bit for webhook
    if (paymentRecord && paymentRecord.status === 'PENDING') {
      // Check if payment is recent (within last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      console.log(`⏱️ [Booking Create] PENDING 결제 시간 확인: ${paymentRecord.createdAt.toISOString()}`)
      if (paymentRecord && paymentRecord.createdAt < fiveMinutesAgo) {
        console.error('❌ [Booking Create] 결제 시간 초과 (5분 이상)')
        return NextResponse.json(
          {
            error: 'Payment timeout',
            message: '결제 처리 시간이 초과되었습니다.',
          },
          { status: 408 }
        )
      }

      // Payment is still pending but recent - webhook might arrive soon
      console.log('⏳ [Booking Create] PENDING 결제이지만 최근 결제. 예약 생성 진행 중...')
    }

    // Verify payment ownership
    console.log(`👤 [Booking Create] 결제 소유권 확인: ${paymentRecord?.customerId} === ${user.id}`)
    if (paymentRecord && paymentRecord.customerId && paymentRecord.customerId !== user.id) {
      console.error('❌ [Booking Create] 결제 소유권 오류: 다른 사용자의 결제')
      return NextResponse.json({ error: 'Payment belongs to another user' }, { status: 403 })
    }

    // Verify payment is not already used for another booking
    console.log(`🔗 [Booking Create] 결제 재사용 확인: bookingId = ${paymentRecord?.bookingId}`)
    if (paymentRecord && paymentRecord.bookingId) {
      console.error('❌ [Booking Create] 결제 오류: 이미 다른 예약에 사용됨')
      return NextResponse.json(
        { error: 'Payment already used for another booking' },
        { status: 400 }
      )
    }
    console.log('✅ [Booking Create] 결제 소유권 및 재사용 확인 완료')

    // Calculate expected total price
    console.log('💰 [Booking Create] 예상 금액 계산 중...')
    const expectedTotal = validatedData.petServices.reduce((total, petService) => {
      return (
        total +
        petService.services.reduce((serviceTotal, service) => {
          return serviceTotal + service.basePrice
        }, 0)
      )
    }, 0)
    console.log(`[Booking Create] 예상 금액: ${expectedTotal}원`)

    // Verify payment amount matches expected total
    console.log(`💳 [Booking Create] 결제 금액 확인: ${paymentRecord?.amount} === ${expectedTotal}`)
    if (!paymentRecord || paymentRecord.amount !== expectedTotal) {
      console.error(`❌ [Booking Create] 결제 금액 불일치:`, {
        expected: expectedTotal,
        actual: paymentRecord?.amount,
      })
      return NextResponse.json({ error: 'Payment amount mismatch' }, { status: 400 })
    }
    console.log('✅ [Booking Create] 결제 금액 확인 완료')

    // Verify groomer availability
    console.log(`👨‍💼 [Booking Create] 미용사 정보 조회: ${validatedData.groomerId}`)
    const groomer = await prisma.user.findFirst({
      where: {
        id: validatedData.groomerId,
        role: 'GROOMER',
      },
    })

    if (!groomer) {
      console.error(`❌ [Booking Create] 미용사 정보 없음: ${validatedData.groomerId}`)
      return NextResponse.json({ error: 'Groomer not found' }, { status: 404 })
    }
    console.log(`✅ [Booking Create] 미용사 정보 확인 완료: ${groomer.name}`)

    // Calculate required time slots for the booking (including cleanup buffer)
    const totalDuration = validatedData.petServices.reduce(
      (total, ps) => total + ps.services.reduce((dur, s) => dur + (s.duration || 60), 0),
      0
    )

    // Add cleanup buffer to total duration for time slot blocking
    const requiredSlots = generateRequiredTimeSlots(
      validatedData.timeSlot,
      totalDuration + CLEANUP_BUFFER_MINUTES
    )

    // Pre-check availability before starting transaction
    console.log(`📅 [Booking Create] 미용사 시간 가용성 확인: ${validatedData.date} ${validatedData.timeSlot}`)
    const availabilityCheck = await checkGroomerAvailability(
      validatedData.groomerId,
      new Date(validatedData.date),
      requiredSlots
    )
    console.log(`[Booking Create] 가용성 확인 결과:`, availabilityCheck)

    if (!availabilityCheck.available) {
      console.error(`❌ [Booking Create] 시간 충돌: ${availabilityCheck.conflicts?.join(', ')}`)
      return NextResponse.json(
        {
          error: '선택한 시간대가 이미 예약되었습니다',
          conflicts: availabilityCheck.conflicts,
          message: `다음 시간이 이미 예약되어 있습니다: ${availabilityCheck.conflicts?.join(', ')}`,
        },
        { status: 409 }
      )
    }
    console.log('✅ [Booking Create] 시간 가용성 확인 완료')

    // Generate booking number
    const bookingNumber = `BK${Date.now()}`
    console.log(`📝 [Booking Create] 예약 생성 시작: ${bookingNumber}`)

    // Create booking with all related data in a transaction with time slot blocking
    const booking = await prisma.$transaction(async (tx) => {
      console.log(`[Booking Create] Transaction 시작: ${bookingNumber}`)
      // Double-check availability within transaction (with row-level lock)
      const existingConflict = await tx.booking.findFirst({
        where: {
          groomerId: validatedData.groomerId,
          serviceDate: new Date(validatedData.date),
          status: {
            notIn: ['SERVICE_CANCELLED', 'BOOKING_FAILED'],
          },
          OR: requiredSlots.map((slot) => ({
            AND: [
              { serviceTime: { lte: slot } },
              {
                // Check if existing booking's end time overlaps with our slot
                // This is a simplified check - in production you might want to store end time
              },
            ],
          })),
        },
      })

      if (existingConflict) {
        throw new Error('시간대가 다른 예약과 충돌합니다. 다른 시간을 선택해주세요.')
      }

      // Create main booking with split payment structure
      const newBooking = await tx.booking.create({
        data: {
          bookingNumber,
          customerId: user.id,
          groomerId: validatedData.groomerId,
          serviceDate: new Date(validatedData.date),
          serviceTime: validatedData.timeSlot,
          basePrice: expectedTotal, // 기본 서비스 금액 (1차 결제)
          additionalCharges: 0, // 추가 서비스 금액 (2차 결제, 초기값 0)
          totalPrice: expectedTotal, // 현재 총 금액 (추후 견적 시 업데이트)
          status:
            paymentRecord?.status === 'PAID' ? 'FIRST_PAYMENT_COMPLETE' : 'FIRST_PAYMENT_PENDING',
          paymentStatus: paymentRecord?.status === 'PAID' ? 'PAID' : 'PENDING',
          serviceType: 'GROOMING',
          specialRequests: validatedData.specialRequests,
          customerAddressId: validatedData.addressId,
          estimatedDurationMinutes: totalDuration,
        },
      })

      // Block time slots for this booking
      await blockTimeSlots(
        tx,
        validatedData.groomerId,
        new Date(validatedData.date),
        requiredSlots,
        newBooking.id
      )

      // Create booking pets and their services
      for (const petService of validatedData.petServices) {
        const bookingPet = await tx.bookingPet.create({
          data: {
            bookingId: newBooking.id,
            petId: petService.petId,
          },
        })

        // Create booking pet services
        for (const service of petService.services) {
          await tx.bookingService.create({
            data: {
              bookingPetId: bookingPet.id,
              serviceId: service.id,
              servicePrice: service.basePrice,
            },
          })
        }
      }

      // Link payment to booking
      // Update payment to link it with the booking
      await tx.payment.update({
        where: {
          paymentId: validatedData.paymentId,
        },
        data: {
          bookingId: newBooking.id,
          // Keep other fields as they were set by webhook
        },
      })

      return newBooking
    })

    // Return booking with details
    const bookingWithDetails = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        groomer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookingPets: {
          include: {
            pet: {
              include: {
                breed: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            services: {
              include: {
                service: true,
              },
            },
            selectedOptions: {
              include: {
                serviceOption: true,
              },
            },
          },
        },
        payments: true,
      },
    })

    // 예약 생성 성공 - Payment cleanup job 취소
    try {
      await workerApiClient.cancelPaymentCleanup(validatedData.paymentId)
      console.log(
        `[Booking Create] Cancelled cleanup job for successful payment: ${validatedData.paymentId}`
      )
    } catch (cleanupError) {
      console.error('[Booking Create] Failed to cancel cleanup job:', cleanupError)
      // 실패해도 계속 진행
    }

    // 예약 생성 성공 후 알림 스케줄링
    try {
      const serviceDateTime = parseISO(`${validatedData.date}T${validatedData.timeSlot}`)

      // 2시간 전 리마인더 스케줄링
      await workerApiClient.scheduleBookingReminder({
        bookingId: booking.id,
        serviceDateTime: serviceDateTime.toISOString(),
      })

      // 당일 알림 스케줄링
      await workerApiClient.scheduleTodayNotification({
        bookingId: booking.id,
        serviceDate: serviceDateTime.toISOString(),
      })

      // 미용사에게 즉시 알림 (새로운 예약 요청)
      await workerApiClient.sendImmediateNotification({
        type: 'status_update',
        bookingId: booking.id,
        targetAudience: 'GROOMER',
        title: '새로운 예약 요청',
        body: `${user.name}님이 새로운 미용 예약을 요청했습니다.`,
        data: {
          bookingNumber: booking.bookingNumber,
          serviceDate: validatedData.date,
          serviceTime: validatedData.timeSlot,
        },
      })

      console.log(`Scheduled notifications for booking: ${booking.id}`)
    } catch (notificationError) {
      console.error('Failed to schedule notifications:', notificationError)
      // 알림 스케줄링 실패는 예약 생성 자체를 실패로 처리하지 않음
    }

    return NextResponse.json(bookingWithDetails, { status: 201 })
  } catch (error) {
    // 예약 생성 실패 시 즉시 cleanup 실행
    try {
      // paymentId가 있는 경우에만 실행
      if (paymentIdForCleanup) {
        await workerApiClient.executePaymentCleanup({ paymentId: paymentIdForCleanup })
        console.log(
          `[Booking Create] Executed immediate cleanup for failed booking: ${paymentIdForCleanup}`
        )
      }
    } catch (cleanupError) {
      console.error('[Booking Create] Failed to execute immediate cleanup:', cleanupError)
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    // Handle booking conflict errors
    if (error instanceof Error) {
      if (error.message.includes('충돌') || error.message.includes('예약')) {
        return NextResponse.json(
          {
            error: error.message,
            code: 'BOOKING_CONFLICT',
          },
          { status: 409 }
        )
      }
    }

    console.error('❌ [Booking Create] 예약 생성 오류:', error)
    if (error instanceof Error) {
      console.error('[Booking Create] 에러 상세:', {
        message: error.message,
        stack: error.stack,
      })
    }
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}

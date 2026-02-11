import { ko } from 'date-fns/locale'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { format } from 'date-fns'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { BookingStatus } from '@mimisalon/shared'

// 페이지네이션 기본값
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

// UI 상태를 DB 상태로 매핑
const statusMap: Record<string, BookingStatus[]> = {
  PENDING: [BookingStatus.GROOMER_CONFIRM_PENDING, BookingStatus.FIRST_PAYMENT_COMPLETE],
  CONFIRMED: [BookingStatus.GROOMER_CONFIRM],
  IN_PROGRESS: [BookingStatus.WORK_IN_PROGRESS],
  COMPLETED: [BookingStatus.SERVICE_COMPLETED],
  CANCELLED: [BookingStatus.SERVICE_CANCELLED, BookingStatus.BOOKING_FAILED],
}

// Error response type
export interface ErrorResponse {
  error: string
  details?: unknown
}

// Response types
export type GroomerBookingListItem = {
  id: string
  bookingNumber: string
  date: string
  time: string
  status: string
  dbStatus: string
  paymentStatus: string
  customer: {
    id: string
    name: string
    phone?: string
    email: string
  }
  pets: Array<{
    id: string
    name: string
    breed: string
    weight?: number
    age?: number
    specialNotes?: string
    services: Array<{
      id: string
      name: string
      price: number
      duration: number
    }>
    options: Array<{
      name: string
      price: number
    }>
  }>
  location?: {
    name: string
    address: string
    detailAddress?: string
    zipCode?: string
  }
  serviceType: string
  serviceDescription?: string
  specialRequests?: string
  totalPrice: number
  estimatedDuration: number
  createdAt: Date
}

export type GroomerBookingsResponse = {
  bookings: GroomerBookingListItem[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalCount: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<GroomerBookingsResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get('filter') || 'ALL'
    const page = parseInt(searchParams.get('page') || String(DEFAULT_PAGE))
    const limit = Math.min(parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT)), MAX_LIMIT)
    const sortBy = searchParams.get('sortBy') || 'serviceDate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // 기본 필터 조건
    const whereClause: {
      groomerId: string
      serviceDate?: {
        gte: Date
        lt: Date
      }
      status?: BookingStatus | { in: BookingStatus[] }
    } = {
      groomerId: session.user.id,
    }

    // 필터 적용
    if (filter === 'TODAY') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      whereClause.serviceDate = {
        gte: today,
        lt: tomorrow,
      }
    } else if (filter !== 'ALL' && statusMap[filter]) {
      whereClause.status = {
        in: statusMap[filter],
      }
    } else if (filter !== 'ALL') {
      // 직접 DB 상태값을 사용하는 경우 - BookingStatus enum 값으로 변환
      const bookingStatus = filter as BookingStatus
      if (Object.values(BookingStatus).includes(bookingStatus)) {
        whereClause.status = bookingStatus
      }
    }

    // 전체 개수 조회
    const totalCount = await prisma.booking.count({
      where: whereClause,
    })

    // 페이지네이션 계산
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(totalCount / limit)

    // 예약 목록 조회
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true,
          },
        },
        customerAddress: true,
        bookingPets: {
          include: {
            pet: {
              include: {
                breed: true,
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
      },
    })

    // UI 표시용으로 데이터 변환
    const transformedBookings = bookings.map((booking) => {
      const uiStatus = mapDbStatusToUi(booking.status)
      console.log(
        `[Groomer Bookings] Booking ${booking.id}: dbStatus=${booking.status}, uiStatus=${uiStatus}, paymentStatus=${booking.paymentStatus}`
      )
      return {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        date: format(booking.serviceDate, 'yyyy-MM-dd', { locale: ko }),
        time: booking.serviceTime,
        status: uiStatus,
        dbStatus: booking.status, // 원본 DB 상태도 보관
        paymentStatus: booking.paymentStatus,
        customer: {
          id: booking.customer.id,
          name: booking.customer.name || '고객',
        phone: booking.customer.phoneNumber || undefined,
        email: booking.customer.email,
      },
      pets: booking.bookingPets.map((bp) => ({
        id: bp.pet.id,
        name: bp.pet.name,
        breed: bp.pet.breed?.name || '알 수 없음',
        weight: bp.pet.weight || undefined,
        age: bp.pet.age || undefined,
        specialNotes: bp.pet.specialNeeds || undefined, // specialNeeds 필드 사용
        services: bp.services.map((s) => ({
          id: s.service.id,
          name: s.service.name,
          price: s.servicePrice,
          duration: s.serviceDurationMinutes || booking.estimatedDurationMinutes,
        })),
        options: bp.selectedOptions.map((opt) => ({
          name: opt.serviceOption.name,
          price: opt.optionPrice,
        })),
      })),
      location: booking.customerAddress
        ? {
            name: '고객 주소',
            address: `${booking.customerAddress.street}, ${booking.customerAddress.city}, ${booking.customerAddress.state}`,
            detailAddress: undefined,
            zipCode: booking.customerAddress.zipCode || undefined,
          }
        : undefined,
      serviceType: booking.serviceType,
      serviceDescription: booking.serviceDescription || undefined,
      specialRequests: booking.specialRequests || undefined,
      totalPrice: booking.basePrice + booking.additionalCharges - booking.discountAmount, // totalAmount 대신 계산
      estimatedDuration: booking.estimatedDurationMinutes,
      createdAt: booking.createdAt,
    }));

    return NextResponse.json({
      bookings: transformedBookings,
      pagination: {
        page,
        limit,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Groomer bookings fetch error:', error)
    return NextResponse.json(
      { error: '예약 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// DB 상태를 UI 표시용으로 변환
function mapDbStatusToUi(status: BookingStatus): string {
  const mappings: Record<BookingStatus, string> = {
    [BookingStatus.FIRST_PAYMENT_PENDING]: 'PENDING',
    [BookingStatus.FIRST_PAYMENT_COMPLETE]: 'PENDING',
    [BookingStatus.FIRST_PAYMENT_VERIFY]: 'PENDING',
    [BookingStatus.GROOMER_CONFIRM_PENDING]: 'PENDING',
    [BookingStatus.GROOMER_CONFIRM]: 'CONFIRMED',
    [BookingStatus.ADDITIONAL_PAYMENT_PENDING]: 'CONFIRMED',
    [BookingStatus.ADDITIONAL_PAYMENT_COMPLETE]: 'CONFIRMED',
    [BookingStatus.WORK_IN_PROGRESS]: 'IN_PROGRESS',
    [BookingStatus.SERVICE_COMPLETED]: 'COMPLETED',
    [BookingStatus.SERVICE_CANCELLED]: 'CANCELLED',
    [BookingStatus.BOOKING_FAILED]: 'CANCELLED',
  }

  const uiStatus = mappings[status] || 'PENDING'
  console.log(
    `[MapDbStatusToUi] Converting ${status} to ${uiStatus}`
  )
  return uiStatus
}

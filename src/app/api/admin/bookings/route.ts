import { ko } from 'date-fns/locale';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { BookingStatus, prisma, Prisma } from '@mimisalon/shared';
import { format } from 'date-fns';

// Prisma query result type
type BookingFromDB = Prisma.BookingGetPayload<{
  select: {
    id: true
    bookingNumber: true
    customerId: true
    groomerId: true
    status: true
    serviceDate: true
    serviceTime: true
    actualStartTime: true
    actualEndTime: true
    basePrice: true
    additionalCharges: true
    discountAmount: true
    paymentStatus: true
    notes: true
    createdAt: true
    updatedAt: true
    customer: {
      select: {
        id: true
        name: true
        email: true
        phoneNumber: true
      }
    }
    groomer: {
      select: {
        id: true
        name: true
        email: true
        phoneNumber: true
      }
    }
    bookingPets: {
      select: {
        id: true
        bookingId: true
        petId: true
        pet: {
          include: {
            breed: true
          }
        }
        services: {
          select: {
            id: true
            bookingPetId: true
            serviceId: true
            servicePrice: true
            serviceDurationMinutes: true
            service: {
              select: {
                id: true
                name: true
              }
            }
          }
        }
        selectedOptions: {
          select: {
            id: true
            optionPrice: true
            serviceOption: {
              select: {
                id: true
                name: true
              }
            }
          }
        }
      }
    }
    customerAddress: {
      select: {
        id: true
        street: true
        city: true
        state: true
        zipCode: true
      }
    }
    payments: {
      select: {
        id: true
        amount: true
        method: true
        status: true
        createdAt: true
      }
    }
  }
}>

export type UserInfo = {
  id: string
  name: string | null
  email: string
  phoneNumber: string | null
}

export type ServiceInfo = {
  service: {
    id: string
    name: string
  }
  price: number
}

export type BookingPetInfo = {
  pet: BookingFromDB['bookingPets'][number]['pet']
  services: ServiceInfo[]
}

export type PaymentInfo = {
  id: string
  amount: number
  method: string
  status: string
  createdAt: string
}

export type AddressInfo = {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
}

export type TransformedBooking = {
  id: string
  bookingNumber: string
  customerId: string
  groomerId: string | null
  status: BookingStatus
  serviceDate: string
  startTime: string
  endTime: string | null
  totalAmount: number
  paidAmount: number
  additionalAmount: number
  paymentStatus: string
  notes: string | null
  createdAt: string
  updatedAt: string
  customer: UserInfo | null
  groomer: UserInfo | null
  bookingPets: BookingPetInfo[]
  customerAddress: AddressInfo | null
  payments: PaymentInfo[]
}

export type PaginationInfo = {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface AdminBookingsGetResponse {
  bookings: TransformedBooking[]
  pagination: PaginationInfo
}

interface ErrorResponse {
  error: string
}

export async function GET(request: NextRequest): Promise<NextResponse<AdminBookingsGetResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const {searchParams} = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';
    const date = searchParams.get('date') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.BookingWhereInput = {};

    // Search filter
    if (search) {
      where.OR = [
        {bookingNumber: {contains: search, mode: 'insensitive'}},
        {customer: {name: {contains: search, mode: 'insensitive'}}},
        {customer: {email: {contains: search, mode: 'insensitive'}}},
        {customer: {phoneNumber: {contains: search, mode: 'insensitive'}}},
      ];
    }

    // Status filter
    if (status && status !== 'ALL') {
      where.status = status as BookingStatus;
    }

    // Date filter
    if (date) {
      const selectedDate = new Date(date);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1);

      where.serviceDate = {
        gte: selectedDate,
        lt: nextDate,
      };
    }

    // Get bookings with pagination
    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          bookingNumber: true,
          customerId: true,
          groomerId: true,
          status: true,
          serviceDate: true,
          serviceTime: true,
          actualStartTime: true,
          actualEndTime: true,
          basePrice: true,
          additionalCharges: true,
          discountAmount: true,
          paymentStatus: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
          groomer: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
          bookingPets: {
            select: {
              id: true,
              bookingId: true,
              petId: true,
              pet: {
                include: {
                  breed: true,
                },
              },
              services: {
                select: {
                  id: true,
                  bookingPetId: true,
                  serviceId: true,
                  servicePrice: true,
                  serviceDurationMinutes: true,
                  service: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              selectedOptions: {
                select: {
                  id: true,
                  optionPrice: true,
                  serviceOption: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          customerAddress: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              zipCode: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              method: true,
              status: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.booking.count({where}),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Transform bookings to ensure proper serialization
    const transformedBookings = bookings.map((booking) => {
      // Calculate paid amount from completed payments
      const paidAmount = booking.payments
        .filter((p) => p.status === 'PAID' || p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        customerId: booking.customerId,
        groomerId: booking.groomerId,
        status: booking.status,
        serviceDate: format(booking.serviceDate, 'yyyy-MM-dd', {locale: ko}),
        startTime: booking.serviceTime, // serviceTime을 startTime으로 매핑
        endTime: booking.actualEndTime
          ? format(booking.actualEndTime, 'HH:mm', {locale: ko})
          : null,
        totalAmount: booking.basePrice + booking.additionalCharges - booking.discountAmount,
        paidAmount,
        additionalAmount: booking.additionalCharges,
        paymentStatus: booking.paymentStatus,
        notes: booking.notes,
        createdAt: format(booking.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", {locale: ko}),
        updatedAt: format(booking.updatedAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", {locale: ko}),
        customer: booking.customer,
        groomer: booking.groomer,
        bookingPets: booking.bookingPets.map((bp) => ({
          pet: bp.pet,
          services: bp.services.map((s) => ({
            service: s.service,
            price: s.servicePrice,
          })),
        })),
        customerAddress: booking.customerAddress,
        payments: booking.payments.map((p) => ({
          ...p,
          createdAt: format(p.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", {locale: ko}),
        })),
      };
    });

    return NextResponse.json({
      bookings: transformedBookings,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }
}

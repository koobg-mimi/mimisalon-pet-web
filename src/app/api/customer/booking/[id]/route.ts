import { ko } from 'date-fns/locale';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { format } from 'date-fns';
import { env } from '@/lib/env';

// Response type definition
interface BookingDetailResponse {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  additionalAmount: number | null;
  paymentStatus: 'PENDING' | 'PAID';
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string; // breed name as string, not object
    weight: number;
    age: number | null;
    photoUrl: string | null;
  };
  services: Array<{
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  }>;
  options: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
  }>;
  groomer: {
    id: string;
    name: string;
    photoUrl: string | null;
    rating: number;
    experience: string | null;
    phone: string;
    salon: {
      id: string;
      name: string;
      address: string;
      phone: string;
    };
  };
  timeline: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
  notes: string | null;
  estimatedEndTime: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: bookingId } = await params;

    // Get user to verify ownership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get booking with all necessary information
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        customerId: user.id, // Ensure customer owns this booking
      },
      include: {
        groomer: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            image: true, // Profile photo URL
            groomerProfile: {
              select: {
                id: true,
                isActive: true,
              },
            },
          },
        },
        customerAddress: true,
        bookingPets: {
          include: {
            pet: {
              include: {
                breed: {
                  select: {
                    name: true,
                  },
                },
                images: {
                  select: {
                    url: true,
                    isPrimary: true,
                  },
                  where: {
                    isPrimary: true,
                  },
                  take: 1,
                },
              },
            },
            services: {
              include: {
                service: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    durationMinutes: true,
                    priceRanges: {
                      select: {
                        price: true,
                      },
                    },
                  },
                },
              },
            },
            selectedOptions: {
              include: {
                serviceOption: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Format response for booking detail page
    const response: BookingDetailResponse = {
      id: booking.id,
      appointmentDate: format(booking.serviceDate, 'yyyy-MM-dd', { locale: ko }),
      startTime: booking.serviceTime,
      endTime: booking.serviceTime, // You might want to calculate this based on service duration
      status: booking.status,
      totalAmount: booking.totalPrice,
      paidAmount: booking.basePrice,
      additionalAmount: booking.additionalCharges,
      paymentStatus: booking.paymentStatus === 'PAID' ? 'PAID' : 'PENDING',
      pet: booking.bookingPets?.[0]?.pet
        ? {
            id: booking.bookingPets[0].pet.id,
            name: booking.bookingPets[0].pet.name,
            species: booking.bookingPets[0].pet.type,
            breed: booking.bookingPets[0].pet.breed?.name || 'Unknown',
            weight: booking.bookingPets[0].pet.weight || 0,
            age: booking.bookingPets[0].pet.age || null,
            photoUrl: booking.bookingPets[0].pet.images?.[0]?.url || null,
          }
        : {
            id: 'unknown',
            name: 'Unknown Pet',
            species: 'Unknown',
            breed: 'Unknown',
            weight: 0,
            age: null,
            photoUrl: null,
          },
      services: booking.bookingPets?.[0]?.services?.map((s: any) => ({
        id: s.service.id,
        name: s.service.name,
        description: s.service.description || '',
        duration: s.service.durationMinutes,
        price: s.service.priceRanges?.[0]?.price || 0,
        status:
          booking.status === 'SERVICE_COMPLETED'
            ? 'COMPLETED'
            : booking.status === 'WORK_IN_PROGRESS'
              ? 'IN_PROGRESS'
              : 'PENDING',
      })) || [
        {
          id: 'default',
          name: booking.serviceType,
          description: booking.serviceDescription || '',
          duration: booking.estimatedDurationMinutes,
          price: booking.totalPrice,
          status:
            booking.status === 'SERVICE_COMPLETED'
              ? 'COMPLETED'
              : booking.status === 'WORK_IN_PROGRESS'
                ? 'IN_PROGRESS'
                : 'PENDING',
        },
      ],
      options:
        booking.bookingPets?.[0]?.selectedOptions?.map((o: any) => ({
          id: o.serviceOption.id,
          name: o.serviceOption.name,
          description: o.serviceOption.description || '',
          price: o.optionPrice,
        })) || [],
      groomer: {
        id: booking.groomer?.id || 'unassigned',
        name: booking.groomer?.name || 'Unassigned',
        photoUrl: booking.groomer?.image || null,
        rating: 0, // TODO: Implement rating aggregation from reviews
        experience: null, // TODO: Add experience field to GroomerProfile model
        phone: booking.groomer?.phoneNumber || '',
        salon: {
          id: 'default',
          name: '미미살롱',
          address: booking.customerAddress?.street || '주소 미확인',
          phone: env.NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE,
        },
      },
      timeline: [
        {
          id: 'created',
          type: 'CREATED',
          title: '예약 생성',
          description: `반려동물의 미용 예약이 생성되었습니다.`,
          timestamp: booking.createdAt.toISOString(),
        },
        ...(booking.confirmedAt
          ? [
              {
                id: 'confirmed',
                type: 'CONFIRMED',
                title: '예약 확정',
                description: '미용사가 예약을 확정했습니다.',
                timestamp: booking.confirmedAt.toISOString(),
              },
            ]
          : []),
        ...(booking.startedAt
          ? [
              {
                id: 'started',
                type: 'STARTED',
                title: '미용 시작',
                description: `반려동물의 미용이 시작되었습니다.`,
                timestamp: booking.startedAt.toISOString(),
              },
            ]
          : []),
        ...(booking.completedAt
          ? [
              {
                id: 'completed',
                type: 'COMPLETED',
                title: '미용 완료',
                description: '모든 서비스가 완료되었습니다.',
                timestamp: booking.completedAt.toISOString(),
              },
            ]
          : []),
        ...(booking.cancelledAt
          ? [
              {
                id: 'cancelled',
                type: 'CANCELLED',
                title: '예약 취소',
                description: booking.cancellationReason || '예약이 취소되었습니다.',
                timestamp: booking.cancelledAt.toISOString(),
              },
            ]
          : []),
      ],
      notes: booking.specialRequests,
      estimatedEndTime: booking.serviceTime, // You might want to calculate this
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Booking detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

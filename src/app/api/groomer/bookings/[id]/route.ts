import { ko } from 'date-fns/locale';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { format } from 'date-fns';
import { Prisma } from '@mimisalon/shared';

// Response type definition
interface GroomerBookingDetailResponse {
  id: string;
  bookingNumber: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  paidAmount: number;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  groomer: {
    id: string;
    name: string;
    phone: string;
    email: string;
    photoUrl: string | null;
    experience: string | null;
  } | null;
  pets: Array<{
    id: string;
    name: string;
    species: string;
    breed: string; // breed name as string, not object
    age: number;
    weight: number;
    photoUrl: string | null;
    services: Array<{
      id: string;
      serviceId: string;
      name: string;
      description: string;
      duration: number;
      price: number;
      status: string;
    }>;
    options: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
    }>;
  }>;
  location: {
    address: string;
    zipCode: string;
  } | null;
  notes: string | null;
  specialRequests: string | null;
  serviceType: string;
  serviceDescription: string | null;
  actualStartTime: string | null;
  actualEndTime: string | null;
  estimatedEndTime: string;
  createdAt: string;
  updatedAt: string;
}

// Prisma의 include를 활용한 타입 정의
const bookingDetailInclude = {
  customer: {
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      email: true,
    },
  },
  groomer: {
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      email: true,
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
  payments: {
    select: {
      id: true,
      amount: true,
      status: true,
      method: true,
      createdAt: true,
    },
  },
} satisfies Prisma.BookingInclude;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || session.user.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 403 });
    }

    const { id } = await params;

    // 예약 상세 정보 조회
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        groomerId: session.user.id,
      },
      include: bookingDetailInclude,
    });

    if (!booking) {
      return NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 });
    }

    // 응답 데이터 변환 (UI에 맞게 가공)
    const response: GroomerBookingDetailResponse = {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      appointmentDate: format(booking.serviceDate, 'yyyy-MM-dd', { locale: ko }),
      startTime: booking.serviceTime,
      endTime: calculateEndTime(booking.serviceTime, booking.estimatedDurationMinutes),
      status: booking.status,
      paymentStatus: booking.paymentStatus,

      // 가격 정보
      totalAmount: booking.basePrice + booking.additionalCharges - booking.discountAmount,
      paidAmount: booking.payments
        .filter((p) => p.status === 'PAID' || p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0),

      // 고객 정보
      customer: {
        id: booking.customer.id,
        name: booking.customer.name || '고객',
        phone: booking.customer.phoneNumber || '',
        email: booking.customer.email,
      },

      // 미용사 정보
      groomer: booking.groomer
        ? {
            id: booking.groomer.id,
            name: booking.groomer.name || '미용사',
            phone: booking.groomer.phoneNumber || '',
            email: booking.groomer.email,
            photoUrl: booking.groomer.image || null,
            // Experience would go here when available in schema
            experience: null, // Not available in current schema
          }
        : null,

      // 반려동물 및 서비스 정보
      pets: booking.bookingPets.map((bookingPet) => ({
        id: bookingPet.pet.id,
        name: bookingPet.pet.name,
        species: bookingPet.pet.type, // PetType을 species로 매핑
        breed: bookingPet.pet.breed?.name || bookingPet.pet.type || 'Unknown',
        age: bookingPet.pet.age || 0,
        weight: bookingPet.pet.weight || 0,
        photoUrl: bookingPet.pet.images?.[0]?.url || null,

        services: bookingPet.services.map((bookingService) => ({
          id: bookingService.id,
          serviceId: bookingService.service.id,
          name: bookingService.service.name,
          description: bookingService.service.description || '',
          duration: bookingService.serviceDurationMinutes || 60,
          price: bookingService.servicePrice,
          status: booking.status,
        })),

        options: bookingPet.selectedOptions.map((opt) => ({
          id: opt.serviceOption.id,
          name: opt.serviceOption.name,
          description: opt.serviceOption.description || '',
          price: opt.optionPrice,
        })),
      })),

      // 주소 정보
      location: booking.customerAddress
        ? {
            address: `${booking.customerAddress.street}, ${booking.customerAddress.city}, ${booking.customerAddress.state}`,
            zipCode: booking.customerAddress.zipCode,
          }
        : null,

      // 추가 정보
      notes: booking.notes,
      specialRequests: booking.specialRequests,
      serviceType: booking.serviceType,
      serviceDescription: booking.serviceDescription,

      // 시간 정보
      estimatedEndTime: calculateEndTime(booking.serviceTime, booking.estimatedDurationMinutes),
      actualStartTime: booking.actualStartTime
        ? format(booking.actualStartTime, 'HH:mm', { locale: ko })
        : null,
      actualEndTime: booking.actualEndTime
        ? format(booking.actualEndTime, 'HH:mm', { locale: ko })
        : null,

      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Groomer booking detail fetch error:', error);
    return NextResponse.json(
      { error: '예약 정보를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 종료 시간 계산 헬퍼 함수
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

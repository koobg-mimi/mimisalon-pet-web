import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma, Prisma } from '@mimisalon/shared';
import { calculateMultipleServiceRatings } from '@/lib/rating-calculator';
import { z } from 'zod';

// Input validation schemas
const servicePriceRangeSchema = z.object({
  petType: z.string(),
  minWeight: z.number().optional(),
  maxWeight: z.number().optional(),
  price: z.number(),
  selectedBreedIds: z.array(z.string()).optional(),
});

const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().positive(),
  priceRanges: z.array(servicePriceRangeSchema).min(1),
  petTypes: z.array(z.string()),
  breedCategories: z.array(z.string()).optional(),
  requirements: z.string().optional(),
  isActive: z.boolean(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type ServicePriceRangeInput = z.infer<typeof servicePriceRangeSchema>;

// Response types
interface ServicePriceRangeInfo {
  id: string;
  petType: string;
  minWeight: number | null;
  maxWeight: number | null;
  price: number;
  selectedBreedIds?: string[];
}

export interface AdminServiceInfo {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  isActive: boolean;
  petTypes: string[];
  breedCategories: string[];
  priceRanges: ServicePriceRangeInfo[];
  requirements?: string;
  afterCareInstructions?: undefined;
  createdAt: string;
  updatedAt: string;
  bookingCount: number;
  averageRating: number;
}

export type AdminServicesGetResponse = AdminServiceInfo[];
export type AdminServicePostResponse = AdminServiceInfo;

interface ErrorResponse {
  error: string;
  message?: string;
  details?: string;
}

// GET /api/admin/services - 서비스 목록 조회
export async function GET(): Promise<NextResponse<AdminServicesGetResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      include: {
        servicePetTypes: true,
        serviceBreedCategories: true,
        priceRanges: {
          include: {
            applicableBreeds: {
              include: {
                breed: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookingServices: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 모든 서비스의 평균 평점 계산
    const serviceIds = services.map((s) => s.id);
    const ratingsMap = await calculateMultipleServiceRatings(serviceIds);

    // 데이터 변환 - 프론트엔드에서 사용하는 형태로
    const transformedServices = services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      duration: service.durationMinutes,
      isActive: service.isActive,
      petTypes: service.servicePetTypes.map((spt) => spt.petType),
      breedCategories: service.serviceBreedCategories.map((sbc) => sbc.breedCategory),
      priceRanges: service.priceRanges.map((range) => ({
        ...range,
        selectedBreedIds: range.applicableBreeds?.map((b) => b.breedId) || [],
      })),
      requirements: service.requiresVaccination ? '예방접종 필요' : undefined,
      afterCareInstructions: undefined,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
      bookingCount: service._count.bookingServices,
      averageRating: ratingsMap.get(service.id) ?? 0,
    }));

    return NextResponse.json(transformedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch services',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/services - 새 서비스 생성
export async function POST(request: NextRequest): Promise<NextResponse<AdminServicePostResponse | ErrorResponse>> {
  try {
    console.log('POST /api/admin/services - Starting service creation');
    const session = await auth.api.getSession({ headers: await headers() });

    console.log(
      'Session:',
      session
        ? {
            user: {
              id: session.user?.id,
              email: session.user?.email,
              role: session.user?.role,
            },
          }
        : 'No session'
    );

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      console.log('User role is not ADMIN:', session.user.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    console.log('Received payload:', JSON.stringify(body, null, 2));

    const {
      name,
      description,
      duration,
      priceRanges = [],
      petTypes,
      breedCategories = [],
      requirements,
      isActive,
    } = body;

    // 가격 범위 검증: 최소 1개 이상 필요
    if (!priceRanges || priceRanges.length === 0) {
      return NextResponse.json({ error: '최소 하나의 가격 설정이 필요합니다' }, { status: 400 });
    }

    // 트랜잭션으로 서비스와 관련 데이터 생성
    const service = await prisma.$transaction(async (tx) => {
      // 서비스 생성
      const newService = await tx.service.create({
        data: {
          name,
          description,
          durationMinutes: duration,
          requiresVaccination: requirements ? requirements.includes('예방접종') : false,
          isActive,
        },
      });

      // 서비스별 대상 동물 타입 생성
      if (petTypes && petTypes.length > 0) {
        await tx.servicePetType.createMany({
          data: petTypes.map((petType: string) => ({
            serviceId: newService.id,
            petType,
          })),
        });
      }

      // 서비스별 품종 카테고리 생성
      if (breedCategories && breedCategories.length > 0) {
        await tx.serviceBreedCategory.createMany({
          data: breedCategories.map((breedCategory: string) => ({
            serviceId: newService.id,
            breedCategory,
          })),
        });
      }

      // 가격 구간 생성 (항상 필요)
      if (priceRanges.length > 0) {
        for (const range of priceRanges) {
          // 먼저 가격 범위 생성
          const priceRange = await tx.servicePriceRange.create({
            data: {
              serviceId: newService.id,
              petType: range.petType,
              minWeight: range.minWeight ?? 0,
              maxWeight: range.maxWeight,
              price: range.price,
            },
          });

          // 품종 매핑 생성
          if (range.selectedBreedIds && range.selectedBreedIds.length > 0) {
            await tx.servicePriceBreed.createMany({
              data: range.selectedBreedIds.map((breedId: string) => ({
                servicePriceRangeId: priceRange.id,
                breedId,
              })),
            });
          }
        }
      }

      return newService;
    });

    // 생성된 서비스 상세 정보 조회
    const createdService = await prisma.service.findUnique({
      where: { id: service.id },
      include: {
        servicePetTypes: true,
        serviceBreedCategories: true,
        priceRanges: true,
        _count: {
          select: {
            bookingServices: true,
          },
        },
      },
    });

    // 프론트엔드 형태로 변환
    const transformedService = {
      id: createdService!.id,
      name: createdService!.name,
      description: createdService!.description,
      duration: createdService!.durationMinutes,
      isActive: createdService!.isActive,
      petTypes: createdService!.servicePetTypes.map((spt) => spt.petType),
      breedCategories: createdService!.serviceBreedCategories.map((sbc) => sbc.breedCategory),
      priceRanges: createdService!.priceRanges,
      requirements: createdService!.requiresVaccination ? '예방접종 필요' : undefined,
      afterCareInstructions: undefined,
      createdAt: createdService!.createdAt.toISOString(),
      updatedAt: createdService!.updatedAt.toISOString(),
      bookingCount: createdService!._count.bookingServices,
      averageRating: 0,
    };

    return NextResponse.json(transformedService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error message:', error instanceof Error ? error.message : String(error));

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

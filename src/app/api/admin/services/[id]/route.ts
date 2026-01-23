import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { calculateServiceAverageRating } from '@/lib/rating-calculator';

// GET /api/admin/services/[id] - 특정 서비스 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
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
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // 평균 평점 계산
    const averageRating = await calculateServiceAverageRating(id);

    // 데이터 변환 - 프론트엔드에서 사용하는 형태로
    const transformedService = {
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
      averageRating: averageRating ?? 0,
    };

    return NextResponse.json(transformedService);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch service details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/services/[id] - 서비스 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
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

    // 트랜잭션으로 서비스 및 관련 데이터 업데이트
    await prisma.$transaction(async (tx) => {
      // 서비스 업데이트
      const updatedService = await tx.service.update({
        where: { id },
        data: {
          name,
          description,
          durationMinutes: duration,
          requiresVaccination: requirements ? requirements.includes('예방접종') : false,
          isActive,
        },
      });

      // 기존 관련 데이터 삭제
      await tx.servicePetType.deleteMany({
        where: { serviceId: id },
      });
      await tx.serviceBreedCategory.deleteMany({
        where: { serviceId: id },
      });
      await tx.servicePriceRange.deleteMany({
        where: { serviceId: id },
      });

      // 새로운 서비스별 대상 동물 타입 생성
      if (petTypes && petTypes.length > 0) {
        await tx.servicePetType.createMany({
          data: petTypes.map((petType: string) => ({
            serviceId: id,
            petType,
          })),
        });
      }

      // 새로운 서비스별 품종 카테고리 생성
      if (breedCategories && breedCategories.length > 0) {
        await tx.serviceBreedCategory.createMany({
          data: breedCategories.map((breedCategory: string) => ({
            serviceId: id,
            breedCategory,
          })),
        });
      }

      // 새로운 가격 구간 생성 (항상 필요)
      if (priceRanges.length > 0) {
        for (const range of priceRanges) {
          // 먼저 가격 범위 생성
          const priceRange = await tx.servicePriceRange.create({
            data: {
              serviceId: id,
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

      return updatedService;
    });

    // 업데이트된 서비스 상세 정보 조회
    const updatedService = await prisma.service.findUnique({
      where: { id },
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
    });

    // 평균 평점 계산
    const averageRating = await calculateServiceAverageRating(id);

    // 프론트엔드 형태로 변환
    const transformedService = {
      id: updatedService!.id,
      name: updatedService!.name,
      description: updatedService!.description,
      duration: updatedService!.durationMinutes,
      isActive: updatedService!.isActive,
      petTypes: updatedService!.servicePetTypes.map((spt) => spt.petType),
      breedCategories: updatedService!.serviceBreedCategories.map((sbc) => sbc.breedCategory),
      priceRanges: updatedService!.priceRanges.map((range) => ({
        ...range,
        selectedBreedIds: range.applicableBreeds?.map((b) => b.breedId) || [],
      })),
      requirements: updatedService!.requiresVaccination ? '예방접종 필요' : undefined,
      afterCareInstructions: undefined,
      createdAt: updatedService!.createdAt.toISOString(),
      updatedAt: updatedService!.updatedAt.toISOString(),
      bookingCount: updatedService!._count.bookingServices,
      averageRating: averageRating ?? 0,
    };

    return NextResponse.json(transformedService);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      {
        error: 'Failed to update service',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/services/[id] - 서비스 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // 서비스와 관련 데이터 삭제 (CASCADE로 자동 삭제)
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete service',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

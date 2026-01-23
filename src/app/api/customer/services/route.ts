import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { calculateServicePrice } from '@/lib/pricing';

// GET /api/customer/services - 고객용 서비스 목록 조회
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const petId = searchParams.get('petId');

    // 펫 정보 조회 (가격 계산용)
    let pet = null;
    if (petId) {
      pet = await prisma.pet.findUnique({
        where: { id: petId },
        include: {
          breed: true,
        },
      });

      if (!pet) {
        return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
      }
    }

    // 활성화된 서비스만 조회
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      include: {
        servicePetTypes: true,
        priceRanges: {
          include: {
            applicableBreeds: {
              include: {
                breed: true,
              },
            },
          },
          orderBy: [{ petType: 'asc' }, { minWeight: 'asc' }],
        },
        _count: {
          select: {
            bookingServices: true,
          },
        },
      },
      orderBy: [{ name: 'asc' }],
    });

    // 고객용 형태로 데이터 변환 및 필터링
    const transformedServices = services
      .map((service) => {
        let calculatedPrice =
          service.priceRanges.length > 0 ? Math.min(...service.priceRanges.map((r) => r.price)) : 0;
        let isAvailableForPet = true;

        // 펫 정보가 있으면 무게 및 품종 기반 가격 계산 및 가용성 체크
        if (pet && service.priceRanges.length > 0) {
          // Early exit: 펫 타입에 맞는 가격 범위가 없으면 바로 필터링
          const hasPetTypeMatch = service.priceRanges.some((r) => r.petType === pet.type);
          if (!hasPetTypeMatch) {
            isAvailableForPet = false;
          } else {
            let matchingRange = null;

            // 1. 품종별 가격 확인 (품종이 지정된 경우)
            if (pet.breedId) {
              // 품종이 명시적으로 선택된 가격 범위 확인
              matchingRange = service.priceRanges.find((range) => {
                if (range.petType !== pet.type) return false;

                const breedIds = range.applicableBreeds?.map((ab) => ab.breedId) || [];
                if (breedIds.length > 0 && pet.breedId && breedIds.includes(pet.breedId)) {
                  // 무게 조건 확인
                  if (pet.weight) {
                    const minWeight = range.minWeight ?? 0;
                    const isMinWeightValid = pet.weight >= minWeight;
                    const isMaxWeightValid =
                      range.maxWeight == null || pet.weight <= range.maxWeight;
                    return isMinWeightValid && isMaxWeightValid;
                  }
                  // 무게 정보가 없으면 minWeight=0 & maxWeight=null인 범위만 적용
                  return (
                    (range.minWeight === 0 || range.minWeight == null) && range.maxWeight == null
                  );
                }
                return false;
              });
            }

            // 2. 품종별 가격이 없으면 일반 가격(품종 제한 없는) 확인
            if (!matchingRange) {
              matchingRange = service.priceRanges.find((range) => {
                if (range.petType !== pet.type) return false;

                // 품종이 지정되지 않은 일반 가격 범위 (모든 품종에 적용)
                const breedIds = range.applicableBreeds?.map((ab) => ab.breedId) || [];
                if (breedIds.length > 0) return false;

                // 무게 조건 확인
                if (pet.weight) {
                  const minWeight = range.minWeight ?? 0;
                  const isMinWeightValid = pet.weight >= minWeight;
                  const isMaxWeightValid = range.maxWeight == null || pet.weight <= range.maxWeight;
                  return isMinWeightValid && isMaxWeightValid;
                }

                // 무게 정보가 없으면 minWeight=0 & maxWeight=null인 범위만 적용
                return (
                  (range.minWeight === 0 || range.minWeight == null) && range.maxWeight == null
                );
              });
            }

            if (matchingRange) {
              calculatedPrice = matchingRange.price;
            } else {
              // 가격 범위를 찾지 못한 경우 - 이 품종에는 해당 서비스 제공 불가
              console.warn(
                `[Service Filter] ✗ No price range match for service ${service.id} (${service.name}), ` +
                  `pet ${pet.id} (type: ${pet.type}, weight: ${pet.weight}kg, breedId: ${pet.breedId}). Service will be hidden.`
              );
              // 품종별 가격도 없고 일반 가격도 없으면 서비스 숨김
              isAvailableForPet = false;
            }
          }
        }

        return {
          id: service.id,
          name: service.name,
          description: service.description || '',
          price: calculatedPrice, // 계산된 가격
          duration: service.durationMinutes,
          petTypes: service.servicePetTypes.map((spt) => spt.petType),
          priceRanges: service.priceRanges.map((pr) => ({
            petType: pr.petType,
            minWeight: pr.minWeight,
            maxWeight: pr.maxWeight,
            price: pr.price,
            selectedBreedIds: pr.applicableBreeds?.map((ab) => ab.breedId) || [],
          })),
          requiresVaccination: service.requiresVaccination,
          bookingCount: service._count.bookingServices,
          // 추가 정보
          isPopular: service._count.bookingServices > 10,
          isRecommended: false,
          // 기본 아이콘
          icon: '✂️',
          createdAt: service.createdAt.toISOString(),
          updatedAt: service.updatedAt.toISOString(),
          isAvailableForPet, // 가용성 플래그 추가
        };
      })
      .filter((service) => service.isAvailableForPet); // 가용한 서비스만 필터링

    return NextResponse.json(transformedServices);
  } catch (error) {
    console.error('Error fetching customer services:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

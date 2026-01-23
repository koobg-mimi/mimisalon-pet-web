import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { BreedCategory } from '@mimisalon/shared';

// GET /api/customer/service-options - 고객용 서비스 옵션 조회
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const petId = searchParams.get('petId');

    if (!petId) {
      return NextResponse.json({ error: '반려동물 ID가 필요합니다' }, { status: 400 });
    }

    // 반려동물 정보 조회
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: {
        breed: true,
      },
    });

    if (!pet) {
      return NextResponse.json({ error: '반려동물을 찾을 수 없습니다' }, { status: 404 });
    }

    // 품종이 없으면 빈 배열 반환
    if (!pet.breed) {
      return NextResponse.json([]);
    }

    // 해당 품종 카테고리에 적용 가능한 옵션만 조회
    const options = await prisma.serviceOption.findMany({
      where: {
        isActive: true,
        applicableCategories: {
          has: pet.breed.category as BreedCategory,
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error('Error fetching service options for customer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

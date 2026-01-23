import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

// PATCH /api/admin/services/[id]/toggle - 서비스 상태 토글
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    // 서비스 상태 업데이트
    const updatedService = await prisma.service.update({
      where: { id },
      data: { isActive },
      include: {
        servicePetTypes: true,
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
      id: updatedService.id,
      name: updatedService.name,
      description: updatedService.description,
      duration: updatedService.durationMinutes,
      isActive: updatedService.isActive,
      petTypes: updatedService.servicePetTypes.map((spt) => spt.petType),
      priceRanges: updatedService.priceRanges,
      requirements: updatedService.requiresVaccination ? '예방접종 필요' : undefined,
      afterCareInstructions: undefined,
      createdAt: updatedService.createdAt.toISOString(),
      updatedAt: updatedService.updatedAt.toISOString(),
      bookingCount: updatedService._count.bookingServices,
      averageRating: 4.5,
    };

    return NextResponse.json(transformedService);
  } catch (error) {
    console.error('Error toggling service status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

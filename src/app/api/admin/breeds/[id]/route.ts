import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { Breed, prisma } from '@mimisalon/shared';

// DELETE endpoint types
export interface AdminBreedsDeleteSuccessResponse {
  message: string
}

export interface AdminBreedsDeleteErrorResponse {
  error: string
  petCount?: number
  suggestion?: string
  message?: string
}

// PATCH endpoint types
export interface AdminBreedsPatchRequest {
  isActive: boolean
}

export type AdminBreedsPatchSuccessResponse = Breed

export interface AdminBreedsPatchErrorResponse {
  error: string
  message?: string
}

// DELETE /api/admin/breeds/[id] - 품종 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<AdminBreedsDeleteSuccessResponse | AdminBreedsDeleteErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // 연관된 펫이 있는지 확인
    const breed = await prisma.breed.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            pets: true,
          },
        },
      },
    });

    if (!breed) {
      return NextResponse.json({ error: '품종을 찾을 수 없습니다' }, { status: 404 });
    }

    if (breed._count.pets > 0) {
      return NextResponse.json(
        {
          error: '이 품종을 사용하는 반려동물이 있어 삭제할 수 없습니다',
          petCount: breed._count.pets,
          suggestion: '대신 비활성화를 권장합니다',
        },
        { status: 400 }
      );
    }

    // 품종 삭제
    await prisma.breed.delete({
      where: { id },
    });

    return NextResponse.json({ message: '품종이 삭제되었습니다' });
  } catch (error) {
    console.error('Error deleting breed:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete breed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/breeds/[id] - 품종 활성화/비활성화 토글
export async function PATCH(
  request: NextRequest,
  {params}: { params: Promise<{ id: string }> }
): Promise<NextResponse<AdminBreedsPatchSuccessResponse | AdminBreedsPatchErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body: AdminBreedsPatchRequest = await request.json();
    const { isActive } = body;

    // 품종 업데이트
    const updatedBreed = await prisma.breed.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(updatedBreed);
  } catch (error) {
    console.error('Error updating breed:', error);
    return NextResponse.json(
      {
        error: 'Failed to update breed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

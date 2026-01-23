import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma, Prisma } from '@mimisalon/shared';

// ============================================================================
// Types
// ============================================================================

interface RouteParams {
  params: Promise<{
    id: string;
    action: string;
  }>;
}

/**
 * PATCH/DELETE success response
 */
export interface CommissionGradeActionSuccessResponse {
  success: true;
  message: string;
  grade?: {
    id: string;
    name: string;
    isActive: boolean;
    groomerCount: number;
    updatedAt: string;
  };
}

export interface ErrorResponse {
  error: string;
}

// ============================================================================
// Handlers
// ============================================================================

// PATCH - 커미션 등급 활성화/비활성화
export async function PATCH(
  _request: NextRequest,
  {params}: RouteParams
): Promise<NextResponse<CommissionGradeActionSuccessResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    const { id, action } = await params;

    // 등급 존재 여부 확인
    const existingGrade = await prisma.groomerCommissionGrade.findUnique({
      where: { id },
      include: {
        _count: {
          select: { groomers: true },
        },
      },
    });

    if (!existingGrade) {
      return NextResponse.json({ error: '커미션 등급을 찾을 수 없습니다' }, { status: 404 });
    }

    let updateData: Prisma.GroomerCommissionGradeUpdateInput = {};
    let message = '';

    switch (action) {
      case 'activate':
        if (existingGrade.isActive) {
          return NextResponse.json({ error: '이미 활성화된 등급입니다' }, { status: 400 });
        }
        updateData = { isActive: true };
        message = '커미션 등급이 활성화되었습니다';
        break;

      case 'deactivate':
        if (!existingGrade.isActive) {
          return NextResponse.json({ error: '이미 비활성화된 등급입니다' }, { status: 400 });
        }

        // 사용 중인 등급인지 확인
        if (existingGrade._count.groomers > 0) {
          return NextResponse.json(
            { error: '미용사가 사용 중인 등급은 비활성화할 수 없습니다' },
            { status: 400 }
          );
        }

        updateData = { isActive: false };
        message = '커미션 등급이 비활성화되었습니다';
        break;

      case 'delete':
        // 사용 중인 등급인지 확인
        if (existingGrade._count.groomers > 0) {
          return NextResponse.json(
            { error: '미용사가 사용 중인 등급은 삭제할 수 없습니다' },
            { status: 400 }
          );
        }

        // 등급 삭제
        await prisma.groomerCommissionGrade.delete({
          where: { id },
        });

        return NextResponse.json({
          success: true,
          message: '커미션 등급이 삭제되었습니다',
        });

      default:
        return NextResponse.json({ error: '알 수 없는 액션입니다' }, { status: 400 });
    }

    // 등급 상태 업데이트 (activate/deactivate인 경우)
    if (action === 'activate' || action === 'deactivate') {
      const updatedGrade = await prisma.groomerCommissionGrade.update({
        where: { id },
        data: updateData,
        include: {
          _count: {
            select: { groomers: true },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message,
        grade: {
          id: updatedGrade.id,
          name: updatedGrade.name,
          isActive: updatedGrade.isActive,
          groomerCount: updatedGrade._count.groomers,
          updatedAt: updatedGrade.updatedAt.toISOString(),
        },
      });
    }

    // This should never be reached, but TypeScript needs a return
    return NextResponse.json({error: 'Unknown error'}, {status: 500});
  } catch (error) {
    console.error('Error updating commission grade:', error);
    return NextResponse.json(
      { error: '커미션 등급 상태 변경 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE - 커미션 등급 삭제 (호환성을 위해)
export async function DELETE(
  request: NextRequest,
  {params}: RouteParams
): Promise<NextResponse<CommissionGradeActionSuccessResponse | ErrorResponse>> {
  const resolvedParams = await params;
  if (resolvedParams.action === 'delete') {
    return PATCH(request, { params });
  }

  return NextResponse.json({ error: '지원되지 않는 액션입니다' }, { status: 400 });
}

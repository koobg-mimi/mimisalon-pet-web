import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { z } from 'zod';

// ============================================================================
// Types
// ============================================================================

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// 커미션 등급 수정 스키마
const updateCommissionGradeSchema = z.object({
  name: z.string().min(1, '등급명을 입력해주세요').optional(),
  description: z.string().optional(),
  commissionRate: z.number().min(0).max(100, '수수료율은 0-100% 사이여야 합니다').optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

/**
 * PATCH request body
 */
export type UpdateCommissionGradeRequest = z.infer<typeof updateCommissionGradeSchema>;

/**
 * Success response for PATCH
 */
export interface UpdateCommissionGradeSuccessResponse {
  success: true;
  message: string;
  grade: {
    id: string;
    name: string;
    description: string | null;
    commissionRate: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    groomerCount: number;
  };
}

/**
 * Success response for DELETE
 */
export interface DeleteCommissionGradeSuccessResponse {
  success: true;
  message: string;
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}

// ============================================================================
// Handlers
// ============================================================================

// PATCH - 커미션 등급 수정
export async function PATCH(
  request: NextRequest,
  {params}: RouteParams
): Promise<NextResponse<UpdateCommissionGradeSuccessResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    const { id } = await params;

    // 등급 존재 여부 확인
    const existingGrade = await prisma.groomerCommissionGrade.findUnique({
      where: { id },
    });

    if (!existingGrade) {
      return NextResponse.json({ error: '커미션 등급을 찾을 수 없습니다' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateCommissionGradeSchema.parse(body);

    // 등급명 중복 체크 (자신 제외)
    if (validatedData.name && validatedData.name !== existingGrade.name) {
      const duplicateGrade = await prisma.groomerCommissionGrade.findFirst({
        where: {
          name: validatedData.name,
          id: { not: id },
        },
      });

      if (duplicateGrade) {
        return NextResponse.json({ error: '이미 존재하는 등급명입니다' }, { status: 400 });
      }
    }

    // 등급 수정
    const updatedGrade = await prisma.groomerCommissionGrade.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: { groomers: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: '커미션 등급이 수정되었습니다',
      grade: {
        id: updatedGrade.id,
        name: updatedGrade.name,
        description: updatedGrade.description,
        commissionRate: updatedGrade.commissionRate,
        isActive: updatedGrade.isActive,
        createdAt: updatedGrade.createdAt.toISOString(),
        updatedAt: updatedGrade.updatedAt.toISOString(),
        groomerCount: updatedGrade._count.groomers,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating commission grade:', error);
    return NextResponse.json({ error: '커미션 등급 수정 중 오류가 발생했습니다' }, { status: 500 });
  }
}

// DELETE - 커미션 등급 삭제
export async function DELETE(
  request: NextRequest,
  {params}: RouteParams
): Promise<NextResponse<DeleteCommissionGradeSuccessResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    const { id } = await params;

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
  } catch (error) {
    console.error('Error deleting commission grade:', error);
    return NextResponse.json({ error: '커미션 등급 삭제 중 오류가 발생했습니다' }, { status: 500 });
  }
}

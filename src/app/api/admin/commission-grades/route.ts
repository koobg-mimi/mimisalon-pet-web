import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma, Prisma } from '@mimisalon/shared';
import { z } from 'zod';

// ============================================================================
// Request Validation Schemas
// ============================================================================

// 커미션 등급 생성/수정 스키마
const commissionGradeSchema = z.object({
  name: z.string().min(1, '등급명을 입력해주세요'),
  description: z.string().optional(),
  commissionRate: z.number().min(0).max(100, '수수료율은 0-100% 사이여야 합니다'),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).optional(),
});

// 등급 조회 쿼리 스키마
const gradeQuerySchema = z.object({
  search: z.string().optional().default(''),
  status: z.enum(['ALL', 'ACTIVE', 'INACTIVE']).optional().default('ALL'),
});

// ============================================================================
// Types
// ============================================================================

type CommissionGradeInput = z.infer<typeof commissionGradeSchema>;
type GradeQueryParams = z.infer<typeof gradeQuerySchema>;

/**
 * Commission grade with groomer count
 */
type CommissionGradeWithCount = Prisma.GroomerCommissionGradeGetPayload<{
  include: {
    _count: {
      select: {
        groomers: true;
      };
    };
  };
}>;

/**
 * Formatted commission grade for response
 */
export interface FormattedCommissionGrade {
  id: string;
  name: string;
  description: string | null;
  commissionRate: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  groomerCount: number;
}

/**
 * GET /api/admin/commission-grades response
 */
export interface GetCommissionGradesResponse {
  success: true;
  grades: FormattedCommissionGrade[];
  totalCount: number;
}

/**
 * POST /api/admin/commission-grades response
 */
export interface CreateCommissionGradeResponse {
  success: true;
  message: string;
  grade: FormattedCommissionGrade;
}

interface ErrorResponse {
  error: string;
  details?: unknown;
}

// ============================================================================
// Handlers
// ============================================================================

// GET - 커미션 등급 목록 조회
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetCommissionGradesResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validatedParams = gradeQuerySchema.parse(queryParams);

    // 검색 조건 구성
    const where: Prisma.GroomerCommissionGradeWhereInput = {};

    // 상태 필터
    if (validatedParams.status !== 'ALL') {
      where.isActive = validatedParams.status === 'ACTIVE';
    }

    // 검색어 필터 (등급명, 설명)
    if (validatedParams.search) {
      where.OR = [
        { name: { contains: validatedParams.search, mode: 'insensitive' } },
        {
          description: {
            contains: validatedParams.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // 등급 목록 조회 (표시 순서대로)
    const grades = await prisma.groomerCommissionGrade.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { groomers: true },
        },
      },
    });

    // 응답 데이터 변환
    const formattedGrades = grades.map((grade) => ({
      id: grade.id,
      name: grade.name,
      description: grade.description,
      commissionRate: grade.commissionRate,
      isActive: grade.isActive,
      displayOrder: grade.displayOrder,
      createdAt: grade.createdAt.toISOString(),
      updatedAt: grade.updatedAt.toISOString(),
      groomerCount: grade._count.groomers,
    }));

    return NextResponse.json({
      success: true,
      grades: formattedGrades,
      totalCount: grades.length,
    });
  } catch (error) {
    console.error('Error fetching commission grades:', error);
    return NextResponse.json({ error: '커미션 등급 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}

// POST - 새 커미션 등급 생성
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateCommissionGradeResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = commissionGradeSchema.parse(body);

    // 등급명 중복 체크
    const existingGrade = await prisma.groomerCommissionGrade.findFirst({
      where: { name: validatedData.name },
    });

    if (existingGrade) {
      return NextResponse.json({ error: '이미 존재하는 등급명입니다' }, { status: 400 });
    }

    // 표시 순서 계산 (가장 마지막)
    const maxOrder = await prisma.groomerCommissionGrade.findFirst({
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });

    const displayOrder = (maxOrder?.displayOrder || 0) + 1;

    // 새 등급 생성
    const newGrade = await prisma.groomerCommissionGrade.create({
      data: {
        ...validatedData,
        displayOrder,
      },
      include: {
        _count: {
          select: { groomers: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: '커미션 등급이 생성되었습니다',
      grade: {
        id: newGrade.id,
        name: newGrade.name,
        description: newGrade.description,
        commissionRate: newGrade.commissionRate,
        isActive: newGrade.isActive,
        displayOrder: newGrade.displayOrder,
        createdAt: newGrade.createdAt.toISOString(),
        updatedAt: newGrade.updatedAt.toISOString(),
        groomerCount: newGrade._count.groomers,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating commission grade:', error);
    return NextResponse.json({ error: '커미션 등급 생성 중 오류가 발생했습니다' }, { status: 500 });
  }
}

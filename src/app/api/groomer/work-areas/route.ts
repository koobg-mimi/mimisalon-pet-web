import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { geocodeAddress } from '@/lib/kakao-geocode';
import { z } from 'zod';
import { Prisma } from '@mimisalon/shared';

// Request schema - EXPORTED
export const createWorkAreaSchema = z.object({
  name: z.string().min(1, '근무 장소명은 필수입니다'),
  centerLat: z.number().min(-90).max(90, '유효한 위도를 입력하세요').optional(),
  centerLng: z.number().min(-180).max(180, '유효한 경도를 입력하세요').optional(),
  radiusKm: z.number().min(0.5).max(50, '반경은 0.5km ~ 50km 사이여야 합니다'),
  address: z.string().min(1, '주소는 필수입니다'),
  zonecode: z.string().optional(),
  description: z.string().optional(),
});

export type CreateWorkAreaRequest = z.infer<typeof createWorkAreaSchema>;

// Response types - EXPORTED
export type WorkAreaResponse = Prisma.GroomerWorkAreaGetPayload<{
  select: {
    id: true;
    name: true;
    centerLat: true;
    centerLng: true;
    radiusKm: true;
    address: true;
    description: true;
    isActive: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

type ErrorResponse = {
  error: string;
  details?: unknown;
};

// GET: 미용사의 근무 장소 목록 조회
export async function GET(): Promise<NextResponse<WorkAreaResponse[] | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    if (session.user.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사만 접근 가능합니다' }, { status: 403 });
    }

    const workAreas = await prisma.groomerWorkArea.findMany({
      where: {
        groomerId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(workAreas);
  } catch (error) {
    console.error('Failed to fetch work areas:', error);
    return NextResponse.json({ error: '근무 장소 조회에 실패했습니다' }, { status: 500 });
  }
}

// POST: 새로운 근무 장소 생성
export async function POST(
  request: NextRequest
): Promise<NextResponse<WorkAreaResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    if (session.user.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사만 접근 가능합니다' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createWorkAreaSchema.parse(body);

    // Server-side geocoding using Kakao API
    const geocodeResult = await geocodeAddress(validatedData.address);

    if (!geocodeResult) {
      return NextResponse.json(
        {
          error: '주소를 좌표로 변환할 수 없습니다. 올바른 주소를 입력해주세요.',
        },
        { status: 400 }
      );
    }

    const workArea = await prisma.groomerWorkArea.create({
      data: {
        groomerId: session.user.id,
        name: validatedData.name,
        centerLat: geocodeResult.latitude,
        centerLng: geocodeResult.longitude,
        radiusKm: validatedData.radiusKm,
        address: geocodeResult.address,
        description: validatedData.description,
      },
    });

    return NextResponse.json(workArea, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다', details: error },
        { status: 400 }
      );
    }

    console.error('Failed to create work area:', error);
    return NextResponse.json({ error: '근무 장소 생성에 실패했습니다' }, { status: 500 });
  }
}

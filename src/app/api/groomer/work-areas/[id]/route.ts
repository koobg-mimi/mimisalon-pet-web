import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { geocodeAddress } from '@/lib/kakao-geocode';
import { z } from 'zod';

const updateWorkAreaSchema = z.object({
  name: z.string().min(1, '근무 장소명은 필수입니다').optional(),
  centerLat: z.number().min(-90).max(90, '유효한 위도를 입력하세요').optional(),
  centerLng: z.number().min(-180).max(180, '유효한 경도를 입력하세요').optional(),
  radiusKm: z.number().min(0.5).max(50, '반경은 0.5km ~ 50km 사이여야 합니다').optional(),
  address: z.string().optional(),
  zonecode: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET: 특정 근무 장소 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    if (session.user.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사만 접근 가능합니다' }, { status: 403 });
    }

    const { id } = await params;
    const workArea = await prisma.groomerWorkArea.findFirst({
      where: {
        id: id,
        groomerId: session.user.id,
      },
    });

    if (!workArea) {
      return NextResponse.json({ error: '근무 장소를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json(workArea);
  } catch (error) {
    console.error('Failed to fetch work area:', error);
    return NextResponse.json({ error: '근무 장소 조회에 실패했습니다' }, { status: 500 });
  }
}

// PUT: 근무 장소 정보 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    if (session.user.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사만 접근 가능합니다' }, { status: 403 });
    }

    // 근무 장소가 해당 미용사의 것인지 확인
    const existingWorkArea = await prisma.groomerWorkArea.findFirst({
      where: {
        id: (await params).id,
        groomerId: session.user.id,
      },
    });

    if (!existingWorkArea) {
      return NextResponse.json({ error: '근무 장소를 찾을 수 없습니다' }, { status: 404 });
    }

    const body = await request.json();
    console.log('PUT request body:', body);

    const validatedData = updateWorkAreaSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Clean the data by removing fields that don't exist in the database schema
    const cleanedData = validatedData;

    // If address is being updated, perform geocoding
    let updateData = { ...cleanedData };
    if (cleanedData.address && cleanedData.address !== existingWorkArea.address) {
      console.log('Attempting geocoding for new address:', cleanedData.address);
      const geocodeResult = await geocodeAddress(cleanedData.address);
      console.log('Geocoding result:', geocodeResult);

      if (!geocodeResult) {
        return NextResponse.json(
          {
            error: '주소를 좌표로 변환할 수 없습니다. 올바른 주소를 입력해주세요.',
          },
          { status: 400 }
        );
      }

      updateData = {
        ...cleanedData,
        centerLat: geocodeResult.latitude,
        centerLng: geocodeResult.longitude,
        address: geocodeResult.address,
      };
    } else if (cleanedData.address === existingWorkArea.address) {
      console.log('Address unchanged, skipping geocoding');
      // Remove address from update data to avoid unnecessary geocoding
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { address, ...rest } = cleanedData;
      updateData = rest;
    }

    console.log('Final update data:', updateData);

    const updatedWorkArea = await prisma.groomerWorkArea.update({
      where: {
        id: (await params).id,
      },
      data: updateData,
    });

    return NextResponse.json(updatedWorkArea);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Failed to update work area:', error);
    return NextResponse.json({ error: '근무 장소 수정에 실패했습니다' }, { status: 500 });
  }
}

// DELETE: 근무 장소 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    if (session.user.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사만 접근 가능합니다' }, { status: 403 });
    }

    // 근무 장소가 해당 미용사의 것인지 확인
    const existingWorkArea = await prisma.groomerWorkArea.findFirst({
      where: {
        id: (await params).id,
        groomerId: session.user.id,
      },
    });

    if (!existingWorkArea) {
      return NextResponse.json({ error: '근무 장소를 찾을 수 없습니다' }, { status: 404 });
    }

    await prisma.groomerWorkArea.delete({
      where: {
        id: (await params).id,
      },
    });

    return NextResponse.json({ message: '근무 장소가 삭제되었습니다' });
  } catch (error) {
    console.error('Failed to delete work area:', error);
    return NextResponse.json({ error: '근무 장소 삭제에 실패했습니다' }, { status: 500 });
  }
}

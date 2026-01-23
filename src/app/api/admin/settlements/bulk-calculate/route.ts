import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { SettlementJobManager } from '@/lib/settlement-scheduler';
import { prisma } from '@mimisalon/shared';
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns';

// POST - 일괄 정산 생성 (주간 정산 생성)
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    // 요청 본문에서 옵션 추출 (선택적)
    const body = await request.json().catch(() => ({}));
    const { immediate = true, weekOffset = 1 } = body; // 기본값: 즉시 실행, 지난주 정산

    if (immediate) {
      // 즉시 정산 실행 (지난주 정산)
      const targetWeek = subWeeks(new Date(), weekOffset);
      const periodStart = startOfWeek(targetWeek, { weekStartsOn: 1 }); // 월요일 시작
      const periodEnd = endOfWeek(targetWeek, { weekStartsOn: 1 }); // 일요일 끝

      // 이미 생성된 정산이 있는지 확인
      const existingSettlements = await prisma.groomerSettlement.count({
        where: {
          periodStartDate: {
            gte: periodStart,
          },
          periodEndDate: {
            lte: periodEnd,
          },
        },
      });

      if (existingSettlements > 0) {
        return NextResponse.json(
          {
            error: '해당 기간의 정산이 이미 존재합니다',
            existingCount: existingSettlements,
          },
          { status: 400 }
        );
      }

      // 자동 정산 기능이 비활성화됨
      return NextResponse.json(
        {
          error:
            '자동 정산 기능이 비활성화되었습니다. /api/admin/settlements/create-weekly 엔드포인트를 사용하여 수동으로 정산을 생성하세요.',
        },
        { status: 400 }
      );
    } else {
      // 자동 정산 스케줄링이 비활성화됨
      return NextResponse.json(
        {
          error: '자동 정산 스케줄링이 비활성화되었습니다. 수동 정산을 사용하세요.',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error starting bulk calculation:', error);
    return NextResponse.json({ error: '일괄 정산 생성 중 오류가 발생했습니다' }, { status: 500 });
  }
}

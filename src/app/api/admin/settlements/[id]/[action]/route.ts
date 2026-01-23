import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { SettlementStatus } from '@mimisalon/shared'

interface RouteParams {
  params: Promise<{
    id: string
    action: string
  }>
}

// PATCH - 정산 상태 변경 (계산, 지급, 분쟁)
export async function PATCH(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 })
    }

    const { id, action } = await params

    // 정산 조회
    const settlement = await prisma.groomerSettlement.findUnique({
      where: { id },
      include: {
        groomer: { select: { name: true } },
      },
    })

    if (!settlement) {
      return NextResponse.json({ error: '정산을 찾을 수 없습니다' }, { status: 404 })
    }

    interface SettlementUpdateData {
      status: SettlementStatus
      updatedAt: Date
    }

    let updateData: SettlementUpdateData

    switch (action) {
      case 'calculate':
        // PENDING -> CALCULATED
        if (settlement.status !== SettlementStatus.PENDING) {
          return NextResponse.json({ error: '계산할 수 없는 정산 상태입니다' }, { status: 400 })
        }
        updateData = {
          status: SettlementStatus.CALCULATED,
          updatedAt: new Date(),
        }
        break

      case 'pay':
        // CALCULATED -> PAID
        if (settlement.status !== SettlementStatus.CALCULATED) {
          return NextResponse.json({ error: '지급할 수 없는 정산 상태입니다' }, { status: 400 })
        }
        updateData = {
          status: SettlementStatus.PAID,
          updatedAt: new Date(),
        }
        // TODO: 포트원 파트너 정산 API 호출
        break

      case 'fail':
        // CALCULATED or PROCESSING -> FAILED
        if (
          settlement.status !== SettlementStatus.CALCULATED &&
          settlement.status !== SettlementStatus.PROCESSING
        ) {
          return NextResponse.json(
            { error: '실패 처리할 수 없는 정산 상태입니다' },
            { status: 400 }
          )
        }
        updateData = {
          status: SettlementStatus.FAILED,
          updatedAt: new Date(),
        }
        break

      default:
        return NextResponse.json({ error: '알 수 없는 액션입니다' }, { status: 400 })
    }

    // 정산 상태 업데이트
    const updatedSettlement = await prisma.groomerSettlement.update({
      where: { id },
      data: updateData,
      include: {
        groomer: { select: { name: true } },
      },
    })

    // 액션에 따른 메시지
    const actionMessages: Record<string, string> = {
      calculate: '정산이 계산되었습니다',
      pay: '정산이 지급 처리되었습니다',
      fail: '정산이 실패 처리되었습니다',
    }

    return NextResponse.json({
      success: true,
      message: actionMessages[action as keyof typeof actionMessages],
      settlement: {
        id: updatedSettlement.id,
        status: updatedSettlement.status,
        groomerName: updatedSettlement.groomer.name,
        netAmount: updatedSettlement.netSettlementAmount,
        updatedAt: updatedSettlement.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error updating settlement:', error)
    return NextResponse.json(
      { error: '정산 상태 업데이트 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

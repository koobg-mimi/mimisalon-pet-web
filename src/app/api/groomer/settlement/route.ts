import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { z } from 'zod'

// 정산 설정 스키마
const settlementConfigSchema = z.object({
  bankName: z.string().min(1, '은행명을 입력해주세요'),
  bankAccountNumber: z.string().min(10, '올바른 계좌번호를 입력해주세요'),
  bankAccountHolderName: z.string().min(1, '예금주명을 입력해주세요'),
  settlementCycle: z.enum(['WEEKLY_TUESDAY', 'MANUAL']).default('WEEKLY_TUESDAY'),
  taxRate: z.number().min(0).max(100).default(3.3),
  isSettlementActive: z.boolean().default(true),
})

// GET - 정산 설정 조회
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 401 })
    }

    const groomerProfile = await prisma.groomerProfile.findUnique({
      where: { groomerId: session.user.id },
      include: {
        commissionGrade: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: groomerProfile,
    })
  } catch (error) {
    console.error('Error fetching settlement config:', error)
    return NextResponse.json({ error: '정산 설정 조회 중 오류가 발생했습니다' }, { status: 500 })
  }
}

// POST - 정산 설정 생성/수정
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = settlementConfigSchema.parse(body)

    // 기존 프로필 확인
    const existingProfile = await prisma.groomerProfile.findUnique({
      where: { groomerId: session.user.id },
    })

    let groomerProfile

    if (existingProfile) {
      // 기존 프로필 업데이트
      groomerProfile = await prisma.groomerProfile.update({
        where: { groomerId: session.user.id },
        data: {
          bankName: validatedData.bankName,
          bankAccountNumber: validatedData.bankAccountNumber,
          bankAccountHolderName: validatedData.bankAccountHolderName,
          settlementCycle: validatedData.settlementCycle,
          taxRate: validatedData.taxRate,
          isSettlementActive: validatedData.isSettlementActive,
        },
        include: {
          commissionGrade: true,
        },
      })
    } else {
      // 새 프로필 생성 (기본 등급 할당)
      // 기본 등급 조회 (가장 낮은 등급)
      const defaultGrade = await prisma.groomerCommissionGrade.findFirst({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      })

      groomerProfile = await prisma.groomerProfile.create({
        data: {
          groomerId: session.user.id,
          bankName: validatedData.bankName,
          bankAccountNumber: validatedData.bankAccountNumber,
          bankAccountHolderName: validatedData.bankAccountHolderName,
          settlementCycle: validatedData.settlementCycle,
          taxRate: validatedData.taxRate,
          isSettlementActive: validatedData.isSettlementActive,
          commissionGradeId: defaultGrade?.id,
        },
        include: {
          commissionGrade: true,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: groomerProfile,
      message: existingProfile ? '정산 설정이 수정되었습니다' : '정산 설정이 생성되었습니다',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating settlement config:', error)
    return NextResponse.json(
      { error: '정산 설정 업데이트 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// PATCH - 정산 활성화/비활성화
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 401 })
    }

    const body = await request.json()
    const { isSettlementActive } = body

    if (typeof isSettlementActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isSettlementActive는 boolean 값이어야 합니다' },
        { status: 400 }
      )
    }

    const groomerProfile = await prisma.groomerProfile.update({
      where: { groomerId: session.user.id },
      data: { isSettlementActive },
      include: {
        commissionGrade: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: groomerProfile,
      message: `정산이 ${isSettlementActive ? '활성화' : '비활성화'}되었습니다`,
    })
  } catch (error) {
    console.error('Error updating settlement status:', error)
    return NextResponse.json(
      { error: '정산 상태 업데이트 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

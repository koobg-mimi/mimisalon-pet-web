import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { z } from 'zod'
import { Prisma } from '@mimisalon/shared'

// 정산 조회 쿼리 스키마
const settlementQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  search: z.string().optional().default(''),
  status: z
    .enum(['ALL', 'CALCULATED', 'PAID', 'PENDING', 'FAILED', 'CANCELLED'])
    .optional()
    .default('ALL'),
  period: z.string().optional().default(''),
})

// Response types
interface SettlementGroomerInfo {
  name: string | null
  email: string
  commissionRate: number
  bankName: string | null
  bankAccountNumber: string | null
  bankAccountHolderName: string | null
}

export interface AdminSettlementInfo {
  id: string
  groomerId: string
  period: string
  totalBookings: number
  totalRevenue: number
  commission: number
  netAmount: number
  status: string
  calculatedAt: string
  paidAt: string | null
  createdAt: string
  updatedAt: string
  groomer: SettlementGroomerInfo
}

interface SettlementSummary {
  totalPendingAmount: number
  totalPaidAmount: number
  totalCommission: number
  pendingCount: number
}

export interface AdminSettlementsGetResponse {
  success: boolean
  settlements: AdminSettlementInfo[]
  totalCount: number
  totalPages: number
  currentPage: number
  summary: SettlementSummary
}

interface ErrorResponse {
  error: string
}

// GET - 정산 목록 조회 (관리자용)
export async function GET(
  request: NextRequest
): Promise<NextResponse<AdminSettlementsGetResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    const validatedParams = settlementQuerySchema.parse(queryParams)

    const page = parseInt(validatedParams.page)
    const limit = parseInt(validatedParams.limit)
    const skip = (page - 1) * limit

    // 검색 조건 구성
    const where: Prisma.GroomerSettlementWhereInput = {}

    // 상태 필터
    if (validatedParams.status !== 'ALL') {
      where.status = validatedParams.status
    }

    // 기간 필터 (YYYY-MM 형식)
    if (validatedParams.period) {
      const [year, month] = validatedParams.period.split('-')
      const periodStart = new Date(parseInt(year), parseInt(month) - 1, 1)
      const periodEnd = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)

      where.periodStartDate = {
        gte: periodStart,
        lte: periodEnd,
      }
    }

    // 검색어 필터 (미용사명, 이메일)
    if (validatedParams.search) {
      where.groomer = {
        OR: [
          { name: { contains: validatedParams.search, mode: 'insensitive' } },
          { email: { contains: validatedParams.search, mode: 'insensitive' } },
        ],
      }
    }

    // 정산 목록 조회
    const [settlements, totalCount] = await Promise.all([
      prisma.groomerSettlement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          groomer: {
            select: { name: true, email: true },
          },
          groomerProfile: {
            select: {
              bankName: true,
              bankAccountNumber: true,
              bankAccountHolderName: true,
              commissionGrade: {
                select: {
                  commissionRate: true,
                },
              },
            },
          },
        },
      }),
      prisma.groomerSettlement.count({ where }),
    ])

    // 정산 요약 정보 계산
    const summary = await prisma.groomerSettlement.aggregate({
      _sum: {
        netSettlementAmount: true,
        commissionAmount: true,
      },
      _count: {
        id: true,
      },
      where: {
        status: {
          in: ['CALCULATED', 'PAID'],
        },
      },
    })

    const pendingSummary = await prisma.groomerSettlement.aggregate({
      _sum: {
        netSettlementAmount: true,
      },
      _count: {
        id: true,
      },
      where: {
        status: 'CALCULATED',
      },
    })

    const paidSummary = await prisma.groomerSettlement.aggregate({
      _sum: {
        netSettlementAmount: true,
      },
      where: {
        status: 'PAID',
      },
    })

    // 응답 데이터 변환
    const formattedSettlements = settlements.map((settlement) => ({
      id: settlement.id,
      groomerId: settlement.groomerId,
      period: `${settlement.periodStartDate.getFullYear()}-${String(settlement.periodStartDate.getMonth() + 1).padStart(2, '0')}`,
      totalBookings: settlement.bookingCount,
      totalRevenue: settlement.totalRevenue,
      commission: settlement.commissionAmount,
      netAmount: settlement.netSettlementAmount,
      status: settlement.status,
      calculatedAt: settlement.createdAt.toISOString(),
      paidAt: settlement.status === 'PAID' ? settlement.updatedAt.toISOString() : null,
      createdAt: settlement.createdAt.toISOString(),
      updatedAt: settlement.updatedAt.toISOString(),
      groomer: {
        name: settlement.groomer.name,
        email: settlement.groomer.email,
        commissionRate:
          settlement.groomerProfile?.commissionGrade?.commissionRate || settlement.commissionRate,
        bankName: settlement.groomerProfile?.bankName || null,
        bankAccountNumber: settlement.groomerProfile?.bankAccountNumber || null,
        bankAccountHolderName: settlement.groomerProfile?.bankAccountHolderName || null,
      },
    }))

    return NextResponse.json({
      success: true,
      settlements: formattedSettlements,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      summary: {
        totalPendingAmount: pendingSummary._sum.netSettlementAmount || 0,
        totalPaidAmount: paidSummary._sum.netSettlementAmount || 0,
        totalCommission: summary._sum.commissionAmount || 0,
        pendingCount: pendingSummary._count.id || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching settlements:', error)
    return NextResponse.json({ error: '정산 목록 조회 중 오류가 발생했습니다' }, { status: 500 })
  }
}

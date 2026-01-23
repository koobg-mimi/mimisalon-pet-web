import { ko } from 'date-fns/locale'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { format, getISOWeek, parseISO } from 'date-fns'
import type { Prisma } from '@mimisalon/shared'

// Simplify status for display
function simplifyStatus(dbStatus: string): 'PENDING' | 'PAID' | 'FAILED' {
  if (dbStatus === 'PAID') return 'PAID'
  if (dbStatus === 'FAILED' || dbStatus === 'CANCELLED') return 'FAILED'
  return 'PENDING' // PENDING, CALCULATED, READY_FOR_PAYOUT, PROCESSING
}

// GET - Fetch settlements list with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 401 })
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const yearParam = searchParams.get('year')
    const year = yearParam ? parseInt(yearParam) : undefined
    const status = searchParams.get('status') as 'PENDING' | 'PAID' | 'FAILED' | null
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Validate year parameter
    if (year !== undefined && (isNaN(year) || year < 2000 || year > 2100)) {
      return NextResponse.json({ error: '유효하지 않은 연도입니다' }, { status: 400 })
    }

    // Validate date range
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json({ error: '유효하지 않은 날짜 형식입니다' }, { status: 400 })
      }
      if (start > end) {
        return NextResponse.json({ error: '시작일이 종료일보다 늦을 수 없습니다' }, { status: 400 })
      }
    }

    // Validate status
    if (status && !['PENDING', 'PAID', 'FAILED'].includes(status)) {
      return NextResponse.json({ error: '유효하지 않은 상태입니다' }, { status: 400 })
    }

    // Build where clause with proper typing
    const where: Prisma.GroomerSettlementWhereInput = {
      groomerId: session.user.id,
    }

    // Date range filter (takes precedence over year filter)
    if (startDate && endDate) {
      where.periodStartDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } else if (year) {
      // Year filter (only if no date range specified)
      where.periodStartDate = {
        gte: parseISO(`${year}-01-01`),
        lt: parseISO(`${year + 1}-01-01`),
      }
    }

    // Status filter - map simplified status to DB statuses
    if (status) {
      if (status === 'PAID') {
        where.status = 'PAID'
      } else if (status === 'FAILED') {
        where.status = { in: ['FAILED', 'CANCELLED'] }
      } else if (status === 'PENDING') {
        where.status = { in: ['PENDING', 'CALCULATED', 'READY_FOR_PAYOUT', 'PROCESSING'] }
      }
    }

    // Fetch settlements
    const settlements = await prisma.groomerSettlement.findMany({
      where,
      orderBy: {
        periodStartDate: 'desc', // Latest first
      },
      select: {
        id: true,
        periodStartDate: true,
        periodEndDate: true,
        settlementDate: true,
        status: true,
        totalRevenue: true,
        commissionAmount: true,
        netSettlementAmount: true,
        bookingCount: true,
        paidAt: true,
        failureReason: true,
        createdAt: true,
      },
    })

    // Transform data with week numbers and simplified status
    const transformedSettlements = settlements.map((settlement) => {
      const weekNumber = getISOWeek(settlement.periodStartDate)

      return {
        id: settlement.id,
        weekNumber,
        periodStart: format(settlement.periodStartDate, 'yyyy-MM-dd', { locale: ko }),
        periodEnd: format(settlement.periodEndDate, 'yyyy-MM-dd', { locale: ko }),
        settlementDate: format(settlement.settlementDate, 'yyyy-MM-dd', { locale: ko }),
        status: simplifyStatus(settlement.status),
        dbStatus: settlement.status, // Keep original for reference
        totalRevenue: settlement.totalRevenue,
        commissionAmount: settlement.commissionAmount,
        netSettlementAmount: settlement.netSettlementAmount,
        bookingCount: settlement.bookingCount,
        paidAt: settlement.paidAt
          ? format(settlement.paidAt, 'yyyy-MM-dd HH:mm:ss', { locale: ko })
          : undefined,
        failureReason: settlement.failureReason,
        createdAt: format(settlement.createdAt, 'yyyy-MM-dd HH:mm:ss', { locale: ko }),
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedSettlements,
    })
  } catch (error) {
    console.error('Error fetching settlements:', error)
    return NextResponse.json({ error: '정산 내역 조회 중 오류가 발생했습니다' }, { status: 500 })
  }
}

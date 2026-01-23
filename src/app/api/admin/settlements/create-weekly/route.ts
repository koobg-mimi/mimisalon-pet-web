import { ko } from 'date-fns/locale'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns'
import { SettlementCalculator } from '@/lib/settlement-calculator'
import { env } from '@/lib/env'

// POST - 주간 정산 직접 생성 (스케줄러 없이)
export async function POST(request: Request) {
  try {
    // 외부 API 인증 체크 (Authorization: Default)
    const authHeader = request.headers.get('Authorization')
    const isExternalAPI = authHeader === 'Default'

    if (!isExternalAPI) {
      // 기존 세션 기반 인증
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 })
      }
    }

    let weekOffset: number
    let periodStart: Date
    let periodEnd: Date

    try {
      const body = await request.json().catch(() => ({}))
      weekOffset = body.weekOffset ?? 1 // 기본값: 지난주

      // weekOffset 입력값 검증
      if (typeof weekOffset !== 'number' || weekOffset < 0 || weekOffset > 52) {
        return NextResponse.json(
          {
            error: 'weekOffset은 0부터 52 사이의 숫자여야 합니다',
            received: weekOffset,
          },
          { status: 400 }
        )
      }

      // 정산 기간 계산 (지난주 월요일 ~ 일요일)
      const targetWeek = subWeeks(new Date(), weekOffset)
      periodStart = startOfWeek(targetWeek, { weekStartsOn: 1 })
      periodEnd = endOfWeek(targetWeek, { weekStartsOn: 1 })
    } catch (parseError) {
      return NextResponse.json(
        {
          error: '요청 데이터 파싱 중 오류가 발생했습니다',
          details: parseError instanceof Error ? parseError.message : '알 수 없는 오류',
        },
        { status: 400 }
      )
    }

    // 새로운 배치 처리 방식 사용 (에러 처리 강화)
    let results, summary
    try {
      const response = await SettlementCalculator.processSettlements(periodStart, periodEnd, {
        skipExisting: true,
        dryRun: false,
        onProgress: (progress) => {
          console.log(`정산 진행률: ${progress.completed}/${progress.total} (${progress.current})`)
        },
      })
      results = response.results
      summary = response.summary
    } catch (error) {
      console.error('Settlement processing failed:', error)
      return NextResponse.json(
        {
          error: '정산 처리 중 시스템 오류가 발생했습니다',
          details: error instanceof Error ? error.message : '알 수 없는 오류',
          period: {
            start: periodStart.toISOString(),
            end: periodEnd.toISOString(),
          },
        },
        { status: 500 }
      )
    }

    // 기존 형식으로 변환 (에러 처리 포함)
    const legacyResults = results
      .filter((r) => r.status === 'success')
      .map((r) => {
        try {
          return {
            groomerId: r.groomerId,
            groomerName: r.groomerName,
            settlementId: r.settlementId!,
            bookingCount: r.calculation?.bookingCount || 0,
            totalRevenue: r.calculation?.totalRevenue || 0,
            platformCommission: r.calculation?.platformCommission || 0,
            netAmount: r.calculation?.netSettlementAmount || 0,
            status: 'success' as const,
          }
        } catch (error) {
          console.error(`Error processing successful result for ${r.groomerId}:`, error)
          return null
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)

    const skippedGroomers = results
      .filter((r) => r.status === 'skipped')
      .map((r) => ({
        groomerId: r.groomerId,
        groomerName: r.groomerName,
        reason: r.reason || 'unknown',
        details: r.error,
      }))

    const failedGroomers = results
      .filter((r) => r.status === 'failed')
      .map((r) => ({
        groomerId: r.groomerId,
        groomerName: r.groomerName,
        reason: 'failed',
        error: r.error || '알 수 없는 오류',
      }))

    const result = {
      activeGroomers: [],
      results: legacyResults,
      skippedGroomers: [...skippedGroomers, ...failedGroomers],
      totalCreated: summary.successful,
      totalAmount: summary.totalAmount,
    }

    // 부분 성공 시나리오 로깅
    if (summary.failed > 0 || summary.skipped > 0) {
      console.warn(
        `정산 처리 완료 - 성공: ${summary.successful}, 실패: ${summary.failed}, 건너뜀: ${summary.skipped}`
      )

      // 실패한 경우 상세 로깅
      if (summary.failed > 0) {
        const failedDetails = failedGroomers
          .map((f) => `${f.groomerName}(${f.groomerId}): ${f.error}`)
          .join(', ')
        console.error(`실패한 정산들: ${failedDetails}`)
      }
    }

    // 응답 상태 결정 (부분 성공 고려)
    const hasFailures = summary.failed > 0
    const hasSuccesses = summary.successful > 0
    const isPartialSuccess = hasSuccesses && (hasFailures || summary.skipped > 0)

    let responseStatus = 200
    let responseMessage = `${format(periodStart, 'yyyy-MM-dd', { locale: ko })} ~ ${format(periodEnd, 'yyyy-MM-dd', { locale: ko })} 기간 정산이 생성되었습니다`

    if (!hasSuccesses && hasFailures) {
      responseStatus = 500
      responseMessage = '모든 정산 처리가 실패했습니다'
    } else if (isPartialSuccess) {
      responseStatus = 207 // Multi-Status for partial success
      responseMessage = `부분 성공: ${summary.successful}개 성공, ${summary.failed}개 실패, ${summary.skipped}개 건너뜀`
    }

    return NextResponse.json(
      {
        success: hasSuccesses,
        partialSuccess: isPartialSuccess,
        message: responseMessage,
        summary: {
          period: {
            start: periodStart.toISOString(),
            end: periodEnd.toISOString(),
          },
          totalGroomers: summary.total,
          totalCreated: result.totalCreated,
          totalSkipped: result.skippedGroomers.length,
          totalAmount: result.totalAmount,
          failed: summary.failed,
          skippedReasons: {
            noCommissionRate: results.filter(
              (r) => r.reason === 'no_commission_rate' || r.reason === 'no_commission_grade'
            ).length,
            alreadyExists: results.filter((r) => r.reason === 'already_exists').length,
            noBookings: results.filter((r) => r.reason === 'no_bookings').length,
            belowMinimum: results.filter((r) => r.reason === 'below_minimum').length,
            noProfile: results.filter((r) => r.reason === 'no_profile').length,
            systemErrors: summary.failed,
          },
        },
        results: result.results,
        skippedGroomers: result.skippedGroomers,
        errors: hasFailures ? failedGroomers : undefined,
      },
      { status: responseStatus }
    )
  } catch (error) {
    console.error('Critical error in weekly settlement creation:', error)

    // 스택 트레이스 로깅 (개발 환경에서만)
    if (env.NODE_ENV === 'development') {
      console.error('Stack trace:', error)
    }

    return NextResponse.json(
      {
        error: '주간 정산 생성 중 심각한 오류가 발생했습니다',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

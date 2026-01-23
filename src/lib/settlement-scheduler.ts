import { prisma } from '@mimisalon/shared'
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns'
import type { SettlementJob } from '@mimisalon/shared'
import { getPortOneClient, isPortOneEnabled } from '@/lib/portone-client'
import type { CreateOrderTransferRequest } from '@/lib/portone-client'
import { SettlementCalculator } from '@/lib/settlement-calculator'
import type { GroomerWithProfile } from '@/lib/settlement-calculator'

// 정산 작업 결과 타입
interface SettlementResult {
  type: string
  period?: { start: Date; end: Date }
  processed?: number
  successful?: number
  failed?: number
  results?: Array<{
    groomerId: string
    groomerName: string
    settlementId?: string
    netAmount?: number
    status: string
    error?: string
    portoneTransferId?: string
    portoneSettlementId?: string
  }>
  groomerId?: string
  groomerName?: string
  settlementId?: string
  netAmount?: number
  portoneTransferId?: string
  portoneSettlementId?: string
}

// 기존 타입을 새로운 타입으로 매핑 - PortOne 필드 추가
type GroomerProfileWithIncludes = GroomerWithProfile & {
  portonePartnerId?: string | null
  portoneContractId?: string | null
  groomerId: string
}

// 정산 작업 스케줄러 클래스 (자동 스케줄링 비활성화)
export class SettlementScheduler {
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null

  // 스케줄러 시작 (자동 실행 비활성화)
  start() {
    console.log(
      '⚠️ 정산 스케줄러 자동 실행이 비활성화되었습니다. 수동으로만 정산을 실행할 수 있습니다.'
    )
    return
  }

  // 스케줄러 중지
  stop() {
    if (!this.isRunning) return

    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    console.log('🔴 정산 스케줄러 중지')
  }

  // 실행 대기 중인 작업 확인 및 실행 (자동 실행 비활성화)
  private async checkAndExecuteJobs() {
    console.log('⚠️ 정산 작업 자동 실행이 비활성화되었습니다.')
    return
  }

  /**
   * TODO: 개별 작업 실행 로직 구현
   * @param job
   */
  // 개별 작업 실행
  private async executeJob(job: SettlementJob) {
    try {
      // 작업 상태를 RUNNING으로 변경
      await prisma.settlementJob.update({
        where: { id: job.id },
        data: {
          status: 'RUNNING',
          executedAt: new Date(),
          attempts: {
            increment: 1,
          },
        },
      })

      console.log(`🚀 정산 작업 실행: ${job.jobType} (ID: ${job.id})`)

      let result: SettlementResult

      // 작업 타입별 실행
      switch (job.jobType) {
        case 'WEEKLY_SETTLEMENT':
          result = await this.processWeeklySettlement(job)
          break
        case 'MANUAL_SETTLEMENT':
          result = await this.processManualSettlement(job)
          break
        case 'RETRY_SETTLEMENT':
          result = await this.processRetrySettlement(job)
          break
        default:
          throw new Error(`알 수 없는 작업 타입: ${job.jobType}`)
      }

      // 성공 시 상태 업데이트
      await prisma.settlementJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          result: JSON.stringify(result),
          lastError: null,
        },
      })

      console.log(`✅ 정산 작업 완료: ${job.jobType} (ID: ${job.id})`)
    } catch (error) {
      console.error(`❌ 정산 작업 실패: ${job.jobType} (ID: ${job.id})`, error)

      // 재시도 횟수 확인
      const shouldRetry = job.attempts < job.maxAttempts

      await prisma.settlementJob.update({
        where: { id: job.id },
        data: {
          status: shouldRetry ? 'PENDING' : 'FAILED',
          lastError: error instanceof Error ? error.message : '알 수 없는 오류',
          // 재시도인 경우 5분 후 다시 실행
          scheduledAt: shouldRetry ? new Date(Date.now() + 5 * 60 * 1000) : job.scheduledAt,
        },
      })

      if (!shouldRetry) {
        // TODO: 관리자에게 알림 발송
        console.error(`💥 정산 작업 최종 실패: ${job.id}`)
      }
    }
  }

  // 주간 정산 처리
  private async processWeeklySettlement(job: SettlementJob): Promise<SettlementResult> {
    console.log(`📅 주간 정산 처리 시작: ${job.id}`)

    const lastWeek = subWeeks(new Date(), 1)
    const periodStart = startOfWeek(lastWeek, { weekStartsOn: 1 })
    const periodEnd = endOfWeek(lastWeek, { weekStartsOn: 1 })

    // 새로운 배치 처리 방식 사용
    const { results, summary } = await SettlementCalculator.processSettlements(
      periodStart,
      periodEnd,
      {
        skipExisting: true,
        dryRun: false,
      }
    )

    // 기존 형식으로 변환
    const legacyResults = results.map((r) => ({
      groomerId: r.groomerId,
      groomerName: r.groomerName,
      settlementId: r.settlementId,
      netAmount: r.calculation?.netSettlementAmount,
      status: r.status,
      error: r.error,
      portoneTransferId: undefined, // PortOne 처리는 별도로
      portoneSettlementId: undefined,
    }))

    return {
      type: 'weekly_settlement',
      period: { start: periodStart, end: periodEnd },
      processed: summary.total,
      successful: summary.successful,
      failed: summary.failed,
      results: legacyResults,
    }
  }

  // 수동 정산 처리
  private async processManualSettlement(job: SettlementJob): Promise<SettlementResult> {
    if (!job.groomerId || !job.periodStartDate || !job.periodEndDate) {
      throw new Error('수동 정산에 필요한 데이터가 부족합니다')
    }

    // 특정 미용사만 처리하도록 필터링
    const groomers = await SettlementCalculator.fetchActiveGroomers()
    const targetGroomer = groomers.find((g) => g.id === job.groomerId)

    if (!targetGroomer) {
      throw new Error('미용사 프로필을 찾을 수 없습니다')
    }

    // 단일 미용사 정산 처리
    const { results } = await SettlementCalculator.processSettlements(
      job.periodStartDate,
      job.periodEndDate,
      {
        skipExisting: false, // 수동 정산은 기존 것 덮어쓰기 가능
        dryRun: false,
      }
    )

    const result = results.find((r) => r.groomerId === job.groomerId)
    if (!result || result.status !== 'success') {
      throw new Error(result?.error || '정산할 데이터가 없습니다')
    }

    return {
      type: 'manual_settlement',
      groomerId: job.groomerId,
      groomerName: result.groomerName,
      settlementId: result.settlementId!,
      netAmount: result.calculation!.netSettlementAmount,
      portoneTransferId: undefined, // PortOne 처리는 별도로
      portoneSettlementId: undefined,
    }
  }

  // 재시도 정산 처리
  private async processRetrySettlement(job: SettlementJob): Promise<SettlementResult> {
    // 실패한 정산을 다시 처리하는 로직
    // 기본적으로 수동 정산과 동일하지만 로깅이 다름
    return await this.processManualSettlement(job)
  }

  // 레거시 메서드 - 호환성을 위해 유지하되 새 계산기 사용
  private async calculateAndCreateSettlement(
    groomerProfile: GroomerProfileWithIncludes,
    periodStart: Date,
    periodEnd: Date,
    isManual: boolean
  ) {
    // 새로운 계산기를 사용하여 처리
    const bookings = await SettlementCalculator.fetchBookingsForGroomers(
      [groomerProfile.id],
      periodStart,
      periodEnd
    )

    const groomerBookings = bookings.get(groomerProfile.id) || []
    if (groomerBookings.length === 0) {
      return null
    }

    const calculation = SettlementCalculator.calculateSettlement(
      groomerBookings,
      groomerProfile.groomerProfile?.commissionGrade?.commissionRate || 60.0,
      groomerProfile.groomerProfile?.taxRate || 0
    )

    // PortOne 정산 처리는 별도 메서드로 분리
    let portoneResult: {
      portoneTransferId?: string
      portoneSettlementId?: string
      error?: string
    } = {}

    if (isPortOneEnabled()) {
      // PortOne 처리 로직은 기존 그대로 유지
      portoneResult = await this.processPortOneSettlement(
        groomerProfile,
        periodStart,
        periodEnd,
        groomerBookings as any // TODO 타입 호환을 위한 임시 캐스팅
      )

      if (portoneResult.error) {
        console.warn(`PortOne 정산 처리 실패: ${portoneResult.error}`)
      }
    }

    // 정산 생성
    return await prisma.$transaction(async (tx) => {
      const settlement = await tx.groomerSettlement.create({
        data: {
          groomerId: groomerProfile.id,
          groomerProfileId: groomerProfile.groomerProfile!.id,
          settlementDate: new Date(),
          periodStartDate: periodStart,
          periodEndDate: periodEnd,
          totalRevenue: calculation.totalRevenue,
          commissionRate: calculation.commissionRate,
          commissionAmount: calculation.platformCommission,
          taxAmount: calculation.taxAmount,
          netSettlementAmount: calculation.netSettlementAmount,
          status: portoneResult.portoneSettlementId ? 'READY_FOR_PAYOUT' : 'CALCULATED',
          bookingCount: calculation.bookingCount,
          notes: isManual ? '관리자 수동 정산' : '자동 정산',
          portoneTransferId: portoneResult.portoneTransferId,
          portoneSettlementId: portoneResult.portoneSettlementId,
        },
      })

      // 세부 내역 생성
      for (const booking of groomerBookings) {
        const bookingPlatformCommission = booking.totalPrice * (calculation.commissionRate / 100)
        const bookingTaxAmount =
          calculation.taxAmount > 0
            ? booking.totalPrice * (calculation.taxAmount / calculation.totalRevenue)
            : 0
        const bookingNetAmount = booking.totalPrice - bookingPlatformCommission - bookingTaxAmount

        await tx.groomerSettlementDetail.create({
          data: {
            settlementId: settlement.id,
            groomerProfileId: groomerProfile.groomerProfile!.id,
            bookingId: booking.id,
            bookingDate: booking.completedAt!,
            serviceAmount: booking.totalPrice,
            commissionRate: calculation.commissionRate,
            commissionAmount: bookingPlatformCommission,
            taxAmount: bookingTaxAmount,
            netAmount: bookingNetAmount,
          },
        })
      }

      return settlement
    })
  }

  /**
   * PortOne 파트너 정산 처리
   */
  private async processPortOneSettlement(
    groomerProfile: GroomerProfileWithIncludes,
    periodStart: Date,
    periodEnd: Date,
    completedBookings: Array<{
      id: string
      bookingNumber: string
      totalPrice: number
      completedAt: Date | null
      payments: Array<{
        id: string
        paymentId: string
        status: string
        amount: number
        paidAt: Date | null
      }>
    }>
  ): Promise<{
    portoneTransferId?: string
    portoneSettlementId?: string
    error?: string
  }> {
    try {
      if (!isPortOneEnabled()) {
        return { error: 'PortOne 기능이 활성화되지 않음' }
      }

      const portoneClient = getPortOneClient()

      // 각 예약에 대해 주문 정산 건 생성
      const transferIds: string[] = []

      for (const booking of completedBookings) {
        try {
          // 결제 정보 가져오기
          const payment = booking.payments?.[0]
          if (!payment?.paymentId) {
            console.warn(`예약 ${booking.bookingNumber}에 결제 정보가 없어 건너뜁니다`)
            continue
          }

          const orderTransferRequest: CreateOrderTransferRequest = {
            partnerId: groomerProfile.portonePartnerId!,
            contractId: groomerProfile.portoneContractId ?? undefined,
            memo: `미용 서비스 정산 - 예약 ${booking.bookingNumber}`,
            orderDetail: {
              orderId: booking.bookingNumber,
              orderName: `미용 서비스 예약 #${booking.bookingNumber}`,
            },
            transferAmount: booking.totalPrice,
          }

          const transfer = await portoneClient.createOrderTransfer(orderTransferRequest)
          transferIds.push(transfer.id)

          console.log(`✅ PortOne 정산 건 생성: ${transfer.id} (예약: ${booking.bookingNumber})`)
        } catch (error) {
          console.error(`❌ PortOne 정산 건 생성 실패 (예약: ${booking.bookingNumber}):`, error)
          // 개별 예약 실패는 전체 프로세스를 중단하지 않음
        }
      }

      if (transferIds.length === 0) {
        return { error: '생성된 PortOne 정산 건이 없음' }
      }

      // 파트너 정산 조회 (PortOne이 자동으로 생성)
      const settlements = await portoneClient.listPartnerSettlements({
        partnerIds: [groomerProfile.portonePartnerId!],
        settlementDates: {
          from: portoneClient.formatDate(periodStart),
          until: portoneClient.formatDate(periodEnd),
        },
      })

      const latestSettlement = settlements.items.find(
        (s) =>
          s.partnerId === groomerProfile.portonePartnerId &&
          transferIds.some((id) => s.transferIds.includes(id))
      )

      return {
        portoneTransferId: transferIds[0], // 첫 번째 transfer ID 저장
        portoneSettlementId: latestSettlement?.id,
      }
    } catch (error) {
      console.error('PortOne 정산 처리 실패:', error)
      return {
        error: error instanceof Error ? error.message : '알 수 없는 PortOne 오류',
      }
    }
  }

  /**
   * PortOne 정산 상태 동기화
   */
  async syncPortOneSettlementStatus(settlementId: string): Promise<{
    success: boolean
    status?: string
    error?: string
  }> {
    try {
      if (!isPortOneEnabled()) {
        return { success: false, error: 'PortOne 기능이 활성화되지 않음' }
      }

      const settlement = await prisma.groomerSettlement.findUnique({
        where: { id: settlementId },
      })

      if (!settlement?.portoneSettlementId) {
        return { success: false, error: 'PortOne 정산 ID가 없음' }
      }

      const portoneClient = getPortOneClient()
      const portoneSettlement = await portoneClient.getPartnerSettlement(
        settlement.portoneSettlementId
      )

      // PortOne 상태를 로컬 상태로 매핑
      let localStatus = settlement.status
      switch (portoneSettlement.status) {
        case 'PAYOUT_SCHEDULED':
        case 'PAYOUT_PREPARED':
        case 'IN_PAYOUT':
          localStatus = 'PROCESSING'
          break
        case 'PAID_OUT':
          localStatus = 'PAID'
          break
        case 'CANCELLED':
          localStatus = 'CANCELLED'
          break
        case 'PAYOUT_SCHEDULED':
          localStatus = 'READY_FOR_PAYOUT'
          break
      }

      // 상태가 변경되었으면 업데이트
      if (localStatus !== settlement.status) {
        await prisma.groomerSettlement.update({
          where: { id: settlementId },
          data: {
            status: localStatus,
            paidAt: portoneSettlement.status === 'PAID_OUT' ? new Date() : settlement.paidAt,
          },
        })
      }

      return {
        success: true,
        status: portoneSettlement.status,
      }
    } catch (error) {
      console.error(`PortOne 정산 상태 동기화 실패 (${settlementId}):`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      }
    }
  }

  /**
   * PortOne 일괄 지급 실행
   */
  async executePortOneBulkPayout(settlementIds: string[]): Promise<{
    success: boolean
    bulkPayoutId?: string
    error?: string
  }> {
    try {
      if (!isPortOneEnabled()) {
        return { success: false, error: 'PortOne 기능이 활성화되지 않음' }
      }

      // 해당 정산들의 PortOne 정산 ID 조회
      const settlements = await prisma.groomerSettlement.findMany({
        where: {
          id: { in: settlementIds },
          portoneSettlementId: { not: null },
          status: 'READY_FOR_PAYOUT',
        },
      })

      if (settlements.length === 0) {
        return { success: false, error: '지급 가능한 정산이 없음' }
      }

      const portoneSettlementIds = settlements
        .map((s) => s.portoneSettlementId)
        .filter(Boolean) as string[]

      const portoneClient = getPortOneClient()
      const bulkPayout = await portoneClient.createBulkPayout({
        memo: `미용사 정산 일괄 지급 - ${settlements.length}건`,
        partnerSettlementIds: portoneSettlementIds,
      })

      // 로컬 정산 상태 업데이트
      await prisma.groomerSettlement.updateMany({
        where: { id: { in: settlementIds } },
        data: { status: 'PROCESSING' },
      })

      console.log(`✅ PortOne 일괄 지급 실행: ${bulkPayout.id} (${settlements.length}건)`)

      return {
        success: true,
        bulkPayoutId: bulkPayout.id,
      }
    } catch (error) {
      console.error('PortOne 일괄 지급 실패:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '일괄 지급 실행 실패',
      }
    }
  }
}

// 싱글톤 인스턴스
export const settlementScheduler = new SettlementScheduler()

// 정산 작업 관리 함수들
export class SettlementJobManager {
  // 주간 정산 작업 예약 (비활성화됨)
  static async scheduleWeeklySettlements(weeksAhead = 4) {
    console.log('⚠️ 자동 주간 정산 작업 예약이 비활성화되었습니다.')
    return []
  }

  // 수동 정산 작업 추가
  static async addManualSettlement(
    groomerId: string,
    periodStart: Date,
    periodEnd: Date,
    createdBy: string,
    scheduleTime?: Date
  ) {
    const job = await prisma.settlementJob.create({
      data: {
        jobType: 'MANUAL_SETTLEMENT',
        groomerId,
        periodStartDate: periodStart,
        periodEndDate: periodEnd,
        scheduledAt: scheduleTime || new Date(), // 즉시 실행 또는 예약
        status: 'PENDING',
        createdBy,
        notes: '관리자 수동 정산 요청',
      },
    })

    console.log(`📝 수동 정산 작업 추가: ${job.id}`)
    return job
  }

  // 즉시 정산 실행 (비활성화됨)
  static async runImmediateSettlement() {
    console.log('⚠️ 즉시 정산 실행이 비활성화되었습니다.')
    throw new Error('자동 정산 기능이 비활성화되었습니다. 수동 정산을 사용하세요.')
  }

  // 작업 상태 조회
  static async getJobStatus() {
    const jobs = await prisma.settlementJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        groomer: {
          select: { name: true },
        },
      },
    })

    const summary = await prisma.settlementJob.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    return {
      jobs,
      summary: summary.reduce(
        (acc, item) => {
          acc[item.status] = item._count.status
          return acc
        },
        {} as Record<string, number>
      ),
    }
  }

  // 실패한 작업 재시도
  static async retryFailedJob(jobId: string) {
    const originalJob = await prisma.settlementJob.findUnique({
      where: { id: jobId },
    })

    if (!originalJob || originalJob.status !== 'FAILED') {
      throw new Error('재시도할 수 없는 작업입니다')
    }

    const retryJob = await prisma.settlementJob.create({
      data: {
        jobType: 'RETRY_SETTLEMENT',
        groomerId: originalJob.groomerId,
        periodStartDate: originalJob.periodStartDate,
        periodEndDate: originalJob.periodEndDate,
        scheduledAt: new Date(),
        status: 'PENDING',
        notes: `실패한 작업 재시도 (원본: ${jobId})`,
      },
    })

    console.log(`🔄 작업 재시도: ${retryJob.id}`)
    return retryJob
  }

  // 작업 취소
  static async cancelJob(jobId: string) {
    const job = await prisma.settlementJob.update({
      where: {
        id: jobId,
        status: 'PENDING', // PENDING 상태인 것만 취소 가능
      },
      data: {
        status: 'CANCELLED',
      },
    })

    console.log(`❌ 작업 취소: ${jobId}`)
    return job
  }

  // 오래된 작업 정리
  static async cleanupOldJobs(daysToKeep = 30) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)

    const deleted = await prisma.settlementJob.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        status: {
          in: ['COMPLETED', 'CANCELLED'],
        },
      },
    })

    console.log(`🧹 오래된 정산 작업 ${deleted.count}개 정리 완료`)
    return deleted
  }

  // PortOne 정산 상태 동기화 작업
  static async syncPortOneSettlements(settlementIds?: string[]) {
    const scheduler = settlementScheduler

    if (!isPortOneEnabled()) {
      console.log('⚠️ PortOne 기능이 비활성화되어 동기화를 건너뜁니다')
      return { synced: 0, failed: 0 }
    }

    // 대상 정산 조회
    const targetSettlements = settlementIds
      ? await prisma.groomerSettlement.findMany({
          where: {
            id: { in: settlementIds },
            portoneSettlementId: { not: null },
          },
        })
      : await prisma.groomerSettlement.findMany({
          where: {
            portoneSettlementId: { not: null },
            status: { in: ['PROCESSING', 'READY_FOR_PAYOUT'] },
          },
          take: 100, // 한 번에 최대 100개
        })

    let synced = 0
    let failed = 0

    for (const settlement of targetSettlements) {
      try {
        const result = await scheduler.syncPortOneSettlementStatus(settlement.id)
        if (result.success) {
          synced++
        } else {
          failed++
          console.error(`정산 동기화 실패 (${settlement.id}): ${result.error}`)
        }
      } catch (error) {
        failed++
        console.error(`정산 동기화 중 오류 (${settlement.id}):`, error)
      }

      // API 레이트 리밋 방지
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log(`📊 PortOne 정산 상태 동기화 완료: ${synced}개 성공, ${failed}개 실패`)
    return { synced, failed }
  }

  // PortOne 일괄 지급 실행
  static async executeBulkPayout(settlementIds: string[]) {
    const scheduler = settlementScheduler

    if (!isPortOneEnabled()) {
      throw new Error('PortOne 기능이 활성화되지 않음')
    }

    const result = await scheduler.executePortOneBulkPayout(settlementIds)

    if (result.success) {
      console.log(`💰 PortOne 일괄 지급 실행 완료: ${result.bulkPayoutId}`)
    } else {
      console.error(`❌ PortOne 일괄 지급 실패: ${result.error}`)
    }

    return result
  }
}

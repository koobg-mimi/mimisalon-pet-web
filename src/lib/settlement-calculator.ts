import { prisma } from '@mimisalon/shared';

// Types for settlement calculations
export interface SettlementBooking {
  id: string;
  bookingNumber: string;
  totalPrice: number;
  completedAt: Date | null;
  payments: Array<{
    id: string;
    paymentId?: string;
    status: string;
    amount: number;
    paidAt: Date | null;
  }>;
}

export interface GroomerWithProfile {
  id: string;
  name: string | null;
  email: string | null;
  groomerProfile: {
    id: string;
    groomerId: string;
    commissionGradeId: string | null;
    taxRate: number;
    portonePartnerId: string | null;
    portoneContractId: string | null;
    commissionGrade: {
      id: string;
      name: string;
      commissionRate: number;
    } | null;
  } | null;
}

export interface SettlementCalculation {
  totalRevenue: number;
  commissionRate: number;
  platformCommission: number;
  netSettlementAmount: number;
  taxAmount: number;
  bookingCount: number;
}

export interface SettlementValidation {
  isValid: boolean;
  reason?: string;
  details?: string;
}

export interface BatchSettlementOptions {
  skipExisting?: boolean;
  minAmount?: number;
  dryRun?: boolean;
  onProgress?: (progress: { completed: number; total: number; current?: string }) => void;
}

export interface SettlementResult {
  groomerId: string;
  groomerName: string;
  status: 'success' | 'failed' | 'skipped';
  reason?: string;
  error?: string;
  settlementId?: string;
  calculation?: SettlementCalculation;
}

/**
 * Settlement calculator utility class
 */
export class SettlementCalculator {
  /**
   * Validate if a groomer can have settlement processed
   */
  static validateGroomer(groomer: GroomerWithProfile): SettlementValidation {
    if (!groomer.groomerProfile) {
      return {
        isValid: false,
        reason: 'no_profile',
        details: '미용사 프로필이 없습니다',
      };
    }

    if (!groomer.groomerProfile.commissionGrade) {
      return {
        isValid: false,
        reason: 'no_commission_grade',
        details: '수수료 등급이 설정되지 않았습니다',
      };
    }

    if (!groomer.groomerProfile.commissionGrade.commissionRate) {
      return {
        isValid: false,
        reason: 'no_commission_rate',
        details: '수수료율이 설정되지 않았습니다',
      };
    }

    return { isValid: true };
  }

  /**
   * Calculate settlement amounts for a groomer
   */
  static calculateSettlement(
    bookings: SettlementBooking[],
    commissionRate: number,
    taxRate: number = 0
  ): SettlementCalculation {
    if (bookings.length === 0) {
      return {
        totalRevenue: 0,
        commissionRate,
        platformCommission: 0,
        netSettlementAmount: 0,
        taxAmount: 0,
        bookingCount: 0,
      };
    }

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const platformCommission = totalRevenue * (commissionRate / 100);
    const taxAmount = taxRate > 0 ? totalRevenue * (taxRate / 100) : 0;
    const netSettlementAmount = totalRevenue - platformCommission - taxAmount;

    return {
      totalRevenue,
      commissionRate,
      platformCommission,
      netSettlementAmount,
      taxAmount,
      bookingCount: bookings.length,
    };
  }

  /**
   * Fetch all active groomers with their profiles in a single query
   */
  static async fetchActiveGroomers(): Promise<GroomerWithProfile[]> {
    const groomers = await prisma.user.findMany({
      where: {
        role: 'GROOMER',
        groomerProfile: {
          isActive: true,
          isSettlementActive: true,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        groomerProfile: {
          select: {
            id: true,
            groomerId: true,
            commissionGradeId: true,
            taxRate: true,
            portonePartnerId: true,
            portoneContractId: true,
            commissionGrade: {
              select: {
                id: true,
                name: true,
                commissionRate: true,
              },
            },
          },
        },
      },
    });

    return groomers;
  }

  /**
   * Batch fetch all bookings for multiple groomers in a single query
   */
  static async fetchBookingsForGroomers(
    groomerIds: string[],
    periodStart: Date,
    periodEnd: Date
  ): Promise<Map<string, SettlementBooking[]>> {
    const bookings = await prisma.booking.findMany({
      where: {
        groomerId: { in: groomerIds },
        status: 'SERVICE_COMPLETED',
        completedAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      select: {
        id: true,
        bookingNumber: true,
        totalPrice: true,
        completedAt: true,
        groomerId: true,
        payments: {
          where: {
            status: 'PAID',
          },
          select: {
            id: true,
            paymentId: true,
            status: true,
            amount: true,
            paidAt: true,
          },
        },
      },
    });

    // Group bookings by groomer ID
    const bookingsByGroomer = new Map<string, SettlementBooking[]>();

    for (const booking of bookings) {
      const { groomerId, ...bookingData } = booking;
      // Skip bookings without groomerId
      if (!groomerId) {
        console.warn(`Booking ${booking.id} has no groomerId, skipping`);
        continue;
      }
      if (!bookingsByGroomer.has(groomerId)) {
        bookingsByGroomer.set(groomerId, []);
      }
      bookingsByGroomer.get(groomerId)!.push(bookingData);
    }

    return bookingsByGroomer;
  }

  /**
   * Check for existing settlements for multiple groomers in batch
   */
  static async checkExistingSettlements(
    groomerIds: string[],
    periodStart: Date,
    periodEnd: Date
  ): Promise<Set<string>> {
    const existing = await prisma.groomerSettlement.findMany({
      where: {
        groomerId: { in: groomerIds },
        periodStartDate: periodStart,
        periodEndDate: periodEnd,
      },
      select: {
        groomerId: true,
      },
    });

    return new Set(existing.map((s) => s.groomerId));
  }

  /**
   * Create a single settlement record with details
   */
  static async createSettlement(
    groomer: GroomerWithProfile,
    bookings: SettlementBooking[],
    calculation: SettlementCalculation,
    periodStart: Date,
    periodEnd: Date,
    notes?: string
  ): Promise<string> {
    return await prisma.$transaction(async (tx) => {
      // Create settlement record
      const settlement = await tx.groomerSettlement.create({
        data: {
          groomerId: groomer.id,
          groomerProfileId: groomer.groomerProfile!.id,
          settlementDate: new Date(),
          periodStartDate: periodStart,
          periodEndDate: periodEnd,
          totalRevenue: calculation.totalRevenue,
          commissionRate: calculation.commissionRate,
          commissionAmount: calculation.platformCommission,
          taxAmount: calculation.taxAmount,
          netSettlementAmount: calculation.netSettlementAmount,
          status: 'CALCULATED',
          bookingCount: calculation.bookingCount,
          notes: notes || '자동 정산',
          processedAt: new Date(),
        },
      });

      // Create settlement details for each booking
      for (const booking of bookings) {
        const bookingPlatformCommission = booking.totalPrice * (calculation.commissionRate / 100);
        const bookingTaxAmount =
          calculation.taxAmount > 0
            ? booking.totalPrice * (calculation.taxAmount / calculation.totalRevenue)
            : 0;
        const bookingNetAmount = booking.totalPrice - bookingPlatformCommission - bookingTaxAmount;

        await tx.groomerSettlementDetail.create({
          data: {
            settlementId: settlement.id,
            groomerProfileId: groomer.groomerProfile!.id,
            bookingId: booking.id,
            bookingDate: booking.completedAt!,
            serviceAmount: booking.totalPrice,
            commissionRate: calculation.commissionRate,
            commissionAmount: bookingPlatformCommission,
            taxAmount: bookingTaxAmount,
            netAmount: bookingNetAmount,
          },
        });
      }

      return settlement.id;
    });
  }

  /**
   * Process settlements for multiple groomers with optimized batch operations
   */
  static async processSettlements(
    periodStart: Date,
    periodEnd: Date,
    options: BatchSettlementOptions = {}
  ): Promise<{
    results: SettlementResult[];
    summary: {
      total: number;
      successful: number;
      failed: number;
      skipped: number;
      totalAmount: number;
    };
  }> {
    const { skipExisting = true, dryRun = false, onProgress } = options;

    // Step 1: Fetch all active groomers
    const groomers = await this.fetchActiveGroomers();
    const results: SettlementResult[] = [];
    let totalAmount = 0;

    onProgress?.({ completed: 0, total: groomers.length, current: 'Fetching groomer data...' });

    // Step 2: Batch check existing settlements
    const groomerIds = groomers.map((g) => g.id);
    const existingSettlements = skipExisting
      ? await this.checkExistingSettlements(groomerIds, periodStart, periodEnd)
      : new Set<string>();

    // Step 3: Batch fetch all bookings
    const allBookings = await this.fetchBookingsForGroomers(groomerIds, periodStart, periodEnd);

    onProgress?.({ completed: 0, total: groomers.length, current: 'Processing settlements...' });

    // Step 4: Process each groomer
    let completed = 0;
    for (const groomer of groomers) {
      try {
        onProgress?.({
          completed,
          total: groomers.length,
          current: `Processing ${groomer.name || groomer.email}...`,
        });

        // Check if already exists
        if (existingSettlements.has(groomer.id)) {
          results.push({
            groomerId: groomer.id,
            groomerName: groomer.name || '알 수 없음',
            status: 'skipped',
            reason: 'already_exists',
          });
          completed++;
          continue;
        }

        // Validate groomer
        const validation = this.validateGroomer(groomer);
        if (!validation.isValid) {
          results.push({
            groomerId: groomer.id,
            groomerName: groomer.name || '알 수 없음',
            status: 'skipped',
            reason: validation.reason,
            error: validation.details,
          });
          completed++;
          continue;
        }

        // Get bookings for this groomer
        const groomerBookings = allBookings.get(groomer.id) || [];
        if (groomerBookings.length === 0) {
          results.push({
            groomerId: groomer.id,
            groomerName: groomer.name || '알 수 없음',
            status: 'skipped',
            reason: 'no_bookings',
          });
          completed++;
          continue;
        }

        // Calculate settlement
        const calculation = this.calculateSettlement(
          groomerBookings,
          groomer.groomerProfile!.commissionGrade!.commissionRate,
          groomer.groomerProfile!.taxRate
        );

        // Create settlement (unless dry run)
        let settlementId: string | undefined;
        if (!dryRun) {
          settlementId = await this.createSettlement(
            groomer,
            groomerBookings,
            calculation,
            periodStart,
            periodEnd,
            '배치 자동 정산'
          );
        }

        results.push({
          groomerId: groomer.id,
          groomerName: groomer.name || '알 수 없음',
          status: 'success',
          settlementId,
          calculation,
        });

        totalAmount += calculation.netSettlementAmount;
      } catch (error) {
        results.push({
          groomerId: groomer.id,
          groomerName: groomer.name || '알 수 없음',
          status: 'failed',
          error: error instanceof Error ? error.message : '알 수 없는 오류',
        });
      }

      completed++;
    }

    onProgress?.({ completed, total: groomers.length, current: 'Complete!' });

    // Calculate summary
    const summary = {
      total: results.length,
      successful: results.filter((r) => r.status === 'success').length,
      failed: results.filter((r) => r.status === 'failed').length,
      skipped: results.filter((r) => r.status === 'skipped').length,
      totalAmount,
    };

    return { results, summary };
  }
}

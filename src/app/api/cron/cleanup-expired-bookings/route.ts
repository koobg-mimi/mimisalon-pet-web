import { NextRequest, NextResponse } from 'next/server'
import { cleanupExpiredBookings } from '@/lib/cron/cleanup-expired-bookings'
import { env } from '@/lib/env'

// ============================================================================
// Types
// ============================================================================

export interface CleanupExpiredBookingsResponse {
  success: boolean
  message: string
  expiredBookings: number
  orphanedPayments: number
}

export interface CleanupErrorResponse {
  success: false
  error: string
}

// ============================================================================
// Route Handler
// ============================================================================

/**
 * GET /api/cron/cleanup-expired-bookings
 *
 * Cron job endpoint to cleanup expired bookings and orphaned payments.
 * Requires CRON_SECRET authorization.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<CleanupExpiredBookingsResponse | CleanupErrorResponse>> {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json<CleanupErrorResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await cleanupExpiredBookings()

    return NextResponse.json<CleanupExpiredBookingsResponse>({
      success: true,
      message: 'Cleanup completed',
      ...result,
    })
  } catch (error) {
    console.error('[Cron API] Error:', error)
    return NextResponse.json<CleanupErrorResponse>(
      {
        success: false,
        error: 'Failed to cleanup expired bookings',
      },
      { status: 500 }
    )
  }
}

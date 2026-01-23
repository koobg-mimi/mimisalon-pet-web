import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, TaskTypes, TaskQueue } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@mimisalon/shared'
import { env } from '@/lib/env'
import { BookingNotificationService, BookingNotificationData } from '@/lib/booking-notifications'
import { NotificationService } from '@/lib/notification-service'

// ============================================================================
// Types
// ============================================================================

export interface TaskQueueTriggerResponse {
  success: boolean
  type?: TaskTypes
  processed?: number
  limit?: number
  maxRetries?: number
  error?: string
  details?: unknown
}

/**
 * Zod schema for task queue trigger request validation
 *
 * Validates incoming webhook/cron requests to trigger task queue processing
 */
export const taskQueueTriggerSchema = z
  .object({
    type: z.nativeEnum(TaskTypes).describe('Task type to process'),

    // Optional filters for targeted task processing
    limit: z
      .number()
      .int()
      .positive()
      .max(100)
      .optional()
      .describe('Maximum number of tasks to process (default: 10)'),

    maxRetries: z
      .number()
      .int()
      .nonnegative()
      .max(10)
      .optional()
      .describe('Maximum retry attempts before marking as failed'),
  })
  .strict() // Reject unknown fields
  .describe('Task queue trigger configuration')

export type TaskQueueTriggerRequest = z.infer<typeof taskQueueTriggerSchema>

// ============================================================================
// Route Handler
// ============================================================================

/**
 * POST /api/hooks
 *
 * Webhook endpoint for triggering task queue processing.
 * Used by cron jobs or external systems to process pending tasks.
 */
export async function POST(request: NextRequest): Promise<NextResponse<TaskQueueTriggerResponse>> {
  try {
    const body = await request.json()
    const headers = request.headers

    // Authenticate webhook request with CRON_SECRET token
    const authHeader = headers.get('authorization') || headers.get('x-webhook-token')
    const receivedToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : authHeader
    const expectedToken = env.CRON_SECRET

    // Check if CRON_SECRET is configured
    if (!expectedToken) {
      console.error('[Webhook Auth] CRON_SECRET environment variable not configured')
      return NextResponse.json<TaskQueueTriggerResponse>(
        {
          success: false,
          error: 'Server configuration error',
          details: 'Webhook authentication not properly configured',
        },
        { status: 500 }
      )
    }

    // Validate token from request headers
    if (!receivedToken || receivedToken !== expectedToken) {
      console.warn('[Webhook Auth] Unauthorized webhook request attempt')
      return NextResponse.json<TaskQueueTriggerResponse>(
        {
          success: false,
          error: 'Unauthorized',
          details: 'Invalid or missing authentication token',
        },
        { status: 401 }
      )
    }

    // Validate request body
    const validationResult = taskQueueTriggerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json<TaskQueueTriggerResponse>(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.message,
        },
        { status: 400 }
      )
    }

    const { type, limit = 10, maxRetries = 3 } = validationResult.data

    // Process tasks based on type
    let processed = 0

    switch (type) {
      case TaskTypes.PAYMENT_CLEANUP:
        processed = await processPaymentCleanup(limit, maxRetries)
        break

      case TaskTypes.BOOKING_REMINDER:
        processed = await processBookingReminder(limit, maxRetries)
        break

      case TaskTypes.TODAY_NOTIFICATION:
        processed = await processTodayNotification(limit, maxRetries)
        break

      case TaskTypes.IMMEDIATE_NOTIFICATION:
        processed = await processImmediateNotification(limit, maxRetries)
        break

      case TaskTypes.NONE:
        // No-op for testing
        processed = 0
        break

      default:
        return NextResponse.json<TaskQueueTriggerResponse>(
          {
            success: false,
            error: 'Unsupported task type',
            details: { type },
          },
          { status: 400 }
        )
    }

    return NextResponse.json<TaskQueueTriggerResponse>({
      success: true,
      type,
      processed,
      limit,
      maxRetries,
    })
  } catch (error) {
    return NextResponse.json<TaskQueueTriggerResponse>(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Release groomer availability time slots by bookingId
 *
 * Safely releases time slots with comprehensive error handling.
 * Errors are logged but don't interrupt the cleanup process.
 *
 * @param tx - Prisma transaction client
 * @param bookingId - Booking ID to release slots for
 * @param context - Context description for logging (e.g., "booking: abc123")
 * @returns Number of released time slots (0 if error occurred)
 * @throws Never throws - errors are logged and 0 is returned
 */
async function releaseGroomerAvailabilities(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>,
  bookingId: string,
  context: string
): Promise<number> {
  try {
    // Input validation
    if (!bookingId || typeof bookingId !== 'string') {
      console.warn(
        `[Payment Cleanup] Invalid bookingId provided for availability release: ${bookingId} (${context})`
      )
      return 0
    }

    // Find availability slots to release
    let availabilities
    try {
      availabilities = await tx.groomerAvailability.findMany({
        where: { bookingId },
      })
    } catch (dbError) {
      console.error(
        `[Payment Cleanup] Database error finding availabilities for ${context}:`,
        dbError instanceof Error ? dbError.message : dbError
      )
      // Don't throw - allow cleanup to continue
      return 0
    }

    // No slots to release
    if (!availabilities || availabilities.length === 0) {
      console.log(`[Payment Cleanup] No time slots found for ${context}`)
      return 0
    }

    // Release the slots
    try {
      const updateResult = await tx.groomerAvailability.updateMany({
        where: { bookingId },
        data: {
          isBooked: false,
          bookingId: null,
          isAvailable: true,
        },
      })

      // Verify update count matches found count
      if (updateResult.count !== availabilities.length) {
        console.warn(
          `[Payment Cleanup] Partial release for ${context}: expected ${availabilities.length} slots, updated ${updateResult.count}`
        )
      }

      console.log(
        `[Payment Cleanup] Successfully released ${updateResult.count} time slots for ${context}`
      )
      return updateResult.count
    } catch (updateError) {
      console.error(
        `[Payment Cleanup] Database error releasing ${availabilities.length} slots for ${context}:`,
        updateError instanceof Error ? updateError.message : updateError
      )
      // Don't throw - slot release failure shouldn't block payment/booking cleanup
      return 0
    }
  } catch (unexpectedError) {
    // Catch-all for any unexpected errors (shouldn't reach here, but defensive)
    console.error(
      `[Payment Cleanup] Unexpected error in releaseGroomerAvailabilities for ${context}:`,
      unexpectedError instanceof Error ? unexpectedError.message : unexpectedError
    )
    return 0
  }
}

/**
 * Process payment cleanup tasks from the database queue
 *
 * @param limit - Maximum number of tasks to process
 * @param maxRetries - Maximum retry attempts before marking as failed
 * @returns Number of successfully processed tasks
 */
async function processPaymentCleanup(limit: number, maxRetries: number): Promise<number> {
  // Query due tasks that are ready to be processed
  const tasks: TaskQueue[] = await prisma.taskQueue.findMany({
    where: {
      type: 'PAYMENT_CLEANUP',
      status: 'PENDING',
      scheduledAt: { lte: new Date() },
      retry: { lt: maxRetries },
    },
    orderBy: { scheduledAt: 'asc' },
    take: limit,
  })

  let processedCount = 0

  // Process each task
  for (const task of tasks) {
    try {
      // Update status to RUNNING with optimistic locking
      const updated = await prisma.taskQueue.updateMany({
        where: {
          id: task.id,
          version: task.version, // Only update if version matches
        },
        data: {
          status: 'RUNNING',
          version: { increment: 1 },
        },
      })

      // Skip if another worker already processed this task
      if (updated.count === 0) {
        continue
      }

      // Parse payload to extract payment and booking IDs
      const payload = JSON.parse(task.payload as string)
      const { paymentId, bookingId } = payload

      // 1. Payment 조회 (include booking과 groomerAvailabilities)
      const payment = await prisma.payment.findUnique({
        where: { paymentId },
        include: {
          booking: {
            include: {
              groomerAvailabilities: true,
            },
          },
        },
      })

      // 2. Payment 존재 확인
      if (!payment) {
        console.log(`[Payment Cleanup] Payment not found: ${paymentId}`)
        continue // Skip to next task
      }

      // 3. 이미 PAID 상태인 경우 스킵
      if (payment.status === 'PAID') {
        console.log(`[Payment Cleanup] Payment already paid: ${paymentId}`)
        continue
      }

      // 4. 5분 경과 확인 (여유있게 6분)
      const sixMinutesAgo = new Date(Date.now() - 6 * 60 * 1000)
      if (payment.createdAt > sixMinutesAgo) {
        console.log(`[Payment Cleanup] Payment too recent, skipping: ${paymentId}`)
        continue
      }

      // 5. 트랜잭션으로 정리 작업 실행
      await prisma.$transaction(async (tx) => {
        // Booking이 있고 삭제 대상 상태인 경우
        if (payment.booking) {
          const booking = payment.booking

          // FIRST_PAYMENT_PENDING 또는 BOOKING_FAILED 상태만 삭제
          if (booking.status === 'FIRST_PAYMENT_PENDING' || booking.status === 'BOOKING_FAILED') {
            // GroomerAvailability 먼저 해제 (Booking 삭제 전에!)
            await releaseGroomerAvailabilities(tx, booking.id, `booking: ${booking.id}`)

            // Booking 삭제 (Cascade로 BookingPet, BookingService, BookingPetOption 자동 삭제)
            await tx.booking.delete({
              where: { id: booking.id },
            })

            console.log(`[Payment Cleanup] Deleted booking: ${booking.id}`)
          }
        }

        // bookingId로만 연결된 orphaned GroomerAvailability 해제
        if (bookingId && !payment.bookingId) {
          await releaseGroomerAvailabilities(tx, bookingId, `orphaned bookingId: ${bookingId}`)
        }

        // Payment 삭제
        await tx.payment.delete({
          where: { paymentId },
        })

        console.log(`[Payment Cleanup] Deleted payment: ${paymentId}`)
      })

      console.log(`[Payment Cleanup] Successfully cleaned up payment: ${paymentId}`)

      // Mark task as completed
      await prisma.taskQueue.update({
        where: { id: task.id },
        data: { status: 'COMPLETED' },
      })

      processedCount++
    } catch (error) {
      // Handle failure: increment retry and reschedule with exponential backoff
      const newRetryCount = task.retry + 1
      const shouldFail = newRetryCount >= maxRetries

      await prisma.taskQueue.update({
        where: { id: task.id },
        data: {
          retry: { increment: 1 },
          status: shouldFail ? 'FAILED' : 'PENDING',
          // Exponential backoff: 1min, 2min, 4min, 8min, etc.
          scheduledAt: shouldFail
            ? undefined
            : new Date(Date.now() + Math.pow(2, task.retry) * 60 * 1000),
        },
      })

      console.error(`Failed to process payment cleanup task ${task.id}:`, error)
    }
  }

  return processedCount
}

/**
 * Process booking reminder notification tasks from the database queue
 *
 * Sends reminder notifications 2 hours before service time
 *
 * @param limit - Maximum number of tasks to process
 * @param maxRetries - Maximum retry attempts before marking as failed
 * @returns Number of successfully processed tasks
 */
async function processBookingReminder(limit: number, maxRetries: number): Promise<number> {
  // Query due tasks that are ready to be processed
  const tasks = await prisma.taskQueue.findMany({
    where: {
      type: 'BOOKING_REMINDER',
      status: 'PENDING',
      scheduledAt: { lte: new Date() },
      retry: { lt: maxRetries },
    },
    orderBy: { scheduledAt: 'asc' },
    take: limit,
  })

  let processedCount = 0

  // Process each task
  for (const task of tasks) {
    try {
      // Update status to RUNNING with optimistic locking
      const updated = await prisma.taskQueue.updateMany({
        where: {
          id: task.id,
          version: task.version, // Only update if version matches
        },
        data: {
          status: 'RUNNING',
          version: { increment: 1 },
        },
      })

      // Skip if another worker already processed this task
      if (updated.count === 0) {
        continue
      }

      // Parse payload to extract booking information
      const payload = JSON.parse(task.payload as string)
      const { bookingId, serviceDateTime } = payload

      // Fetch booking with all required data
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          customer: true,
          groomer: true,
          bookingPets: {
            include: {
              pet: true,
              services: {
                include: {
                  service: true,
                },
              },
            },
          },
        },
      })

      // Skip if booking not found or cancelled
      if (!booking) {
        console.log(`[Booking Reminder] Booking not found: ${bookingId}`)
        await prisma.taskQueue.update({
          where: { id: task.id },
          data: { status: 'COMPLETED' }, // Mark as completed anyway
        })
        continue
      }

      if (booking.status === 'SERVICE_CANCELLED') {
        console.log(`[Booking Reminder] Booking cancelled: ${bookingId}`)
        await prisma.taskQueue.update({
          where: { id: task.id },
          data: { status: 'COMPLETED' },
        })
        continue
      }

      // Build notification data
      const petNames = booking.bookingPets.map((bp) => bp.pet.name)
      const totalPrice = booking.bookingPets.reduce(
        (total, bp) => total + bp.services.reduce((sum, s) => sum + s.servicePrice, 0),
        0
      )

      const bookingData: BookingNotificationData = {
        bookingId: booking.id,
        bookingNumber: booking.id, // Can add a separate booking number field if needed
        customerName: booking.customer.name || '고객',
        groomerName: booking.groomer?.name ?? undefined,
        serviceDate: new Date(serviceDateTime),
        serviceTime: new Date(serviceDateTime).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        petNames,
        totalPrice,
      }

      // Send reminder notification
      const sent = await BookingNotificationService.sendServiceReminder(
        booking.customerId,
        bookingData,
        2
      )

      if (!sent) {
        throw new Error('Failed to send booking reminder notification')
      }

      console.log(`[Booking Reminder] Sent reminder for booking: ${bookingId}`)

      // Mark task as completed
      await prisma.taskQueue.update({
        where: { id: task.id },
        data: { status: 'COMPLETED' },
      })

      processedCount++
    } catch (error) {
      // Handle failure: increment retry and reschedule with exponential backoff
      const newRetryCount = task.retry + 1
      const shouldFail = newRetryCount >= maxRetries

      await prisma.taskQueue.update({
        where: { id: task.id },
        data: {
          retry: { increment: 1 },
          status: shouldFail ? 'FAILED' : 'PENDING',
          // Exponential backoff: 1min, 2min, 4min, 8min, etc.
          scheduledAt: shouldFail
            ? undefined
            : new Date(Date.now() + Math.pow(2, task.retry) * 60 * 1000),
        },
      })

      console.error(`Failed to process booking reminder task ${task.id}:`, error)
    }
  }

  return processedCount
}

/**
 * Process today notification tasks from the database queue
 *
 * Sends "today is your service day" notifications at 8 AM
 *
 * @param limit - Maximum number of tasks to process
 * @param maxRetries - Maximum retry attempts before marking as failed
 * @returns Number of successfully processed tasks
 */
async function processTodayNotification(limit: number, maxRetries: number): Promise<number> {
  // Query due tasks that are ready to be processed
  const tasks = await prisma.taskQueue.findMany({
    where: {
      type: 'TODAY_NOTIFICATION',
      status: 'PENDING',
      scheduledAt: { lte: new Date() },
      retry: { lt: maxRetries },
    },
    orderBy: { scheduledAt: 'asc' },
    take: limit,
  })

  let processedCount = 0

  // Process each task
  for (const task of tasks) {
    try {
      // Update status to RUNNING with optimistic locking
      const updated = await prisma.taskQueue.updateMany({
        where: {
          id: task.id,
          version: task.version,
        },
        data: {
          status: 'RUNNING',
          version: { increment: 1 },
        },
      })

      // Skip if another worker already processed this task
      if (updated.count === 0) {
        continue
      }

      // Parse payload to extract booking information
      const payload = JSON.parse(task.payload as string)
      const { bookingId, serviceDate } = payload

      // Fetch booking with all required data
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          customer: true,
          groomer: true,
          bookingPets: {
            include: {
              pet: true,
              services: {
                include: {
                  service: true,
                },
              },
            },
          },
        },
      })

      // Skip if booking not found or cancelled
      if (!booking) {
        console.log(`[Today Notification] Booking not found: ${bookingId}`)
        await prisma.taskQueue.update({
          where: { id: task.id },
          data: { status: 'COMPLETED' },
        })
        continue
      }

      if (booking.status === 'SERVICE_CANCELLED') {
        console.log(`[Today Notification] Booking cancelled: ${bookingId}`)
        await prisma.taskQueue.update({
          where: { id: task.id },
          data: { status: 'COMPLETED' },
        })
        continue
      }

      // Build notification data
      const petNames = booking.bookingPets.map((bp) => bp.pet.name)
      const totalPrice = booking.bookingPets.reduce(
        (total, bp) => total + bp.services.reduce((sum, s) => sum + s.servicePrice, 0),
        0
      )

      const bookingData: BookingNotificationData = {
        bookingId: booking.id,
        bookingNumber: booking.id,
        customerName: booking.customer.name || '고객',
        groomerName: booking.groomer?.name ?? undefined,
        serviceDate: new Date(serviceDate),
        serviceTime: new Date(serviceDate).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        petNames,
        totalPrice,
      }

      // Send today notification
      const sent = await BookingNotificationService.sendTodayReminder(
        booking.customerId,
        bookingData
      )

      if (!sent) {
        throw new Error('Failed to send today notification')
      }

      console.log(`[Today Notification] Sent notification for booking: ${bookingId}`)

      // Mark task as completed
      await prisma.taskQueue.update({
        where: { id: task.id },
        data: { status: 'COMPLETED' },
      })

      processedCount++
    } catch (error) {
      // Handle failure: increment retry and reschedule with exponential backoff
      const newRetryCount = task.retry + 1
      const shouldFail = newRetryCount >= maxRetries

      await prisma.taskQueue.update({
        where: { id: task.id },
        data: {
          retry: { increment: 1 },
          status: shouldFail ? 'FAILED' : 'PENDING',
          scheduledAt: shouldFail
            ? undefined
            : new Date(Date.now() + Math.pow(2, task.retry) * 60 * 1000),
        },
      })

      console.error(`Failed to process today notification task ${task.id}:`, error)
    }
  }

  return processedCount
}

/**
 * Process immediate notification tasks from the database queue
 *
 * Sends generic immediate notifications based on payload
 *
 * @param limit - Maximum number of tasks to process
 * @param maxRetries - Maximum retry attempts before marking as failed
 * @returns Number of successfully processed tasks
 */
async function processImmediateNotification(limit: number, maxRetries: number): Promise<number> {
  // Query due tasks that are ready to be processed
  const tasks = await prisma.taskQueue.findMany({
    where: {
      type: 'IMMEDIATE_NOTIFICATION',
      status: 'PENDING',
      scheduledAt: { lte: new Date() },
      retry: { lt: maxRetries },
    },
    orderBy: { scheduledAt: 'asc' },
    take: limit,
  })

  let processedCount = 0

  // Process each task
  for (const task of tasks) {
    try {
      // Update status to RUNNING with optimistic locking
      const updated = await prisma.taskQueue.updateMany({
        where: {
          id: task.id,
          version: task.version,
        },
        data: {
          status: 'RUNNING',
          version: { increment: 1 },
        },
      })

      // Skip if another worker already processed this task
      if (updated.count === 0) {
        continue
      }

      // Parse payload to extract notification information
      const payload = JSON.parse(task.payload as string)
      const { userId, targetAudience, title, body, data } = payload

      // Fetch user token based on targetAudience
      let sent = false

      if (targetAudience === 'CUSTOMER' || targetAudience === 'BOTH') {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true },
        })

        if (user) {
          const notification = {
            title,
            body,
            data: data || {},
          }
          sent = await NotificationService.sendToDevice(userId, notification)
        }
      }

      if (targetAudience === 'GROOMER' || targetAudience === 'BOTH') {
        // Send to groomer (if userId is groomerId)
        const groomer = await prisma.user.findUnique({
          where: { id: userId, role: 'GROOMER' },
          select: { id: true },
        })

        if (groomer) {
          const notification = {
            title,
            body,
            data: data || {},
          }
          sent = await NotificationService.sendToDevice(userId, notification)
        }
      }

      if (!sent) {
        throw new Error('Failed to send immediate notification')
      }

      console.log(`[Immediate Notification] Sent notification to user: ${userId}`)

      // Mark task as completed
      await prisma.taskQueue.update({
        where: { id: task.id },
        data: { status: 'COMPLETED' },
      })

      processedCount++
    } catch (error) {
      // Handle failure: increment retry and reschedule with exponential backoff
      const newRetryCount = task.retry + 1
      const shouldFail = newRetryCount >= maxRetries

      await prisma.taskQueue.update({
        where: { id: task.id },
        data: {
          retry: { increment: 1 },
          status: shouldFail ? 'FAILED' : 'PENDING',
          scheduledAt: shouldFail
            ? undefined
            : new Date(Date.now() + Math.pow(2, task.retry) * 60 * 1000),
        },
      })

      console.error(`Failed to process immediate notification task ${task.id}:`, error)
    }
  }

  return processedCount
}

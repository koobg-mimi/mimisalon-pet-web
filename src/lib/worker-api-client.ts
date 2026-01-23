/**
 * Worker API Client
 *
 * Type-safe REST client for communicating with @mimisalon/worker service.
 * Handles authentication, retries, and error handling.
 *
 * @module lib/worker-api-client
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import {
  BookingReminderNotificationRequest,
  CancelNotificationsResponse,
  CancelPaymentCleanupResponse,
  ExecutePaymentCleanupRequest,
  ImmediateNotificationRequest,
  NotificationJobResponse,
  NotificationQueueStatusResponse,
  PaymentCleanupJobResponse,
  prisma,
  SchedulePaymentCleanupRequest,
  TodayNotificationRequest,
  WorkerApiError,
  WorkerApiResponse,
} from '@mimisalon/shared'
import { Prisma } from '@prisma/client'

/**
 * Worker API Key
 * This key is used for internal communication between Next.js and Worker services.
 * It must match the key defined in packages/worker/src/config/server-config.ts
 * TODO: Set via WORKER_API_KEY environment variable
 */
const WORKER_API_KEY = process.env.WORKER_API_KEY || ''

// Import client logger for browser environments
let clientLogger: any = null
if (typeof window !== 'undefined') {
  import('./client-logger').then((module) => {
    clientLogger = module
  })
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Worker API client configuration
 */
interface WorkerApiClientConfig {
  baseURL: string
  apiKey: string
  timeout?: number
  maxRetries?: number
  retryDelay?: number
}

/**
 * Get configuration from environment variables
 */
function getConfigFromEnv(): WorkerApiClientConfig {
  const baseURL = process.env.WORKER_API_URL || 'http://localhost:3001'
  const timeout = parseInt(process.env.WORKER_API_TIMEOUT || '10000', 10)

  return {
    baseURL,
    apiKey: WORKER_API_KEY, // Use hardcoded key
    timeout,
    maxRetries: 3,
    retryDelay: 1000,
  }
}

// ============================================================================
// Client Class
// ============================================================================

/**
 * Worker API REST Client
 */
export class WorkerApiClient {
  private client: AxiosInstance
  private config: WorkerApiClientConfig

  constructor(config?: Partial<WorkerApiClientConfig>) {
    this.config = {
      ...getConfigFromEnv(),
      ...config,
    }

    // Create axios instance
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
      },
    })

    // Add request interceptor to track start time
    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        ;(config as any)._startTime = performance.now()
      }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<WorkerApiResponse>) => {
        // Handle errors with retry logic
        return this.handleError(error)
      }
    )
  }

  /**
   * Handle API errors with retry logic
   */
  private async handleError(error: AxiosError<WorkerApiResponse>): Promise<never> {
    const config = error.config as AxiosRequestConfig & {
      _retryCount?: number
      _startTime?: number
    }

    // Log error to client logger (browser only)
    if (typeof window !== 'undefined' && clientLogger) {
      const duration = config._startTime ? performance.now() - config._startTime : undefined

      clientLogger.logNetworkError({
        url: config.url || 'unknown',
        method: (config.method || 'GET').toUpperCase(),
        statusCode: error.response?.status || 0,
        message: error.message || 'Worker API request failed',
        timestamp: new Date().toISOString(),
        requestHeaders: config.headers as Record<string, string>,
        responseHeaders: error.response?.headers as Record<string, string>,
        requestBody: config.data,
        responseBody: error.response?.data,
        duration,
      })
    }

    // Don't retry on authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw this.createWorkerApiError(error)
    }

    // Implement retry logic for 5xx errors and network errors
    const shouldRetry =
      (!error.response || error.response.status >= 500) &&
      (config._retryCount || 0) < (this.config.maxRetries || 3)

    if (shouldRetry && config) {
      config._retryCount = (config._retryCount || 0) + 1
      const delay = this.config.retryDelay! * config._retryCount

      console.log(
        `⏳ Retrying worker API request (attempt ${config._retryCount}/${this.config.maxRetries}) after ${delay}ms...`
      )

      await new Promise((resolve) => setTimeout(resolve, delay))
      return this.client.request(config)
    }

    throw this.createWorkerApiError(error)
  }

  /**
   * Create typed error from axios error
   */
  private createWorkerApiError(error: AxiosError<WorkerApiResponse>): WorkerApiError {
    const apiError = error.response?.data?.error

    const workerError = new Error(
      apiError?.message || error.message || 'Worker API request failed'
    ) as WorkerApiError

    workerError.name = 'WorkerApiError'
    workerError.code = apiError?.code || 'UNKNOWN_ERROR'
    workerError.statusCode = error.response?.status || 500
    workerError.details = apiError?.details

    return workerError
  }

  // ==========================================================================
  // Notification API Methods
  // ==========================================================================

  /**
   * Schedule booking reminder notification
   *
   * Migrated to use TaskQueue directly (no HTTP call to worker service).
   * Schedules notification for 2 hours before service time.
   */
  async scheduleBookingReminder(
    data: BookingReminderNotificationRequest
  ): Promise<NotificationJobResponse> {
    try {
      // Parse service date/time and calculate reminder time (2 hours before)
      const serviceDateTime = new Date(data.serviceDateTime)
      const reminderTime = new Date(serviceDateTime.getTime() - 2 * 60 * 60 * 1000) // 2 hours before

      // Try to create task (atomic operation with deduplication)
      const task = await prisma.taskQueue.create({
        data: {
          type: 'BOOKING_REMINDER',
          jobId: data.bookingId, // Use bookingId for deduplication
          payload: JSON.stringify(data),
          scheduledAt: reminderTime,
          status: 'PENDING',
        },
      })

      // Return response matching worker API format
      return {
        bookingId: data.bookingId,
        type: 'booking_reminder',
        status: 'scheduled',
        serviceDateTime: data.serviceDateTime,
        reminderTime: task.scheduledAt!.toISOString(),
      }
    } catch (error) {
      // Handle unique constraint violation (task already exists for this booking)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Find existing task
          const existing = await prisma.taskQueue.findFirst({
            where: {
              type: 'BOOKING_REMINDER',
              jobId: data.bookingId,
              status: { in: ['PENDING', 'RUNNING'] },
            },
          })

          if (!existing) {
            throw new Error(
              `Race condition detected but no existing reminder found for booking: ${data.bookingId}`
            )
          }

          // Return existing task
          return {
            bookingId: data.bookingId,
            type: 'booking_reminder',
            status: 'scheduled',
            serviceDateTime: data.serviceDateTime,
            reminderTime: existing.scheduledAt!.toISOString(),
          }
        }
      }

      // Re-throw other errors
      throw error
    }
  }

  /**
   * Schedule today notification
   *
   * Migrated to use TaskQueue directly (no HTTP call to worker service).
   * Schedules notification for 8:00 AM on the service date.
   */
  async scheduleTodayNotification(
    data: TodayNotificationRequest
  ): Promise<NotificationJobResponse> {
    try {
      // Parse service date and set time to 8:00 AM
      const serviceDate = new Date(data.serviceDate)
      const notificationTime = new Date(serviceDate)
      notificationTime.setHours(8, 0, 0, 0) // 8:00 AM on service day

      // Try to create task (atomic operation with deduplication)
      const task = await prisma.taskQueue.create({
        data: {
          type: 'TODAY_NOTIFICATION',
          jobId: `${data.bookingId}-today`, // Unique ID for today notification
          payload: JSON.stringify(data),
          scheduledAt: notificationTime,
          status: 'PENDING',
        },
      })

      // Return response matching worker API format
      return {
        bookingId: data.bookingId,
        type: 'today_booking',
        status: 'scheduled',
        notificationTime: task.scheduledAt!.toISOString(),
      }
    } catch (error) {
      // Handle unique constraint violation (task already exists)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Find existing task
          const existing = await prisma.taskQueue.findFirst({
            where: {
              type: 'TODAY_NOTIFICATION',
              jobId: `${data.bookingId}-today`,
              status: { in: ['PENDING', 'RUNNING'] },
            },
          })

          if (!existing) {
            throw new Error(
              `Race condition detected but no existing today notification found for booking: ${data.bookingId}`
            )
          }

          // Return existing task
          return {
            bookingId: data.bookingId,
            type: 'today_booking',
            status: 'scheduled',
            notificationTime: existing.scheduledAt!.toISOString(),
          }
        }
      }

      // Re-throw other errors
      throw error
    }
  }

  /**
   * Send immediate notification
   *
   * Migrated to use TaskQueue directly (no HTTP call to worker service).
   * Creates high-priority notification to be sent immediately.
   */
  async sendImmediateNotification(
    data: ImmediateNotificationRequest
  ): Promise<NotificationJobResponse> {
    try {
      // Create task to be executed immediately
      // Use timestamp in jobId to ensure uniqueness for immediate notifications
      const jobId = data.bookingId
        ? `${data.bookingId}-immediate-${Date.now()}`
        : `immediate-${Date.now()}`

      const task = await prisma.taskQueue.create({
        data: {
          type: 'IMMEDIATE_NOTIFICATION',
          jobId: jobId,
          payload: JSON.stringify(data),
          scheduledAt: new Date(), // Execute immediately
          status: 'PENDING',
        },
      })

      // Return response matching worker API format
      return {
        bookingId: data.bookingId,
        type: data.type,
        status: 'queued',
        targetAudience: data.targetAudience,
        title: data.title,
        priority: 'high',
      }
    } catch (error) {
      console.error('Failed to create immediate notification task:', error)
      throw error
    }
  }

  /**
   * Cancel booking notifications
   *
   * Migrated to use TaskQueue directly (no HTTP call to worker service).
   * Cancels all PENDING/RUNNING notification tasks for the specified booking.
   */
  async cancelBookingNotifications(bookingId: string): Promise<CancelNotificationsResponse> {
    await prisma.$transaction(async (tx) => {
      // Cancel all notification tasks for this booking
      // This includes BOOKING_REMINDER and TODAY_NOTIFICATION tasks
      await tx.taskQueue.updateMany({
        where: {
          type: {
            in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'],
          },
          OR: [
            { jobId: bookingId }, // BOOKING_REMINDER uses bookingId directly
            { jobId: `${bookingId}-today` }, // TODAY_NOTIFICATION uses this format
            { jobId: { startsWith: `${bookingId}-immediate-` } }, // IMMEDIATE notifications
          ],
          status: { in: ['PENDING', 'RUNNING'] },
        },
        data: {
          status: 'CANCELLED',
        },
      })
    })

    // Return response matching worker API format
    return {
      bookingId,
      status: 'cancelled',
      message: 'All scheduled notifications for this booking have been cancelled',
    }
  }

  /**
   * Get notification queue status
   *
   * Migrated to use TaskQueue directly (no HTTP call to worker service).
   * Queries TaskQueue for notification task statistics.
   */
  async getNotificationQueueStatus(): Promise<NotificationQueueStatusResponse> {
    // Get counts for each notification task status
    const [pending, running, completed, failed, cancelled] = await Promise.all([
      prisma.taskQueue.count({
        where: {
          type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
          status: 'PENDING',
        },
      }),
      prisma.taskQueue.count({
        where: {
          type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
          status: 'RUNNING',
        },
      }),
      prisma.taskQueue.count({
        where: {
          type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
          status: 'COMPLETED',
        },
      }),
      prisma.taskQueue.count({
        where: {
          type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
          status: 'FAILED',
        },
      }),
      prisma.taskQueue.count({
        where: {
          type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
          status: 'CANCELLED',
        },
      }),
    ])

    // Calculate delayed tasks (scheduled for future execution)
    const delayed = await prisma.taskQueue.count({
      where: {
        type: { in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'] },
        status: 'PENDING',
        scheduledAt: { gt: new Date() },
      },
    })

    // Return response matching worker API format
    return {
      queue: 'notification',
      counts: {
        waiting: pending,
        active: running,
        completed: completed,
        failed: failed,
        delayed: delayed,
        total: pending + running + completed + failed + cancelled,
      },
    }
  }

  // ==========================================================================
  // Payment API Methods
  // ==========================================================================

  /**
   * Schedule payment cleanup
   *
   * Uses try-insert-catch-conflict pattern for race-condition-safe idempotency:
   * 1. Try to create task (will fail if duplicate due to unique constraint)
   * 2. If unique violation (P2002), find and return existing task
   * 3. Otherwise, return created task
   *
   * Database constraint ensures only one PENDING/RUNNING task per (type, jobId)
   */
  async schedulePaymentCleanup(
    data: SchedulePaymentCleanupRequest
  ): Promise<PaymentCleanupJobResponse> {
    try {
      // Try to create task (atomic operation)
      const task = await prisma.taskQueue.create({
        data: {
          type: 'PAYMENT_CLEANUP',
          jobId: data.paymentId, // Store paymentId as jobId for fast lookup
          payload: JSON.stringify(data),
          scheduledAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
          status: 'PENDING',
        },
      })

      // Return response for newly created task
      return {
        bookingId: data.bookingId,
        cleanupTime: task.scheduledAt!.toISOString(),
        delayMs: 5 * 60 * 1000,
        jobId: task.id,
        paymentId: data.paymentId,
        status: 'scheduled',
      }
    } catch (error) {
      // Handle unique constraint violation (race condition)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Task already exists, find and return it
          const existing = await prisma.taskQueue.findFirst({
            where: {
              type: 'PAYMENT_CLEANUP',
              jobId: data.paymentId,
              status: { in: ['PENDING', 'RUNNING'] },
            },
          })

          // This should always exist due to unique constraint, but handle edge case
          if (!existing) {
            throw new Error(
              `Race condition detected but no existing task found for payment: ${data.paymentId}`
            )
          }

          // Return response for existing task
          return {
            bookingId: data.bookingId,
            cleanupTime: existing.scheduledAt!.toISOString(),
            delayMs: 5 * 60 * 1000,
            jobId: existing.id,
            paymentId: data.paymentId,
            status: 'scheduled',
          }
        }
      }

      // Re-throw other errors
      throw error
    }
  }

  /**
   * Cancel payment cleanup
   */
  async cancelPaymentCleanup(paymentId: string): Promise<CancelPaymentCleanupResponse> {
    // Cancel task in database queue
    await prisma.$transaction(async (tx) => {
      // Find and cancel all pending/running cleanup tasks for this payment
      await tx.taskQueue.updateMany({
        where: {
          type: 'PAYMENT_CLEANUP',
          jobId: paymentId, // Use jobId for accurate matching
          status: { in: ['PENDING', 'RUNNING'] },
        },
        data: {
          status: 'CANCELLED',
        },
      })
    })

    // Return response matching worker API format
    return {
      paymentId,
      status: 'cancelled',
      message: 'Payment cleanup job has been cancelled',
    }
  }

  /**
   * Execute immediate payment cleanup
   *
   * Migrated to use TaskQueue directly (no HTTP call to worker service).
   * Creates a payment cleanup task to be executed immediately.
   */
  async executePaymentCleanup(
    data: ExecutePaymentCleanupRequest
  ): Promise<PaymentCleanupJobResponse> {
    try {
      // Create task for immediate execution
      const task = await prisma.taskQueue.create({
        data: {
          type: 'PAYMENT_CLEANUP',
          jobId: `${data.paymentId}-immediate`, // Use different jobId to avoid conflicts with scheduled cleanup
          payload: JSON.stringify(data),
          scheduledAt: new Date(), // Execute immediately
          status: 'PENDING',
        },
      })

      // Return response matching worker API format
      return {
        jobId: task.id,
        paymentId: data.paymentId,
        bookingId: data.bookingId,
        delayMs: 0,
        cleanupTime: task.scheduledAt!.toISOString(),
        status: 'queued',
        priority: 'high',
        message: 'Immediate payment cleanup queued',
      }
    } catch (error) {
      console.error('Failed to execute immediate payment cleanup:', error)
      throw error
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

/**
 * Default worker API client instance
 */
export const workerApiClient = new WorkerApiClient()

/**
 * Export for convenience (can use named exports or singleton)
 */
export default workerApiClient

// ============================================================================
// Re-export Types from @mimisalon/shared
// ============================================================================

/**
 * Re-export types for convenience so consumers don't need to import from @mimisalon/shared
 */
export type {
  BookingReminderNotificationRequest,
  TodayNotificationRequest,
  ImmediateNotificationRequest,
  NotificationJobResponse,
  NotificationQueueStatusResponse,
  CancelNotificationsResponse,
  SchedulePaymentCleanupRequest,
  ExecutePaymentCleanupRequest,
  PaymentCleanupJobResponse,
  CancelPaymentCleanupResponse,
  WorkerApiError,
  WorkerApiResponse,
}

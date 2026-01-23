/**
 * Worker API Types
 *
 * TypeScript types for REST API communication with @mimisalon/worker service.
 * Defines request/response shapes for all queue job endpoints.
 *
 * @module types/worker-api
 */

// ============================================================================
// Common Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface WorkerApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string | Record<string, unknown>;
  };
  timestamp: string;
}

/**
 * Queue job status (distinct from Prisma's JobStatus enum)
 * Represents the current state of a job in the BullMQ queue
 */
export type QueueJobStatus = 'queued' | 'scheduled' | 'cancelled' | 'completed' | 'failed';

// ============================================================================
// Email Queue Types
// ============================================================================

/**
 * Email job types
 */
export type EmailJobType = 'VERIFICATION' | 'PASSWORD_RESET' | 'NOTIFICATION' | 'BOOKING_REMINDER';

/**
 * Generic email job request
 */
export interface EmailJobRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
  userId?: string;
  type: EmailJobType;
  priority?: number;
  metadata?: Record<string, unknown>;
  delay?: number;
  jobId?: string;
}

/**
 * Verification email request
 */
export interface VerificationEmailRequest {
  userId: string;
  email: string;
  name: string;
  verificationUrl: string;
}

/**
 * Email job response data
 */
export interface EmailJobResponse {
  jobId: string | number;
  type: EmailJobType;
  email: string;
  status: QueueJobStatus;
  bookingId?: string;
  delayMinutes?: number;
}

/**
 * Email queue status response
 */
export interface EmailQueueStatusResponse {
  queue: 'email';
  counts: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  samples?: {
    waiting: Array<{ id: string; type: string; to: string }>;
    failed: Array<{ id: string; type: string; to: string; error?: string }>;
  };
}

// ============================================================================
// Notification Queue Types
// ============================================================================

/**
 * Notification job types
 */
export type NotificationJobType =
  | 'booking_reminder'
  | 'today_booking'
  | 'status_update'
  | 'quote_request';

/**
 * Notification target audience
 */
export type NotificationAudience = 'CUSTOMER' | 'GROOMER' | 'BOTH';

/**
 * Booking reminder notification request
 */
export interface BookingReminderNotificationRequest {
  bookingId: string;
  serviceDateTime: string; // ISO 8601 datetime
}

/**
 * Today notification request
 */
export interface TodayNotificationRequest {
  bookingId: string;
  serviceDate: string; // ISO 8601 date
}

/**
 * Immediate notification request
 */
export interface ImmediateNotificationRequest {
  type: NotificationJobType;
  bookingId: string;
  userId?: string;
  targetAudience: NotificationAudience;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * Notification job response data
 */
export interface NotificationJobResponse {
  bookingId: string;
  type: NotificationJobType;
  status: QueueJobStatus;
  serviceDateTime?: string;
  reminderTime?: string;
  notificationTime?: string;
  targetAudience?: NotificationAudience;
  title?: string;
  priority?: string;
}

/**
 * Cancel notifications response
 */
export interface CancelNotificationsResponse {
  bookingId: string;
  status: 'cancelled';
  message: string;
}

/**
 * Notification queue status response
 */
export interface NotificationQueueStatusResponse {
  queue: 'notification';
  counts: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    total: number;
  };
}

// ============================================================================
// Payment Queue Types
// ============================================================================

/**
 * Schedule payment cleanup request
 */
export interface SchedulePaymentCleanupRequest {
  paymentId: string;
  bookingId?: string | null;
  delayMs?: number; // Default: 5 minutes (300000ms)
}

/**
 * Execute immediate cleanup request
 */
export interface ExecutePaymentCleanupRequest {
  paymentId: string;
  bookingId?: string | null;
}

/**
 * Payment cleanup job response
 */
export interface PaymentCleanupJobResponse {
  jobId: string | number;
  paymentId: string;
  bookingId?: string | null;
  delayMs?: number;
  cleanupTime?: string;
  status: QueueJobStatus;
  priority?: string;
  message?: string;
}

/**
 * Cancel payment cleanup response
 */
export interface CancelPaymentCleanupResponse {
  paymentId: string;
  status: 'cancelled';
  message: string;
}

// ============================================================================
// Health & Status Types
// ============================================================================

/**
 * Health check response
 */
export interface HealthCheckResponse {
  success: boolean;
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  checks?: {
    redis: {
      healthy: boolean;
      status: string;
      connections: number;
    };
    smtp: {
      healthy: boolean;
      message: string;
    };
    workers: {
      initialized: boolean;
      isLeader: boolean;
      status: {
        notification: 'running' | 'stopped';
        email: 'running' | 'stopped';
        paymentCleanup: 'running' | 'stopped';
      };
    };
  };
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Worker API error class
 */
export class WorkerApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public details?: string | Record<string, unknown>
  ) {
    super(message);
    this.name = 'WorkerApiError';
  }
}

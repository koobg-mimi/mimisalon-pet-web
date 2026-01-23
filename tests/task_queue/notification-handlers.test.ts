/**
 * Notification Task Queue Tests
 *
 * Tests for booking reminder, today notification, and immediate notification handlers
 */
import type { Mock } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { workerApiClient } from '@/lib/worker-api-client'
import { prisma } from '@mimisalon/shared'
import { Prisma } from '@prisma/client'
import type {
  BookingReminderNotificationRequest,
  TodayNotificationRequest,
  ImmediateNotificationRequest,
} from '@/lib/worker-api-client'

// Mock the prisma client
vi.mock('@mimisalon/shared', () => ({
  prisma: {
    $transaction: vi.fn(),
    taskQueue: {
      findFirst: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

describe('Notification Task Queue', () => {
  const mockPrisma = prisma as unknown as {
    $transaction: Mock
    taskQueue: {
      findFirst: Mock
      create: Mock
      updateMany: Mock
      findMany: Mock
      count: Mock
      deleteMany: Mock
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('scheduleBookingReminder', () => {
    const mockReminderData: BookingReminderNotificationRequest = {
      bookingId: 'booking-123',
      serviceDateTime: new Date('2025-11-01T10:00:00Z').toISOString(),
    }

    const reminderTime = new Date(
      new Date(mockReminderData.serviceDateTime).getTime() - 2 * 60 * 60 * 1000
    )

    const mockTask = {
      id: 'task-cuid-123',
      type: 'BOOKING_REMINDER' as const,
      jobId: 'booking-123',
      payload: JSON.stringify(mockReminderData),
      status: 'PENDING' as const,
      version: 0,
      retry: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      scheduledAt: reminderTime,
    }

    it('should schedule reminder 2 hours before service', async () => {
      mockPrisma.taskQueue.create.mockResolvedValue(mockTask)

      const result = await workerApiClient.scheduleBookingReminder(mockReminderData)

      expect(result.bookingId).toBe('booking-123')
      expect(result.type).toBe('booking_reminder')
      expect(result.status).toBe('scheduled')
      expect(result.serviceDateTime).toBeDefined()
      expect(result.reminderTime).toBeDefined()
      expect(new Date(result.serviceDateTime!)).toEqual(new Date(mockReminderData.serviceDateTime))
      expect(new Date(result.reminderTime!)).toEqual(reminderTime)
    })

    it('should be idempotent when reminder already exists', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
        meta: { target: ['type', 'jobId', 'status'] },
      })
      mockPrisma.taskQueue.create.mockRejectedValue(error)
      mockPrisma.taskQueue.findFirst.mockResolvedValue(mockTask)

      const result = await workerApiClient.scheduleBookingReminder(mockReminderData)

      expect(result.bookingId).toBe('booking-123')
      expect(result.status).toBe('scheduled')
      expect(mockPrisma.taskQueue.findFirst).toHaveBeenCalledWith({
        where: {
          type: 'BOOKING_REMINDER',
          jobId: 'booking-123',
          status: { in: ['PENDING', 'RUNNING'] },
        },
      })
    })

    it('should use bookingId as jobId for deduplication', async () => {
      let createData: any

      mockPrisma.taskQueue.create.mockImplementation((data) => {
        createData = data
        return Promise.resolve(mockTask)
      })

      await workerApiClient.scheduleBookingReminder(mockReminderData)

      expect(createData.data.jobId).toBe('booking-123')
      expect(createData.data.type).toBe('BOOKING_REMINDER')
      expect(createData.data.status).toBe('PENDING')
    })
  })

  describe('scheduleTodayNotification', () => {
    const mockTodayData: TodayNotificationRequest = {
      bookingId: 'booking-789',
      serviceDate: '2025-11-01',
    }

    const expectedScheduleTime = new Date('2025-11-01T08:00:00+09:00')

    const mockTask = {
      id: 'task-cuid-456',
      type: 'TODAY_NOTIFICATION' as const,
      jobId: 'booking-789',
      payload: JSON.stringify(mockTodayData),
      status: 'PENDING' as const,
      version: 0,
      retry: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      scheduledAt: expectedScheduleTime,
    }

    it('should schedule notification for 8 AM on service date', async () => {
      mockPrisma.taskQueue.create.mockResolvedValue(mockTask)

      const result = await workerApiClient.scheduleTodayNotification(mockTodayData)

      expect(result.bookingId).toBe('booking-789')
      expect(result.type).toBe('today_booking')
      expect(result.status).toBe('scheduled')
    })

    it('should be idempotent when today notification already exists', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
        meta: { target: ['type', 'jobId', 'status'] },
      })
      mockPrisma.taskQueue.create.mockRejectedValue(error)
      mockPrisma.taskQueue.findFirst.mockResolvedValue(mockTask)

      const result = await workerApiClient.scheduleTodayNotification(mockTodayData)

      expect(result.bookingId).toBe('booking-789')
      expect(mockPrisma.taskQueue.findFirst).toHaveBeenCalledWith({
        where: {
          type: 'TODAY_NOTIFICATION',
          jobId: 'booking-789-today',
          status: { in: ['PENDING', 'RUNNING'] },
        },
      })
    })
  })

  describe('sendImmediateNotification', () => {
    const mockImmediateData: ImmediateNotificationRequest = {
      type: 'status_update',
      bookingId: 'booking-555',
      userId: 'user-999',
      targetAudience: 'CUSTOMER',
      title: 'Booking Confirmed',
      body: 'Your booking has been confirmed',
      data: { bookingId: 'booking-555' },
    }

    it('should create immediate notification with timestamped jobId', async () => {
      let createData: any
      const now = Date.now()

      const mockTask = {
        id: 'task-cuid-789',
        type: 'IMMEDIATE_NOTIFICATION' as const,
        jobId: `user-999_${now}`,
        payload: JSON.stringify(mockImmediateData),
        status: 'PENDING' as const,
        version: 0,
        retry: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        scheduledAt: new Date(),
      }

      mockPrisma.taskQueue.create.mockImplementation((data) => {
        createData = data
        return Promise.resolve(mockTask)
      })

      const result = await workerApiClient.sendImmediateNotification(mockImmediateData)

      expect(result.status).toBe('queued')
      expect(result.targetAudience).toBe('CUSTOMER')
      expect(result.title).toBe('Booking Confirmed')
      expect(result.priority).toBe('high')
      expect(createData.data.type).toBe('IMMEDIATE_NOTIFICATION')
      expect(createData.data.jobId).toMatch(/^immediate-\d+$/)
    })
  })

  describe('cancelBookingNotifications', () => {
    const testBookingId = 'booking-cancel-123'

    it('should cancel all notification types for a booking', async () => {
      let updateQuery: any

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          taskQueue: {
            updateMany: vi.fn((query) => {
              updateQuery = query
              return Promise.resolve({ count: 3 })
            }),
          },
        }
        return callback(tx)
      })

      const result = await workerApiClient.cancelBookingNotifications(testBookingId)

      expect(updateQuery).toBeDefined()
      expect(updateQuery.where.type).toEqual({
        in: ['BOOKING_REMINDER', 'TODAY_NOTIFICATION', 'IMMEDIATE_NOTIFICATION'],
      })
      expect(updateQuery.where.OR).toEqual([
        { jobId: testBookingId },
        { jobId: `${testBookingId}-today` },
        { jobId: { startsWith: `${testBookingId}-immediate-` } },
      ])
      expect(updateQuery.where.status).toEqual({ in: ['PENDING', 'RUNNING'] })

      expect(updateQuery.data).toEqual({
        status: 'CANCELLED',
      })

      expect(result.bookingId).toBe(testBookingId)
      expect(result.status).toBe('cancelled')
      expect(result.message).toBeDefined()
    })

    it('should handle zero cancellations gracefully', async () => {
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          taskQueue: {
            updateMany: vi.fn(() => Promise.resolve({ count: 0 })),
          },
        }
        return callback(tx)
      })

      const result = await workerApiClient.cancelBookingNotifications(testBookingId)

      expect(result.status).toBe('cancelled')
      expect(result.message).toBeDefined()
    })
  })

  describe('getNotificationQueueStatus', () => {
    it('should return counts for all notification types', async () => {
      mockPrisma.taskQueue.count
        .mockResolvedValueOnce(5) // pending
        .mockResolvedValueOnce(3) // running
        .mockResolvedValueOnce(10) // completed
        .mockResolvedValueOnce(2) // failed
        .mockResolvedValueOnce(1) // cancelled
        .mockResolvedValueOnce(2) // delayed

      const result = await workerApiClient.getNotificationQueueStatus()

      expect(result).toEqual({
        queue: 'notification',
        counts: {
          waiting: 5,
          active: 3,
          completed: 10,
          failed: 2,
          delayed: 2,
          total: 21, // 5 + 3 + 10 + 2 + 1
        },
      })

      expect(mockPrisma.taskQueue.count).toHaveBeenCalledTimes(6)
    })
  })
})

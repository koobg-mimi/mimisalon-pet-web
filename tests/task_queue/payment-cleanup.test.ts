/**
 * Payment Cleanup Task Queue Tests
 *
 * Tests for jobId-based deduplication and task scheduling
 */
import type { Mock } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { workerApiClient } from '@/lib/worker-api-client'
import { prisma } from '@mimisalon/shared'
import { Prisma } from '@prisma/client'

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

describe('Payment Cleanup Task Queue', () => {
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

  describe('schedulePaymentCleanup', () => {
    const mockPaymentData = {
      paymentId: 'test-payment-123',
      bookingId: 'test-booking-456',
    }

    const mockTask = {
      id: 'task-cuid-123',
      type: 'PAYMENT_CLEANUP' as const,
      jobId: 'test-payment-123',
      payload: JSON.stringify(mockPaymentData),
      status: 'PENDING' as const,
      version: 0,
      retry: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      scheduledAt: new Date(Date.now() + 15 * 60 * 1000),
    }

    it('should create a new task when none exists', async () => {
      // Setup: Create succeeds directly
      mockPrisma.taskQueue.create.mockResolvedValue(mockTask)

      // Execute
      const result = await workerApiClient.schedulePaymentCleanup(mockPaymentData)

      // Verify
      expect(result.jobId).toBe('task-cuid-123')
      expect(result.paymentId).toBe('test-payment-123')
      expect(result.status).toBe('scheduled')
    })

    it('should return existing task when one already exists (idempotent)', async () => {
      // Setup: Simulate unique constraint violation, then return existing task
      const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
        meta: { target: ['type', 'jobId', 'status'] },
      })
      mockPrisma.taskQueue.create.mockRejectedValue(error)
      mockPrisma.taskQueue.findFirst.mockResolvedValue(mockTask)

      // Execute
      const result = await workerApiClient.schedulePaymentCleanup(mockPaymentData)

      // Verify: Returns existing task
      expect(result.jobId).toBe('task-cuid-123')
      expect(result.paymentId).toBe('test-payment-123')

      // Verify: create was attempted
      expect(mockPrisma.taskQueue.create).toHaveBeenCalledTimes(1)

      // Verify: findFirst was called to get existing task
      expect(mockPrisma.taskQueue.findFirst).toHaveBeenCalledTimes(1)
    })

    it('should use jobId for deduplication query', async () => {
      let findFirstQuery

      // Setup: Create throws P2002, findFirst captures query
      const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
        meta: { target: ['type', 'jobId', 'status'] },
      })
      mockPrisma.taskQueue.create.mockRejectedValue(error)
      mockPrisma.taskQueue.findFirst.mockImplementation((query) => {
        findFirstQuery = query
        return Promise.resolve(mockTask)
      })

      await workerApiClient.schedulePaymentCleanup(mockPaymentData)

      // Verify: Query uses jobId (not string_contains)
      expect(findFirstQuery).toEqual({
        where: {
          type: 'PAYMENT_CLEANUP',
          jobId: 'test-payment-123',
          status: { in: ['PENDING', 'RUNNING'] },
        },
      })
    })

    it('should store paymentId as jobId in new task', async () => {
      let createData: { data: { jobId: string; type: string; status: string } } | undefined

      // Setup: Capture create data
      mockPrisma.taskQueue.create.mockImplementation((data) => {
        createData = data
        return Promise.resolve(mockTask)
      })

      await workerApiClient.schedulePaymentCleanup(mockPaymentData)

      // Verify: jobId is set to paymentId
      expect(createData).toBeDefined()
      expect(createData!.data.jobId).toBe('test-payment-123')
      expect(createData!.data.type).toBe('PAYMENT_CLEANUP')
      expect(createData!.data.status).toBe('PENDING')
    })
  })

  describe('cancelPaymentCleanup', () => {
    const testPaymentId = 'test-payment-789'

    it('should cancel all pending/running tasks with jobId', async () => {
      let updateQuery:
        | {
            where: { type: string; jobId: string; status: { in: string[] } }
            data: { status: string }
          }
        | undefined

      // Setup: Mock transaction that executes callback with tx
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          taskQueue: {
            updateMany: vi.fn((query) => {
              updateQuery = query
              return Promise.resolve({ count: 2 })
            }),
          },
        }
        return callback(tx)
      })

      const result = await workerApiClient.cancelPaymentCleanup(testPaymentId)

      // Verify: Query uses jobId
      expect(updateQuery).toBeDefined()
      expect(updateQuery!.where).toEqual({
        type: 'PAYMENT_CLEANUP',
        jobId: testPaymentId,
        status: { in: ['PENDING', 'RUNNING'] },
      })

      // Verify: Status updated to CANCELLED
      expect(updateQuery!.data).toEqual({
        status: 'CANCELLED',
      })

      // Verify: Response
      expect(result.paymentId).toBe(testPaymentId)
      expect(result.status).toBe('cancelled')
    })
  })
})

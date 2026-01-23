/**
 * Integration Tests for Task Queue with jobId
 *
 * Tests end-to-end scenarios with actual Prisma operations
 * These tests require a test database
 *
 * Run with: bun test tests/task_queue/integration.test.ts
 */
import { workerApiClient } from '@/lib/worker-api-client'
import { prisma } from '@mimisalon/shared'

// Note: This test file does NOT mock Prisma - it uses real database operations

describe('Task Queue Integration Tests', () => {
  const TEST_PAYMENT_PREFIX = 'integration-test-'

  beforeEach(async () => {
    // Clean up any existing test tasks
    await prisma.taskQueue.deleteMany({
      where: {
        jobId: {
          startsWith: TEST_PAYMENT_PREFIX,
        },
      },
    })
  })

  afterEach(async () => {
    // Clean up test tasks
    await prisma.taskQueue.deleteMany({
      where: {
        jobId: {
          startsWith: TEST_PAYMENT_PREFIX,
        },
      },
    })
  })

  describe('schedulePaymentCleanup - Full Integration', () => {
    it('should create task in database with jobId', async () => {
      const testPaymentId = `${TEST_PAYMENT_PREFIX}${Date.now()}`
      const testData = {
        paymentId: testPaymentId,
        bookingId: 'test-booking-integration',
      }

      // Execute
      const result = await workerApiClient.schedulePaymentCleanup(testData)

      // Verify: Response
      expect(result.jobId).toBeDefined()
      expect(result.paymentId).toBe(testPaymentId)
      expect(result.status).toBe('scheduled')

      // Verify: Database state
      const taskInDb = await prisma.taskQueue.findFirst({
        where: {
          jobId: testPaymentId,
          type: 'PAYMENT_CLEANUP',
        },
      })

      expect(taskInDb).not.toBeNull()
      expect(taskInDb?.jobId).toBe(testPaymentId)
      expect(taskInDb?.status).toBe('PENDING')
      expect(taskInDb?.version).toBe(0)

      // Verify: Payload stored correctly
      const payload = JSON.parse(taskInDb?.payload as string)
      expect(payload.paymentId).toBe(testPaymentId)
      expect(payload.bookingId).toBe('test-booking-integration')
    })

    it('should be idempotent - multiple calls return same task', async () => {
      const testPaymentId = `${TEST_PAYMENT_PREFIX}${Date.now()}-idempotent`
      const testData = {
        paymentId: testPaymentId,
        bookingId: 'test-booking-idempotent',
      }

      // Execute: First call
      const result1 = await workerApiClient.schedulePaymentCleanup(testData)

      // Execute: Second call
      const result2 = await workerApiClient.schedulePaymentCleanup(testData)

      // Verify: Both return same task ID
      expect(result1.jobId).toBe(result2.jobId)

      // Verify: Only 1 task in database
      const tasksInDb = await prisma.taskQueue.findMany({
        where: {
          jobId: testPaymentId,
          type: 'PAYMENT_CLEANUP',
        },
      })

      expect(tasksInDb).toHaveLength(1)
    })

    it('should handle concurrent requests correctly', async () => {
      const testPaymentId = `${TEST_PAYMENT_PREFIX}${Date.now()}-concurrent`
      const testData = {
        paymentId: testPaymentId,
        bookingId: 'test-booking-concurrent',
      }

      // Execute: 5 concurrent requests
      const results = await Promise.all([
        workerApiClient.schedulePaymentCleanup(testData),
        workerApiClient.schedulePaymentCleanup(testData),
        workerApiClient.schedulePaymentCleanup(testData),
        workerApiClient.schedulePaymentCleanup(testData),
        workerApiClient.schedulePaymentCleanup(testData),
      ])

      // Verify: All return same job ID
      const uniqueJobIds = new Set(results.map((r) => r.jobId))
      expect(uniqueJobIds.size).toBe(1)

      // Verify: Only 1 task in database
      const tasksInDb = await prisma.taskQueue.findMany({
        where: {
          jobId: testPaymentId,
          type: 'PAYMENT_CLEANUP',
        },
      })

      expect(tasksInDb).toHaveLength(1)
      expect(tasksInDb[0].jobId).toBe(testPaymentId)
    })
  })

  describe('cancelPaymentCleanup - Full Integration', () => {
    it('should cancel pending task by jobId', async () => {
      const testPaymentId = `${TEST_PAYMENT_PREFIX}${Date.now()}-cancel`
      const testData = {
        paymentId: testPaymentId,
        bookingId: 'test-booking-cancel',
      }

      // Setup: Create task
      await workerApiClient.schedulePaymentCleanup(testData)

      // Verify: Task is PENDING
      const pendingTask = await prisma.taskQueue.findFirst({
        where: {
          jobId: testPaymentId,
          type: 'PAYMENT_CLEANUP',
        },
      })
      expect(pendingTask?.status).toBe('PENDING')

      // Execute: Cancel
      const result = await workerApiClient.cancelPaymentCleanup(testPaymentId)

      // Verify: Response
      expect(result.status).toBe('cancelled')
      expect(result.paymentId).toBe(testPaymentId)

      // Verify: Task is CANCELLED in DB
      const cancelledTask = await prisma.taskQueue.findFirst({
        where: {
          jobId: testPaymentId,
          type: 'PAYMENT_CLEANUP',
        },
      })
      expect(cancelledTask?.status).toBe('CANCELLED')
    })

    it('should not cancel COMPLETED tasks', async () => {
      const testPaymentId = `${TEST_PAYMENT_PREFIX}${Date.now()}-completed`

      // Setup: Create and mark as COMPLETED
      await prisma.taskQueue.create({
        data: {
          type: 'PAYMENT_CLEANUP',
          jobId: testPaymentId,
          payload: JSON.stringify({
            paymentId: testPaymentId,
            bookingId: 'test-booking',
          }),
          status: 'COMPLETED',
          scheduledAt: new Date(),
        },
      })

      // Execute: Try to cancel
      await workerApiClient.cancelPaymentCleanup(testPaymentId)

      // Verify: Task remains COMPLETED (not CANCELLED)
      const task = await prisma.taskQueue.findFirst({
        where: {
          jobId: testPaymentId,
          type: 'PAYMENT_CLEANUP',
        },
      })
      expect(task?.status).toBe('COMPLETED')
    })
  })

  describe('jobId index performance', () => {
    it('should use index for jobId queries', async () => {
      // Note: This is a documentation test
      // Actual index usage can be verified with EXPLAIN ANALYZE in database

      const testPaymentId = `${TEST_PAYMENT_PREFIX}${Date.now()}-index`

      // Create task
      await workerApiClient.schedulePaymentCleanup({
        paymentId: testPaymentId,
        bookingId: 'test-booking',
      })

      // Query by type and jobId (should use composite index)
      const task = await prisma.taskQueue.findFirst({
        where: {
          type: 'PAYMENT_CLEANUP',
          jobId: testPaymentId,
        },
      })

      expect(task).not.toBeNull()
      expect(task?.jobId).toBe(testPaymentId)

      // Note: Index TaskQueue_type_jobId_idx should be used
      // Can verify with: EXPLAIN ANALYZE SELECT * FROM "TaskQueue" WHERE type = 'PAYMENT_CLEANUP' AND "jobId" = '...';
    })
  })
})

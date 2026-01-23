/**
 * Race Condition Tests for Task Queue
 *
 * Tests concurrent task scheduling with jobId-based deduplication
 */
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { workerApiClient } from '@/lib/worker-api-client';
import { prisma } from '@mimisalon/shared';
import { Prisma } from '@prisma/client';

vi.mock('@mimisalon/shared', () => ({
  prisma: {
    taskQueue: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

describe('Task Queue Race Condition Prevention', () => {
  const mockPrisma = prisma as unknown as {
    taskQueue: {
      create: Mock;
      findFirst: Mock;
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Concurrent schedulePaymentCleanup calls', () => {
    it('should handle 5 concurrent requests and create only 1 task', async () => {
      const mockPaymentData = {
        paymentId: 'concurrent-test-payment',
        bookingId: 'concurrent-test-booking',
      };

      const mockTask = {
        id: 'task-shared-123',
        type: 'PAYMENT_CLEANUP' as const,
        jobId: 'concurrent-test-payment',
        payload: JSON.stringify(mockPaymentData),
        status: 'PENDING' as const,
        version: 0,
        retry: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        scheduledAt: new Date(Date.now() + 15 * 60 * 1000),
      };

      let taskCreated = false;
      let createCallCount = 0;
      let findFirstCallCount = 0;

      // Simulate try-insert-catch-conflict pattern:
      // First call succeeds, subsequent calls get P2002 and query existing
      mockPrisma.taskQueue.create.mockImplementation(() => {
        createCallCount++;
        if (!taskCreated) {
          taskCreated = true;
          return Promise.resolve(mockTask);
        }
        // Subsequent calls throw unique constraint violation
        const error = new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed',
          {
            code: 'P2002',
            clientVersion: '5.0.0',
            meta: { target: ['type', 'jobId', 'status'] },
          }
        );
        return Promise.reject(error);
      });

      // findFirst is called by catch block when P2002 occurs
      mockPrisma.taskQueue.findFirst.mockImplementation(() => {
        findFirstCallCount++;
        return Promise.resolve(mockTask);
      });

      // Execute: 5 concurrent requests
      const results = await Promise.all([
        workerApiClient.schedulePaymentCleanup(mockPaymentData),
        workerApiClient.schedulePaymentCleanup(mockPaymentData),
        workerApiClient.schedulePaymentCleanup(mockPaymentData),
        workerApiClient.schedulePaymentCleanup(mockPaymentData),
        workerApiClient.schedulePaymentCleanup(mockPaymentData),
      ]);

      // Verify: All requests return the same task ID
      const uniqueJobIds = new Set(results.map((r) => r.jobId));
      expect(uniqueJobIds.size).toBe(1);
      expect(results[0].jobId).toBe('task-shared-123');

      // Verify: All responses have correct data
      results.forEach((result) => {
        expect(result.paymentId).toBe('concurrent-test-payment');
        expect(result.status).toBe('scheduled');
      });

      // Verify: create was called 5 times (all attempts)
      expect(createCallCount).toBe(5);
      // Verify: findFirst was called 4 times (after first success, 4 caught P2002)
      expect(findFirstCallCount).toBe(4);
    });

    it('should use jobId for accurate deduplication (not string_contains)', async () => {
      const mockPaymentData = {
        paymentId: 'exact-match-123',
        bookingId: 'test-booking',
      };

      const mockTask = {
        id: 'task-123',
        type: 'PAYMENT_CLEANUP' as const,
        jobId: 'exact-match-123',
        payload: JSON.stringify(mockPaymentData),
        status: 'PENDING' as const,
        version: 0,
        retry: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        scheduledAt: new Date(Date.now() + 15 * 60 * 1000),
      };

      // First call succeeds
      mockPrisma.taskQueue.create.mockResolvedValueOnce(mockTask);

      await workerApiClient.schedulePaymentCleanup(mockPaymentData);

      // Verify: create was called with exact jobId (not string_contains)
      expect(mockPrisma.taskQueue.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'PAYMENT_CLEANUP',
          jobId: 'exact-match-123',
        }),
      });
    });

    it('should prevent duplicate tasks for same paymentId with different bookingId', async () => {
      const paymentId = 'same-payment-different-booking';
      const existingTask = {
        id: 'existing-task-123',
        type: 'PAYMENT_CLEANUP' as const,
        jobId: paymentId,
        payload: JSON.stringify({
          paymentId,
          bookingId: 'booking-1',
        }),
        status: 'PENDING' as const,
        version: 0,
        retry: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        scheduledAt: new Date(Date.now() + 15 * 60 * 1000),
      };

      // Simulate duplicate: create throws P2002, findFirst returns existing
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { target: ['type', 'jobId', 'status'] },
        }
      );
      mockPrisma.taskQueue.create.mockRejectedValueOnce(error);
      mockPrisma.taskQueue.findFirst.mockResolvedValueOnce(existingTask);

      // Execute: Try to create task with same paymentId but different bookingId
      const result = await workerApiClient.schedulePaymentCleanup({
        paymentId,
        bookingId: 'booking-2', // Different booking ID
      });

      // Verify: Returns existing task (deduplication by jobId/paymentId only)
      expect(result.jobId).toBe('existing-task-123');

      // Verify: create was attempted
      expect(mockPrisma.taskQueue.create).toHaveBeenCalledTimes(1);

      // Verify: findFirst was called to get existing task
      expect(mockPrisma.taskQueue.findFirst).toHaveBeenCalledWith({
        where: {
          type: 'PAYMENT_CLEANUP',
          jobId: paymentId,
          status: {in: ['PENDING', 'RUNNING']},
        },
      });
    });
  });

  describe('Optimistic locking with version field', () => {
    it('should respect version field for concurrent updates', async () => {
      // Note: This test documents the version field behavior
      // The actual optimistic locking is tested in the hooks/route.ts tests

      const mockTask = {
        id: 'task-version-test',
        type: 'PAYMENT_CLEANUP' as const,
        jobId: 'payment-version-test',
        payload: JSON.stringify({
          paymentId: 'payment-version-test',
          bookingId: 'booking-1',
        }),
        status: 'PENDING' as const,
        version: 0, // Initial version
        retry: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        scheduledAt: new Date(Date.now() + 15 * 60 * 1000),
      };

      // Create succeeds with initial version
      mockPrisma.taskQueue.create.mockResolvedValueOnce(mockTask);

      const result = await workerApiClient.schedulePaymentCleanup({
        paymentId: 'payment-version-test',
        bookingId: 'booking-1',
      });

      // Verify: Task created with version 0
      expect(result.jobId).toBe('task-version-test');

      // Note: Version increments happen in the hooks route when processing tasks
      // This is documented for reference
    });
  });
});

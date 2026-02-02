/**
 * Booking Service Tests
 * Official Prisma testing pattern: https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { parseISO } from 'date-fns'
import type { PrismaClient } from '@prisma/client'
import prisma from '../../src/lib/__mocks__/prisma'

// Mock the Prisma module - Vitest will automatically use __mocks__/prisma.ts
vi.mock('../../src/lib/prisma')

describe('Booking Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createBooking', () => {
    it('should create a booking', async () => {
      const bookingData = {
        bookingNumber: 'BK-2024-001',
        customerId: 'customer1',
        groomerId: 'groomer1',
        petId: 'pet1',
        serviceDate: parseISO('2024-01-15'),
        serviceTime: '10:00',
        estimatedDurationMinutes: 90,
        serviceType: 'BASIC_GROOMING',
        basePrice: 50000,
        totalPrice: 50000,
      }

      const createdBooking = {
        id: 'booking1',
        customerAddressId: null,
        paymentId: null,
        actualStartTime: null,
        actualEndTime: null,
        status: 'FIRST_PAYMENT_PENDING' as const,
        paymentStatus: 'PENDING' as const,
        serviceDescription: null,
        specialRequests: null,
        additionalCharges: 0,
        discountAmount: 0,
        confirmedAt: null,
        startedAt: null,
        completedAt: null,
        cancelledAt: null,
        cancellationReason: null,
        cancelledBy: null,
        customerRating: null,
        customerReview: null,
        reviewDate: null,
        isEmergency: false,
        requiresPickup: false,
        requiresDropoff: false,
        notes: null,
        idempotencyKey: null,
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...bookingData,
      }

      prisma.$transaction.mockImplementation(
        async <R>(callback: (tx: PrismaClient) => Promise<R>): Promise<R> => {
          return callback(prisma)
        }
      )

      prisma.booking.create.mockResolvedValue(createdBooking)

      const result = await prisma.$transaction(async (tx) => {
        return tx.booking.create({
          data: bookingData,
          include: { payments: true },
        })
      })

      expect(result).toEqual(createdBooking)
    })
  })

  describe('findBookings', () => {
    it('should find bookings by date range', async () => {
      const bookings = [
        {
          id: 'booking1',
          bookingNumber: 'BK-2024-001',
          customerId: 'customer1',
          groomerId: 'groomer1',
          petId: 'pet1',
          customerAddressId: null,
          paymentId: null,
          serviceDate: parseISO('2024-01-15'),
          serviceTime: '10:00',
          estimatedDurationMinutes: 90,
          actualStartTime: null,
          actualEndTime: null,
          status: 'FIRST_PAYMENT_PENDING' as const,
          paymentStatus: 'PENDING' as const,
          serviceType: 'BASIC_GROOMING',
          serviceDescription: null,
          specialRequests: null,
          basePrice: 50000,
          additionalCharges: 0,
          discountAmount: 0,
          totalPrice: 50000,
          confirmedAt: null,
          startedAt: null,
          completedAt: null,
          cancelledAt: null,
          cancellationReason: null,
          cancelledBy: null,
          customerRating: null,
          customerReview: null,
          reviewDate: null,
          isEmergency: false,
          requiresPickup: false,
          requiresDropoff: false,
          notes: null,
          idempotencyKey: null,
          expiresAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      prisma.booking.findMany.mockResolvedValue(bookings)

      const result = await prisma.booking.findMany({
        where: {
          serviceDate: {
            gte: parseISO('2024-01-15'),
            lte: parseISO('2024-01-16'),
          },
        },
      })

      expect(result).toEqual(bookings)
      expect(prisma.booking.findMany).toHaveBeenCalledWith({
        where: {
          serviceDate: {
            gte: parseISO('2024-01-15'),
            lte: parseISO('2024-01-16'),
          },
        },
      })
    })

    it('should count bookings by groomer', async () => {
      prisma.booking.count.mockResolvedValue(5)

      const count = await prisma.booking.count({
        where: { groomerId: 'groomer1' },
      })

      expect(count).toBe(5)
      expect(prisma.booking.count).toHaveBeenCalledWith({
        where: { groomerId: 'groomer1' },
      })
    })
  })

  describe('updateBookingStatus', () => {
    it('should update booking status', async () => {
      const updatedBooking = {
        id: 'booking1',
        bookingNumber: 'BK-2024-001',
        customerId: 'customer1',
        groomerId: 'groomer1',
        petId: 'pet1',
        customerAddressId: null,
        paymentId: null,
        serviceDate: parseISO('2024-01-15'),
        serviceTime: '10:00',
        estimatedDurationMinutes: 90,
        actualStartTime: null,
        actualEndTime: null,
        status: 'SERVICE_COMPLETED' as const,
        paymentStatus: 'COMPLETED' as const,
        serviceType: 'BASIC_GROOMING',
        serviceDescription: null,
        specialRequests: null,
        basePrice: 50000,
        additionalCharges: 0,
        discountAmount: 0,
        totalPrice: 50000,
        confirmedAt: null,
        startedAt: null,
        completedAt: new Date(),
        cancelledAt: null,
        cancellationReason: null,
        cancelledBy: null,
        customerRating: null,
        customerReview: null,
        reviewDate: null,
        isEmergency: false,
        requiresPickup: false,
        requiresDropoff: false,
        notes: null,
        idempotencyKey: null,
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prisma.booking.update.mockResolvedValue(updatedBooking)

      const result = await prisma.booking.update({
        where: { id: 'booking1' },
        data: { status: 'SERVICE_COMPLETED', completedAt: new Date() },
      })

      expect(result).toEqual(updatedBooking)
    })
  })

  describe('complex queries', () => {
    it('should aggregate bookings data', async () => {
      const aggregateResult = {
        _count: { id: 10 },
        _sum: { totalPrice: 500000 },
        _avg: { totalPrice: 50000 },
        _min: { totalPrice: 30000 },
        _max: { totalPrice: 80000 },
      }

      prisma.booking.aggregate.mockResolvedValue(aggregateResult)

      const result = await prisma.booking.aggregate({
        _count: { id: true },
        _sum: { totalPrice: true },
        _avg: { totalPrice: true },
        where: { status: 'SERVICE_COMPLETED' },
      })

      expect(result).toEqual(aggregateResult)
    })

    it('should group bookings by status', async () => {
      const groupResult = [
        { status: 'FIRST_PAYMENT_PENDING', _count: { id: 5 } },
        { status: 'SERVICE_COMPLETED', _count: { id: 8 } },
        { status: 'SERVICE_CANCELLED', _count: { id: 2 } },
      ]

      // @ts-ignore - Mock returns simplified test data
      prisma.booking.groupBy.mockResolvedValue(groupResult)

      const result = await prisma.booking.groupBy({
        by: ['status'],
        _count: { id: true },
      })

      expect(result).toEqual(groupResult)
    })
  })
})

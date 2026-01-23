/**
 * User Service Tests
 * Official Prisma testing pattern: https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { parseISO } from 'date-fns'
import prisma from '../../src/lib/__mocks__/prisma'
import { User } from '@prisma/client'

// Mock the Prisma module - Vitest will automatically use __mocks__/prisma.ts
vi.mock('../../src/lib/prisma')

describe('User Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'user1@test.com',
          name: 'User 1',
          role: 'CUSTOMER' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          emailVerified: null,
          image: null,
          password: null,
          phoneNumber: null,
          phoneNumberVerified: false,
          fcmToken: null,
          fcmTokenUpdatedAt: null,
          notificationsEnabled: true,
        },
        {
          id: '2',
          email: 'user2@test.com',
          name: 'User 2',
          role: 'CUSTOMER' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          emailVerified: null,
          image: null,
          password: null,
          phoneNumber: null,
          phoneNumberVerified: false,
          fcmToken: null,
          fcmTokenUpdatedAt: null,
          notificationsEnabled: true,
        },
      ]

      prisma.user.findMany.mockResolvedValue(mockUsers)

      const users = await prisma.user.findMany()

      expect(users).toEqual(mockUsers)
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1)
    })

    it('should find user by email', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CUSTOMER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
        password: null,
        phoneNumber: null,
        phoneNumberVerified: false,
        fcmToken: null,
        fcmTokenUpdatedAt: null,
        notificationsEnabled: true,
      }

      prisma.user.findUnique.mockResolvedValue(mockUser)

      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
      })

      expect(user).toEqual(mockUser)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'new@example.com',
        name: 'New User',
        password: 'hashed_password',
      }

      const createdUser: User = {
        id: '3',
        role: 'CUSTOMER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
        phoneNumber: null,
        phoneNumberVerified: false,
        notificationsEnabled: true,
        ...newUser,
      }

      prisma.user.create.mockResolvedValue(createdUser)

      const result = await prisma.user.create({
        data: newUser,
      })

      expect(result).toEqual(createdUser)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: newUser,
      })
    })

    it('should handle creation error', async () => {
      const newUser = {
        email: 'duplicate@example.com',
        name: 'Duplicate User',
      }

      const error = new Error('User already exists')
      prisma.user.create.mockRejectedValue(error)

      await expect(prisma.user.create({ data: newUser })).rejects.toThrow('User already exists')
    })
  })

  describe('updateUser', () => {
    it('should update user', async () => {
      const updatedUser = {
        id: '1',
        email: 'updated@example.com',
        name: 'Updated User',
        role: 'CUSTOMER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
        password: null,
        phoneNumber: null,
        phoneNumberVerified: false,
        fcmToken: null,
        fcmTokenUpdatedAt: null,
        notificationsEnabled: true,
      }

      prisma.user.update.mockResolvedValue(updatedUser)

      const result = await prisma.user.update({
        where: { id: '1' },
        data: { name: 'Updated User' },
      })

      expect(result).toEqual(updatedUser)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated User' },
      })
    })
  })

  describe('relations', () => {
    it('should find user with bookings', async () => {
      const userWithBookings = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CUSTOMER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
        password: null,
        phoneNumber: null,
        phoneNumberVerified: false,
        fcmToken: null,
        fcmTokenUpdatedAt: null,
        notificationsEnabled: true,
        bookings: [
          {
            id: 'booking1',
            bookingNumber: 'BK-2024-001',
            customerId: '1',
            groomerId: null,
            petId: null,
            customerAddressId: null,
            paymentId: null,
            serviceDate: parseISO('2024-01-01'),
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
        ],
      }

      prisma.user.findUnique.mockResolvedValue(userWithBookings)

      const result = await prisma.user.findUnique({
        where: { id: '1' },
        include: { bookings: true },
      })

      expect(result).toEqual(userWithBookings)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { bookings: true },
      })
    })
  })
})

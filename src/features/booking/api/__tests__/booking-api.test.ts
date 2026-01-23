/**
 * Booking API Tests
 *
 * Tests for API layer functions with fetch mocking
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import {
  bookingApi,
  type InitializeBookingRequest,
  type InitializePaymentRequest,
} from '../booking-api'

// Mock fetch
global.fetch = vi.fn()

describe('bookingApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('initializeBooking', () => {
    const mockRequest: InitializeBookingRequest = {
      idempotencyKey: 'key123',
      petServices: [
        {
          petId: 'pet1',
          services: [
            {
              id: 'service1',
              name: 'Basic Grooming',
              price: 50000,
              duration: 60,
            },
          ],
          options: [],
        },
      ],
      addressId: 'address1',
      groomerId: 'groomer1',
      date: '2024-01-15',
      timeSlot: '10:00',
    }

    it('should successfully initialize booking', async () => {
      const mockResponse = {
        bookingId: 'booking123',
        isExisting: false,
        status: 'FIRST_PAYMENT_PENDING',
      }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await bookingApi.initializeBooking(mockRequest)

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/bookings/initialize',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockRequest),
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should handle errors', async () => {
      const mockError = { message: 'Booking failed' }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response)

      await expect(bookingApi.initializeBooking(mockRequest)).rejects.toThrow('Booking failed')
    })

    it('should handle network errors', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'))

      await expect(bookingApi.initializeBooking(mockRequest)).rejects.toThrow('Network error')
    })
  })

  describe('initializePayment', () => {
    const mockRequest: InitializePaymentRequest = {
      bookingId: 'booking123',
      amount: 50000,
      orderName: 'Max 미용서비스',
    }

    it('should successfully initialize payment', async () => {
      const mockResponse = {
        paymentId: 'payment123',
        portonePaymentId: 'portone123',
      }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await bookingApi.initializePayment(mockRequest)

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/initialize',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockRequest),
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should handle payment errors', async () => {
      const mockError = { message: 'Payment initialization failed' }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response)

      await expect(bookingApi.initializePayment(mockRequest)).rejects.toThrow(
        'Payment initialization failed'
      )
    })
  })

  describe('cancelBooking', () => {
    it('should successfully cancel booking', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)

      await expect(bookingApi.cancelBooking('booking123', 'Changed plans')).resolves.not.toThrow()

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/bookings/booking123/cancel',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason: 'Changed plans' }),
        })
      )
    })

    it('should handle cancellation errors', async () => {
      const mockError = { message: 'Cancellation failed' }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response)

      await expect(bookingApi.cancelBooking('booking123')).rejects.toThrow('Cancellation failed')
    })
  })

  describe('updateBookingStatus', () => {
    it('should successfully update booking status', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)

      await expect(
        bookingApi.updateBookingStatus('booking123', 'SERVICE_COMPLETED')
      ).resolves.not.toThrow()

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/bookings/booking123/status',
        expect.objectContaining({
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'SERVICE_COMPLETED' }),
        })
      )
    })

    it('should handle status update errors', async () => {
      const mockError = { message: 'Status update failed' }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response)

      await expect(
        bookingApi.updateBookingStatus('booking123', 'SERVICE_COMPLETED')
      ).rejects.toThrow('Status update failed')
    })
  })

  describe('getBooking', () => {
    it('should successfully fetch and transform booking', async () => {
      const mockResponse = {
        id: 'booking123',
        customer: {
          id: 'customer1',
          name: 'John Doe',
          phone: '010-1234-5678',
          email: 'john@example.com',
        },
        shop: {
          id: 'shop1',
          name: 'Pet Salon',
          address: 'Seoul',
          phone: '02-1234-5678',
        },
        groomer: {
          id: 'groomer1',
          name: 'Jane Smith',
        },
        pets: [
          {
            id: 'pet1',
            name: 'Max',
            breed: 'Poodle',
            type: 'DOG',
          },
        ],
        services: [
          {
            petName: 'Max',
            serviceName: 'Basic Grooming',
            price: 50000,
          },
        ],
        scheduledAt: '2024-01-15T10:00:00Z',
        totalAmount: 50000,
        status: 'FIRST_PAYMENT_PENDING',
        createdAt: '2024-01-10T12:00:00Z',
        updatedAt: '2024-01-10T12:00:00Z',
      }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await bookingApi.getBooking('booking123')

      expect(result).toHaveProperty('formattedDate')
      expect(result).toHaveProperty('formattedTime')
      expect(result).toHaveProperty('formattedTotalAmount')
      expect(result.scheduledAt).toBeInstanceOf(Date)
      expect(result.services[0]).toHaveProperty('formattedPrice')
    })

    it('should handle get booking errors', async () => {
      const mockError = { message: 'Booking not found' }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      } as Response)

      await expect(bookingApi.getBooking('booking123')).rejects.toThrow('Booking not found')
    })
  })

  describe('getBookings', () => {
    it('should successfully fetch and transform bookings list', async () => {
      const mockResponse = {
        bookings: [
          {
            id: 'booking123',
            customer: {
              id: 'customer1',
              name: 'John Doe',
              phone: '010-1234-5678',
              email: 'john@example.com',
            },
            shop: {
              id: 'shop1',
              name: 'Pet Salon',
              address: 'Seoul',
              phone: '02-1234-5678',
            },
            groomer: {
              id: 'groomer1',
              name: 'Jane Smith',
            },
            pets: [],
            services: [],
            scheduledAt: '2024-01-15T10:00:00Z',
            totalAmount: 50000,
            status: 'FIRST_PAYMENT_PENDING',
            createdAt: '2024-01-10T12:00:00Z',
            updatedAt: '2024-01-10T12:00:00Z',
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 5,
          totalItems: 50,
          pageSize: 10,
        },
      }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await bookingApi.getBookings({
        userId: 'customer1',
        status: 'all',
        page: 1,
        pageSize: 10,
      })

      expect(result.bookings).toHaveLength(1)
      expect(result.bookings[0]).toHaveProperty('formattedDate')
      expect(result.pagination).toEqual(mockResponse.pagination)
    })

    it('should construct correct query parameters', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ bookings: [], pagination: {} }),
      } as Response)

      await bookingApi.getBookings({
        userId: 'customer1',
        status: 'FIRST_PAYMENT_PENDING',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        page: 2,
        pageSize: 20,
      })

      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
      const url = fetchCall[0] as string

      expect(url).toContain('userId=customer1')
      expect(url).toContain('status=FIRST_PAYMENT_PENDING')
      expect(url).toContain('startDate=2024-01-01')
      expect(url).toContain('endDate=2024-01-31')
      expect(url).toContain('page=2')
      expect(url).toContain('pageSize=20')
    })
  })
})

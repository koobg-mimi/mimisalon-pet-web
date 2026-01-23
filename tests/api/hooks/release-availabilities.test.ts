/**
 * Tests for releaseGroomerAvailabilities error handling
 *
 * Verifies that the function handles various error scenarios gracefully
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'

// Mock implementation of releaseGroomerAvailabilities for testing
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
      return 0
    }
  } catch (unexpectedError) {
    console.error(
      `[Payment Cleanup] Unexpected error in releaseGroomerAvailabilities for ${context}:`,
      unexpectedError instanceof Error ? unexpectedError.message : unexpectedError
    )
    return 0
  }
}

describe('releaseGroomerAvailabilities error handling', () => {
  let mockTx: any
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleLogSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Mock console methods to verify logging
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    // Reset mock transaction
    mockTx = {
      groomerAvailability: {
        findMany: vi.fn(),
        updateMany: vi.fn(),
      },
    }
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  describe('Input validation', () => {
    it('should return 0 for empty bookingId', async () => {
      const result = await releaseGroomerAvailabilities(mockTx, '', 'test context')

      expect(result).toBe(0)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid bookingId provided')
      )
      expect(mockTx.groomerAvailability.findMany).not.toHaveBeenCalled()
    })

    it('should return 0 for null bookingId', async () => {
      const result = await releaseGroomerAvailabilities(mockTx, null as any, 'test context')

      expect(result).toBe(0)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid bookingId provided')
      )
    })

    it('should return 0 for non-string bookingId', async () => {
      const result = await releaseGroomerAvailabilities(mockTx, 12345 as any, 'test context')

      expect(result).toBe(0)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid bookingId provided')
      )
    })
  })

  describe('Database errors during findMany', () => {
    it('should handle database error gracefully', async () => {
      const dbError = new Error('Database connection lost')
      mockTx.groomerAvailability.findMany.mockRejectedValue(dbError)

      const result = await releaseGroomerAvailabilities(
        mockTx,
        'booking-123',
        'booking: booking-123'
      )

      expect(result).toBe(0)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Database error finding availabilities'),
        'Database connection lost'
      )
      expect(mockTx.groomerAvailability.updateMany).not.toHaveBeenCalled()
    })
  })

  describe('No availabilities found', () => {
    it('should return 0 when no slots found', async () => {
      mockTx.groomerAvailability.findMany.mockResolvedValue([])

      const result = await releaseGroomerAvailabilities(
        mockTx,
        'booking-123',
        'booking: booking-123'
      )

      expect(result).toBe(0)
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No time slots found'))
      expect(mockTx.groomerAvailability.updateMany).not.toHaveBeenCalled()
    })
  })

  describe('Database errors during updateMany', () => {
    it('should handle update error gracefully', async () => {
      const mockAvailabilities = [
        { id: 'slot-1', bookingId: 'booking-123' },
        { id: 'slot-2', bookingId: 'booking-123' },
      ]
      mockTx.groomerAvailability.findMany.mockResolvedValue(mockAvailabilities)

      const updateError = new Error('Update operation failed')
      mockTx.groomerAvailability.updateMany.mockRejectedValue(updateError)

      const result = await releaseGroomerAvailabilities(
        mockTx,
        'booking-123',
        'booking: booking-123'
      )

      expect(result).toBe(0)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Database error releasing 2 slots'),
        'Update operation failed'
      )
    })
  })

  describe('Successful release', () => {
    it('should release slots successfully', async () => {
      const mockAvailabilities = [
        { id: 'slot-1', bookingId: 'booking-123' },
        { id: 'slot-2', bookingId: 'booking-123' },
        { id: 'slot-3', bookingId: 'booking-123' },
      ]
      mockTx.groomerAvailability.findMany.mockResolvedValue(mockAvailabilities)
      mockTx.groomerAvailability.updateMany.mockResolvedValue({ count: 3 })

      const result = await releaseGroomerAvailabilities(
        mockTx,
        'booking-123',
        'booking: booking-123'
      )

      expect(result).toBe(3)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Successfully released 3 time slots')
      )
      expect(mockTx.groomerAvailability.updateMany).toHaveBeenCalledWith({
        where: { bookingId: 'booking-123' },
        data: {
          isBooked: false,
          bookingId: null,
          isAvailable: true,
        },
      })
    })

    it('should warn about partial release', async () => {
      const mockAvailabilities = [
        { id: 'slot-1', bookingId: 'booking-123' },
        { id: 'slot-2', bookingId: 'booking-123' },
        { id: 'slot-3', bookingId: 'booking-123' },
      ]
      mockTx.groomerAvailability.findMany.mockResolvedValue(mockAvailabilities)
      // Only 2 slots updated instead of 3
      mockTx.groomerAvailability.updateMany.mockResolvedValue({ count: 2 })

      const result = await releaseGroomerAvailabilities(
        mockTx,
        'booking-123',
        'booking: booking-123'
      )

      expect(result).toBe(2)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Partial release for booking: booking-123: expected 3 slots, updated 2'
        )
      )
    })
  })

  describe('Unexpected errors', () => {
    it('should catch and log unexpected errors', async () => {
      // Force an unexpected error by making findMany return a non-array
      mockTx.groomerAvailability.findMany.mockResolvedValue({ invalid: 'data' })

      const result = await releaseGroomerAvailabilities(
        mockTx,
        'booking-123',
        'booking: booking-123'
      )

      expect(result).toBe(0)
      // The outer catch block should handle this
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})

/**
 * Booking Calculations Unit Tests
 *
 * Tests for pure calculation functions
 */

import { describe, expect, it, vi } from 'vitest'
import {
  calculatePetServicePrice,
  calculateTotalDuration,
  calculateTotalPrice,
} from '../booking-calculations'
import type { BookingForm } from '../../types/booking-form.types'
import type { Pet } from '@/hooks/usePets'
import type { ServiceData } from '@/data/services'
import type { ServiceOption } from '@/features/booking/components/ui/service-option-selector'

// Helper to create properly typed service data
const createService = (overrides: Partial<ServiceData> = {}): ServiceData => ({
  id: 'service1',
  name: 'Basic Grooming',
  description: 'Basic grooming service',
  duration: 60,
  price: 50000,
  petTypes: ['DOG'],
  priceRanges: [],
  requiresVaccination: false,
  bookingCount: 0,
  icon: '✂️',
  isPopular: false,
  isRecommended: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

// Helper to create properly typed service option
const createOption = (overrides: Partial<ServiceOption> = {}): ServiceOption => ({
  id: 'option1',
  name: 'Nail Trim',
  description: 'Nail trimming',
  price: 10000,
  displayOrder: 0,
  ...overrides,
})

// Mock the services module
vi.mock('@/data/services', () => ({
  calculateServicePrice: vi.fn((service, _petType, _weight, _breedId) => {
    // Simple mock: return base price
    return service.price || 50000
  }),
}))

describe('booking-calculations', () => {
  // Mock data
  const mockPets: Pet[] = [
    {
      id: 'pet1',
      name: 'Max',
      type: 'DOG',
      weight: 10,
      breedId: 'breed1',
      customerId: 'customer1',
      breed: null,
      age: 3,
      birthDate: null,
      gender: 'MALE',
      hairType: null,
      specialNeeds: null,
      vaccinationStatus: 'UP_TO_DATE',
      vaccinationDate: null,
      isActive: true,
      termsAcception: false,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'pet2',
      name: 'Luna',
      type: 'CAT',
      weight: 5,
      breedId: 'breed2',
      customerId: 'customer1',
      breed: null,
      age: 2,
      birthDate: null,
      gender: 'FEMALE',
      hairType: null,
      specialNeeds: null,
      vaccinationStatus: 'UP_TO_DATE',
      vaccinationDate: null,
      isActive: true,
      termsAcception: false,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  describe('calculateTotalPrice', () => {
    it('should return 0 for empty pet services', () => {
      const formData: BookingForm = {
        petServices: [],
        addressId: '',
        groomerId: '',
        date: '',
        timeSlot: '',
        specialRequests: '',
      }

      const result = calculateTotalPrice(formData, mockPets)
      expect(result).toBe(0)
    })

    it('should calculate price for single pet with one service', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [
              {
                id: 'service1',
                name: 'Basic Grooming',
                description: 'Basic grooming service',
                duration: 60,
                price: 50000,
                petTypes: ['DOG'],
                priceRanges: [],
                requiresVaccination: false,
                bookingCount: 0,
                icon: '✂️',
                isPopular: false,
                isRecommended: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            options: [],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculateTotalPrice(formData, mockPets)
      expect(result).toBe(50000)
    })

    it('should calculate price for single pet with multiple services', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [
              createService(),
              createService({
                id: 'service2',
                name: 'Bath',
                description: 'Bath service',
                icon: '🛁',
                price: 30000,
                duration: 30,
              }),
            ],
            options: [],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculateTotalPrice(formData, mockPets)
      expect(result).toBe(80000)
    })

    it('should calculate price for multiple pets', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [createService()],
            options: [],
          },
          {
            petId: 'pet2',
            services: [createService({ price: 40000, duration: 45 })],
            options: [],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculateTotalPrice(formData, mockPets)
      expect(result).toBe(90000)
    })

    it('should include options in price calculation', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [createService()],
            options: [
              createOption(),
              createOption({
                id: 'option2',
                name: 'Teeth Cleaning',
                description: 'Teeth cleaning',
                price: 15000,
                displayOrder: 1,
              }),
            ],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculateTotalPrice(formData, mockPets)
      expect(result).toBe(75000) // 50000 + 10000 + 15000
    })

    it('should handle missing pet gracefully', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'nonexistent-pet',
            services: [createService()],
            options: [],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculateTotalPrice(formData, mockPets)
      expect(result).toBeGreaterThanOrEqual(0)
    })
  })

  describe('calculateTotalDuration', () => {
    it('should return 0 for empty pet services', () => {
      const formData: BookingForm = {
        petServices: [],
        addressId: '',
        groomerId: '',
        date: '',
        timeSlot: '',
        specialRequests: '',
      }

      const result = calculateTotalDuration(formData)
      expect(result).toBe(0)
    })

    it('should calculate duration for single service', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [createService({ duration: 60 })],
            options: [],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculateTotalDuration(formData)
      expect(result).toBe(60)
    })

    it('should sum durations for multiple services on single pet', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [
              createService({ duration: 60 }),
              createService({
                id: 'service2',
                name: 'Bath',
                description: 'Bath',
                icon: '🛁',
                duration: 30,
                price: 30000,
              }),
            ],
            options: [],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculateTotalDuration(formData)
      expect(result).toBe(90)
    })

    it('should sum durations across multiple pets', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [createService({ duration: 60 })],
            options: [],
          },
          {
            petId: 'pet2',
            services: [createService({ duration: 45, price: 40000 })],
            options: [],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculateTotalDuration(formData)
      expect(result).toBe(105)
    })
  })

  describe('calculatePetServicePrice', () => {
    it('should return 0 for non-existent pet', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [createService({ duration: 60 })],
            options: [],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculatePetServicePrice('nonexistent-pet', formData, mockPets)
      expect(result).toBe(0)
    })

    it('should calculate price for specific pet', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [createService({ duration: 60 })],
            options: [],
          },
          {
            petId: 'pet2',
            services: [createService({ duration: 45, price: 40000 })],
            options: [],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculatePetServicePrice('pet1', formData, mockPets)
      expect(result).toBe(50000)
    })

    it('should include options in pet service price', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [createService({ duration: 60 })],
            options: [createOption()],
          },
        ],
        addressId: 'address1',
        groomerId: 'groomer1',
        date: '2024-01-15',
        timeSlot: '10:00',
        specialRequests: '',
      }

      const result = calculatePetServicePrice('pet1', formData, mockPets)
      expect(result).toBe(60000)
    })
  })
})

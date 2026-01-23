/**
 * Booking Validation Unit Tests
 *
 * Tests for validation functions used in booking flow
 */

import { describe, expect, it } from 'vitest'
import {
  canProceedToNextStep,
  getValidationMessage,
  hasPetServices,
  isPetSelected,
} from '../booking-validation'
import type { BookingForm } from '../../types/booking-form.types'
import type { Pet } from '@/hooks/usePets'
import type { ServiceData } from '@/data/services'

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

describe('booking-validation', () => {
  // Mock pets
  const mockPets: Pet[] = [
    {
      id: 'pet1',
      name: 'Max',
      customerId: 'customer1',
      type: 'DOG',
      breedId: 'breed1',
      breed: null,
      weight: 10,
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
      customerId: 'customer1',
      type: 'CAT',
      breedId: 'breed2',
      breed: null,
      weight: 5,
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

  describe('canProceedToNextStep', () => {
    describe('Step 1: Pet and Service Selection', () => {
      it('should return false when no pets are selected', () => {
        const formData: BookingForm = {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        expect(canProceedToNextStep(1, formData)).toBe(false)
      })

      it('should return false when pets are selected but no services', () => {
        const formData: BookingForm = {
          petServices: [{ petId: 'pet1', services: [], options: [] }],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        expect(canProceedToNextStep(1, formData)).toBe(false)
      })

      it('should return false when some pets have no services', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
            { petId: 'pet2', services: [], options: [] },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        expect(canProceedToNextStep(1, formData)).toBe(false)
      })

      it('should return true when all pets have services', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        expect(canProceedToNextStep(1, formData)).toBe(true)
      })
    })

    describe('Step 2: Address Selection', () => {
      it('should return false when no address is selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        expect(canProceedToNextStep(2, formData)).toBe(false)
      })

      it('should return true when address is selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: 'address1',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        expect(canProceedToNextStep(2, formData)).toBe(true)
      })
    })

    describe('Step 3: Date, Time, and Groomer Selection', () => {
      it('should return false when date is not selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: 'address1',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        expect(canProceedToNextStep(3, formData)).toBe(false)
      })

      it('should return false when groomer is not selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: 'address1',
          groomerId: '',
          date: '2024-01-15',
          timeSlot: '',
          specialRequests: '',
        }

        expect(canProceedToNextStep(3, formData)).toBe(false)
      })

      it('should return false when time slot is not selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: 'address1',
          groomerId: 'groomer1',
          date: '2024-01-15',
          timeSlot: '',
          specialRequests: '',
        }

        expect(canProceedToNextStep(3, formData)).toBe(false)
      })

      it('should return true when date, time, and groomer are all selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
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

        expect(canProceedToNextStep(3, formData)).toBe(true)
      })
    })

    describe('Step 4: Payment', () => {
      it('should always return true for payment step', () => {
        const formData: BookingForm = {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        expect(canProceedToNextStep(4, formData)).toBe(true)
      })
    })
  })

  describe('getValidationMessage', () => {
    describe('Step 1 Messages', () => {
      it('should return message when no pets are selected', () => {
        const formData: BookingForm = {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        const message = getValidationMessage(1, formData, mockPets)
        expect(message).toBe('반려동물을 선택해주세요.')
      })

      it('should return message with pet name when pet has no services', () => {
        const formData: BookingForm = {
          petServices: [{ petId: 'pet1', services: [], options: [] }],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        const message = getValidationMessage(1, formData, mockPets)
        expect(message).toContain('Max')
        expect(message).toContain('서비스를 선택해주세요')
      })

      it('should list multiple pets without services', () => {
        const formData: BookingForm = {
          petServices: [
            { petId: 'pet1', services: [], options: [] },
            { petId: 'pet2', services: [], options: [] },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        const message = getValidationMessage(1, formData, mockPets)
        expect(message).toContain('Max')
        expect(message).toContain('Luna')
      })

      it('should return empty string when validation passes', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        const message = getValidationMessage(1, formData, mockPets)
        expect(message).toBe('')
      })
    })

    describe('Step 2 Messages', () => {
      it('should return message when no address is selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        const message = getValidationMessage(2, formData, mockPets)
        expect(message).toBe('주소를 선택해주세요.')
      })

      it('should return empty string when address is selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: 'address1',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        const message = getValidationMessage(2, formData, mockPets)
        expect(message).toBe('')
      })
    })

    describe('Step 3 Messages', () => {
      it('should return date message when date is not selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: 'address1',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        }

        const message = getValidationMessage(3, formData, mockPets)
        expect(message).toBe('날짜를 선택해주세요.')
      })

      it('should return groomer message when groomer is not selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: 'address1',
          groomerId: '',
          date: '2024-01-15',
          timeSlot: '',
          specialRequests: '',
        }

        const message = getValidationMessage(3, formData, mockPets)
        expect(message).toBe('미용사를 선택해주세요.')
      })

      it('should return time message when time slot is not selected', () => {
        const formData: BookingForm = {
          petServices: [
            {
              petId: 'pet1',
              services: [createService()],
              options: [],
            },
          ],
          addressId: 'address1',
          groomerId: 'groomer1',
          date: '2024-01-15',
          timeSlot: '',
          specialRequests: '',
        }

        const message = getValidationMessage(3, formData, mockPets)
        expect(message).toBe('시간을 선택해주세요.')
      })
    })
  })

  describe('hasPetServices', () => {
    it('should return false for pet not in form data', () => {
      const formData: BookingForm = {
        petServices: [],
        addressId: '',
        groomerId: '',
        date: '',
        timeSlot: '',
        specialRequests: '',
      }

      expect(hasPetServices('pet1', formData)).toBe(false)
    })

    it('should return false for pet with no services', () => {
      const formData: BookingForm = {
        petServices: [{ petId: 'pet1', services: [], options: [] }],
        addressId: '',
        groomerId: '',
        date: '',
        timeSlot: '',
        specialRequests: '',
      }

      expect(hasPetServices('pet1', formData)).toBe(false)
    })

    it('should return true for pet with services', () => {
      const formData: BookingForm = {
        petServices: [
          {
            petId: 'pet1',
            services: [createService()],
            options: [],
          },
        ],
        addressId: '',
        groomerId: '',
        date: '',
        timeSlot: '',
        specialRequests: '',
      }

      expect(hasPetServices('pet1', formData)).toBe(true)
    })
  })

  describe('isPetSelected', () => {
    it('should return false for unselected pet', () => {
      const formData: BookingForm = {
        petServices: [],
        addressId: '',
        groomerId: '',
        date: '',
        timeSlot: '',
        specialRequests: '',
      }

      expect(isPetSelected('pet1', formData)).toBe(false)
    })

    it('should return true for selected pet', () => {
      const formData: BookingForm = {
        petServices: [{ petId: 'pet1', services: [], options: [] }],
        addressId: '',
        groomerId: '',
        date: '',
        timeSlot: '',
        specialRequests: '',
      }

      expect(isPetSelected('pet1', formData)).toBe(true)
    })
  })
})

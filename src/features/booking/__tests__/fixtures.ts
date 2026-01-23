/**
 * Shared test fixtures for booking feature tests
 * Centralizes mock data to follow DRY principle and ensure consistency
 */

import type { ServiceData } from '@/data/services'
import type { ServiceOption } from '@/features/booking/components/ui/service-option-selector'

/**
 * Mock pet data for testing (matching Prisma Pet type from @/hooks/usePets)
 * Note: Using a simplified type structure compatible with the Prisma Pet model
 */
export const mockPet = {
  id: 'pet1',
  name: 'Max',
  customerId: 'customer1',
  type: 'DOG' as const,
  breedId: 'breed1',
  breed: null,
  weight: 10,
  age: 3,
  birthDate: new Date('2021-01-01'),
  gender: 'MALE' as const,
  hairType: null,
  specialNeeds: null,
  vaccinationStatus: 'UP_TO_DATE' as const,
  vaccinationDate: new Date('2024-01-01'),
  isActive: true,
  termsAcception: true,
  images: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

/**
 * Mock service data for testing
 */
export const mockService: ServiceData = {
  id: 'service1',
  name: 'Basic Grooming',
  description: 'Basic grooming service',
  icon: '✂️',
  price: 50000,
  duration: 60,
  petTypes: ['DOG'],
  priceRanges: [],
  requiresVaccination: false,
  bookingCount: 0,
  isPopular: true,
  isRecommended: false,
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-01').toISOString(),
}

/**
 * Mock service option data for testing
 */
export const mockOption: ServiceOption = {
  id: 'option1',
  name: 'Nail Trim',
  description: 'Nail trimming service',
  price: 10000,
  displayOrder: 0,
}

/**
 * Creates a mock pet with custom overrides
 * @param overrides - Partial pet data to override defaults
 */
export function createMockPet(overrides: Partial<typeof mockPet> = {}): typeof mockPet {
  return {
    ...mockPet,
    ...overrides,
  }
}

/**
 * Creates a mock service with custom overrides
 * @param overrides - Partial service data to override defaults
 */
export function createMockService(overrides: Partial<ServiceData> = {}): ServiceData {
  return {
    ...mockService,
    ...overrides,
  }
}

/**
 * Creates a mock service option with custom overrides
 * @param overrides - Partial service option data to override defaults
 */
export function createMockOption(overrides: Partial<ServiceOption> = {}): ServiceOption {
  return {
    ...mockOption,
    ...overrides,
  }
}

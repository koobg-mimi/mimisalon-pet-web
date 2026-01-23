/**
 * Mock data for admin bookings tests
 *
 * Provides realistic booking data matching the API route types.
 * Used across all test files for consistency.
 */

import { BookingStatus } from '@mimisalon/shared'
import type {
  TransformedBooking,
  PaginationInfo,
  AdminBookingsGetResponse,
  UserInfo,
  ServiceInfo,
  BookingPetInfo,
  PaymentInfo,
  AddressInfo,
} from '@/app/api/admin/bookings/route'
import type { BookingStats } from '../../types/booking.types'

/**
 * Mock customer data
 */
export const mockCustomers: UserInfo[] = [
  {
    id: 'customer-1',
    name: '김철수',
    email: 'kim@example.com',
    phoneNumber: '01012345678',
  },
  {
    id: 'customer-2',
    name: '이영희',
    email: 'lee@example.com',
    phoneNumber: '01098765432',
  },
  {
    id: 'customer-3',
    name: '박민수',
    email: 'park@example.com',
    phoneNumber: '01055556666',
  },
]

/**
 * Mock groomer data
 */
export const mockGroomers: UserInfo[] = [
  {
    id: 'groomer-1',
    name: '최미용',
    email: 'choi@groomer.com',
    phoneNumber: '01011112222',
  },
  {
    id: 'groomer-2',
    name: '정미용',
    email: 'jung@groomer.com',
    phoneNumber: '01033334444',
  },
]

/**
 * Mock service data
 */
export const mockServices: ServiceInfo[] = [
  {
    service: {
      id: 'service-1',
      name: '기본 목욕',
    },
    price: 50000,
  },
  {
    service: {
      id: 'service-2',
      name: '전체 미용',
    },
    price: 100000,
  },
  {
    service: {
      id: 'service-3',
      name: '부분 미용',
    },
    price: 70000,
  },
]

/**
 * Mock address data
 */
export const mockAddresses: AddressInfo[] = [
  {
    id: 'address-1',
    street: '강남대로 123',
    city: '서울',
    state: '강남구',
    zipCode: '06000',
  },
  {
    id: 'address-2',
    street: '테헤란로 456',
    city: '서울',
    state: '강남구',
    zipCode: '06100',
  },
]

/**
 * Mock payment data
 */
export const mockPayments: PaymentInfo[] = [
  {
    id: 'payment-1',
    amount: 50000,
    method: 'CARD',
    status: 'COMPLETED',
    createdAt: '2025-10-30T10:00:00Z',
  },
  {
    id: 'payment-2',
    amount: 100000,
    method: 'CARD',
    status: 'COMPLETED',
    createdAt: '2025-10-31T14:00:00Z',
  },
]

/**
 * Mock pet breed data
 */
const mockBreeds = [
  {
    id: 'breed-1',
    name: '푸들',
    category: 'SMALL' as const,
    petType: 'DOG' as const,
    displayOrder: 1,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'breed-2',
    name: '골든 리트리버',
    category: 'LARGE' as const,
    petType: 'DOG' as const,
    displayOrder: 2,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'breed-3',
    name: '말티즈',
    category: 'SMALL' as const,
    petType: 'DOG' as const,
    displayOrder: 3,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
]

/**
 * Mock booking pets
 */
export const mockBookingPets: BookingPetInfo[] = [
  {
    pet: {
      id: 'pet-1',
      name: '뽀삐',
      type: 'DOG' as const,
      age: 3,
      weight: 5.5,
      birthDate: new Date('2022-01-01'),
      gender: 'FEMALE' as const,
      hairType: null,
      specialNeeds: null,
      vaccinationStatus: 'UP_TO_DATE' as const,
      vaccinationDate: new Date('2024-01-01'),
      isActive: true,
      termsAcception: false,
      breed: mockBreeds[0],
      breedId: 'breed-1',
      customerId: 'customer-1',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    services: [mockServices[0]],
  },
  {
    pet: {
      id: 'pet-2',
      name: '초코',
      type: 'DOG' as const,
      age: 2,
      weight: 28.0,
      birthDate: new Date('2023-01-01'),
      gender: 'MALE' as const,
      hairType: null,
      specialNeeds: null,
      vaccinationStatus: 'UP_TO_DATE' as const,
      vaccinationDate: new Date('2024-06-01'),
      isActive: true,
      termsAcception: false,
      breed: mockBreeds[1],
      breedId: 'breed-2',
      customerId: 'customer-2',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    services: [mockServices[1]],
  },
]

/**
 * Generate a mock booking with specific status
 */
export function createMockBooking(overrides: Partial<TransformedBooking> = {}): TransformedBooking {
  const defaultBooking: TransformedBooking = {
    id: `booking-${Date.now()}-${Math.random()}`,
    bookingNumber: `BK-2025-${Math.floor(Math.random() * 1000000)}`,
    customerId: mockCustomers[0].id,
    groomerId: mockGroomers[0].id,
    status: BookingStatus.GROOMER_CONFIRM_PENDING,
    serviceDate: '2025-11-05',
    startTime: '14:00',
    endTime: '16:00',
    totalAmount: 100000,
    paidAmount: 50000,
    additionalAmount: 0,
    paymentStatus: 'PARTIAL',
    notes: null,
    createdAt: '2025-10-30T10:00:00Z',
    updatedAt: '2025-10-30T10:00:00Z',
    customer: mockCustomers[0],
    groomer: mockGroomers[0],
    bookingPets: [mockBookingPets[0]],
    customerAddress: mockAddresses[0],
    payments: [mockPayments[0]],
  }

  return { ...defaultBooking, ...overrides }
}

/**
 * Pre-generated mock bookings with various statuses
 */
export const mockBookings: TransformedBooking[] = [
  // FIRST_PAYMENT_PENDING
  createMockBooking({
    id: 'booking-1',
    bookingNumber: 'BK-2025-000001',
    status: BookingStatus.FIRST_PAYMENT_PENDING,
    serviceDate: '2025-11-10',
    totalAmount: 50000,
    paidAmount: 0,
    paymentStatus: 'PENDING',
  }),

  // GROOMER_CONFIRM_PENDING
  createMockBooking({
    id: 'booking-2',
    bookingNumber: 'BK-2025-000002',
    status: BookingStatus.GROOMER_CONFIRM_PENDING,
    serviceDate: '2025-11-08',
    totalAmount: 100000,
    paidAmount: 50000,
  }),

  // GROOMER_CONFIRM
  createMockBooking({
    id: 'booking-3',
    bookingNumber: 'BK-2025-000003',
    status: BookingStatus.GROOMER_CONFIRM,
    serviceDate: '2025-11-07',
    customerId: mockCustomers[1].id,
    customer: mockCustomers[1],
    totalAmount: 70000,
    paidAmount: 70000,
    paymentStatus: 'COMPLETED',
  }),

  // WORK_IN_PROGRESS
  createMockBooking({
    id: 'booking-4',
    bookingNumber: 'BK-2025-000004',
    status: BookingStatus.WORK_IN_PROGRESS,
    serviceDate: '2025-11-02',
    totalAmount: 100000,
    paidAmount: 100000,
    paymentStatus: 'COMPLETED',
  }),

  // SERVICE_COMPLETED
  createMockBooking({
    id: 'booking-5',
    bookingNumber: 'BK-2025-000005',
    status: BookingStatus.SERVICE_COMPLETED,
    serviceDate: '2025-10-30',
    totalAmount: 150000,
    paidAmount: 150000,
    paymentStatus: 'COMPLETED',
    endTime: '16:00',
  }),

  // SERVICE_CANCELLED
  createMockBooking({
    id: 'booking-6',
    bookingNumber: 'BK-2025-000006',
    status: BookingStatus.SERVICE_CANCELLED,
    serviceDate: '2025-10-28',
    customerId: mockCustomers[2].id,
    customer: mockCustomers[2],
    totalAmount: 50000,
    paidAmount: 0,
    paymentStatus: 'CANCELLED',
  }),

  // ADDITIONAL_PAYMENT_PENDING
  createMockBooking({
    id: 'booking-7',
    bookingNumber: 'BK-2025-000007',
    status: BookingStatus.ADDITIONAL_PAYMENT_PENDING,
    serviceDate: '2025-11-06',
    totalAmount: 120000,
    paidAmount: 50000,
    additionalAmount: 20000,
    paymentStatus: 'PARTIAL',
  }),

  // ADDITIONAL_PAYMENT_COMPLETE
  createMockBooking({
    id: 'booking-8',
    bookingNumber: 'BK-2025-000008',
    status: BookingStatus.ADDITIONAL_PAYMENT_COMPLETE,
    serviceDate: '2025-11-05',
    totalAmount: 130000,
    paidAmount: 130000,
    additionalAmount: 30000,
    paymentStatus: 'COMPLETED',
  }),

  // FIRST_PAYMENT_VERIFY
  createMockBooking({
    id: 'booking-9',
    bookingNumber: 'BK-2025-000009',
    status: BookingStatus.FIRST_PAYMENT_VERIFY,
    serviceDate: '2025-11-09',
    totalAmount: 80000,
    paidAmount: 40000,
    paymentStatus: 'VERIFYING',
  }),

  // BOOKING_FAILED
  createMockBooking({
    id: 'booking-10',
    bookingNumber: 'BK-2025-000010',
    status: BookingStatus.BOOKING_FAILED,
    serviceDate: '2025-10-25',
    totalAmount: 60000,
    paidAmount: 0,
    paymentStatus: 'FAILED',
    notes: 'Payment failed',
  }),
]

/**
 * Mock pagination info
 */
export const mockPaginationInfo: PaginationInfo = {
  page: 1,
  totalPages: 3,
  totalCount: 150,
  limit: 50,
  hasNext: true,
  hasPrev: false,
}

/**
 * Mock admin bookings API response
 */
export const mockAdminBookingsResponse: AdminBookingsGetResponse = {
  bookings: mockBookings,
  pagination: mockPaginationInfo,
}

/**
 * Calculate stats from bookings
 */
export function calculateMockStats(bookings: TransformedBooking[]): BookingStats {
  const totalBookings = bookings.length

  const pendingBookings = bookings.filter(
    (b) =>
      b.status === BookingStatus.FIRST_PAYMENT_PENDING ||
      b.status === BookingStatus.FIRST_PAYMENT_VERIFY ||
      b.status === BookingStatus.GROOMER_CONFIRM_PENDING ||
      b.status === BookingStatus.ADDITIONAL_PAYMENT_PENDING
  ).length

  const confirmedBookings = bookings.filter(
    (b) =>
      b.status === BookingStatus.GROOMER_CONFIRM ||
      b.status === BookingStatus.ADDITIONAL_PAYMENT_COMPLETE
  ).length

  const completedBookings = bookings.filter(
    (b) => b.status === BookingStatus.SERVICE_COMPLETED
  ).length

  const cancelledBookings = bookings.filter(
    (b) => b.status === BookingStatus.SERVICE_CANCELLED
  ).length

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.paidAmount, 0)

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue,
  }
}

/**
 * Pre-calculated mock stats
 */
export const mockBookingStats: BookingStats = calculateMockStats(mockBookings)

/**
 * Generate a page of bookings for pagination testing
 */
export function generateBookingsPage(
  page: number,
  pageSize: number = 50,
  totalCount: number = 150
): AdminBookingsGetResponse {
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalCount)

  // Generate bookings for this page
  const pageBookings = mockBookings.slice(
    startIndex % mockBookings.length,
    endIndex % mockBookings.length
  )

  // If we need more bookings than available in mockBookings, repeat them
  while (pageBookings.length < Math.min(pageSize, totalCount - startIndex)) {
    const index = pageBookings.length % mockBookings.length
    pageBookings.push(
      createMockBooking({
        ...mockBookings[index],
        id: `booking-${startIndex + pageBookings.length}`,
        bookingNumber: `BK-2025-${String(startIndex + pageBookings.length).padStart(6, '0')}`,
      })
    )
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return {
    bookings: pageBookings,
    pagination: {
      page,
      limit: pageSize,
      totalPages,
      totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

/**
 * Filter bookings by search query
 */
export function filterBookingsBySearch(
  bookings: TransformedBooking[],
  searchQuery: string
): TransformedBooking[] {
  if (!searchQuery) return bookings

  const query = searchQuery.toLowerCase()
  return bookings.filter(
    (b) =>
      b.bookingNumber.toLowerCase().includes(query) ||
      b.customer?.name?.toLowerCase().includes(query) ||
      b.customer?.phoneNumber?.includes(query)
  )
}

/**
 * Filter bookings by status
 */
export function filterBookingsByStatus(
  bookings: TransformedBooking[],
  status: string
): TransformedBooking[] {
  if (status === 'ALL' || !status) return bookings
  return bookings.filter((b) => b.status === status)
}

/**
 * Filter bookings by date
 */
export function filterBookingsByDate(
  bookings: TransformedBooking[],
  dateFilter: string
): TransformedBooking[] {
  if (!dateFilter) return bookings
  return bookings.filter((b) => b.serviceDate === dateFilter)
}

/**
 * Sort bookings
 */
export function sortBookings(
  bookings: TransformedBooking[],
  sortBy: 'date' | 'status' | 'amount',
  sortOrder: 'asc' | 'desc'
): TransformedBooking[] {
  const sorted = [...bookings].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'date':
        comparison = a.serviceDate.localeCompare(b.serviceDate)
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      case 'amount':
        comparison = a.totalAmount - b.totalAmount
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  return sorted
}

/**
 * Mock data for admin groomers tests
 *
 * Provides realistic groomer data matching the API route types.
 * Used across all test files for consistency.
 */

import type { AdminGroomerInfo, AdminGroomersGetResponse } from '@/app/api/admin/groomers/route'
import type { GroomerStats } from '../../types/groomer.types'

/**
 * Mock groomer data with realistic values
 */
export const mockGroomers: AdminGroomerInfo[] = [
  {
    id: 'groomer-1',
    userId: 'user-1',
    user: {
      id: 'user-1',
      email: 'choi.groomer@mimisalon.com',
      name: '최미용',
      phoneNumber: '01012345678',
      isActive: true,
      createdAt: '2024-01-15T09:00:00Z',
      lastLoginAt: null,
    },
    bio: null,
    experience: 5,
    certifications: [
      { name: 'Professional Pet Groomer Certification', year: 2019 },
      { name: 'Advanced Styling Certificate', year: 2021 },
    ],
    isActive: true,
    rating: 4.8,
    totalReviews: 156,
    totalBookings: 342,
    monthlyRevenue: 4500000,
    profileImage: 'https://example.com/profiles/groomer1.jpg',
    portfolio: [{ imageUrl: 'https://example.com/portfolio/1.jpg', description: 'Poodle styling' }],
    birthDate: '1990-05-20T00:00:00Z',
    availableLocations: [
      {
        id: 'location-1',
        name: '강남구',
        address: '서울시 강남구',
        description: '강남 지역',
        centerLat: 37.4979,
        centerLng: 127.0276,
        radiusKm: 5.0,
        isActive: true,
      },
    ],
    services: [
      { id: 'service-1', name: '기본 목욕', price: 50000 },
      { id: 'service-2', name: '전체 미용', price: 100000 },
    ],
    bankAccount: {
      bankName: '우리은행',
      accountNumber: '1002-123-456789',
      accountHolder: '최미용',
    },
    commissionGrade: {
      id: 'grade-1',
      name: 'Gold',
      commissionRate: 0.85,
    },
    lastActivityAt: '2025-11-02T14:30:00Z',
  },
  {
    id: 'groomer-2',
    userId: 'user-2',
    user: {
      id: 'user-2',
      email: 'park.stylist@mimisalon.com',
      name: '박스타일',
      phoneNumber: '01098765432',
      isActive: true,
      createdAt: '2024-03-20T10:30:00Z',
      lastLoginAt: null,
    },
    bio: null,
    experience: 3,
    certifications: [{ name: 'Pet Grooming Certificate', year: 2022 }],
    isActive: true,
    rating: 4.6,
    totalReviews: 89,
    totalBookings: 178,
    monthlyRevenue: 2800000,
    profileImage: 'https://example.com/profiles/groomer2.jpg',
    portfolio: [],
    birthDate: '1995-08-10T00:00:00Z',
    availableLocations: [
      {
        id: 'location-2',
        name: '서초구',
        address: '서울시 서초구',
        description: '서초 지역',
        centerLat: 37.4836,
        centerLng: 127.0327,
        radiusKm: 4.0,
        isActive: true,
      },
    ],
    services: [{ id: 'service-1', name: '기본 목욕', price: 50000 }],
    bankAccount: {
      bankName: '국민은행',
      accountNumber: '123-456-789012',
      accountHolder: '박스타일',
    },
    commissionGrade: {
      id: 'grade-2',
      name: 'Silver',
      commissionRate: 0.8,
    },
    lastActivityAt: '2025-11-01T16:45:00Z',
  },
  {
    id: 'groomer-3',
    userId: 'user-3',
    user: {
      id: 'user-3',
      email: 'kim.expert@mimisalon.com',
      name: '김전문',
      phoneNumber: '01055556666',
      isActive: true,
      createdAt: '2023-11-05T08:15:00Z',
      lastLoginAt: null,
    },
    bio: null,
    experience: 8,
    certifications: [
      { name: 'Master Pet Groomer', year: 2017 },
      { name: 'Cat Grooming Specialist', year: 2018 },
      { name: 'Show Dog Grooming Expert', year: 2020 },
    ],
    isActive: true,
    rating: 4.9,
    totalReviews: 267,
    totalBookings: 521,
    monthlyRevenue: 6200000,
    profileImage: 'https://example.com/profiles/groomer3.jpg',
    portfolio: [
      { imageUrl: 'https://example.com/portfolio/3-1.jpg', description: 'Show dog preparation' },
      { imageUrl: 'https://example.com/portfolio/3-2.jpg', description: 'Cat grooming' },
    ],
    birthDate: '1987-03-15T00:00:00Z',
    availableLocations: [
      {
        id: 'location-1',
        name: '강남구',
        address: '서울시 강남구',
        description: '강남 지역',
        centerLat: 37.4979,
        centerLng: 127.0276,
        radiusKm: 5.0,
        isActive: true,
      },
      {
        id: 'location-3',
        name: '송파구',
        address: '서울시 송파구',
        description: '송파 지역',
        centerLat: 37.5145,
        centerLng: 127.1058,
        radiusKm: 6.0,
        isActive: true,
      },
    ],
    services: [
      { id: 'service-1', name: '기본 목욕', price: 50000 },
      { id: 'service-2', name: '전체 미용', price: 100000 },
      { id: 'service-3', name: '부분 미용', price: 70000 },
    ],
    bankAccount: {
      bankName: '신한은행',
      accountNumber: '110-456-789012',
      accountHolder: '김전문',
    },
    commissionGrade: {
      id: 'grade-1',
      name: 'Gold',
      commissionRate: 0.85,
    },
    lastActivityAt: '2025-11-03T09:20:00Z',
  },
  {
    id: 'groomer-4',
    userId: 'user-4',
    user: {
      id: 'user-4',
      email: 'lee.newbie@mimisalon.com',
      name: '이신입',
      phoneNumber: '01077778888',
      isActive: true,
      createdAt: '2025-09-01T11:00:00Z',
      lastLoginAt: null,
    },
    bio: null,
    experience: 1,
    certifications: [{ name: 'Basic Pet Grooming', year: 2025 }],
    isActive: true,
    rating: 4.3,
    totalReviews: 12,
    totalBookings: 23,
    monthlyRevenue: 980000,
    profileImage: null,
    portfolio: [],
    birthDate: '1998-11-25T00:00:00Z',
    availableLocations: [
      {
        id: 'location-2',
        name: '서초구',
        address: '서울시 서초구',
        description: '서초 지역',
        centerLat: 37.4836,
        centerLng: 127.0327,
        radiusKm: 4.0,
        isActive: true,
      },
    ],
    services: [{ id: 'service-1', name: '기본 목욕', price: 50000 }],
    bankAccount: {
      bankName: '하나은행',
      accountNumber: '789-123456-78901',
      accountHolder: '이신입',
    },
    commissionGrade: {
      id: 'grade-3',
      name: 'Bronze',
      commissionRate: 0.75,
    },
    lastActivityAt: '2025-10-30T13:15:00Z',
  },
  {
    id: 'groomer-5',
    userId: 'user-5',
    user: {
      id: 'user-5',
      email: 'jung.inactive@mimisalon.com',
      name: '정휴직',
      phoneNumber: '01044445555',
      isActive: false,
      createdAt: '2024-06-10T14:20:00Z',
      lastLoginAt: null,
    },
    bio: null,
    experience: 4,
    certifications: [{ name: 'Professional Pet Groomer Certification', year: 2020 }],
    isActive: false,
    rating: 4.5,
    totalReviews: 134,
    totalBookings: 289,
    monthlyRevenue: 0,
    profileImage: 'https://example.com/profiles/groomer5.jpg',
    portfolio: [],
    birthDate: '1992-07-08T00:00:00Z',
    availableLocations: [
      {
        id: 'location-1',
        name: '강남구',
        address: '서울시 강남구',
        description: '강남 지역',
        centerLat: 37.4979,
        centerLng: 127.0276,
        radiusKm: 5.0,
        isActive: true,
      },
    ],
    services: [],
    bankAccount: {
      bankName: '기업은행',
      accountNumber: '456-789012-34567',
      accountHolder: '정휴직',
    },
    commissionGrade: {
      id: 'grade-2',
      name: 'Silver',
      commissionRate: 0.8,
    },
    lastActivityAt: '2025-09-15T10:30:00Z',
  },
  {
    id: 'groomer-6',
    userId: 'user-6',
    user: {
      id: 'user-6',
      email: 'kang.pro@mimisalon.com',
      name: '강프로',
      phoneNumber: '01011112222',
      isActive: true,
      createdAt: '2024-02-14T09:45:00Z',
      lastLoginAt: null,
    },
    bio: null,
    experience: 6,
    certifications: [
      { name: 'Advanced Pet Grooming', year: 2019 },
      { name: 'Breed-Specific Styling', year: 2021 },
    ],
    isActive: true,
    rating: 4.7,
    totalReviews: 198,
    totalBookings: 412,
    monthlyRevenue: 5100000,
    profileImage: 'https://example.com/profiles/groomer6.jpg',
    portfolio: [
      { imageUrl: 'https://example.com/portfolio/6.jpg', description: 'Breed-specific cuts' },
    ],
    birthDate: '1989-12-30T00:00:00Z',
    availableLocations: [
      {
        id: 'location-3',
        name: '송파구',
        address: '서울시 송파구',
        description: '송파 지역',
        centerLat: 37.5145,
        centerLng: 127.1058,
        radiusKm: 6.0,
        isActive: true,
      },
    ],
    services: [
      { id: 'service-1', name: '기본 목욕', price: 50000 },
      { id: 'service-2', name: '전체 미용', price: 100000 },
    ],
    bankAccount: {
      bankName: '농협은행',
      accountNumber: '302-0123-4567-89',
      accountHolder: '강프로',
    },
    commissionGrade: {
      id: 'grade-1',
      name: 'Gold',
      commissionRate: 0.85,
    },
    lastActivityAt: '2025-11-02T17:00:00Z',
  },
  {
    id: 'groomer-7',
    userId: 'user-7',
    user: {
      id: 'user-7',
      email: 'yoon.mobile@mimisalon.com',
      name: '윤출장',
      phoneNumber: '01033334444',
      isActive: true,
      createdAt: '2024-07-22T13:30:00Z',
      lastLoginAt: null,
    },
    bio: null,
    experience: 7,
    certifications: [
      { name: 'Mobile Grooming Specialist', year: 2018 },
      { name: 'Large Breed Expert', year: 2020 },
    ],
    isActive: true,
    rating: 4.8,
    totalReviews: 223,
    totalBookings: 478,
    monthlyRevenue: 5700000,
    profileImage: 'https://example.com/profiles/groomer7.jpg',
    portfolio: [
      { imageUrl: 'https://example.com/portfolio/7-1.jpg', description: 'Mobile setup' },
      { imageUrl: 'https://example.com/portfolio/7-2.jpg', description: 'Large breed grooming' },
    ],
    birthDate: '1988-04-18T00:00:00Z',
    availableLocations: [
      {
        id: 'location-1',
        name: '강남구',
        address: '서울시 강남구',
        description: '강남 지역',
        centerLat: 37.4979,
        centerLng: 127.0276,
        radiusKm: 5.0,
        isActive: true,
      },
      {
        id: 'location-2',
        name: '서초구',
        address: '서울시 서초구',
        description: '서초 지역',
        centerLat: 37.4836,
        centerLng: 127.0327,
        radiusKm: 4.0,
        isActive: true,
      },
      {
        id: 'location-3',
        name: '송파구',
        address: '서울시 송파구',
        description: '송파 지역',
        centerLat: 37.5145,
        centerLng: 127.1058,
        radiusKm: 6.0,
        isActive: true,
      },
    ],
    services: [
      { id: 'service-1', name: '기본 목욕', price: 50000 },
      { id: 'service-2', name: '전체 미용', price: 100000 },
      { id: 'service-3', name: '부분 미용', price: 70000 },
    ],
    bankAccount: {
      bankName: '카카오뱅크',
      accountNumber: '3333-01-2345678',
      accountHolder: '윤출장',
    },
    commissionGrade: {
      id: 'grade-1',
      name: 'Gold',
      commissionRate: 0.85,
    },
    lastActivityAt: '2025-11-03T11:45:00Z',
  },
  {
    id: 'groomer-8',
    userId: 'user-8',
    user: {
      id: 'user-8',
      email: 'han.parttime@mimisalon.com',
      name: '한파트',
      phoneNumber: '01066667777',
      isActive: true,
      createdAt: '2025-08-15T10:00:00Z',
      lastLoginAt: null,
    },
    bio: null,
    experience: 2,
    certifications: [{ name: 'Pet Grooming Certificate', year: 2023 }],
    isActive: true,
    rating: 4.4,
    totalReviews: 34,
    totalBookings: 67,
    monthlyRevenue: 1450000,
    profileImage: null,
    portfolio: [],
    birthDate: '1996-09-22T00:00:00Z',
    availableLocations: [
      {
        id: 'location-2',
        name: '서초구',
        address: '서울시 서초구',
        description: '서초 지역',
        centerLat: 37.4836,
        centerLng: 127.0327,
        radiusKm: 4.0,
        isActive: true,
      },
    ],
    services: [
      { id: 'service-1', name: '기본 목욕', price: 50000 },
      { id: 'service-3', name: '부분 미용', price: 70000 },
    ],
    bankAccount: {
      bankName: '토스뱅크',
      accountNumber: '1000-1234-5678',
      accountHolder: '한파트',
    },
    commissionGrade: {
      id: 'grade-3',
      name: 'Bronze',
      commissionRate: 0.75,
    },
    lastActivityAt: '2025-11-01T15:20:00Z',
  },
  {
    id: 'groomer-9',
    userId: 'user-9',
    user: {
      id: 'user-9',
      email: 'oh.suspended@mimisalon.com',
      name: '오정지',
      phoneNumber: '01088889999',
      isActive: false,
      createdAt: '2024-05-12T12:00:00Z',
      lastLoginAt: null,
    },
    bio: null,
    experience: 3,
    certifications: [{ name: 'Professional Pet Groomer Certification', year: 2021 }],
    isActive: false,
    rating: 3.8,
    totalReviews: 87,
    totalBookings: 156,
    monthlyRevenue: 0,
    profileImage: 'https://example.com/profiles/groomer9.jpg',
    portfolio: [],
    birthDate: '1993-06-05T00:00:00Z',
    availableLocations: [],
    services: [],
    bankAccount: null,
    commissionGrade: {
      id: 'grade-2',
      name: 'Silver',
      commissionRate: 0.8,
    },
    lastActivityAt: '2025-08-20T14:10:00Z',
  },
  {
    id: 'groomer-10',
    userId: 'user-10',
    user: {
      id: 'user-10',
      email: 'seo.excellent@mimisalon.com',
      name: '서우수',
      phoneNumber: '01022223333',
      isActive: true,
      createdAt: '2023-12-01T08:30:00Z',
      lastLoginAt: null,
    },
    bio: null,
    experience: 9,
    certifications: [
      { name: 'Master Pet Groomer', year: 2016 },
      { name: 'International Grooming Certificate', year: 2019 },
      { name: 'Competition Judge Certificate', year: 2022 },
    ],
    isActive: true,
    rating: 5.0,
    totalReviews: 312,
    totalBookings: 678,
    monthlyRevenue: 7800000,
    profileImage: 'https://example.com/profiles/groomer10.jpg',
    portfolio: [
      { imageUrl: 'https://example.com/portfolio/10-1.jpg', description: 'Award-winning styles' },
      { imageUrl: 'https://example.com/portfolio/10-2.jpg', description: 'Competition work' },
      { imageUrl: 'https://example.com/portfolio/10-3.jpg', description: 'Celebrity clients' },
    ],
    birthDate: '1986-02-14T00:00:00Z',
    availableLocations: [
      {
        id: 'location-1',
        name: '강남구',
        address: '서울시 강남구',
        description: '강남 지역',
        centerLat: 37.4979,
        centerLng: 127.0276,
        radiusKm: 5.0,
        isActive: true,
      },
    ],
    services: [
      { id: 'service-1', name: '기본 목욕', price: 50000 },
      { id: 'service-2', name: '전체 미용', price: 100000 },
      { id: 'service-3', name: '부분 미용', price: 70000 },
    ],
    bankAccount: {
      bankName: '우리은행',
      accountNumber: '1002-987-654321',
      accountHolder: '서우수',
    },
    commissionGrade: {
      id: 'grade-1',
      name: 'Gold',
      commissionRate: 0.85,
    },
    lastActivityAt: '2025-11-03T10:00:00Z',
  },
]

/**
 * Generate a mock groomer with specific overrides
 */
export function createMockGroomer(overrides: Partial<AdminGroomerInfo> = {}): AdminGroomerInfo {
  const defaultGroomer: AdminGroomerInfo = {
    id: `groomer-${Date.now()}-${Math.random()}`,
    userId: `user-${Date.now()}-${Math.random()}`,
    user: {
      id: `user-${Date.now()}-${Math.random()}`,
      email: `groomer${Math.floor(Math.random() * 1000)}@mimisalon.com`,
      name: `테스트 미용사 ${Math.floor(Math.random() * 100)}`,
      phoneNumber: `010${Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, '0')}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    },
    bio: null,
    experience: Math.floor(Math.random() * 10),
    certifications: [],
    isActive: true,
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    totalReviews: Math.floor(Math.random() * 100),
    totalBookings: Math.floor(Math.random() * 200),
    monthlyRevenue: Math.floor(Math.random() * 5000000),
    profileImage: null,
    portfolio: [],
    birthDate: null,
    availableLocations: [],
    services: [],
    bankAccount: null,
    commissionGrade: null,
    lastActivityAt: new Date().toISOString(),
  }

  return { ...defaultGroomer, ...overrides }
}

/**
 * Filter groomers by search query
 */
export function filterGroomersBySearch(
  groomers: AdminGroomerInfo[],
  searchQuery: string
): AdminGroomerInfo[] {
  if (!searchQuery) return groomers

  const query = searchQuery.toLowerCase()
  return groomers.filter(
    (g) =>
      g.user.name?.toLowerCase().includes(query) ||
      g.user.email?.toLowerCase().includes(query) ||
      g.user.phoneNumber?.includes(query)
  )
}

/**
 * Filter groomers by status
 */
export function filterGroomersByStatus(
  groomers: AdminGroomerInfo[],
  status: string
): AdminGroomerInfo[] {
  if (status === 'ALL' || !status) return groomers
  return groomers.filter((g) => (status === 'ACTIVE' ? g.isActive : !g.isActive))
}

/**
 * Filter groomers by location
 */
export function filterGroomersByLocation(
  groomers: AdminGroomerInfo[],
  locationId: string
): AdminGroomerInfo[] {
  if (locationId === 'ALL' || !locationId) return groomers
  return groomers.filter((g) => g.availableLocations.some((loc) => loc.id === locationId))
}

/**
 * Sort groomers
 */
export function sortGroomers(
  groomers: AdminGroomerInfo[],
  sortBy: 'name' | 'rating' | 'revenue' | 'bookings' | 'joinDate',
  sortOrder: 'asc' | 'desc'
): AdminGroomerInfo[] {
  const sorted = [...groomers].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'name':
        comparison = (a.user.name || '').localeCompare(b.user.name || '')
        break
      case 'rating':
        comparison = a.rating - b.rating
        break
      case 'revenue':
        comparison = a.monthlyRevenue - b.monthlyRevenue
        break
      case 'bookings':
        comparison = a.totalBookings - b.totalBookings
        break
      case 'joinDate':
        comparison = a.user.createdAt.localeCompare(b.user.createdAt)
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  return sorted
}

/**
 * Calculate stats from groomers
 */
export function calculateMockStats(groomers: AdminGroomerInfo[]): GroomerStats {
  const totalGroomers = groomers.length
  const activeGroomers = groomers.filter((g) => g.isActive).length
  const inactiveGroomers = groomers.filter((g) => !g.isActive).length

  // Calculate average rating
  const ratings = groomers.map((g) => g.rating)
  const averageRating =
    ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

  // Calculate monthly stats (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // For mock data, we use monthlyRevenue and estimate bookings
  const totalRevenueThisMonth = groomers.reduce((sum, g) => sum + g.monthlyRevenue, 0)
  const totalBookingsThisMonth = groomers.reduce((sum, g) => {
    // Estimate 15% of total bookings are in current month for active groomers
    return sum + (g.isActive ? Math.floor(g.totalBookings * 0.15) : 0)
  }, 0)

  return {
    totalGroomers,
    activeGroomers,
    inactiveGroomers,
    averageRating: Number(averageRating.toFixed(1)),
    totalBookingsThisMonth,
    totalRevenueThisMonth,
  }
}

/**
 * Pre-calculated mock stats
 */
export const mockGroomerStats: GroomerStats = calculateMockStats(mockGroomers)

/**
 * Generate a page of groomers for pagination testing
 */
export function generateGroomersPage(
  page: number,
  pageSize: number = 20,
  totalCount: number = 100
): AdminGroomersGetResponse {
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalCount)

  // Generate groomers for this page
  const pageGroomers = mockGroomers.slice(
    startIndex % mockGroomers.length,
    endIndex % mockGroomers.length
  )

  // If we need more groomers than available in mockGroomers, repeat them
  while (pageGroomers.length < Math.min(pageSize, totalCount - startIndex)) {
    const index = pageGroomers.length % mockGroomers.length
    pageGroomers.push(
      createMockGroomer({
        ...mockGroomers[index],
        id: `groomer-${startIndex + pageGroomers.length}`,
        userId: `user-${startIndex + pageGroomers.length}`,
      })
    )
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return {
    groomers: pageGroomers,
    totalCount,
    totalPages,
    currentPage: page,
  }
}

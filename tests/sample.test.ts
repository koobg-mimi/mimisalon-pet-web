/**
 * Sample test demonstrating Prisma mocking with Vitest
 * Official pattern from: https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
 */
import { expect, test, vi } from 'vitest'
import prisma from '../src/lib/__mocks__/prisma'

// Mock the Prisma module - Vitest will automatically use __mocks__/prisma.ts
vi.mock('../src/lib/prisma')

test('should create a user', async () => {
  const newUser = { email: 'user@prisma.io', name: 'Prisma Fan' }
  const mockDate = new Date('2024-01-01T00:00:00.000Z')

  // Mock the create operation to return user with id
  prisma.user.create.mockResolvedValue({
    id: '1',
    email: newUser.email,
    name: newUser.name,
    emailVerified: null,
    image: null,
    password: null,
    phoneNumber: null,
    phoneNumberVerified: true,
    role: 'CUSTOMER',
    notificationsEnabled: true,
    createdAt: mockDate,
    updatedAt: mockDate,
  })

  const user = await prisma.user.create({ data: newUser })

  expect(user).toStrictEqual({
    id: '1',
    email: newUser.email,
    name: newUser.name,
    emailVerified: null,
    image: null,
    password: null,
    phoneNumber: null,
    phoneNumberVerified: true,
    role: 'CUSTOMER',
    notificationsEnabled: true,
    createdAt: mockDate,
    updatedAt: mockDate,
  })
})

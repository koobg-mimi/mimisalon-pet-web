/**
 * Prisma Client Mock for Vitest
 * Official pattern from: https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o
 *
 * This mock automatically replaces the real Prisma Client when vi.mock() is called.
 * mockDeep ensures all properties, even deeply nested ones, are mocked.
 */
import { PrismaClient } from '@prisma/client'
import { beforeEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

beforeEach(() => {
  mockReset(prisma)
})

const prisma = mockDeep<PrismaClient>()
export default prisma

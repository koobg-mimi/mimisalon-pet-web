import { PrismaClient } from '@mimisalon/shared'
import { env } from './env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [],
  })

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

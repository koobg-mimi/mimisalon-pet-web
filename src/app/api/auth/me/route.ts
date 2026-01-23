import auth from '@/lib/auth'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma, Prisma } from '@mimisalon/shared'

/**
 * User query result from Prisma
 */
export type UserResponse = Prisma.UserGetPayload<{
  select: {
    id: true
    email: true
    name: true
    phoneNumber: true
    role: true
    image: true
    emailVerified: true
    phoneNumberVerified: true
    createdAt: true
    updatedAt: true
    groomerProfile: {
      select: {
        isActive: true
        isSettlementActive: true
        settlementCycle: true
        bankName: true
        bankAccountNumber: true
      }
    }
  }
}>

interface ErrorResponse {
  error: string
}

export async function GET(): Promise<NextResponse<UserResponse | ErrorResponse> | Response> {
  try {
    // Get the current session
    const session = await auth.api.getSession({ headers: await headers() })

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to access this resource' },
        { status: 401 }
      )
    }

    // Fetch complete user data from database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        role: true,
        image: true,
        emailVerified: true,
        phoneNumberVerified: true,
        createdAt: true,
        updatedAt: true,
        // Include groomer profile if user is a groomer
        groomerProfile: {
          select: {
            isActive: true,
            isSettlementActive: true,
            settlementCycle: true,
            bankName: true,
            bankAccountNumber: true,
          },
        },
      },
    })

    // Handle case where user exists in session but not in database
    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

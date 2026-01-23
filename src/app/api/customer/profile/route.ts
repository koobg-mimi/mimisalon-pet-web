import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'

// ============================================
// Type Definitions
// ============================================

/**
 * Request schema for updating customer profile
 */
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  phone: z
    .string()
    .regex(
      /^(\+82|0)(1[0-9]|2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|70)[0-9]{3,4}[0-9]{4}$/,
      'Invalid Korean phone number format'
    )
    .optional(),
})

/**
 * Request type for updating customer profile
 */
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>

/**
 * Response type for customer profile (with addresses)
 */
export type ProfileResponse = Prisma.UserGetPayload<{
  select: {
    id: true
    name: true
    email: true
    phoneNumber: true
    image: true
    role: true
    createdAt: true
    updatedAt: true
    addresses: true
  }
}>

/**
 * Response type for profile update (without addresses)
 */
export type ProfileUpdateResponse = Prisma.UserGetPayload<{
  select: {
    id: true
    name: true
    email: true
    phoneNumber: true
    image: true
    role: true
    createdAt: true
    updatedAt: true
  }
}>

// ============================================
// API Handlers
// ============================================

/**
 * GET /api/customer/profile - Get customer profile
 */
export async function GET(): Promise<NextResponse<ProfileResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' } as never, { status: 401 })
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' } as never, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' } as never, { status: 404 })
    }

    return NextResponse.json<ProfileResponse>(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' } as never, { status: 500 })
  }
}

/**
 * PUT /api/customer/profile - Update customer profile
 */
export async function PUT(request: NextRequest): Promise<NextResponse<ProfileUpdateResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' } as never, { status: 401 })
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' } as never, { status: 403 })
    }

    const body: unknown = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: validatedData.name,
        phoneNumber: validatedData.phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json<ProfileUpdateResponse>(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues } as never, {
        status: 400,
      })
    }
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' } as never, { status: 500 })
  }
}

import { NextResponse, NextRequest } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma, Prisma } from '@mimisalon/shared'
import { z } from 'zod'

// Input validation schema for PATCH
const adminProfileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
})

export type AdminProfileUpdateInput = z.infer<typeof adminProfileUpdateSchema>

// Response types using Prisma Payload
type AdminProfilePayload = Prisma.UserGetPayload<{
  select: {
    id: true
    name: true
    email: true
    phoneNumber: true
    role: true
    image: true
    createdAt: true
    updatedAt: true
  }
}>

export interface AdminProfile {
  id: string
  name: string
  email: string
  phoneNumber: string | null
  address: null
  dateOfBirth: null
  profileImage: string | null
  role: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt: null
}

export type AdminProfileGetResponse = AdminProfile
export type AdminProfilePatchResponse = AdminProfile

interface ErrorResponse {
  error: string
}

export async function GET(): Promise<NextResponse<AdminProfileGetResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the admin user profile
    const adminProfile = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Add any additional fields that might be available in the User model
      },
    })

    if (!adminProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Format the response to match the frontend interface
    const formattedProfile = {
      id: adminProfile.id,
      name: adminProfile.name || '',
      email: adminProfile.email,
      phoneNumber: adminProfile.phoneNumber,
      address: null, // If you have address field in User model, include it
      dateOfBirth: null, // If you have dateOfBirth field in User model, include it
      profileImage: adminProfile.image,
      role: adminProfile.role,
      isActive: true, // If you have isActive field in User model, include it
      createdAt: adminProfile.createdAt,
      updatedAt: adminProfile.updatedAt,
      lastLoginAt: null, // If you track last login, include it
    }

    return NextResponse.json(formattedProfile)
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest
): Promise<NextResponse<AdminProfilePatchResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = adminProfileUpdateSchema.parse(body)
    const { name, phoneNumber } = validatedData

    // Update the admin user profile
    const updatedProfile = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name || undefined,
        phoneNumber: phoneNumber || undefined,
        // Add other fields as they exist in your User model
        // address: address || undefined,
        // dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Format the response to match the frontend interface
    const formattedProfile = {
      id: updatedProfile.id,
      name: updatedProfile.name || '',
      email: updatedProfile.email,
      phoneNumber: updatedProfile.phoneNumber,
      address: null, // If you have address field in User model, include it
      dateOfBirth: null, // If you have dateOfBirth field in User model, include it
      profileImage: updatedProfile.image,
      role: updatedProfile.role,
      isActive: true, // If you have isActive field in User model, include it
      createdAt: updatedProfile.createdAt,
      updatedAt: updatedProfile.updatedAt,
      lastLoginAt: null, // If you track last login, include it
    }

    return NextResponse.json(formattedProfile)
  } catch (error) {
    console.error('Error updating admin profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

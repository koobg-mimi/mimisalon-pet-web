import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma, Prisma } from '@mimisalon/shared'

// Response types
interface WorkAreaInfo {
  id: string
  name: string
  address: string | null
  centerLat: number
  centerLng: number
  radiusKm: number
  isActive: boolean
}

interface GroomerProfileInfo {
  isVerified: boolean
  workAreas: WorkAreaInfo[]
}

export interface AdminUserDetailGetResponse {
  id: string
  email: string
  name: string | null
  role: string
  phone: string | null
  address: string | null
  dateOfBirth: null
  isActive: boolean
  lastLoginAt: null
  createdAt: string
  groomerProfile?: GroomerProfileInfo
}

interface ErrorResponse {
  error: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<AdminUserDetailGetResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: userId } = await params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get groomer work areas if user is a groomer
    let workAreas: Array<{
      id: string
      name: string
      address: string | null
      centerLat: number
      centerLng: number
      radiusKm: number
      isActive: boolean
    }> = []
    if (user.role === 'GROOMER') {
      const groomerAreas = await prisma.groomerWorkArea.findMany({
        where: { groomerId: userId },
        select: {
          id: true,
          name: true,
          address: true,
          centerLat: true,
          centerLng: true,
          radiusKm: true,
          isActive: true,
        },
      })
      workAreas = groomerAreas
    }

    // Get user's default address
    const defaultAddress = await prisma.address.findFirst({
      where: {
        customerId: userId,
        isDefault: true,
      },
      select: {
        street: true,
        city: true,
        state: true,
      },
    })

    // Check if groomer is verified (has commission grade)
    let isVerified = false
    if (user.role === 'GROOMER') {
      const commissionGrade = await prisma.groomerCommissionGrade.findFirst({
        where: {
          groomers: {
            some: {
              id: userId,
            },
          },
        },
      })
      isVerified = commissionGrade !== null
    }

    // Transform the response
    const response = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phoneNumber,
      address: defaultAddress
        ? `${defaultAddress.street}, ${defaultAddress.city} ${defaultAddress.state}`.trim()
        : null,
      dateOfBirth: null,
      isActive: true,
      lastLoginAt: null,
      createdAt: user.createdAt.toISOString(),
      groomerProfile:
        user.role === 'GROOMER'
          ? {
              isVerified,
              workAreas: workAreas.map((area) => ({
                id: area.id,
                name: area.name,
                address: area.address,
                centerLat: area.centerLat,
                centerLng: area.centerLng,
                radiusKm: area.radiusKm,
                isActive: area.isActive,
              })),
            }
          : undefined,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

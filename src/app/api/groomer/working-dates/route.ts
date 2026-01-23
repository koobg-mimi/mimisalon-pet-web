import { ko } from 'date-fns/locale'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { format } from 'date-fns'
import auth from '@/lib/auth'
import { Prisma, prisma } from '@mimisalon/shared'

// Type definition for groomer working dates
export interface GroomerWorkingDate {
  id: string
  date: string
  startTime: string
  endTime: string
  slotDuration: number
}

// Response types for API endpoints
type PostResponse = {
  success: true
  count: number
  message: string
}

type DeleteResponse = {
  success: true
  message: string
}

type ErrorResponse = {
  error: string
}

// Get groomer's working dates
export async function GET(
  request: NextRequest
): Promise<NextResponse<GroomerWorkingDate[] | { error: string }>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const groomerId = session.user.id

    const where: Prisma.GroomerWorkingDateWhereInput = {
      groomerId,
      isActive: true,
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const workingDates = await prisma.groomerWorkingDate.findMany({
      where,
      orderBy: {
        date: 'asc',
      },
    })

    const formattedDates = workingDates.map((wd) => ({
      id: wd.id,
      date: format(wd.date, 'yyyy-MM-dd', { locale: ko }),
      startTime: wd.startTime,
      endTime: wd.endTime,
      slotDuration: wd.slotDuration,
    }))

    return NextResponse.json(formattedDates)
  } catch (error) {
    console.error('Failed to fetch working dates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create or update working dates (bulk operation)
export async function POST(
  request: NextRequest
): Promise<NextResponse<PostResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groomerId = session.user.id
    const body = await request.json()
    const { workingDates } = body

    if (!Array.isArray(workingDates) || workingDates.length === 0) {
      return NextResponse.json({ error: 'Working dates array is required' }, { status: 400 })
    }

    // Validate all dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (const wd of workingDates) {
      const date = new Date(wd.date)
      if (date < today) {
        return NextResponse.json({ error: 'Cannot set working dates in the past' }, { status: 400 })
      }

      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(wd.startTime) || !timeRegex.test(wd.endTime)) {
        return NextResponse.json({ error: 'Invalid time format' }, { status: 400 })
      }

      // Validate start time is before end time
      const startMinutes = parseTimeToMinutes(wd.startTime)
      const endMinutes = parseTimeToMinutes(wd.endTime)
      if (startMinutes >= endMinutes) {
        return NextResponse.json({ error: 'Start time must be before end time' }, { status: 400 })
      }
    }

    // Upsert all working dates
    const results = await Promise.all(
      workingDates.map(async (wd) => {
        const date = new Date(wd.date)

        return prisma.groomerWorkingDate.upsert({
          where: {
            groomerId_date: {
              groomerId,
              date,
            },
          },
          create: {
            groomerId,
            date,
            startTime: wd.startTime,
            endTime: wd.endTime,
            slotDuration: wd.slotDuration || 30,
            isActive: true,
          },
          update: {
            startTime: wd.startTime,
            endTime: wd.endTime,
            slotDuration: wd.slotDuration || 30,
            isActive: true,
          },
        })
      })
    )

    return NextResponse.json({
      success: true,
      count: results.length,
      message: `${results.length}개의 근무 날짜가 저장되었습니다.`,
    })
  } catch (error) {
    console.error('Failed to save working dates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete working date
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<DeleteResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    const groomerId = session.user.id
    const date = new Date(dateStr)

    // Check if there are any bookings on this date
    const existingBookings = await prisma.groomerAvailability.findFirst({
      where: {
        groomerId,
        date,
        isBooked: true,
      },
    })

    if (existingBookings) {
      return NextResponse.json(
        { error: 'Cannot delete working date with existing bookings' },
        { status: 400 }
      )
    }

    // Soft delete by setting isActive to false
    await prisma.groomerWorkingDate.updateMany({
      where: {
        groomerId,
        date,
      },
      data: {
        isActive: false,
      },
    })

    // Also delete associated availability slots
    await prisma.groomerAvailability.deleteMany({
      where: {
        groomerId,
        date,
        isBooked: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: '근무 날짜가 삭제되었습니다.',
    })
  } catch (error) {
    console.error('Failed to delete working date:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

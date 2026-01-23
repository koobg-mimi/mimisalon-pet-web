import { ko } from 'date-fns/locale'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { format } from 'date-fns'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { canServiceLocation, findClosestWorkArea, sortGroomersByDistance } from '@/lib/geo-utils'
import { CLEANUP_BUFFER_MINUTES, generateRequiredTimeSlots } from '@/lib/booking-availability'

/**
 * ============================================
 * EXPORTED TYPES - API Contract
 * ============================================
 */

/**
 * Time slot with availability and booking information
 */
export interface TimeSlot {
  time: string
  available: boolean
  groomerId: string
  isBooked?: boolean
  bookingId?: string
}

/**
 * Groomer availability information
 */
export interface GroomerAvailabilityResponse {
  id: string
  name: string
  profileImage?: string
  workAreas: string[]
  distance: number
  serviceArea: string
  schedule: {
    workingHoursStart: string
    workingHoursEnd: string
    workingDays: number[]
    slotDurationMinutes: number
  } | null
}

/**
 * Pagination metadata
 */
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Address information in response
 */
export interface AddressInfo {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  coordinates: {
    lat: number | null
    lng: number | null
  }
}

/**
 * Filtering information
 */
export interface FilteringInfo {
  totalGroomersInSystem: number
  groomersInServiceArea: number
  useGeographicFiltering: boolean
}

/**
 * Complete availability API response
 */
export interface AvailabilityResponse {
  date: string
  timeSlots: TimeSlot[]
  groomers: GroomerAvailabilityResponse[]
  pagination: PaginationInfo
  address: AddressInfo
  filteringInfo: FilteringInfo
}

// GET /api/bookings/availability - Get available time slots for a specific date and address
export async function GET(
  request: NextRequest
): Promise<NextResponse<AvailabilityResponse> | Response> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const addressId = searchParams.get('addressId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!date || !addressId) {
      return new NextResponse('date and addressId parameters are required', {
        status: 400,
      })
    }

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return new NextResponse(
        'Invalid pagination parameters. Page must be >= 1, limit must be 1-50',
        { status: 400 }
      )
    }

    // Verify that the address belongs to the current customer (if customer role)
    if (session.user.role === 'CUSTOMER') {
      const address = await prisma.address.findFirst({
        where: {
          id: addressId,
          customerId: session.user.id,
        },
      })

      if (!address) {
        return new NextResponse('Address not found or access denied', {
          status: 404,
        })
      }
    }

    // Get the address details
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    })

    if (!address) {
      return new NextResponse('Address not found', { status: 404 })
    }

    // Check if address has coordinates for geographic filtering
    if (!address.centerLat || !address.centerLng) {
      return new NextResponse('Address coordinates not available. Please update the address.', {
        status: 400,
      })
    }

    // Find all groomers with active work areas
    const selectedDate = new Date(date)

    const allGroomers = await prisma.user.findMany({
      where: {
        role: 'GROOMER',
        workAreas: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        schedule: true,
        workingDates: {
          where: {
            date: selectedDate,
            isActive: true,
          },
        },
        availabilities: {
          where: {
            date: selectedDate,
          },
        },
        workAreas: {
          where: {
            isActive: true,
          },
        },
      },
    })

    // Filter groomers by geographic coverage using customer's coordinates
    const groomers = allGroomers.filter((groomer) => {
      return canServiceLocation(address.centerLat!, address.centerLng!, groomer.workAreas)
    })

    // Generate time slots for each groomer with real-time booking status
    const timeSlots: TimeSlot[] = []

    // Track actual working hours for each groomer (for UI display)
    const groomerActualHours = new Map<string, { start: string; end: string }>()

    // Generate time slots based on start and end time
    const generateTimeSlotsForRange = (
      startTime: string,
      endTime: string,
      slotDuration: number = 30
    ) => {
      const slots: string[] = []
      const [startHour, startMinute] = startTime.split(':').map(Number)
      const [endHour, endMinute] = endTime.split(':').map(Number)

      let currentMinutes = startHour * 60 + startMinute
      const endMinutes = endHour * 60 + endMinute

      while (currentMinutes < endMinutes) {
        const hours = Math.floor(currentMinutes / 60)
        const minutes = currentMinutes % 60
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

        slots.push(timeString)
        currentMinutes += slotDuration
      }

      return slots
    }

    // Process each groomer's availability with real booking status
    for (const groomer of groomers) {
      // Check if groomer has a working date set for this specific date
      const workingDate = groomer.workingDates.find((wd) => {
        return (
          format(wd.date, 'yyyy-MM-dd', { locale: ko }) ===
          format(selectedDate, 'yyyy-MM-dd', { locale: ko })
        )
      })

      // Only process groomers with explicitly set working dates
      if (!workingDate) {
        continue // Skip this groomer if no working date is set
      }

      // Use date-specific working hours
      const workingHours = generateTimeSlotsForRange(
        workingDate.startTime,
        workingDate.endTime,
        workingDate.slotDuration
      )
      const slotDuration = workingDate.slotDuration

      // Track actual hours for this groomer
      groomerActualHours.set(groomer.id, {
        start: workingDate.startTime,
        end: workingDate.endTime,
      })

      // Get existing bookings for conflict checking
      const existingBookings = await prisma.booking.findMany({
        where: {
          groomerId: groomer.id,
          serviceDate: selectedDate,
          status: {
            notIn: ['SERVICE_CANCELLED', 'BOOKING_FAILED'],
          },
        },
        select: {
          id: true,
          serviceTime: true,
          estimatedDurationMinutes: true,
        },
      })

      // Create a set of all booked time slots (including cleanup buffer)
      const bookedSlots = new Set<string>()
      const bookingMap = new Map<string, string>() // timeSlot -> bookingId

      for (const booking of existingBookings) {
        const slots = generateRequiredTimeSlots(
          booking.serviceTime,
          (booking.estimatedDurationMinutes || 60) + CLEANUP_BUFFER_MINUTES
        )
        slots.forEach((slot) => {
          bookedSlots.add(slot)
          bookingMap.set(slot, booking.id)
        })
      }

      // Process each working hour
      workingHours.forEach((time) => {
        // Check if this time slot is booked
        const isBooked = bookedSlots.has(time)

        // Check if explicitly marked as unavailable in GroomerAvailability
        const availability = groomer.availabilities.find((avail) => avail.timeSlot === time)

        const isAvailable =
          !isBooked && (!availability || (availability.isAvailable && !availability.isBooked))

        timeSlots.push({
          time,
          available: isAvailable,
          groomerId: groomer.id,
          isBooked: isBooked,
          bookingId: isBooked ? bookingMap.get(time) : undefined,
        })
      })
    }

    // Sort groomers by distance to customer and add distance information
    const groomersWithDistance = sortGroomersByDistance(
      groomers,
      address.centerLat!,
      address.centerLng!
    )

    // Filter to only include groomers with working dates set for this date
    const availableGroomersWithWorkingDates = groomersWithDistance.filter((groomer) =>
      groomerActualHours.has(groomer.id)
    )

    // Calculate pagination
    const totalGroomers = availableGroomersWithWorkingDates.length
    const totalPages = Math.ceil(totalGroomers / limit)
    const offset = (page - 1) * limit
    const paginatedGroomers = availableGroomersWithWorkingDates.slice(offset, offset + limit)

    // Process groomer information for the UI with distance data (no placeholders)
    const availableGroomers: GroomerAvailabilityResponse[] = paginatedGroomers.map((groomer) => {
      const closestWorkArea = findClosestWorkArea(
        address.centerLat!,
        address.centerLng!,
        groomer.workAreas
      )

      // Get actual working hours for this date (from working date or schedule)
      const actualHours = groomerActualHours.get(groomer.id)

      return {
        id: groomer.id,
        name: groomer.name || 'Unknown Groomer',
        profileImage: groomer.image || undefined,
        workAreas: groomer.workAreas.map((area) => area.name),
        distance: Math.round(groomer.closestDistance * 100) / 100, // Round to 2 decimal places
        serviceArea: closestWorkArea?.workArea.name || '서비스 지역',
        schedule: actualHours
          ? {
              workingHoursStart: actualHours.start,
              workingHoursEnd: actualHours.end,
              workingDays: groomer.schedule?.workingDays || [],
              slotDurationMinutes: groomer.schedule?.slotDurationMinutes || 30,
            }
          : groomer.schedule
            ? {
                workingHoursStart: groomer.schedule.workingHoursStart,
                workingHoursEnd: groomer.schedule.workingHoursEnd,
                workingDays: groomer.schedule.workingDays,
                slotDurationMinutes: groomer.schedule.slotDurationMinutes,
              }
            : null,
      }
    })

    return NextResponse.json({
      date,
      timeSlots,
      groomers: availableGroomers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalGroomers,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      address: {
        id: address.id,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        coordinates: {
          lat: address.centerLat,
          lng: address.centerLng,
        },
      },
      filteringInfo: {
        totalGroomersInSystem: allGroomers.length,
        groomersInServiceArea: totalGroomers, // Total before pagination
        useGeographicFiltering: true,
      },
    })
  } catch (error) {
    console.error('Failed to fetch availability:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

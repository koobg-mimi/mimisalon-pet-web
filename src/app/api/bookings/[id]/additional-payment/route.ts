import { ko } from 'date-fns/locale'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { format } from 'date-fns'

// ============================================
// Response Types
// ============================================

export type AdditionalCharge = {
  id: string
  name: string
  description: string
  amount: number
  quantity: number
  total: number
}

export type AdditionalPaymentResponse = {
  id: string
  status: string
  originalAmount: number
  service: {
    name: string
  }
  pet: {
    name: string
    breed: string // breed name as string, not object
  }
  groomer: {
    name: string
  }
  location: {
    name: string
    address: string
  }
  date: string
  time: string
  additionalCharges: AdditionalCharge[]
}

export type AdditionalPaymentErrorResponse = {
  error: string
}

// ============================================
// API Handler
// ============================================

/**
 * GET /api/bookings/[id]/additional-payment
 *
 * Retrieves additional payment information for a booking that requires extra charges.
 * Only accessible by the customer who owns the booking.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<AdditionalPaymentResponse | AdditionalPaymentErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: bookingId } = await params

    // Get user to verify ownership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get booking with all necessary information
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        customerId: user.id, // Ensure customer owns this booking
      },
      include: {
        groomer: {
          select: {
            id: true,
            name: true,
          },
        },
        customerAddress: true,
        bookingPets: {
          include: {
            pet: {
              include: {
                breed: true,
              },
            },
            services: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if booking has additional payment pending
    if (booking.status !== 'ADDITIONAL_PAYMENT_PENDING') {
      return NextResponse.json(
        { error: 'No additional payment required for this booking' },
        { status: 400 }
      )
    }

    // Parse additional charges - these could be stored in notes or a dedicated field
    // For now, we'll use the additionalCharges amount and create a structure
    const additionalCharges = [
      {
        id: `${booking.id}-additional-1`,
        name: '추가 서비스',
        description: '미용 중 추가로 필요한 서비스',
        amount: booking.additionalCharges,
        quantity: 1,
        total: booking.additionalCharges,
      },
    ]

    // If there are notes, try to parse them as additional service details
    if (booking.notes) {
      try {
        const parsedNotes = JSON.parse(booking.notes)
        if (parsedNotes.services && Array.isArray(parsedNotes.services)) {
          // Override with parsed service details
          additionalCharges.length = 0
          parsedNotes.services.forEach((service: any, index: number) => {
            additionalCharges.push({
              id: `${booking.id}-additional-${index + 1}`,
              name: service.name,
              description: service.description || '',
              amount: service.price,
              quantity: service.quantity || 1,
              total: service.price * (service.quantity || 1),
            })
          })
        }
      } catch (error) {
        // If notes can't be parsed as JSON, keep the default structure
        console.log('Could not parse booking notes as JSON:', error)
      }
    }

    // Format response for payment page
    const response: AdditionalPaymentResponse = {
      id: booking.id,
      status: booking.status,
      originalAmount: booking.basePrice,
      service: {
        name: booking.bookingPets?.[0]?.services?.[0]?.service?.name || booking.serviceType,
      },
      pet: {
        name: booking.bookingPets?.[0]?.pet?.name || 'Unknown Pet',
        breed:
          booking.bookingPets?.[0]?.pet?.breed?.name ||
          booking.bookingPets?.[0]?.pet?.type ||
          'Unknown Breed',
      },
      groomer: {
        name: booking.groomer?.name || 'Unassigned',
      },
      location: {
        name: '미미살롱', // This could be dynamic based on groomer's salon
        address: booking.customerAddress?.street || '주소 미확인',
      },
      date: format(booking.serviceDate, 'yyyy-MM-dd', { locale: ko }),
      time: booking.serviceTime,
      additionalCharges,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Additional payment API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

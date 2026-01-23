import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import type { Prisma } from '@mimisalon/shared'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Parse FormData
    const formData = await request.formData()
    const bookingId = formData.get('bookingId') as string
    const rating = parseInt(formData.get('rating') as string, 10)
    const comment = formData.get('comment') as string
    const imageFiles = formData.getAll('images') as File[]

    // Validate inputs
    if (!bookingId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating value' }, { status: 400 })
    }

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        customerId: user.id,
      },
      include: {
        reviews: {
          where: {
            customerId: user.id,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if booking is completed
    if (booking.status !== 'SERVICE_COMPLETED') {
      return NextResponse.json({ error: 'Cannot review incomplete booking' }, { status: 400 })
    }

    // Check if review already exists
    if (booking.reviews.length > 0) {
      return NextResponse.json({ error: 'Review already exists for this booking' }, { status: 400 })
    }

    // Process images
    const imageData: Prisma.ReviewImageCreateWithoutReviewInput[] = []

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]

      // Convert file to base64 data URL (in production, you'd upload to cloud storage)
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const dataUrl = `data:${file.type};base64,${base64}`

      imageData.push({
        url: dataUrl, // In production, this would be the cloud storage URL
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        order: i,
      })
    }

    // Create review with images
    const review = await prisma.review.create({
      data: {
        bookingId,
        customerId: user.id,
        rating,
        comment,
        images: {
          create: imageData,
        },
      },
      include: {
        images: true,
        customer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update booking with review info
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        customerRating: rating,
        customerReview: comment,
        reviewDate: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        images: review.images.map((img) => ({
          id: img.id,
          url: img.url,
          order: img.order,
        })),
        createdAt: review.createdAt,
        customer: review.customer,
      },
    })
  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}

// GET endpoint to fetch reviews
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')

    if (bookingId) {
      // Get specific review for a booking
      const review = await prisma.review.findFirst({
        where: {
          bookingId,
          customerId: user.id,
        },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          response: true,
          booking: {
            select: {
              id: true,
              serviceDate: true,
              groomer: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      })

      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
      }

      return NextResponse.json(review)
    } else {
      // Get all reviews for the user
      const reviews = await prisma.review.findMany({
        where: {
          customerId: user.id,
        },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          response: true,
          booking: {
            select: {
              id: true,
              serviceDate: true,
              serviceType: true,
              groomer: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json(reviews)
    }
  } catch (error) {
    console.error('Review fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

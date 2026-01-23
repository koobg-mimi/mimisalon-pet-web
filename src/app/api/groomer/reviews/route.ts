import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { Prisma } from '@mimisalon/shared';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groomerId = session.user.id;
    const { searchParams } = new URL(request.url);

    // Query parameters for filtering and pagination
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const rating = searchParams.get('rating');
    const hasResponse = searchParams.get('hasResponse');
    const sortBy = searchParams.get('sortBy') ?? 'createdAt';
    const sortOrder = searchParams.get('sortOrder') ?? 'desc';
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ReviewWhereInput = {
      booking: {
        groomerId: groomerId,
      },
    };

    // Filter by rating
    if (rating && rating !== 'all') {
      where.rating = parseInt(rating);
    }

    // Filter by response status
    if (hasResponse === 'true') {
      where.response = {
        isNot: null,
      };
    } else if (hasResponse === 'false') {
      where.response = null;
    }

    // Search filter (customer name or comment)
    if (search) {
      where.OR = [
        {
          customer: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          comment: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Build orderBy
    const orderBy: Prisma.ReviewOrderByWithRelationInput = {};
    if (sortBy === 'rating') {
      orderBy.rating = sortOrder as Prisma.SortOrder;
    } else if (sortBy === 'customerName') {
      orderBy.customer = { name: sortOrder as Prisma.SortOrder };
    } else {
      orderBy.createdAt = sortOrder as Prisma.SortOrder;
    }

    // Fetch reviews with related data including images
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          booking: {
            select: {
              id: true,
              serviceDate: true,
              serviceType: true,
              bookingPets: {
                include: {
                  pet: {
                    select: {
                      name: true,
                      breed: true,
                    },
                  },
                  services: {
                    include: {
                      service: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              order: true,
            },
            orderBy: { order: 'asc' },
          },
          response: {
            select: {
              id: true,
              content: true,
              createdAt: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    // Transform the data to match the frontend interface
    const transformedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      images: review.images,
      response: review.response
        ? {
            id: review.response.id,
            content: review.response.content,
            createdAt: review.response.createdAt.toISOString(),
          }
        : null,
      customer: {
        id: review.customer.id,
        name: review.customer.name,
        image: review.customer.image,
      },
      booking: {
        id: review.booking.id,
        serviceDate: review.booking.serviceDate.toISOString(),
        serviceType: review.booking.serviceType || 'Service',
        bookingPets: review.booking.bookingPets.map((bp) => ({
          pet: {
            name: bp.pet.name,
            breed: bp.pet.breed,
          },
        })),
      },
    }));

    return NextResponse.json({
      reviews: transformedReviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Failed to fetch groomer reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

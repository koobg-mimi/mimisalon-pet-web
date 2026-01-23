import { ko } from 'date-fns/locale';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { Prisma } from '@mimisalon/shared';
import { format } from 'date-fns';

// Response types
interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface ServiceInfo {
  id: string;
  name: string;
  category?: string;
}

interface PetInfo {
  id: string;
  name: string;
  breed: {
    id: string;
    name: string;
  } | null;
}

interface GroomerInfo {
  id: string | null;
  name: string;
  email: string;
  image: string | null;
}

interface LocationInfo {
  id: string | null;
  name: string;
}

interface BookingInfo {
  id: string;
  date: string;
  service: ServiceInfo;
  services: ServiceInfo[];
  pets: PetInfo[];
  groomer: GroomerInfo;
  location: LocationInfo;
}

interface ReviewImageInfo {
  id: string;
  url: string;
  order: number;
}

interface ReviewResponseInfo {
  id: string;
  content: string;
  createdAt: string;
  groomer: {
    id: string | null;
    name: string;
  };
}

export interface AdminReviewInfo {
  id: string;
  rating: number;
  comment: string | null;
  isPublic: boolean;
  isFlagged: boolean;
  flagReason: null;
  createdAt: string;
  updatedAt: string;
  customer: CustomerInfo;
  booking: BookingInfo;
  images: ReviewImageInfo[];
  response: ReviewResponseInfo | null;
  reports: unknown[];
}

interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  flaggedReviews: number;
  publicReviews: number;
  ratingDistribution: RatingDistribution;
  responseRate: number;
}

export interface AdminReviewsGetResponse {
  reviews: AdminReviewInfo[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  stats: ReviewStats;
}

interface ErrorResponse {
  error: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<AdminReviewsGetResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Query parameters
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const search = searchParams.get('search') ?? '';
    const rating = searchParams.get('rating') ?? 'ALL';
    const status = searchParams.get('status') ?? 'ALL';
    const serviceFilter = searchParams.get('service') ?? 'ALL';
    const sortBy = searchParams.get('sortBy') ?? 'createdAt';
    const sortOrder = searchParams.get('sortOrder') ?? 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ReviewWhereInput = {};

    // Search filter
    if (search) {
      where.OR = [
        {
          comment: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          customer: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          customer: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          booking: {
            groomer: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    // Rating filter
    if (rating !== 'ALL') {
      where.rating = parseInt(rating);
    }

    // Status filter - We'll filter by response status instead
    if (status === 'WITH_RESPONSE') {
      where.response = {
        isNot: null,
      };
    } else if (status === 'NO_RESPONSE') {
      where.response = null;
    }

    // Service filter
    if (serviceFilter !== 'ALL') {
      where.booking = {
        bookingPets: {
          some: {
            services: {
              some: {
                serviceId: serviceFilter,
              },
            },
          },
        },
      };
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

    // Fetch reviews with related data
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          booking: {
            include: {
              groomer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              bookingPets: {
                include: {
                  pet: {
                    select: {
                      id: true,
                      name: true,
                      breed: true,
                    },
                  },
                  services: {
                    include: {
                      service: {
                        select: {
                          id: true,
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

    // Calculate statistics
    const allReviews = await prisma.review.findMany({
      select: {
        rating: true,
        response: true,
      },
    });

    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalRating = 0;
    let reviewsWithResponse = 0;

    allReviews.forEach((review) => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      totalRating += review.rating;
      if (review.response) reviewsWithResponse++;
    });

    const stats = {
      totalReviews: allReviews.length,
      averageRating: allReviews.length > 0 ? totalRating / allReviews.length : 0,
      flaggedReviews: 0, // Not implemented in schema
      publicReviews: allReviews.length, // All reviews are public by default
      ratingDistribution,
      responseRate: allReviews.length > 0 ? (reviewsWithResponse / allReviews.length) * 100 : 0,
    };

    // Transform the data
    const transformedReviews = reviews.map((review) => {
      const services = review.booking.bookingPets.flatMap((bp) =>
        bp.services.map((s) => s.service)
      );
      const pets = review.booking.bookingPets.map((bp) => bp.pet);

      return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        isPublic: true, // All reviews are public by default
        isFlagged: false, // No flag system in current schema
        flagReason: null,
        createdAt: format(review.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { locale: ko }),
        updatedAt: format(review.updatedAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { locale: ko }),
        customer: {
          id: review.customer.id,
          name: review.customer.name || 'Unknown',
          email: review.customer.email || '',
          image: review.customer.image,
        },
        booking: {
          id: review.booking.id,
          date: format(review.booking.serviceDate, 'yyyy-MM-dd', { locale: ko }),
          service: services[0] || { id: '', name: 'Unknown Service', category: '' },
          services: services,
          pets: pets,
          groomer: {
            id: review.booking.groomer?.id || review.booking.groomerId,
            name: review.booking.groomer?.name || 'Unknown',
            email: review.booking.groomer?.email || '',
            image: review.booking.groomer?.image || null,
          },
          location: {
            id: review.booking.groomerId,
            name: `${review.booking.groomer?.name || 'Unknown'}'s Location`,
          },
        },
        images: review.images,
        response: review.response
          ? {
              id: review.response.id,
              content: review.response.content,
              createdAt: format(review.response.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", {
                locale: ko,
              }),
              groomer: {
                id: review.booking.groomerId,
                name: review.booking.groomer?.name || 'Unknown',
              },
            }
          : null,
        reports: [], // No report system in current schema
      };
    });

    return NextResponse.json({
      reviews: transformedReviews,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      stats,
    });
  } catch (error) {
    console.error('Failed to fetch admin reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

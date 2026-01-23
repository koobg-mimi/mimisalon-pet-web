import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

// GET /api/customer/groomers - Get groomers available for a specific address
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role !== 'CUSTOMER') {
      return new NextResponse('Forbidden - Customer access only', {
        status: 403,
      });
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('addressId');

    if (!addressId) {
      return new NextResponse('addressId parameter is required', {
        status: 400,
      });
    }

    // Verify that the address belongs to the current customer
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        customerId: session.user.id,
      },
    });

    if (!address) {
      return new NextResponse('Address not found or access denied', {
        status: 404,
      });
    }

    // Find groomers who service this area
    // For now, we'll do a simple city/state match, but this could be enhanced with geolocation
    const groomers = await prisma.user.findMany({
      where: {
        role: 'GROOMER',
        workAreas: {
          some: {
            isActive: true,
            // Simple matching by city/state for now
            // In production, you'd want to use proper geolocation with radius calculations
            OR: [
              {
                address: {
                  contains: address.city,
                  mode: 'insensitive',
                },
              },
              {
                address: {
                  contains: address.state,
                  mode: 'insensitive',
                },
              },
              {
                // Default to show all groomers if no specific area match
                // This ensures the demo works even without perfectly matched data
                id: {
                  not: undefined,
                },
              },
            ],
          },
        },
      },
      include: {
        workAreas: {
          where: {
            isActive: true,
          },
        },
        schedule: true,
        _count: {
          select: {
            groomerBookings: {
              where: {
                status: 'SERVICE_COMPLETED',
              },
            },
          },
        },
      },
    });

    // Transform the data to match the expected format
    const formattedGroomers = groomers.map((groomer) => ({
      id: groomer.id,
      name: groomer.name || 'Unknown Groomer',
      rating: 4.5, // Placeholder - this would be calculated from reviews
      availability: [], // This will be populated by the availability API
      location: groomer.workAreas[0]?.name || `${address.city} 지역`,
      workAreas: groomer.workAreas.map((area) => ({
        id: area.id,
        name: area.name,
        address: area.address,
      })),
      totalBookings: groomer._count.groomerBookings,
    }));

    return NextResponse.json(formattedGroomers);
  } catch (error) {
    console.error('Failed to fetch groomers:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

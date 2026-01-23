import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get unique work areas for location filtering
    const workAreas = await prisma.groomerWorkArea.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        description: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Group by name to avoid duplicates and provide better descriptions
    const uniqueLocations = workAreas.reduce(
      (acc, area) => {
        if (!acc.find((loc) => loc.name === area.name)) {
          acc.push({
            id: area.id,
            name: area.name,
            address: area.description || area.address || '',
          });
        }
        return acc;
      },
      [] as Array<{ id: string; name: string; address: string }>
    );

    return NextResponse.json(uniqueLocations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

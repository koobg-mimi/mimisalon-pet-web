import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

interface RouteParams {
  params: Promise<{
    id: string;
    action: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: groomerId, action } = await params;
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify groomer exists and has GROOMER role
    const groomer = await prisma.user.findFirst({
      where: {
        id: groomerId,
        role: 'GROOMER',
      },
      include: {
        groomerProfile: true,
      },
    });

    if (!groomer) {
      return NextResponse.json({ error: 'Groomer not found' }, { status: 404 });
    }

    // Ensure groomer profile exists
    let groomerProfile = groomer.groomerProfile;
    if (!groomerProfile) {
      groomerProfile = await prisma.groomerProfile.create({
        data: {
          groomerId: groomerId,
          isActive: true,
        },
      });
    }

    switch (action) {
      case 'activate':
        await prisma.groomerProfile.update({
          where: { groomerId },
          data: { isActive: true },
        });
        break;

      case 'deactivate':
        await prisma.groomerProfile.update({
          where: { groomerId },
          data: { isActive: false },
        });
        break;

      case 'suspend':
        // Suspend both the user account and groomer profile
        await Promise.all([
          prisma.groomerProfile.update({
            where: { groomerId },
            data: { isActive: false },
          }),
          // Could also add a suspended flag or suspend the user account
        ]);
        break;

      case 'update-commission':
        const body = await request.json();
        const { commissionGradeId } = body;

        if (!commissionGradeId) {
          return NextResponse.json({ error: 'Commission grade ID is required' }, { status: 400 });
        }

        // Verify commission grade exists
        const commissionGrade = await prisma.groomerCommissionGrade.findUnique({
          where: { id: commissionGradeId },
        });

        if (!commissionGrade) {
          return NextResponse.json({ error: 'Commission grade not found' }, { status: 404 });
        }

        await prisma.groomerProfile.update({
          where: { groomerId },
          data: { commissionGradeId },
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error performing action ${action} on groomer ${groomerId}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

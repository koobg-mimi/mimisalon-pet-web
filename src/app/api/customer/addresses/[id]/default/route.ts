import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Prisma } from '@prisma/client';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

// ============================================
// Type Definitions
// ============================================

/**
 * Response type for address
 */
export type AddressResponse = Prisma.AddressGetPayload<object>;

// ============================================
// API Handlers
// ============================================

/**
 * PUT /api/customer/addresses/[id]/default - Set an address as default
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<AddressResponse>> {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' } as never, { status: 401 });
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' } as never, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' } as never, { status: 404 });
    }

    // Check if the address belongs to the user
    const address = await prisma.address.findFirst({
      where: {
        id: id,
        customerId: user.id,
      },
    });

    if (!address) {
      return NextResponse.json({ error: 'Address not found' } as never, { status: 404 });
    }

    // Unset all other default addresses for this user
    await prisma.address.updateMany({
      where: {
        customerId: user.id,
        isDefault: true,
        id: { not: id },
      },
      data: { isDefault: false },
    });

    // Set this address as default
    const updatedAddress = await prisma.address.update({
      where: { id: id },
      data: { isDefault: true },
    });

    return NextResponse.json<AddressResponse>(updatedAddress);
  } catch (error) {
    console.error('Set default address error:', error);
    return NextResponse.json({ error: 'Internal server error' } as never, { status: 500 });
  }
}

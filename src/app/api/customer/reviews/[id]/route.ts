import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: reviewId } = await params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if review exists and belongs to user
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
        customerId: user.id,
      },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 });
    }

    // Delete review (images will be cascade deleted)
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Update booking to remove review info
    await prisma.booking.update({
      where: { id: review.bookingId },
      data: {
        customerRating: null,
        customerReview: null,
        reviewDate: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Review deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

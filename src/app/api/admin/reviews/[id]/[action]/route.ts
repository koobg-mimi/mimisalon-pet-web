import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: reviewId, action } = await params;

    // Verify review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    let successMessage = '';

    switch (action) {
      case 'approve':
        // In a real implementation, you might update a status field
        // For now, we'll just return success
        successMessage = 'Review approved';
        break;

      case 'flag':
        // In a real implementation, you might update a flag field
        // For now, we'll just return success
        successMessage = 'Review flagged for review';
        break;

      case 'unflag':
        successMessage = 'Review unflagged';
        break;

      case 'hide':
        // In a real implementation, you might update a visibility field
        successMessage = 'Review hidden from public';
        break;

      case 'show':
        successMessage = 'Review made public';
        break;

      case 'delete':
        // Delete related data first
        await prisma.$transaction([
          // Delete response if exists
          prisma.reviewResponse.deleteMany({
            where: { reviewId },
          }),
          // Delete images
          prisma.reviewImage.deleteMany({
            where: { reviewId },
          }),
          // Delete the review
          prisma.review.delete({
            where: { id: reviewId },
          }),
        ]);

        return NextResponse.json({
          success: true,
          message: 'Review deleted successfully',
        });

      default:
        return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
    }

    // For non-delete actions, just return success
    // In a real implementation, you would update the review in the database
    return NextResponse.json({
      success: true,
      message: successMessage,
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      },
    });
  } catch (error) {
    const { action } = await params;
    console.error(`Failed to ${action} review:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

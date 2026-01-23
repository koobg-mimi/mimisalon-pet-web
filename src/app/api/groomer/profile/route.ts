import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { generateSignedReadUrl, extractFilenameFromUrl, isGcsUrl } from '@/lib/gcs';

// Error response type
export interface ErrorResponse {
  error: string;
  details?: unknown;
}

// Response types
export type GroomerProfileResponse = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  phoneVerified: boolean;
  profileImage: string | null;
  bio: string;
  experience: number;
  certifications: string[];
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  joinedAt: Date;
  isVerified: boolean;
  status: string;
  birthDate: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountHolderName: string | null;
};

// Request schemas
export const updateGroomerProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  experience: z.number().optional(),
  birthDate: z.string().optional().nullable(),
});

export type UpdateGroomerProfileRequest = z.infer<typeof updateGroomerProfileSchema>;

export async function GET(): Promise<NextResponse<GroomerProfileResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groomerProfile = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        phoneNumberVerified: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        groomerProfile: {
          include: {
            commissionGrade: true,
          },
        },
        groomerBookings: {
          select: {
            id: true,
            status: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!groomerProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Calculate statistics
    const completedBookings = groomerProfile.groomerBookings.filter(
      (booking) => booking.status === 'SERVICE_COMPLETED'
    ).length;

    const ratings = groomerProfile.reviews.map((review) => review.rating);
    const averageRating =
      ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
    const totalReviews = ratings.length;

    // Generate signed URL for profile image if it's stored in GCS
    let profileImageUrl = groomerProfile.image;
    if (profileImageUrl && isGcsUrl(profileImageUrl)) {
      const filename = extractFilenameFromUrl(profileImageUrl);
      if (filename) {
        try {
          profileImageUrl = await generateSignedReadUrl(filename, 60);
        } catch (error) {
          console.error(`Failed to generate signed URL for profile image:`, error);
          // Keep original URL as fallback
        }
      }
    }

    // Format the response to match the frontend interface
    const formattedProfile = {
      id: groomerProfile.id,
      name: groomerProfile.name || '',
      email: groomerProfile.email,
      phone: groomerProfile.phoneNumber,
      phoneVerified: groomerProfile.phoneNumberVerified,
      profileImage: profileImageUrl,
      bio: '', // We'll need to add this field to User model later
      experience: 0, // We'll need to add this field to User model later
      certifications: [], // We'll need to create a separate model for this
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      totalBookings: completedBookings,
      joinedAt: groomerProfile.createdAt,
      isVerified: groomerProfile.phoneNumberVerified, // For now, verification is based on phone
      status: 'ACTIVE', // We'll need to add this field to User model later
      birthDate: groomerProfile.groomerProfile?.birthDate
        ? groomerProfile.groomerProfile.birthDate.toISOString()
        : null,

      // Bank account information
      bankName: groomerProfile.groomerProfile?.bankName || null,
      bankAccountNumber: groomerProfile.groomerProfile?.bankAccountNumber || null,
      bankAccountHolderName: groomerProfile.groomerProfile?.bankAccountHolderName || null,
    };

    return NextResponse.json(formattedProfile);
  } catch (error) {
    console.error('Error fetching groomer profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse<GroomerProfileResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: unknown = await request.json();
    const validatedData = updateGroomerProfileSchema.parse(body);
    const { name, phone, bio, experience, birthDate } = validatedData;

    // Update the groomer user profile
    const updatedProfile = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name || undefined,
        phoneNumber: phone || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        phoneNumberVerified: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        groomerProfile: true,
      },
    });

    // Update or create groomer profile with birthDate
    if (birthDate !== undefined) {
      await prisma.groomerProfile.upsert({
        where: {
          groomerId: session.user.id,
        },
        update: {
          birthDate: birthDate ? new Date(birthDate) : null,
        },
        create: {
          groomerId: session.user.id,
          birthDate: birthDate ? new Date(birthDate) : null,
        },
      });
    }

    return NextResponse.json({
      id: updatedProfile.id,
      name: updatedProfile.name || '',
      email: updatedProfile.email,
      phone: updatedProfile.phoneNumber,
      phoneVerified: updatedProfile.phoneNumberVerified,
      profileImage: updatedProfile.image,
      bio: bio || '',
      experience: experience || 0,
      certifications: [],
      averageRating: 0,
      totalReviews: 0,
      totalBookings: 0,
      joinedAt: updatedProfile.createdAt,
      isVerified: updatedProfile.phoneNumberVerified,
      status: 'ACTIVE',
      birthDate: birthDate || null,
      bankName: updatedProfile.groomerProfile?.bankName || null,
      bankAccountNumber: updatedProfile.groomerProfile?.bankAccountNumber || null,
      bankAccountHolderName: updatedProfile.groomerProfile?.bankAccountHolderName || null,
    });
  } catch (error) {
    console.error('Error updating groomer profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

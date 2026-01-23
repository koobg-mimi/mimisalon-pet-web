import { prisma } from '@mimisalon/shared';

/**
 * 서비스의 평균 평점을 계산합니다.
 *
 * Service → BookingService → BookingPet → Booking → Review 경로로
 * 해당 서비스에 대한 모든 리뷰를 찾아 평균을 계산합니다.
 *
 * @param serviceId - 평점을 계산할 서비스 ID
 * @returns 평균 평점 (1-5) 또는 리뷰가 없으면 null
 */
export async function calculateServiceAverageRating(serviceId: string): Promise<number | null> {
  try {
    // Service → BookingService → BookingPet → Booking → Review 경로로 평점 가져오기
    const reviews = await prisma.review.findMany({
      where: {
        booking: {
          bookingPets: {
            some: {
              services: {
                some: {
                  serviceId,
                },
              },
            },
          },
        },
      },
      select: {
        rating: true,
      },
    });

    // 리뷰가 없으면 null 반환
    if (reviews.length === 0) {
      return null;
    }

    // 평균 계산
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // 소수점 첫째 자리까지 반올림
    return Math.round(averageRating * 10) / 10;
  } catch (error) {
    console.error(`Error calculating average rating for service ${serviceId}:`, error);
    return null;
  }
}

/**
 * 여러 서비스의 평균 평점을 한 번에 계산합니다.
 *
 * @param serviceIds - 평점을 계산할 서비스 ID 배열
 * @returns 서비스 ID를 키로, 평균 평점을 값으로 하는 Map
 */
export async function calculateMultipleServiceRatings(
  serviceIds: string[]
): Promise<Map<string, number | null>> {
  const ratingsMap = new Map<string, number | null>();

  try {
    // 모든 서비스의 리뷰를 한 번에 가져오기 (성능 최적화)
    const reviews = await prisma.review.findMany({
      where: {
        booking: {
          bookingPets: {
            some: {
              services: {
                some: {
                  serviceId: {
                    in: serviceIds,
                  },
                },
              },
            },
          },
        },
      },
      select: {
        rating: true,
        booking: {
          select: {
            bookingPets: {
              select: {
                services: {
                  select: {
                    serviceId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 서비스별로 평점 그룹화
    const ratingsByService = new Map<string, number[]>();

    for (const review of reviews) {
      for (const bookingPet of review.booking.bookingPets) {
        for (const bookingService of bookingPet.services) {
          const serviceId = bookingService.serviceId;
          if (!ratingsByService.has(serviceId)) {
            ratingsByService.set(serviceId, []);
          }
          ratingsByService.get(serviceId)!.push(review.rating);
        }
      }
    }

    // 각 서비스의 평균 계산
    for (const serviceId of serviceIds) {
      const ratings = ratingsByService.get(serviceId);
      if (ratings && ratings.length > 0) {
        const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        ratingsMap.set(serviceId, Math.round(average * 10) / 10);
      } else {
        ratingsMap.set(serviceId, null);
      }
    }

    return ratingsMap;
  } catch (error) {
    console.error('Error calculating multiple service ratings:', error);
    // 에러 발생 시 모든 서비스에 null 반환
    for (const serviceId of serviceIds) {
      ratingsMap.set(serviceId, null);
    }
    return ratingsMap;
  }
}

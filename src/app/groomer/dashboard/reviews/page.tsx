'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquareIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ReviewCard } from '@/components/card/review-card';

interface ReviewImage {
  id: string;
  url: string;
  order: number;
}

interface ReviewResponse {
  id: string;
  content: string;
  createdAt: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  images: ReviewImage[];
  response: ReviewResponse | null;
  customer: {
    id: string;
    name: string | null;
    image: string | null;
  };
  booking: {
    id: string;
    serviceDate: string;
    serviceType: string;
    bookingPets?: Array<{
      pet: {
        name: string;
        breed: string | null;
      };
    }>;
  };
}

export default function GroomerReviewsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['groomer', 'reviews', activeTab, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        filter: activeTab,
      });

      const response = await fetch(`/api/groomer/reviews?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      return response.json();
    },
  });

  const reviews = data?.reviews || [];
  const totalPages = data?.totalPages || 1;

  const filteredReviews = reviews.filter((review: Review) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'with-photos') return review.images.length > 0;
    if (activeTab === 'low-rating') return review.rating <= 3;
    return true;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">리뷰를 불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* 헤더 */}
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">리뷰 관리</h1>
        <p className="text-muted-foreground text-sm sm:text-base">고객 리뷰를 확인하세요</p>
      </div>

      {/* 탭 필터 */}
      <div className="mb-6 overflow-x-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="inline-flex w-max min-w-full sm:min-w-0">
            <TabsTrigger value="all" className="whitespace-nowrap">
              전체
            </TabsTrigger>
            <TabsTrigger value="with-photos" className="whitespace-nowrap">
              사진 리뷰
            </TabsTrigger>
            <TabsTrigger value="low-rating" className="whitespace-nowrap">
              <span className="hidden sm:inline">개선 필요 (3점 이하)</span>
              <span className="sm:hidden">3점 이하</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 리뷰 목록 */}
      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="space-y-4 text-center">
              <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <MessageSquareIcon className="text-muted-foreground h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">리뷰가 없습니다</h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === 'with-photos'
                    ? '사진이 포함된 리뷰가 없습니다.'
                    : activeTab === 'low-rating'
                      ? '3점 이하 리뷰가 없습니다.'
                      : '아직 작성된 리뷰가 없습니다.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review: Review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center">
          {/* 모바일 페이지네이션 */}
          <div className="flex items-center space-x-2 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <div className="px-3 py-1 text-sm">
              <span className="font-medium">{currentPage}</span>
              <span className="text-muted-foreground"> / {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* 데스크탑 페이지네이션 */}
          <div className="hidden items-center space-x-2 sm:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="text-muted-foreground">...</span>
                <Button
                  variant={currentPage === totalPages ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

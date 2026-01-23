'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ScissorsIcon,
  PhoneIcon,
  StarIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  ArrowLeftIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface BookingDetails {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status:
    | 'FIRST_PAYMENT_PENDING'
    | 'FIRST_PAYMENT_COMPLETE'
    | 'GROOMER_CONFIRM_PENDING'
    | 'GROOMER_CONFIRM'
    | 'ADDITIONAL_PAYMENT_PENDING'
    | 'ADDITIONAL_PAYMENT_COMPLETE'
    | 'WORK_IN_PROGRESS'
    | 'SERVICE_COMPLETED'
    | 'SERVICE_CANCELLED'
    | 'BOOKING_FAILED';
  totalAmount: number;
  paidAmount: number;
  additionalAmount?: number;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    weight: number;
    photoUrl?: string;
  };
  services: Array<{
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  }>;
  groomer: {
    id: string;
    name: string;
    photoUrl?: string | null;
    rating: number;
    experience: string | null; // null until we add this field to schema
    phone: string;
    salon: {
      id: string;
      name: string;
      address: string;
      phone: string;
    };
  };
  notes?: string;
  estimatedEndTime?: string;
  createdAt?: string;
  actualStartTime?: string;
  actualEndTime?: string;
}

const getStatusColor = (status: BookingDetails['status']) => {
  switch (status) {
    case 'FIRST_PAYMENT_PENDING':
    case 'GROOMER_CONFIRM_PENDING':
      return 'warning';
    case 'FIRST_PAYMENT_COMPLETE':
    case 'GROOMER_CONFIRM':
      return 'info';
    case 'ADDITIONAL_PAYMENT_PENDING':
      return 'warning';
    case 'ADDITIONAL_PAYMENT_COMPLETE':
    case 'WORK_IN_PROGRESS':
      return 'info';
    case 'SERVICE_COMPLETED':
      return 'success';
    case 'SERVICE_CANCELLED':
    case 'BOOKING_FAILED':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusText = (status: BookingDetails['status']) => {
  switch (status) {
    case 'FIRST_PAYMENT_PENDING':
      return '1차 결제 대기';
    case 'FIRST_PAYMENT_COMPLETE':
      return '1차 결제 완료';
    case 'GROOMER_CONFIRM_PENDING':
      return '미용사 확인 대기';
    case 'GROOMER_CONFIRM':
      return '미용사 확정';
    case 'ADDITIONAL_PAYMENT_PENDING':
      return '추가 결제 대기';
    case 'ADDITIONAL_PAYMENT_COMPLETE':
      return '추가 결제 완료';
    case 'WORK_IN_PROGRESS':
      return '진행 중';
    case 'SERVICE_COMPLETED':
      return '완료';
    case 'SERVICE_CANCELLED':
      return '취소됨';
    case 'BOOKING_FAILED':
      return '예약 실패';
    default:
      return '알 수 없음';
  }
};

export default function CustomerBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Fetch booking details using React Query
  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery<BookingDetails>({
    queryKey: ['customer', 'booking', resolvedParams.id],
    queryFn: async () => {
      const response = await fetch(`/api/customer/booking/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch booking: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!resolvedParams.id,
  });

  // Fetch review if booking is completed
  const { data: review } = useQuery({
    queryKey: ['customer', 'reviews', 'booking', resolvedParams.id],
    queryFn: async () => {
      const reviewResponse = await fetch(`/api/customer/reviews?bookingId=${resolvedParams.id}`);
      if (!reviewResponse.ok) {
        return null;
      }
      return reviewResponse.json();
    },
    enabled: !!booking && booking.status === 'SERVICE_COMPLETED',
  });

  // 리뷰 작성 완료 후 알림 표시
  useEffect(() => {
    if (searchParams.get('reviewSubmitted') === 'true') {
      setShowReviewSuccess(true);
      setTimeout(() => setShowReviewSuccess(false), 5000);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">예약 정보를 불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <AlertCircleIcon className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="text-lg font-semibold">예약을 찾을 수 없습니다</h3>
              <p className="text-muted-foreground">요청하신 예약 정보를 찾을 수 없습니다.</p>
              <Button onClick={() => router.push('/customer/bookings')}>
                예약 목록으로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* 헤더 */}
        <div className="mb-6 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">예약 상세정보</h1>
            <p className="text-muted-foreground">예약 번호: #{booking.id}</p>
          </div>
        </div>

        {/* Additional Payment Banner */}
        {booking.status === 'ADDITIONAL_PAYMENT_PENDING' && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircleIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-orange-600" />
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-orange-900">
                    추가 결제가 필요합니다
                  </h3>
                  <p className="mb-4 text-sm text-orange-800">
                    미용 진행 중 추가 서비스가 필요하여 견적이 발생했습니다.
                    {booking.additionalAmount && (
                      <>
                        추가 결제 금액:{' '}
                        <span className="font-semibold">
                          {booking.additionalAmount.toLocaleString('ko-KR')}원
                        </span>
                      </>
                    )}
                  </p>
                  <Button asChild className="bg-orange-600 hover:bg-orange-700">
                    <Link href={`/payment/additional/${booking.id}`}>추가 결제하기</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 상태 및 기본 정보 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <CalendarIcon className="h-6 w-6" />
                <span>예약 정보</span>
              </CardTitle>
              <Badge variant={getStatusColor(booking.status)}>
                {getStatusText(booking.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <div className="text-muted-foreground text-sm">예약 날짜</div>
                  <div className="mt-1 flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">{booking.appointmentDate}</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">예약 시간</div>
                  <div className="mt-1 flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4" />
                    <span className="font-medium">{booking.startTime}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-muted-foreground text-sm">총 결제금액</div>
                  <div className="mt-1 flex items-center space-x-2">
                    <CreditCardIcon className="h-4 w-4" />
                    <div className="text-lg font-medium">
                      <span>{booking.paidAmount.toLocaleString('ko-KR')}원</span>
                      {booking.additionalAmount !== null &&
                        booking.additionalAmount !== undefined &&
                        booking.additionalAmount > 0 && (
                          <span className="ml-2 text-sm text-orange-600">
                            (추가금: {booking.additionalAmount.toLocaleString('ko-KR')}
                            원)
                          </span>
                        )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">결제 상태</div>
                  <Badge
                    variant={booking.paymentStatus === 'PAID' ? 'success' : 'warning'}
                    className="mt-1"
                  >
                    {booking.paymentStatus === 'PAID' ? '결제 완료' : '결제 대기'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 반려동물 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <UserIcon className="h-6 w-6" />
              <span>반려동물 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {booking.pet.photoUrl ? (
                <Image
                  src={booking.pet.photoUrl}
                  alt={booking.pet.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                  unoptimized // Bypass Next.js image optimization for GCS images
                  onError={(e) => {
                    console.error('Failed to load pet image:', booking.pet.photoUrl);
                    console.error('Error event:', e);
                  }}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{booking.pet.name}</h3>
                <p className="text-muted-foreground">
                  {booking.pet.species} • {booking.pet.breed} • {booking.pet.weight}kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 서비스 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <ScissorsIcon className="h-6 w-6" />
              <span>서비스 목록</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {booking.services.map((service, index) => (
                <div key={service.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-muted-foreground mt-1 text-sm">{service.description}</p>
                      <div className="text-muted-foreground mt-2 flex items-center space-x-4 text-sm">
                        <span>{service.price.toLocaleString()}원</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          service.status === 'COMPLETED'
                            ? 'success'
                            : service.status === 'IN_PROGRESS'
                              ? 'info'
                              : 'secondary'
                        }
                      >
                        {service.status === 'COMPLETED'
                          ? '완료'
                          : service.status === 'IN_PROGRESS'
                            ? '진행 중'
                            : '대기'}
                      </Badge>
                    </div>
                  </div>
                  {index < booking.services.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 미용사 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <UserIcon className="h-6 w-6" />
              <span>미용사 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {booking.groomer.photoUrl ? (
                  <Image
                    src={booking.groomer.photoUrl}
                    alt={booking.groomer.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                    unoptimized // Bypass Next.js image optimization for GCS images
                    onError={(e) => {
                      console.error('Failed to load groomer image:', booking.groomer.photoUrl);
                      console.error('Error event:', e);
                    }}
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                    <UserIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{booking.groomer.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="text-sm font-medium">{booking.groomer.rating}</span>
                      </div>
                      {booking.groomer.experience && (
                        <>
                          <Separator orientation="vertical" className="h-4" />
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground text-sm">경력</span>
                            <span className="text-sm font-medium">
                              {booking.groomer.experience}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (booking.groomer.phone) {
                        window.location.href = `tel:${booking.groomer.phone}`;
                      }
                    }}
                    disabled={!booking.groomer.phone}
                    title={
                      booking.groomer.phone
                        ? `${booking.groomer.phone}로 전화하기`
                        : '전화번호가 없습니다'
                    }
                  >
                    <PhoneIcon className="mr-2 h-4 w-4" />
                    {booking.groomer.phone ? '전화' : '전화 불가'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 진행 상황 타임라인 */}
        <Card>
          <CardHeader>
            <CardTitle>진행 상황</CardTitle>
            <CardDescription>예약 진행 상황을 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              // 상태에 따른 타임라인 아이템 생성
              const timelineItems = [];
              const currentStatus = booking.status;

              // 예약 생성
              timelineItems.push({
                id: 'created',
                title: '예약 생성',
                description: '예약이 성공적으로 생성되었습니다',
                icon: <CalendarIcon className="h-4 w-4" />,
                timestamp: booking.createdAt || booking.appointmentDate,
                isCompleted: true,
              });

              // 1차 결제
              if (
                [
                  'FIRST_PAYMENT_COMPLETE',
                  'GROOMER_CONFIRM_PENDING',
                  'GROOMER_CONFIRM',
                  'ADDITIONAL_PAYMENT_PENDING',
                  'ADDITIONAL_PAYMENT_COMPLETE',
                  'WORK_IN_PROGRESS',
                  'SERVICE_COMPLETED',
                ].includes(currentStatus)
              ) {
                timelineItems.push({
                  id: 'payment1',
                  title: '1차 결제 완료',
                  description: '기본 서비스 요금 결제가 완료되었습니다',
                  icon: <CreditCardIcon className="h-4 w-4" />,
                  timestamp: booking.createdAt,
                  isCompleted: true,
                });
              }

              // 미용사 확정
              if (
                [
                  'GROOMER_CONFIRM',
                  'ADDITIONAL_PAYMENT_PENDING',
                  'ADDITIONAL_PAYMENT_COMPLETE',
                  'WORK_IN_PROGRESS',
                  'SERVICE_COMPLETED',
                ].includes(currentStatus)
              ) {
                timelineItems.push({
                  id: 'confirmed',
                  title: '미용사 확정',
                  description: `${booking.groomer?.name || '미용사'}님이 예약을 확정했습니다`,
                  icon: <CheckCircleIcon className="h-4 w-4" />,
                  timestamp: booking.createdAt,
                  isCompleted: true,
                });
              }

              // 추가 결제
              if (currentStatus === 'ADDITIONAL_PAYMENT_PENDING') {
                timelineItems.push({
                  id: 'additional_payment',
                  title: '추가 결제 대기',
                  description: '추가 서비스 요금 결제가 필요합니다',
                  icon: <AlertCircleIcon className="h-4 w-4" />,
                  timestamp: null,
                  isCompleted: false,
                  isActive: true,
                });
              } else if (
                ['ADDITIONAL_PAYMENT_COMPLETE', 'WORK_IN_PROGRESS', 'SERVICE_COMPLETED'].includes(
                  currentStatus
                ) &&
                booking.additionalAmount
              ) {
                timelineItems.push({
                  id: 'additional_payment',
                  title: '추가 결제 완료',
                  description: '추가 서비스 요금 결제가 완료되었습니다',
                  icon: <CreditCardIcon className="h-4 w-4" />,
                  timestamp: booking.createdAt,
                  isCompleted: true,
                });
              }

              // 서비스 진행
              if (['WORK_IN_PROGRESS', 'SERVICE_COMPLETED'].includes(currentStatus)) {
                timelineItems.push({
                  id: 'in_progress',
                  title: '서비스 진행 중',
                  description: '미용 서비스가 진행 중입니다',
                  icon: <ScissorsIcon className="h-4 w-4" />,
                  timestamp: booking.actualStartTime,
                  isCompleted: currentStatus === 'SERVICE_COMPLETED',
                  isActive: currentStatus === 'WORK_IN_PROGRESS',
                });
              }

              // 서비스 완료
              if (currentStatus === 'SERVICE_COMPLETED') {
                timelineItems.push({
                  id: 'completed',
                  title: '서비스 완료',
                  description: '모든 서비스가 완료되었습니다',
                  icon: <CheckCircleIcon className="h-4 w-4" />,
                  timestamp: booking.actualEndTime,
                  isCompleted: true,
                });
              }

              // 취소된 경우
              if (['SERVICE_CANCELLED', 'BOOKING_FAILED'].includes(currentStatus)) {
                timelineItems.push({
                  id: 'cancelled',
                  title: currentStatus === 'SERVICE_CANCELLED' ? '예약 취소' : '예약 실패',
                  description:
                    currentStatus === 'SERVICE_CANCELLED'
                      ? '예약이 취소되었습니다'
                      : '예약이 실패했습니다',
                  icon: <XCircleIcon className="h-4 w-4" />,
                  timestamp: booking.createdAt,
                  isCompleted: true,
                  isError: true,
                });
              }

              return (
                <div className="space-y-6">
                  {timelineItems.map((item, index) => (
                    <div key={item.id} className="flex space-x-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            item.isError
                              ? 'bg-red-100 text-red-600'
                              : item.isActive
                                ? 'bg-orange-100 text-orange-600'
                                : item.isCompleted
                                  ? 'bg-primary text-white'
                                  : 'bg-muted text-muted-foreground'
                          } `}
                        >
                          {item.icon}
                        </div>
                        {index < timelineItems.length - 1 && (
                          <div
                            className={`mt-2 h-12 w-px ${item.isCompleted ? 'bg-primary' : 'bg-border'}`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${item.isActive ? 'text-orange-600' : ''}`}>
                            {item.title}
                          </h4>
                          {item.timestamp && (
                            <span className="text-muted-foreground text-xs">
                              {format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm:ss', {
                                locale: ko,
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* 특이사항 */}
        {/* {booking.notes && (
          <Card>
            <CardHeader>
              <CardTitle>특이사항</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{booking.notes}</p>
            </CardContent>
          </Card>
        )} */}

        {/* 리뷰 성공 알림 */}
        {showReviewSuccess && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">리뷰가 성공적으로 등록되었습니다!</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 작성된 리뷰 표시 */}
        {review && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <StarIcon className="h-6 w-6" />
                <span>내 리뷰</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${
                        star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-muted-foreground ml-2 text-sm">
                    {format(new Date(review.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}
                  </span>
                </div>
                {review.comment && <p className="text-sm">{review.comment}</p>}
                {review.images && review.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {review.images.map((img: any) => (
                      <div key={img.id} className="relative aspect-square">
                        <Image
                          src={img.url}
                          alt="Review image"
                          fill
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                )}
                {review.response && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-medium text-gray-700">미용사 답변</p>
                    <p className="mt-1 text-sm text-gray-600">{review.response.content}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 액션 버튼 */}
        <div className="flex space-x-4">
          {booking.status === 'ADDITIONAL_PAYMENT_PENDING' && (
            <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
              <Link href={`/payment/additional/${booking.id}`}>추가 결제하기</Link>
            </Button>
          )}
          {/* {booking.status === 'GROOMER_CONFIRM' && (
            <Button variant="outline" className="flex-1">
              예약 변경
            </Button>
          )} */}
          {booking.status === 'SERVICE_COMPLETED' && !review && (
            <Button
              className="flex-1"
              onClick={() => router.push(`/customer/review/create?bookingId=${booking.id}`)}
            >
              리뷰 작성
            </Button>
          )}
          {/* {['FIRST_PAYMENT_COMPLETE', 'GROOMER_CONFIRM_PENDING', 'GROOMER_CONFIRM'].includes(
            booking.status
          ) && (
            <Button variant="destructive" className="flex-1">
              예약 취소
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
}

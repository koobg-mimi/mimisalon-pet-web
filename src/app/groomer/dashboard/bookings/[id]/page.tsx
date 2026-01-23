'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ScissorsIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  PlayIcon,
  MapPinIcon,
} from 'lucide-react';

interface Service {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  status: string;
}

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  photoUrl?: string | null;
  services: Service[];
  options: ServiceOption[];
}

interface BookingDetail {
  id: string;
  bookingNumber: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  paidAmount: number;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
    photoUrl?: string | null;
    experience?: string | null; // Will be added to schema later
  } | null;
  groomer?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    photoUrl?: string | null;
    experience?: string | null;
  } | null;
  pets: Pet[];
  location?: {
    address: string;
    zipCode: string;
  } | null;
  notes?: string | null;
  specialRequests?: string | null;
  serviceType: string;
  serviceDescription?: string | null;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
}

// 상태에 따른 Badge variant 반환
function getStatusVariant(status: string): 'default' | 'secondary' | 'success' | 'destructive' {
  switch (status) {
    case 'GROOMER_CONFIRM':
    case 'CONFIRMED':
      return 'default';
    case 'WORK_IN_PROGRESS':
    case 'IN_PROGRESS':
      return 'default';
    case 'SERVICE_COMPLETED':
    case 'COMPLETED':
      return 'success';
    case 'SERVICE_CANCELLED':
    case 'BOOKING_FAILED':
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'secondary';
  }
}

// 상태 라벨 반환
function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    FIRST_PAYMENT_PENDING: '결제 대기',
    FIRST_PAYMENT_COMPLETE: '확인 대기',
    GROOMER_CONFIRM_PENDING: '확인 대기',
    GROOMER_CONFIRM: '예약 확정',
    WORK_IN_PROGRESS: '진행 중',
    SERVICE_COMPLETED: '완료',
    SERVICE_CANCELLED: '취소',
    BOOKING_FAILED: '예약 실패',
    CONFIRMED: '예약 확정',
    IN_PROGRESS: '진행 중',
    COMPLETED: '완료',
    CANCELLED: '취소',
    PENDING: '대기',
  };

  return statusMap[status] || status;
}

export default function GroomerBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery<BookingDetail>({
    queryKey: ['groomer', 'bookings', resolvedParams.id],
    queryFn: async () => {
      const response = await fetch(`/api/groomer/bookings/${resolvedParams.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Booking not found');
        }
        throw new Error('Failed to fetch booking details');
      }

      return response.json();
    },
  });

  const handleServiceUpdate = async (serviceId: string, status: string) => {
    try {
      // Update service status
      console.log('Updating service:', serviceId, status);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const completeAllMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/groomer/bookings/${resolvedParams.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '완료 처리에 실패했습니다');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomer', 'bookings', resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ['groomer', 'bookings'] });
      alert('모든 서비스가 완료되었습니다');
    },
    onError: (error: Error) => {
      console.error('Complete all services error:', error);
      alert(error.message || '완료 처리 중 오류가 발생했습니다');
    },
  });

  const handleCompleteAll = () => {
    if (!confirm('모든 서비스를 완료 처리하시겠습니까?')) {
      return;
    }
    completeAllMutation.mutate();
  };

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

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <AlertCircleIcon className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="text-lg font-semibold">예약을 찾을 수 없습니다</h3>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : '요청하신 예약 정보를 찾을 수 없습니다.'}
              </p>
              <Button onClick={() => router.push('/groomer/dashboard/bookings')}>
                예약 목록으로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
        {/* 헤더 */}
        <div className="mb-4 flex items-center space-x-2 sm:mb-6 sm:space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-1.5 sm:p-2">
            <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold sm:text-2xl">예약 관리</h1>
            <p className="text-muted-foreground truncate text-sm sm:text-base">
              예약 번호: #{booking.id}
            </p>
          </div>
        </div>

        {/* 기본 정보 */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center space-x-2 text-lg sm:space-x-3 sm:text-xl">
                <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>예약 정보</span>
              </CardTitle>
              <Badge variant={getStatusVariant(booking.status)} className="w-fit">
                {getStatusLabel(booking.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:space-y-6 sm:p-6 sm:pt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
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
                    <span className="font-medium">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-muted-foreground text-sm">총 서비스 금액</div>
                  <div className="mt-1 flex items-center space-x-2">
                    <CreditCardIcon className="h-4 w-4" />
                    <span className="text-lg font-medium">
                      {booking.totalAmount.toLocaleString('ko-KR')}원
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">결제 상태</div>
                  <Badge
                    variant={
                      booking.paymentStatus === 'PAID' || booking.paymentStatus === 'COMPLETED'
                        ? 'success'
                        : 'secondary'
                    }
                    className="mt-1"
                  >
                    {booking.paymentStatus === 'PAID' || booking.paymentStatus === 'COMPLETED'
                      ? '결제 완료'
                      : '결제 대기'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 고객, 미용사 및 반려동물 정보 */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:space-x-3 sm:text-xl">
              <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>예약 상세 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:space-y-6 sm:p-6 sm:pt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {/* 고객 정보 */}
              <div>
                <h4 className="mb-3 font-medium">고객 정보</h4>
                {booking.customer ? (
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">이름:</span> {booking.customer.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">연락처:</span>{' '}
                      {booking.customer.phone}
                    </div>
                    <div>
                      <span className="text-muted-foreground">이메일:</span>{' '}
                      {booking.customer.email}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">고객 정보가 없습니다</p>
                )}
              </div>

              {/* 미용사 정보 */}
              <div>
                <h4 className="mb-3 font-medium">담당 미용사</h4>
                {booking.groomer ? (
                  <div className="flex items-start space-x-3">
                    {booking.groomer.photoUrl ? (
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={booking.groomer.photoUrl}
                          alt={booking.groomer.name}
                          fill
                          className="rounded-full object-cover"
                          unoptimized // Bypass Next.js image optimization for GCS images
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
                        <UserIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">이름:</span> {booking.groomer.name}
                      </div>
                      <div>
                        <span className="text-muted-foreground">연락처:</span>{' '}
                        {booking.groomer.phone || '-'}
                      </div>
                      {booking.groomer.experience && (
                        <div>
                          <span className="text-muted-foreground">경력:</span>{' '}
                          {booking.groomer.experience}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">아직 미용사가 배정되지 않았습니다</p>
                )}
              </div>
            </div>

            {/* 서비스 주소 정보 */}
            {booking.location && (
              <div className="col-span-1 mt-4 sm:col-span-2 sm:mt-6">
                <h4 className="mb-3 text-base font-medium sm:text-lg">서비스 주소</h4>
                <div className="rounded-lg border bg-gray-50 p-3 sm:p-4 dark:bg-gray-900">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base">{booking.location.address}</p>
                      <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                        우편번호: {booking.location.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 반려동물 정보 - 여러 마리 지원 */}
            <div className="col-span-1 mt-4 sm:col-span-2 sm:mt-6">
              <h4 className="mb-3 text-base font-medium sm:text-lg">반려동물 정보</h4>
              <div className="space-y-3 sm:space-y-4">
                {booking.pets.map((pet) => (
                  <div key={pet.id} className="rounded-lg border p-3 sm:p-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      {pet.photoUrl ? (
                        <div className="relative h-12 w-12 flex-shrink-0 sm:h-16 sm:w-16">
                          <Image
                            src={pet.photoUrl}
                            alt={pet.name}
                            fill
                            className="rounded-full object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 sm:h-16 sm:w-16">
                          <UserIcon className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold sm:text-lg">{pet.name}</h3>
                        <p className="text-muted-foreground text-sm sm:text-base">
                          <span className="inline-block">
                            {pet.species} • {pet.breed}
                          </span>
                          <span className="ml-1 inline-block">
                            • {pet.weight}kg • {pet.age}세
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 서비스 관리 */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:space-x-3 sm:text-xl">
              <ScissorsIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>서비스 진행 관리</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-4 sm:space-y-6">
              {booking.pets.map((pet) => (
                <div key={pet.id}>
                  <h4 className="mb-2 text-base font-medium sm:mb-3 sm:text-lg">
                    {pet.name}의 서비스
                  </h4>
                  <div className="space-y-3">
                    {pet.services.map((service) => (
                      <div key={service.id} className="rounded-lg border p-3 sm:p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium sm:text-base">{service.name}</h4>
                            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                              {service.description}
                            </p>
                            <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3 text-xs sm:gap-4 sm:text-sm">
                              <span className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                {service.duration}분
                              </span>
                              <span className="flex items-center gap-1">
                                <CreditCardIcon className="h-3 w-3" />
                                {service.price.toLocaleString()}원
                              </span>
                            </div>
                          </div>

                          {/* 전체 예약이 완료되지 않은 경우에만 버튼 표시 */}
                          {booking.status !== 'SERVICE_COMPLETED' &&
                            booking.status !== 'COMPLETED' && (
                              <div className="mt-3 flex flex-row gap-2 sm:mt-0 sm:flex-col">
                                {(service.status === 'PENDING' ||
                                  service.status === 'GROOMER_CONFIRM' ||
                                  service.status === 'GROOMER_CONFIRM_PENDING') && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleServiceUpdate(service.id, 'IN_PROGRESS')}
                                    className="flex-1 text-xs sm:flex-initial sm:text-sm"
                                  >
                                    <PlayIcon className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    시작
                                  </Button>
                                )}
                                {(service.status === 'IN_PROGRESS' ||
                                  service.status === 'WORK_IN_PROGRESS') && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleServiceUpdate(service.id, 'COMPLETED')}
                                    className="flex-1 text-xs sm:flex-initial sm:text-sm"
                                  >
                                    <CheckCircleIcon className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    완료
                                  </Button>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    ))}

                    {/* Display service options */}
                    {pet.options && pet.options.length > 0 && (
                      <div className="mt-3 rounded-lg border border-dashed p-3 sm:p-4">
                        <h5 className="text-muted-foreground mb-2 text-sm font-medium">
                          추가 옵션
                        </h5>
                        <div className="space-y-2">
                          {pet.options.map((option, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-foreground">+ {option.name}</span>
                              <span className="font-medium">{option.price.toLocaleString()}원</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 특이사항 및 요청사항 */}
        {/* {(booking.notes || booking.specialRequests) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <AlertCircleIcon className="h-6 w-6" />
                <span>특이사항</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.specialRequests && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-amber-900 mb-1">고객 요청사항</h4>
                    <p className="text-sm text-amber-800">{booking.specialRequests}</p>
                  </div>
                )}
                {booking.notes && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">서비스 메모</h4>
                    <p className="text-sm text-blue-800">{booking.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* 액션 버튼 또는 완료 상태 메시지 */}
        {booking.status === 'SERVICE_COMPLETED' || booking.status === 'COMPLETED' ? (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-2 text-center">
                <CheckCircleIcon className="mx-auto h-10 w-10 text-green-500 sm:h-12 sm:w-12" />
                <h3 className="text-base font-semibold text-green-700 sm:text-lg">
                  서비스가 완료되었습니다
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {booking.actualEndTime
                    ? `완료 시간: ${format(new Date(booking.actualEndTime), 'yyyy-MM-dd HH:mm:ss', { locale: ko })}`
                    : '모든 서비스가 성공적으로 완료되었습니다'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              className="w-full flex-1 sm:w-auto"
              onClick={handleCompleteAll}
              disabled={booking.status === 'SERVICE_CANCELLED' || booking.status === 'CANCELLED'}
            >
              모든 서비스 완료
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

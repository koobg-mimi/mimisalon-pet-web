'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';

interface AdditionalService {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface BookingInfo {
  id: string;
  status: string;
  basePrice: number;
  serviceDate: string;
  serviceTime: string;
  customer: {
    name: string;
    phone?: string;
  };
  pets: Array<{
    name: string;
    breed: string;
    services: Array<{
      name: string;
      price: number;
    }>;
  }>;
}

export default function GroomerQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([
    { name: '', description: '', price: 0, quantity: 1 },
  ]);
  const [reason, setReason] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
    if (session?.user?.role && session.user.role !== 'GROOMER') {
      router.push('/dashboard');
    }
  }, [session, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['groomer', 'bookings', bookingId, 'quote'],
    queryFn: async () => {
      const response = await fetch(`/api/groomer/bookings/${bookingId}/quote`);
      if (!response.ok) {
        throw new Error('Failed to fetch booking');
      }
      return response.json();
    },
    enabled: !!session?.user && session.user.role === 'GROOMER' && !!bookingId,
  });

  const booking = data?.booking || null;

  useEffect(() => {
    if (data?.additionalServices?.length > 0) {
      setAdditionalServices(data.additionalServices);
    }
  }, [data]);

  const addService = () => {
    setAdditionalServices([
      ...additionalServices,
      { name: '', description: '', price: 0, quantity: 1 },
    ]);
  };

  const removeService = (index: number) => {
    if (additionalServices.length > 1) {
      setAdditionalServices(additionalServices.filter((_, i) => i !== index));
    }
  };

  const updateService = (index: number, field: keyof AdditionalService, value: string | number) => {
    const updated = [...additionalServices];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalServices(updated);
  };

  const getTotalAdditionalAmount = () => {
    return additionalServices.reduce((total, service) => {
      return total + service.price * service.quantity;
    }, 0);
  };

  const submitQuoteMutation = useMutation({
    mutationFn: async () => {
      const validServices = additionalServices.filter(
        (service) => service.name.trim() && service.price > 0
      );

      if (validServices.length === 0) {
        throw new Error('최소 하나 이상의 추가 서비스를 입력해주세요.');
      }

      const response = await fetch(`/api/groomer/bookings/${bookingId}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          additionalServices: validServices,
          totalAdditionalAmount: getTotalAdditionalAmount(),
          reason: reason.trim(),
          estimatedTime,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '견적 요청에 실패했습니다.');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomer', 'bookings', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['groomer', 'bookings'] });
      router.push(`/groomer/dashboard/bookings/${bookingId}?tab=quote`);
    },
    onError: (error: Error) => {
      console.error('Quote submission failed:', error);
      alert(error.message || '견적 요청 중 오류가 발생했습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuoteMutation.mutate();
  };

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session || session.user?.role !== 'GROOMER' || !booking) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-foreground text-2xl font-bold">추가 견적 작성</h1>
            <p className="text-muted-foreground text-sm">
              추가 서비스에 대한 견적을 작성하여 고객에게 요청하세요
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href={`/groomer/dashboard/bookings/${bookingId}`}>돌아가기</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-border bg-card rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">추가 서비스 항목</h2>

                <div className="space-y-4">
                  {additionalServices.map((service, index) => (
                    <div key={index} className="border-border bg-muted/50 rounded-lg border p-4">
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="font-medium">서비스 {index + 1}</h3>
                        {additionalServices.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeService(index)}
                          >
                            삭제
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-foreground mb-2 block text-sm font-medium">
                            서비스명 *
                          </label>
                          <input
                            type="text"
                            required
                            value={service.name}
                            onChange={(e) => updateService(index, 'name', e.target.value)}
                            placeholder="예: 털 엉킴 제거"
                            className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-foreground mb-2 block text-sm font-medium">
                            가격 (원) *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="1000"
                            value={service.price}
                            onChange={(e) =>
                              updateService(index, 'price', parseInt(e.target.value) || 0)
                            }
                            placeholder="10000"
                            className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-foreground mb-2 block text-sm font-medium">
                            수량
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={service.quantity}
                            onChange={(e) =>
                              updateService(index, 'quantity', parseInt(e.target.value) || 1)
                            }
                            className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-foreground mb-2 block text-sm font-medium">
                            소계
                          </label>
                          <div className="bg-muted rounded-md px-3 py-2">
                            {(service.price * service.quantity).toLocaleString()}원
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-foreground mb-2 block text-sm font-medium">
                            설명
                          </label>
                          <textarea
                            value={service.description}
                            onChange={(e) => updateService(index, 'description', e.target.value)}
                            placeholder="서비스에 대한 자세한 설명을 입력하세요"
                            rows={3}
                            className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button type="button" variant="outline" onClick={addService} className="mt-4">
                  + 서비스 추가
                </Button>
              </div>

              <div className="border-border bg-card rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">추가 정보</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-foreground mb-2 block text-sm font-medium">
                      추가 소요 시간 (분)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="15"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 0)}
                      placeholder="30"
                      className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-foreground mb-2 block text-sm font-medium">
                      추가 견적 사유
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="고객에게 전달할 추가 견적 사유를 입력하세요"
                      rows={3}
                      className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitQuoteMutation.isPending}>
                {submitQuoteMutation.isPending ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                견적 요청하기 ({getTotalAdditionalAmount().toLocaleString('ko-KR')}원)
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="border-border bg-card sticky top-8 rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">예약 정보</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">고객:</span> {booking.customer.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">연락처:</span> {booking.customer.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm">
                    <span className="font-medium">반려동물:</span>
                  </p>
                  {booking.pets.map((pet: BookingInfo['pets'][number], index: number) => (
                    <p key={index} className="text-muted-foreground text-sm">
                      {pet.name} ({pet.breed})
                    </p>
                  ))}
                </div>

                <div>
                  <p className="text-sm">
                    <span className="font-medium">예약일시:</span>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {booking.serviceDate} {booking.serviceTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm">
                    <span className="font-medium">기본 서비스:</span>
                  </p>
                  {booking.pets.map((pet: BookingInfo['pets'][number]) =>
                    pet.services.map(
                      (service: BookingInfo['pets'][number]['services'][number], index: number) => (
                        <p key={index} className="text-muted-foreground text-sm">
                          {service.name}: {service.price.toLocaleString()}원
                        </p>
                      )
                    )
                  )}
                </div>

                <div className="border-border border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">기본 금액</span>
                    <span className="text-sm">{booking.basePrice.toLocaleString()}원</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm">추가 금액</span>
                    <span className="text-sm">
                      {getTotalAdditionalAmount().toLocaleString('ko-KR')}원
                    </span>
                  </div>
                  <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                    <span className="text-lg font-semibold">총 예상 금액</span>
                    <span className="text-primary text-lg font-bold">
                      {format(
                        booking.basePrice + getTotalAdditionalAmount(),
                        'yyyy-MM-dd HH:mm:ss',
                        { locale: ko }
                      )}
                      원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

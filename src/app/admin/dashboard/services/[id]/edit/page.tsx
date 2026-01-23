'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, PlusIcon, MinusIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BreedSelector } from '@/components/admin/BreedSelector';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  basePrice: number;
  isActive: boolean;
  petTypes: ('DOG' | 'CAT')[];
  breedCategories?: string[];
  priceRanges?: ServicePriceRange[];
  requirements?: string;
  afterCareInstructions?: string;
}

interface ServicePriceRange {
  id: string;
  petType: 'DOG' | 'CAT';
  minWeight?: number;
  maxWeight?: number | null;
  price: number;
  selectedBreedIds?: string[];
}

// 서비스 수정 스키마
const serviceSchema = z.object({
  name: z
    .string()
    .min(1, '서비스명을 입력해주세요')
    .max(100, '서비스명은 최대 100자까지 입력 가능합니다'),
  description: z
    .string()
    .min(1, '서비스 설명을 입력해주세요')
    .max(500, '설명은 최대 500자까지 입력 가능합니다'),
  duration: z
    .string()
    .min(1, '소요시간을 입력해주세요')
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 30 && num <= 480;
    }, '30분 ~ 480분 사이의 값을 입력해주세요'),
  priceRanges: z
    .array(
      z.object({
        petType: z.enum(['DOG', 'CAT']),
        minWeight: z.number().min(0).nullable().optional(),
        maxWeight: z.number().nullable().optional(),
        price: z.number().min(5000),
        selectedBreedIds: z.array(z.string()).optional(),
      })
    )
    .min(1, '최소 하나의 가격 설정이 필요합니다'),
  requirements: z.string().max(300, '요구사항은 최대 300자까지 입력 가능합니다').optional(),
  afterCareInstructions: z
    .string()
    .max(500, '애프터케어 안내는 최대 500자까지 입력 가능합니다')
    .optional(),
  isActive: z.boolean().optional().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [priceRanges, setPriceRanges] = useState<ServicePriceRange[]>([]);

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: '60',
      priceRanges: [],
      requirements: '',
      afterCareInstructions: '',
      isActive: true,
    },
  });

  // Helper function to sync state and form
  const updatePriceRanges = (newRanges: ServicePriceRange[]) => {
    setPriceRanges(newRanges);
    form.setValue('priceRanges', newRanges);
  };

  // 서비스 데이터 조회
  const {
    data: service,
    isLoading,
    error,
  } = useQuery<Service>({
    queryKey: ['admin', 'services', resolvedParams.id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/services/${resolvedParams.id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '서비스를 찾을 수 없습니다');
      }
      return response.json();
    },
    enabled: !!session?.user && session.user.role === 'ADMIN',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // 서비스 데이터가 로드되면 폼 초기화
  useEffect(() => {
    if (service) {
      // 가격 범위 설정
      const ranges = service.priceRanges || [];

      // 폼에 데이터 채우기 (priceRanges 포함)
      form.reset({
        name: service.name,
        description: service.description,
        duration: service.duration.toString(),
        priceRanges: ranges,
        requirements: service.requirements || '',
        afterCareInstructions: service.afterCareInstructions || '',
        isActive: service.isActive,
      });

      // state도 동기화
      setPriceRanges(ranges);
    }
  }, [service, form]);

  // 서비스 수정 mutation
  const updateServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      // Ensure priceRanges are properly formatted
      const formattedPriceRanges = priceRanges.map((range) => ({
        petType: range.petType,
        minWeight: range.minWeight ?? 0,
        maxWeight: range.maxWeight ?? null,
        price: range.price,
        selectedBreedIds: range.selectedBreedIds || [],
      }));

      const payload = {
        ...data,
        duration: parseInt(data.duration),
        priceRanges: formattedPriceRanges,
      };

      const response = await fetch(`/api/admin/services/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `서비스 수정에 실패했습니다 (${response.status})`;
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: () => {
      // 쿼리 무효화하여 서비스 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'services', resolvedParams.id] });
      alert('서비스가 성공적으로 수정되었습니다!');
      router.push('/admin/dashboard/services');
    },
    onError: (error) => {
      console.error('Error updating service:', error);
      alert(error instanceof Error ? error.message : '오류가 발생했습니다');
    },
  });

  const handleSubmit = (data: ServiceFormData) => {
    updateServiceMutation.mutate(data);
  };

  // 에러 처리
  useEffect(() => {
    if (error) {
      alert(error instanceof Error ? error.message : '서비스를 불러오는데 실패했습니다');
      router.push('/admin/dashboard/services');
    }
  }, [error, router]);

  // 권한 체크
  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  if (!session || session.user?.role !== 'ADMIN') {
    router.push('/admin/dashboard/overview');
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로가기
        </Button>
        <div>
          <h1 className="text-2xl font-bold">서비스 수정</h1>
          <p className="text-muted-foreground">
            {service?.name
              ? `"${service.name}" 서비스의 정보를 수정합니다`
              : '서비스 정보를 수정해주세요'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>서비스 정보</CardTitle>
          <CardDescription>반려동물 미용 서비스의 기본 정보를 수정합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* 기본 정보 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      서비스명 <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="예: 기본 미용 패키지" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      서비스 설명 <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="서비스에 대한 자세한 설명을 입력해주세요..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>고객이 볼 수 있는 서비스 설명입니다</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 가격 및 시간 설정 */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      소요시간 (분) <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="30" max="480" placeholder="60" {...field} />
                    </FormControl>
                    <FormDescription>30분 ~ 8시간</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 가격 설정 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">가격 설정</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newRange: ServicePriceRange = {
                          id: Date.now().toString(),
                          petType: 'DOG',
                          minWeight: 0,
                          maxWeight: null,
                          price: 50000,
                          selectedBreedIds: [],
                        };
                        updatePriceRanges([...priceRanges, newRange]);
                      }}
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      가격 추가
                    </Button>
                  </div>
                  <CardDescription>
                    반려동물 타입과 무게 범위별로 가격을 설정하세요. 모든 무게 범위에 적용하려면
                    최소 무게를 0으로, 최대 무게를 비워두세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {priceRanges.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                      <p className="text-muted-foreground mb-2">가격 설정을 추가해주세요</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newRange: ServicePriceRange = {
                            id: Date.now().toString(),
                            petType: 'DOG',
                            minWeight: 0,
                            maxWeight: null,
                            price: 50000,
                            selectedBreedIds: [],
                          };
                          updatePriceRanges([newRange]);
                        }}
                      >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        가격 추가
                      </Button>
                    </div>
                  )}

                  <div className="space-y-6">
                    {priceRanges.map((range, index) => (
                      <div key={index} className="space-y-4 rounded-lg border p-4">
                        {/* First row: Price configuration */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                          <div>
                            <label className="text-sm font-medium">동물 종류</label>
                            <Select
                              value={range.petType}
                              onValueChange={(value: 'DOG' | 'CAT') => {
                                const newRanges = [...priceRanges];
                                newRanges[index].petType = value;
                                // Clear selected breeds when changing pet type
                                newRanges[index].selectedBreedIds = [];
                                updatePriceRanges(newRanges);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="DOG">강아지</SelectItem>
                                <SelectItem value="CAT">고양이</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium">최소 무게 (kg)</label>
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              value={range.minWeight ?? 0}
                              onChange={(e) => {
                                const newRanges = [...priceRanges];
                                newRanges[index].minWeight = parseFloat(e.target.value) || 0;
                                updatePriceRanges(newRanges);
                              }}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">최대 무게 (kg)</label>
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              value={range.maxWeight ?? ''}
                              placeholder="무제한"
                              onChange={(e) => {
                                const newRanges = [...priceRanges];
                                newRanges[index].maxWeight = e.target.value
                                  ? parseFloat(e.target.value)
                                  : null;
                                updatePriceRanges(newRanges);
                              }}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">가격 (원)</label>
                            <Input
                              type="number"
                              min="5000"
                              value={range.price}
                              onChange={(e) => {
                                const newRanges = [...priceRanges];
                                newRanges[index].price = parseInt(e.target.value) || 0;
                                updatePriceRanges(newRanges);
                              }}
                            />
                          </div>

                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newRanges = priceRanges.filter((_, i) => i !== index);
                                updatePriceRanges(newRanges);
                              }}
                            >
                              <MinusIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Second row: Breed selection */}
                        <div>
                          <BreedSelector
                            selectedBreedIds={range.selectedBreedIds || []}
                            onChange={(breedIds) => {
                              const newRanges = [...priceRanges];
                              newRanges[index].selectedBreedIds = breedIds;
                              updatePriceRanges(newRanges);
                            }}
                            petType={range.petType}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 추가 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">추가 정보</CardTitle>
                  <CardDescription>서비스 요구사항 및 안내사항 설정</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>서비스 요구사항</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="예: 예방접종 완료, 특정 건강 상태 필요 등..."
                            className="min-h-16"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>서비스 이용을 위한 필수 조건들</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="afterCareInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>애프터케어 안내</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="서비스 후 관리 방법이나 주의사항을 입력해주세요..."
                            className="min-h-16"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>고객에게 제공할 사후 관리 가이드</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>서비스 활성화</FormLabel>
                          <FormDescription>
                            체크하면 고객이 예약할 수 있는 서비스가 됩니다
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* 액션 버튼 */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={updateServiceMutation.isPending}
                >
                  취소
                </Button>
                <Button type="submit" disabled={updateServiceMutation.isPending}>
                  {updateServiceMutation.isPending ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  서비스 수정
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

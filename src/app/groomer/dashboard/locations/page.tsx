'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DaumPostcode } from '@/components/address/daum-postcode';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontalIcon,
  MapPinIcon,
  EditIcon,
  TrashIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  PlusCircleIcon,
} from 'lucide-react';

interface WorkArea {
  id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  address?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkAreaForm {
  name: string;
  radiusKm: number;
  address: string;
  zonecode: string;
  description: string;
}

export default function GroomerWorkAreasPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingWorkArea, setEditingWorkArea] = useState<WorkArea | null>(null);
  const [formData, setFormData] = useState<WorkAreaForm>({
    name: '',
    radiusKm: 0.5,
    address: '',
    zonecode: '',
    description: '',
  });

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
    if (session?.user?.role && session.user.role !== 'GROOMER') {
      router.push('/dashboard');
    }
  }, [session, router]);

  const { data: workAreas = [], isLoading } = useQuery<WorkArea[]>({
    queryKey: ['groomer', 'work-areas'],
    queryFn: async () => {
      const response = await fetch('/api/groomer/work-areas');
      if (!response.ok) {
        throw new Error('Failed to fetch work areas');
      }
      return response.json();
    },
    enabled: !!session?.user && session.user.role === 'GROOMER',
  });

  const handleInputChange = (
    field: keyof WorkAreaForm,
    value: WorkAreaForm[keyof WorkAreaForm]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressComplete = (addressData: {
    address: string;
    zonecode: string;
    buildingName?: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      address: addressData.address,
      zonecode: addressData.zonecode,
    }));
  };

  const createWorkAreaMutation = useMutation({
    mutationFn: async (data: WorkAreaForm) => {
      const response = await fetch('/api/groomer/work-areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create work area');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomer', 'work-areas'] });
      setShowForm(false);
      setEditingWorkArea(null);
      resetForm();
    },
  });

  const updateWorkAreaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: WorkAreaForm }) => {
      const response = await fetch(`/api/groomer/work-areas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update work area');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomer', 'work-areas'] });
      setShowForm(false);
      setEditingWorkArea(null);
      resetForm();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWorkArea) {
      updateWorkAreaMutation.mutate({ id: editingWorkArea.id, data: formData });
    } else {
      createWorkAreaMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      radiusKm: 0.5,
      address: '',
      zonecode: '',
      description: '',
    });
  };

  const handleEdit = (workArea: WorkArea) => {
    setEditingWorkArea(workArea);
    setFormData({
      name: workArea.name,
      radiusKm: workArea.radiusKm,
      address: workArea.address || '',
      zonecode: '',
      description: workArea.description || '',
    });
    setShowForm(true);
  };

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(`/api/groomer/work-areas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle work area status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomer', 'work-areas'] });
    },
  });

  const deleteWorkAreaMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/groomer/work-areas/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete work area');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomer', 'work-areas'] });
    },
  });

  const handleToggleActive = (workAreaId: string, isActive: boolean) => {
    toggleActiveMutation.mutate({ id: workAreaId, isActive });
  };

  const handleDelete = (workAreaId: string) => {
    if (!confirm('정말로 이 근무 장소를 삭제하시겠습니까?')) {
      return;
    }
    deleteWorkAreaMutation.mutate(workAreaId);
  };

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session || session.user?.role !== 'GROOMER') {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-foreground text-xl font-bold sm:text-2xl">근무 장소 관리</h1>
              <p className="text-muted-foreground text-sm">근무 장소와 서비스 범위를 설정하세요</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Button
                onClick={() => {
                  setShowForm(true);
                  setEditingWorkArea(null);
                  resetForm();
                }}
                className="w-full sm:w-auto"
              >
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">새 근무 장소 등록</span>
                <span className="sm:hidden">근무 장소 추가</span>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/groomer/dashboard/overview">대시보드</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Dialog for Add/Edit Work Area */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingWorkArea ? '근무 장소 정보 수정' : '새 근무 장소 등록'}
              </DialogTitle>
              <DialogDescription>
                {editingWorkArea
                  ? '근무 장소 정보를 수정하세요'
                  : '새로운 근무 장소를 등록하여 서비스 지역을 확대하세요'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">근무 장소명 *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="border-input bg-background min-h-[44px] w-full rounded-md border px-3 py-2"
                    placeholder="예: 강남구 주변, 홍대 근처"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">서비스 반경 (km) *</label>
                  <input
                    type="number"
                    required
                    min="0.5"
                    max="50"
                    step="0.1"
                    value={formData.radiusKm}
                    onChange={(e) => handleInputChange('radiusKm', parseFloat(e.target.value))}
                    className="border-input bg-background min-h-[44px] w-full rounded-md border px-3 py-2"
                    placeholder="0.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">중심 주소 *</label>
                <div className="space-y-2">
                  <DaumPostcode
                    onComplete={handleAddressComplete}
                    placeholder="주소 검색"
                    className="w-full"
                  />
                  {formData.address && (
                    <input
                      type="text"
                      value={formData.address}
                      readOnly
                      className="border-input bg-muted min-h-[44px] w-full rounded-md border px-3 py-2 text-sm"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="border-input bg-background w-full resize-none rounded-md border px-3 py-2"
                  placeholder="근무 장소에 대한 설명을 입력하세요"
                />
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingWorkArea(null);
                    resetForm();
                  }}
                  className="w-full sm:w-auto"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={createWorkAreaMutation.isPending || updateWorkAreaMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {createWorkAreaMutation.isPending || updateWorkAreaMutation.isPending ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : null}
                  {editingWorkArea ? '수정' : '등록'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {workAreas.length === 0 ? (
          <div className="py-8 text-center sm:py-12">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <MapPinIcon className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-2 text-base font-medium sm:text-lg">
              등록된 근무 장소가 없습니다
            </h3>
            <p className="text-muted-foreground mb-4 px-4 text-sm">
              첫 번째 근무 장소를 등록해보세요.
            </p>
            <Button
              onClick={() => {
                setShowForm(true);
                setEditingWorkArea(null);
                resetForm();
              }}
              className="mx-auto w-full max-w-xs sm:w-auto"
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              근무 장소 등록하기
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {workAreas.map((workArea) => (
              <div key={workArea.id} className="border-border bg-card rounded-lg border p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold sm:text-lg">
                        {workArea.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          workArea.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {workArea.isActive ? '활성' : '비활성'}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        반경 {workArea.radiusKm}km
                      </span>
                    </div>
                    {workArea.address && (
                      <p className="text-muted-foreground mb-2 text-sm break-words sm:text-base">
                        <MapPinIcon className="mr-1 inline-block h-4 w-4" />
                        {workArea.address}
                      </p>
                    )}
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      중심좌표: {workArea.centerLat.toFixed(4)}, {workArea.centerLng.toFixed(4)}
                    </p>
                    {workArea.description && (
                      <p className="text-muted-foreground mt-2 text-xs break-words sm:text-sm">
                        {workArea.description}
                      </p>
                    )}
                  </div>

                  {/* Desktop Actions */}
                  <div className="hidden items-center space-x-2 sm:flex">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(workArea)}
                      disabled={toggleActiveMutation.isPending || deleteWorkAreaMutation.isPending}
                    >
                      <EditIcon className="mr-1 h-4 w-4" />
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(workArea.id, workArea.isActive)}
                      disabled={toggleActiveMutation.isPending || deleteWorkAreaMutation.isPending}
                    >
                      {workArea.isActive ? (
                        <>
                          <ToggleLeftIcon className="mr-1 h-4 w-4" />
                          비활성화
                        </>
                      ) : (
                        <>
                          <ToggleRightIcon className="mr-1 h-4 w-4" />
                          활성화
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(workArea.id)}
                      disabled={toggleActiveMutation.isPending || deleteWorkAreaMutation.isPending}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="mr-1 h-4 w-4" />
                      삭제
                    </Button>
                  </div>

                  {/* Mobile Actions Dropdown */}
                  <div className="sm:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <MoreHorizontalIcon className="mr-2 h-4 w-4" />
                          작업 선택
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleEdit(workArea)}
                          disabled={
                            toggleActiveMutation.isPending || deleteWorkAreaMutation.isPending
                          }
                        >
                          <EditIcon className="mr-2 h-4 w-4" />
                          정보 수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(workArea.id, workArea.isActive)}
                          disabled={
                            toggleActiveMutation.isPending || deleteWorkAreaMutation.isPending
                          }
                        >
                          {workArea.isActive ? (
                            <>
                              <ToggleLeftIcon className="mr-2 h-4 w-4" />
                              비활성화
                            </>
                          ) : (
                            <>
                              <ToggleRightIcon className="mr-2 h-4 w-4" />
                              활성화
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(workArea.id)}
                          disabled={
                            toggleActiveMutation.isPending || deleteWorkAreaMutation.isPending
                          }
                          className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

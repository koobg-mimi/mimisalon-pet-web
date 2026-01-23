'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Shield, Mail, Phone, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Image from 'next/image';

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: string | null;
  profileImage: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export default function AdminDashboardProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
    if (session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/admin/dashboard/overview');
    }
  }, [session, router]);

  const { data: profile, isLoading } = useQuery<AdminProfile>({
    queryKey: ['admin', 'profile'],
    queryFn: async () => {
      const response = await fetch('/api/admin/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!session?.user && session.user.role === 'ADMIN',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: {
      name: string;
      phoneNumber: string;
      address: string;
      dateOfBirth: string;
    }) => {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'profile'] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    },
  });

  const handleProfileUpdate = (formData: FormData) => {
    const updates = {
      name: formData.get('name') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      address: formData.get('address') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
    };
    updateProfileMutation.mutate(updates);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd', { locale: ko });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss', { locale: ko });
  };

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session || session.user?.role !== 'ADMIN' || !profile) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <User className="text-primary h-6 w-6" />
                <h1 className="text-foreground text-3xl font-bold">내 프로필</h1>
              </div>
              <p className="text-muted-foreground">관리자 계정 정보를 관리하세요</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="border-border bg-card rounded-lg border p-6">
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={profile.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <Shield className="text-primary h-12 w-12" />
                  )}
                </div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-muted-foreground mb-2 text-sm">{profile.email}</p>
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">관리자</span>
                </div>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>가입일: {formatDate(profile.createdAt)}</span>
                  </div>
                  {profile.lastLoginAt && (
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>최근 로그인: {formatDateTime(profile.lastLoginAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="border-border bg-card rounded-lg border">
              <div className="border-border flex items-center justify-between border-b p-6">
                <h3 className="text-lg font-semibold">개인 정보</h3>
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? '취소' : '수정'}
                </Button>
              </div>

              {isEditing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleProfileUpdate(formData);
                  }}
                  className="space-y-6 p-6"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">이름</label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={profile.name}
                        className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">이메일</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="border-input bg-muted text-muted-foreground w-full rounded-md border px-3 py-2"
                      />
                      <p className="text-muted-foreground mt-1 text-xs">
                        이메일은 변경할 수 없습니다
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">전화번호</label>
                      <PhoneInput
                        name="phoneNumber"
                        defaultCountry="KR"
                        defaultValue={profile.phoneNumber || ''}
                        placeholder="전화번호를 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">생년월일</label>
                      <input
                        name="dateOfBirth"
                        type="date"
                        defaultValue={profile.dateOfBirth || ''}
                        className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">주소</label>
                    <input
                      name="address"
                      type="text"
                      defaultValue={profile.address || ''}
                      className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <div className="border-border flex gap-2 border-t pt-4">
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? '저장 중...' : '저장'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      취소
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm font-medium">이름</span>
                      </div>
                      <p className="text-muted-foreground pl-6 text-sm">{profile.name}</p>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Mail className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm font-medium">이메일</span>
                      </div>
                      <p className="text-muted-foreground pl-6 text-sm">{profile.email}</p>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Phone className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm font-medium">전화번호</span>
                      </div>
                      <p className="text-muted-foreground pl-6 text-sm">
                        {profile.phoneNumber || '등록되지 않음'}
                      </p>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm font-medium">생년월일</span>
                      </div>
                      <p className="text-muted-foreground pl-6 text-sm">
                        {profile.dateOfBirth ? formatDate(profile.dateOfBirth) : '등록되지 않음'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="mb-2 flex items-center gap-2">
                      <Settings className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">주소</span>
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      {profile.address || '등록되지 않음'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Account Information */}
            <div className="border-border bg-card mt-6 rounded-lg border">
              <div className="border-border border-b p-6">
                <h3 className="text-lg font-semibold">계정 정보</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Shield className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">역할</span>
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">
                        관리자 (ADMIN)
                      </span>
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Settings className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">계정 상태</span>
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          profile.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {profile.isActive ? '활성' : '비활성'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">계정 생성일</span>
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      {formatDateTime(profile.createdAt)}
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">최근 수정일</span>
                    </div>
                    <p className="text-muted-foreground pl-6 text-sm">
                      {formatDateTime(profile.updatedAt)}
                    </p>
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

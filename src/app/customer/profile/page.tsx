'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useSession } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { AddressList } from '@/components/address/AddressList';
import { AddressModal } from '@/components/address/AddressModal';
import { useAddresses } from '@/hooks/useAddresses';
import Link from 'next/link';
import { PhoneUpdateForm } from '@/components/auth/phone-update-form';
import { ChangePasswordForm } from '@/components/profile/change-password-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  phoneVerifiedAt?: string;
  createdAt: string;
  role: string;
  addresses?: Address[];
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  centerLat?: number;
  centerLng?: number;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  // Address management states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();
  const [addressModalMode, setAddressModalMode] = useState<'create' | 'edit'>('create');

  // Password change state
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);

  // Use the addresses hook
  const {
    addresses,
    isLoading: addressesLoading,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
    if (session?.user?.role && session.user.role !== 'CUSTOMER') {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Fetch profile using React Query
  const {
    data: profile,
    isLoading,
    refetch: refetchProfile,
  } = useQuery<UserProfile>({
    queryKey: ['customer', 'profile'],
    queryFn: async () => {
      const response = await fetch('/api/customer/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
    enabled: !!session?.user && session.user.role === 'CUSTOMER',
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string }) => {
      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'profile'] });
      setIsEditing(false);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    await updateProfileMutation.mutateAsync(formData);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
      });
    }
    setIsEditing(false);
  };

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session || session.user?.role !== 'CUSTOMER' || !profile) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <PageHeader title="프로필 설정" description="개인정보와 계정 설정을 관리하세요">
          <Button variant="outline" asChild>
            <Link href="/customer/dashboard/overview">대시보드</Link>
          </Button>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="border-border bg-card rounded-lg border">
            <div className="border-border border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">기본 정보</h2>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>편집</Button>
                ) : (
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updateProfileMutation.isPending}
                    >
                      취소
                    </Button>
                    <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : null}
                      저장
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">이름</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                      placeholder="이름을 입력하세요"
                    />
                  ) : (
                    <p className="text-foreground">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">이메일</label>
                  <p className="text-foreground">{profile.email}</p>
                  <p className="text-muted-foreground mt-1 text-xs">이메일은 변경할 수 없습니다</p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-foreground mb-2 block text-sm font-medium">전화번호</label>
                  <p className="text-foreground mb-3">{profile.phone || '등록되지 않음'}</p>
                  <p className="text-muted-foreground mb-3 text-xs">
                    전화번호 변경 및 인증은 아래에서 진행하세요
                  </p>
                  <PhoneUpdateForm variant="inline" />
                </div>

                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">가입일</label>
                  <p className="text-foreground">
                    {format(new Date(profile.createdAt), 'yyyy-MM-dd', { locale: ko })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Management Section */}
          <div className="border-border bg-card mt-8 rounded-lg border">
            <div className="border-border border-b p-6">
              <h2 className="text-lg font-semibold">주소 관리</h2>
            </div>
            <div className="p-6">
              <AddressList
                addresses={addresses}
                isLoading={addressesLoading}
                onAdd={() => {
                  setSelectedAddress(undefined);
                  setAddressModalMode('create');
                  setIsAddressModalOpen(true);
                }}
                onEdit={(address) => {
                  setSelectedAddress(address);
                  setAddressModalMode('edit');
                  setIsAddressModalOpen(true);
                }}
                onDelete={deleteAddress}
                onSetDefault={setDefaultAddress}
              />
            </div>
          </div>

          <div className="border-border bg-card mt-8 rounded-lg border">
            <div className="border-border border-b p-6">
              <h2 className="text-lg font-semibold">계정 설정</h2>
            </div>
            <div className="space-y-4 p-6">
              {/* Password Change Section */}
              <Collapsible open={isPasswordSectionOpen} onOpenChange={setIsPasswordSectionOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="hover:bg-accent/50 -m-3 flex items-center justify-between rounded-lg p-3 transition-colors">
                    <div className="text-left">
                      <h3 className="font-medium">비밀번호 변경</h3>
                      <p className="text-muted-foreground text-sm">
                        계정 보안을 위해 정기적으로 비밀번호를 변경하세요
                      </p>
                    </div>
                    <ChevronDown
                      className={`text-muted-foreground h-5 w-5 transition-transform ${
                        isPasswordSectionOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <ChangePasswordForm
                    onSuccess={() => {
                      // Collapse the section after successful password change
                      setIsPasswordSectionOpen(false);
                    }}
                  />
                </CollapsibleContent>
              </Collapsible>

              <div className="border-border border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">알림 설정</h3>
                    <p className="text-muted-foreground text-sm">
                      예약 알림 및 마케팅 수신 설정을 관리하세요
                    </p>
                  </div>
                  <Button variant="outline">설정</Button>
                </div>
              </div>

              <div className="border-border border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-destructive font-medium">계정 삭제</h3>
                    <p className="text-muted-foreground text-sm">
                      계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다
                    </p>
                  </div>
                  <Button variant="outline" className="text-destructive border-destructive">
                    계정 삭제
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setSelectedAddress(undefined);
        }}
        onSave={async (addressData) => {
          try {
            if (!addressData.street) {
              throw new Error('Street address is required');
            }
            const completeAddressData = {
              name: addressData.name || '',
              street: addressData.street,
              detailAddress: addressData.detailAddress || '',
              city: addressData.city || '',
              state: addressData.state || '',
              zipCode: addressData.zipCode || '',
              isDefault: addressData.isDefault || false,
            };
            if (addressModalMode === 'edit' && selectedAddress) {
              await updateAddress(selectedAddress.id, completeAddressData);
            } else {
              await createAddress(completeAddressData);
            }
            setIsAddressModalOpen(false);
          } catch (error) {
            console.error('Failed to save address:', error);
          }
        }}
        address={selectedAddress}
        mode={addressModalMode}
      />
    </div>
  );
}

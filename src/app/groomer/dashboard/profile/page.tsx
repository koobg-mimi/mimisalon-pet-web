'use client'

import { ko } from 'date-fns/locale'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/ui/phone-input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/layout/PageHeader'
import Link from 'next/link'
import { PhoneUpdateForm } from '@/components/auth/phone-update-form'
import { ProfileImageUpload } from '@/components/profile/ProfileImageUpload'
import { formatAccountNumber, KOREAN_BANKS, validateAccountNumber } from '@/lib/constants/banks'
import { ChangePasswordForm } from '@/components/profile/change-password-form'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'

interface GroomerProfile {
  id: string
  name: string
  email: string
  phone?: string
  phoneVerified?: boolean
  phoneVerifiedAt?: string
  bio?: string
  experience: number
  certifications: Array<{
    id: string
    name: string
    issuer: string
    issuedAt: string
    expiresAt?: string
  }>
  profileImage?: string
  averageRating: number
  totalReviews: number
  totalBookings: number
  joinedAt: string
  isVerified: boolean
  isActive: boolean
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  birthDate?: string | null
  bankName?: string | null
  bankAccountNumber?: string | null
  bankAccountHolderName?: string | null
}

interface ProfileForm {
  name: string
  phone: string
  bio: string
  experience: number
  birthDate: string
}

interface BankAccountForm {
  bankName: string
  accountNumber: string
  accountHolder: string
}

export default function GroomerProfilePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingBank, setIsEditingBank] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [bankError, setBankError] = useState<string | null>(null)
  const [bankValidationError, setBankValidationError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileForm>({
    name: '',
    phone: '',
    bio: '',
    experience: 0,
    birthDate: '',
  })
  const [bankFormData, setBankFormData] = useState<BankAccountForm>({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  })

  // Password change state
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'GROOMER') {
      router.push('/dashboard')
    }
  }, [session, router])

  const { data: profile, isLoading } = useQuery<GroomerProfile>({
    queryKey: ['groomer', 'profile'],
    queryFn: async () => {
      const response = await fetch('/api/groomer/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      return response.json()
    },
    enabled: !!session?.user && session.user.role === 'GROOMER',
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        experience: profile.experience || 0,
        birthDate: profile.birthDate
          ? format(parseISO(profile.birthDate), 'yyyy-MM-dd', { locale: ko })
          : '',
      })
      setBankFormData({
        bankName: profile.bankName || '',
        accountNumber: profile.bankAccountNumber || '',
        accountHolder: profile.bankAccountHolderName || '',
      })
    }
  }, [profile])

  const handleInputChange = useCallback(
    (field: keyof ProfileForm, value: ProfileForm[keyof ProfileForm]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    },
    []
  )

  const handleBankInputChange = useCallback(
    (field: keyof BankAccountForm, value: BankAccountForm[keyof BankAccountForm]) => {
      setBankFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    },
    []
  )

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const response = await fetch('/api/groomer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to update profile' }))
        throw new Error(error.error || 'Failed to update profile')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomer', 'profile'] })
      setIsEditing(false)
      setProfileError(null)
    },
    onError: (error: Error) => {
      console.error('Failed to update profile:', error)
      setProfileError(error.message || '프로필 업데이트에 실패했습니다.')
    },
  })

  const updateBankAccountMutation = useMutation({
    mutationFn: async (data: BankAccountForm) => {
      const response = await fetch('/api/groomer/profile/bank-account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: 'Failed to update bank account' }))
        throw new Error(error.error || 'Failed to update bank account')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomer', 'profile'] })
      setIsEditingBank(false)
      setBankError(null)
      setBankValidationError(null)
    },
    onError: (error: Error) => {
      console.error('Failed to update bank account:', error)
      setBankError(error.message || '계좌 정보 업데이트에 실패했습니다.')
    },
  })

  const handleSave = () => {
    updateProfileMutation.mutate(formData)
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        experience: profile.experience || 0,
        birthDate: profile.birthDate
          ? format(parseISO(profile.birthDate), 'yyyy-MM-dd', { locale: ko })
          : '',
      })
    }
    setIsEditing(false)
  }

  const handleSaveBank = () => {
    // Clear previous errors
    setBankValidationError(null)
    setBankError(null)

    // Validate bank name
    if (!bankFormData.bankName) {
      setBankValidationError('은행을 선택해주세요.')
      return
    }

    // Validate account number
    if (!bankFormData.accountNumber) {
      setBankValidationError('계좌번호를 입력해주세요.')
      return
    }

    if (!validateAccountNumber(bankFormData.accountNumber)) {
      setBankValidationError('올바른 계좌번호 형식이 아닙니다. (8-20자리 숫자)')
      return
    }

    // Validate account holder name
    if (!bankFormData.accountHolder) {
      setBankValidationError('예금주명을 입력해주세요.')
      return
    }

    updateBankAccountMutation.mutate(bankFormData)
  }

  const handleCancelBank = () => {
    if (profile) {
      setBankFormData({
        bankName: profile.bankName || '',
        accountNumber: profile.bankAccountNumber || '',
        accountHolder: profile.bankAccountHolderName || '',
      })
    }
    setIsEditingBank(false)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50'
      case 'INACTIVE':
        return 'text-gray-600 bg-gray-50'
      case 'SUSPENDED':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '활성'
      case 'INACTIVE':
        return '비활성'
      case 'SUSPENDED':
        return '정지'
      default:
        return status
    }
  }

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'GROOMER' || !profile) {
    return null
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <PageHeader title="프로필 설정" description="미용사 프로필과 정보를 관리하세요">
          <Button variant="outline" asChild>
            <Link href="/groomer/dashboard/overview">대시보드</Link>
          </Button>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="border-border bg-card rounded-lg border">
            <div className="border-border border-b p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-semibold sm:text-lg">기본 정보</h2>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                    편집
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updateProfileMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {updateProfileMutation.isPending ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : null}
                      저장
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 md:col-span-2">
                  <ProfileImageUpload
                    currentImageUrl={profile.profileImage || undefined}
                    userName={profile.name || undefined}
                    onImageUpdate={() => {
                      queryClient.invalidateQueries({ queryKey: ['groomer', 'profile'] })
                    }}
                  />
                  <div className="text-center sm:text-left">
                    <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <h3 className="text-lg font-semibold sm:text-xl">{profile.name}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(profile.status)}`}
                      >
                        {getStatusText(profile.status)}
                      </span>
                      {profile.isVerified && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          인증됨
                        </span>
                      )}
                      {!profile.isActive && (
                        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                          예약 비활성
                        </span>
                      )}
                    </div>
                    {!profile.isActive && (
                      <div className="mb-3 rounded-lg bg-orange-50 p-3 text-left">
                        <p className="text-xs text-orange-700 sm:text-sm">
                          ⚠️ 현재 고객의 예약을 받을 수 없는 상태입니다. 고객센터에 문의하여 활성화를 요청하세요.
                        </p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:justify-start sm:gap-4 sm:text-sm">
                      {renderStars(profile.averageRating)}
                      <span className="text-muted-foreground">{profile.totalReviews}개 리뷰</span>
                      <span className="text-muted-foreground">{profile.totalBookings}건 완료</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-foreground mb-2 block text-xs font-medium sm:text-sm">
                    이름
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="이름을 입력하세요"
                    />
                  ) : (
                    <p className="text-foreground text-sm sm:text-base">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-foreground mb-2 block text-xs font-medium sm:text-sm">
                    이메일
                  </label>
                  <p className="text-foreground text-sm break-all sm:text-base">{profile.email}</p>
                  <p className="text-muted-foreground mt-1 text-xs">이메일은 변경할 수 없습니다</p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-foreground mb-2 block text-xs font-medium sm:text-sm">
                    전화번호
                  </label>
                  <p className="text-foreground mb-3 text-sm sm:text-base">
                    {profile.phone || '등록되지 않음'}
                  </p>
                  <p className="text-muted-foreground mb-3 text-xs">
                    전화번호 변경 및 인증은 아래에서 진행하세요
                  </p>
                  <PhoneUpdateForm variant="inline" />
                </div>

                <div>
                  <label className="text-foreground mb-2 block text-xs font-medium sm:text-sm">
                    경력 (년)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange('experience', parseInt(e.target.value) || 0)
                      }
                      className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="경력 년수를 입력하세요"
                    />
                  ) : (
                    <p className="text-foreground text-sm sm:text-base">{profile.experience}년</p>
                  )}
                </div>

                <div>
                  <label className="text-foreground mb-2 block text-xs font-medium sm:text-sm">
                    생년월일
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                    />
                  ) : (
                    <p className="text-foreground text-sm sm:text-base">
                      {profile.birthDate
                        ? format(new Date(profile.birthDate), 'yyyy-MM-dd', { locale: ko })
                        : '등록되지 않음'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-foreground mb-2 block text-xs font-medium sm:text-sm">
                    자기소개
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="자기소개를 입력하세요"
                    />
                  ) : (
                    <p className="text-foreground text-sm break-words sm:text-base">
                      {profile.bio || '자기소개가 없습니다'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-foreground mb-2 block text-xs font-medium sm:text-sm">
                    가입일
                  </label>
                  <p className="text-foreground text-sm sm:text-base">
                    {format(new Date(profile.joinedAt), 'yyyy-MM-dd', { locale: ko })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Account Section */}
          <div className="border-border bg-card rounded-lg border">
            <div className="border-border border-b p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold sm:text-lg">계좌 정보</h2>
                  <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                    정산을 위한 계좌 정보를 관리하세요
                  </p>
                </div>
                {!isEditingBank ? (
                  <Button
                    onClick={() => setIsEditingBank(true)}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    수정
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="outline"
                      onClick={handleCancelBank}
                      disabled={updateBankAccountMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleSaveBank}
                      disabled={updateBankAccountMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {updateBankAccountMutation.isPending ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : null}
                      저장
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {/* Error messages */}
              {(bankValidationError || bankError) && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {bankValidationError || bankError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="bank-select"
                    className="text-foreground mb-2 block text-xs font-medium sm:text-sm"
                  >
                    은행
                  </label>
                  {isEditingBank ? (
                    <select
                      id="bank-select"
                      value={bankFormData.bankName}
                      onChange={(e) => handleBankInputChange('bankName', e.target.value)}
                      className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                      aria-label="은행 선택"
                      aria-required="true"
                    >
                      <option value="">은행을 선택하세요</option>
                      {KOREAN_BANKS.map((bank) => (
                        <option key={bank.code} value={bank.name}>
                          {bank.displayName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-foreground text-sm sm:text-base">
                      {profile.bankName || '등록되지 않음'}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="account-number"
                    className="text-foreground mb-2 block text-xs font-medium sm:text-sm"
                  >
                    계좌번호
                  </label>
                  {isEditingBank ? (
                    <input
                      id="account-number"
                      type="text"
                      value={bankFormData.accountNumber}
                      onChange={(e) => handleBankInputChange('accountNumber', e.target.value)}
                      className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="계좌번호를 입력하세요"
                      aria-label="계좌번호"
                      aria-required="true"
                      aria-describedby="account-number-hint"
                    />
                  ) : (
                    <p className="text-foreground text-sm sm:text-base">
                      {profile.bankAccountNumber
                        ? formatAccountNumber(profile.bankAccountNumber)
                        : '등록되지 않음'}
                    </p>
                  )}
                  {isEditingBank && (
                    <span id="account-number-hint" className="text-muted-foreground mt-1 text-xs">
                      8-20자리 숫자로 입력해주세요
                    </span>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="account-holder"
                    className="text-foreground mb-2 block text-xs font-medium sm:text-sm"
                  >
                    예금주
                  </label>
                  {isEditingBank ? (
                    <input
                      id="account-holder"
                      type="text"
                      value={bankFormData.accountHolder}
                      onChange={(e) => handleBankInputChange('accountHolder', e.target.value)}
                      className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="예금주명을 입력하세요"
                      aria-label="예금주명"
                      aria-required="true"
                    />
                  ) : (
                    <p className="text-foreground text-sm sm:text-base">
                      {profile.bankAccountHolderName || '등록되지 않음'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {profile.certifications.length > 0 && (
            <div className="border-border bg-card rounded-lg border">
              <div className="border-border border-b p-4 sm:p-6">
                <h2 className="text-base font-semibold sm:text-lg">자격증 및 인증</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid gap-3 sm:gap-4">
                  {profile.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="border-border flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                    >
                      <div className="flex-1">
                        <h3 className="text-sm font-medium sm:text-base">{cert.name}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">{cert.issuer}</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          발급일: {format(new Date(cert.issuedAt), 'yyyy-MM-dd', { locale: ko })}
                          {cert.expiresAt && (
                            <>
                              {' '}
                              • 만료일:{' '}
                              {format(new Date(cert.expiresAt), 'yyyy-MM-dd', { locale: ko })}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="self-center text-green-600 sm:self-auto">
                        <svg
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="border-border bg-card rounded-lg border">
            <div className="border-border border-b p-4 sm:p-6">
              <h2 className="text-base font-semibold sm:text-lg">계정 설정</h2>
            </div>
            <div className="space-y-4 p-4 sm:p-6">
              {/* Password Change Section */}
              <Collapsible open={isPasswordSectionOpen} onOpenChange={setIsPasswordSectionOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="hover:bg-accent/50 -m-3 flex items-center justify-between rounded-lg p-3 transition-colors">
                    <div className="text-left">
                      <h3 className="text-sm font-medium sm:text-base">비밀번호 변경</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">
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
                      setIsPasswordSectionOpen(false)
                    }}
                  />
                </CollapsibleContent>
              </Collapsible>

              <div className="border-border border-t pt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium sm:text-base">알림 설정</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      예약 알림 및 마케팅 수신 설정을 관리하세요
                    </p>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">
                    설정
                  </Button>
                </div>
              </div>

              <div className="border-border border-t pt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <h3 className="text-destructive text-sm font-medium sm:text-base">계정 삭제</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive w-full sm:w-auto"
                  >
                    계정 삭제
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

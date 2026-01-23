'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPinIcon, SearchIcon } from 'lucide-react'
import { billingAddressSchema, type BillingAddress } from '@/lib/validations/payment'
import { cn } from '@/lib/utils'

interface BillingAddressFormProps {
  defaultValues?: Partial<BillingAddress>
  onAddressChange: (address: BillingAddress) => void
  className?: string
}

export function BillingAddressForm({
  defaultValues,
  onAddressChange,
  className,
}: BillingAddressFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<BillingAddress>({
    resolver: zodResolver(billingAddressSchema),
    defaultValues: defaultValues || {},
    mode: 'onChange',
  })

  const watchedValues = watch()

  const onSubmit = (data: BillingAddress) => {
    onAddressChange(data)
  }

  // 실제 주소 검색 API 연동이 필요한 부분
  const handleAddressSearch = () => {
    // 다음(카카오) 주소 검색 API 또는 기타 주소 검색 서비스 연동
    // 여기서는 placeholder로 작성
    console.log('주소 검색 API 호출')
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
  }

  // 폼이 변경될 때마다 상위 컴포넌트에 데이터 전달 (유효한 경우에만)
  const handleFormChange = () => {
    if (isValid) {
      handleSubmit(onSubmit)()
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5" />
            <span>청구서 배송 주소</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 이름과 연락처 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  placeholder="홍길동"
                  {...register('name')}
                  onChange={(e) => {
                    register('name').onChange(e)
                    setTimeout(handleFormChange, 100)
                  }}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="phone">연락처 *</Label>
                <Input
                  id="phone"
                  placeholder="010-1234-5678"
                  {...register('phone')}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    setValue('phone', formatted)
                    setTimeout(handleFormChange, 100)
                  }}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* 우편번호와 주소 검색 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="zipCode">우편번호 *</Label>
                <Input
                  id="zipCode"
                  placeholder="12345"
                  maxLength={5}
                  {...register('zipCode')}
                  onChange={(e) => {
                    register('zipCode').onChange(e)
                    setTimeout(handleFormChange, 100)
                  }}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                )}
              </div>

              <div className="flex space-x-2 md:col-span-2">
                <div className="flex-1">
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    id="address"
                    placeholder="기본 주소"
                    readOnly
                    {...register('address')}
                    className="bg-muted"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddressSearch}
                    className="px-3"
                  >
                    <SearchIcon className="mr-1 h-4 w-4" />
                    검색
                  </Button>
                </div>
              </div>
            </div>

            {/* 상세 주소 */}
            <div>
              <Label htmlFor="detailAddress">상세 주소</Label>
              <Input
                id="detailAddress"
                placeholder="동, 호수 등 상세 주소를 입력해주세요"
                {...register('detailAddress')}
                onChange={(e) => {
                  register('detailAddress').onChange(e)
                  setTimeout(handleFormChange, 100)
                }}
              />
              {errors.detailAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.detailAddress.message}</p>
              )}
            </div>

            {/* 주소 입력 도움말 */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm text-blue-800">
                <p className="font-medium">주소 입력 안내</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>우편번호를 입력하거나 주소 검색 버튼을 클릭해주세요</li>
                  <li>정확한 주소 입력으로 빠른 서비스 이용이 가능합니다</li>
                  <li>청구서는 입력하신 주소로 발송됩니다</li>
                </ul>
              </div>
            </div>

            {/* 폼 유효성 상태 표시 (개발 시에만) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="rounded bg-gray-100 p-3 text-xs text-gray-600">
                <p>Form Valid: {isValid ? '✅' : '❌'}</p>
                <p>Watched Values: {JSON.stringify(watchedValues, null, 2)}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

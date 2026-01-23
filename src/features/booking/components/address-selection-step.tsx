/**
 * 예약 Step 2: 서비스 주소 선택 (Redux 기반)
 */

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { updateAddress } from '../state/booking-slice'

interface Address {
  id: string
  city: string
  state: string
  street: string
  zipCode?: string
  isDefault: boolean
}

interface AddressSelectionStepProps {
  /** 저장된 주소 목록 */
  savedAddresses: Address[]
}

/**
 * 서비스 주소 선택 단계
 *
 * Redux에서 selectedAddressId를 직접 가져오고 액션을 디스패치
 */
export function AddressSelectionStep({ savedAddresses }: AddressSelectionStepProps) {
  const dispatch = useAppDispatch()
  const selectedAddressId = useAppSelector((state) => state.booking.formData.addressId)
  const selectedAddress = savedAddresses.find((addr) => addr.id === selectedAddressId)

  return (
    <div className="space-y-8">
      {/* 주소 선택 카드 */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">서비스 주소</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              미용 서비스를 받을 주소를 선택해주세요
            </p>
          </div>

          {savedAddresses.length > 0 ? (
            <>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                      selectedAddressId === address.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => dispatch(updateAddress(address.id))}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium break-words">
                          {address.city} {address.state} {address.street}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {address.zipCode && `(${address.zipCode})`}
                        </p>
                      </div>
                      {address.isDefault && (
                        <span className="bg-primary text-primary-foreground flex-shrink-0 rounded px-2 py-1 text-xs">
                          기본 주소
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex justify-center">
                <Button variant="outline" asChild>
                  <Link href="/customer/profile">새 주소 추가하기</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <svg
                  className="text-muted-foreground h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-foreground mb-2 text-lg font-medium">등록된 주소가 없습니다</h3>
              <p className="text-muted-foreground mb-4">
                예약을 계속하려면 프로필에서 주소를 먼저 등록해주세요.
              </p>
              <Button asChild>
                <Link href="/customer/profile">주소 등록하러 가기</Link>
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* 선택된 주소 확인 카드 */}
      {selectedAddress && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">선택된 주소</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-700">
              <p className="font-medium break-words">
                {selectedAddress.city} {selectedAddress.state} {selectedAddress.street}
              </p>
              {selectedAddress.zipCode && (
                <p className="mt-1 text-sm">({selectedAddress.zipCode})</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

'use client'

import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Lazy load address search component (includes Daum Postcode API)
const DaumPostcodeEmbed = lazy(() =>
  import('./DaumPostcodeEmbed').then((module) => ({
    default: module.DaumPostcodeEmbed,
  }))
)

interface AddressFormData {
  name: string
  street: string
  detailAddress: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
  centerLat?: number
  centerLng?: number
  createdAt: string
  updatedAt: string
}

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (address: Partial<AddressFormData>) => Promise<void>
  address?: Address
  mode: 'create' | 'edit'
}

export function AddressModal({ isOpen, onClose, onSave, address, mode }: AddressModalProps) {
  const [isDaumOpen, setIsDaumOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<AddressFormData>({
    name: '',
    street: '',
    detailAddress: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  })

  useEffect(() => {
    if (address && mode === 'edit') {
      // Parse the street to extract detail address if present
      const streetParts = address.street.split(' ')
      const mainStreet = streetParts.slice(0, -1).join(' ')
      const detail = streetParts[streetParts.length - 1]

      setFormData({
        name: '',
        street: mainStreet || address.street,
        detailAddress: detail && detail !== mainStreet ? detail : '',
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
      })
    } else {
      setFormData({
        name: '',
        street: '',
        detailAddress: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false,
      })
    }
    setErrors({})
  }, [address, mode, isOpen])

  const handleDaumComplete = (data: {
    sido: string
    district: string
    area: string
    address: string
    postalCode: string
  }) => {
    setFormData((prev) => ({
      ...prev,
      city: data.sido,
      state: data.district,
      street: data.address,
      zipCode: data.postalCode,
    }))
    setIsDaumOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isDefault: checked }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.street) newErrors.street = '주소는 필수입니다'
    if (!formData.city) newErrors.city = '시/도는 필수입니다'
    if (!formData.state) newErrors.state = '구/군은 필수입니다'
    if (!formData.zipCode) newErrors.zipCode = '우편번호는 필수입니다'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setIsSaving(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Failed to save address:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? '새 주소 추가' : '주소 수정'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="street">주소</Label>
              <div className="flex gap-2">
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="도로명 주소"
                  className={errors.street ? 'border-red-500' : ''}
                  readOnly
                />
                <Button type="button" variant="outline" onClick={() => setIsDaumOpen(true)}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {errors.street && <p className="text-sm text-red-500">{errors.street}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailAddress">상세 주소</Label>
              <Input
                id="detailAddress"
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleChange}
                placeholder="동/호수 등 상세 주소 입력"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">시/도</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="시/도"
                  className={errors.city ? 'border-red-500' : ''}
                  readOnly
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">구/군</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="구/군"
                  className={errors.state ? 'border-red-500' : ''}
                  readOnly
                />
                {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">우편번호</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="우편번호"
                className={errors.zipCode ? 'border-red-500' : ''}
                readOnly
              />
              {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isDefault" className="text-sm font-normal">
                기본 배송지로 설정
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  저장 중...
                </>
              ) : (
                '저장'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Suspense fallback={<LoadingSpinner />}>
        {isDaumOpen && (
          <DaumPostcodeEmbed
            isOpen={isDaumOpen}
            onClose={() => setIsDaumOpen(false)}
            onComplete={handleDaumComplete}
          />
        )}
      </Suspense>
    </>
  )
}

'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export interface ServiceOption {
  id: string
  name: string
  description?: string
  price: number
  displayOrder: number
}

interface ServiceOptionSelectorProps {
  petId: string
  petName: string
  selectedOptions: ServiceOption[]
  onOptionsChange: (options: ServiceOption[]) => void
  disabled?: boolean
}

export function ServiceOptionSelector({
  petId,
  petName,
  selectedOptions,
  onOptionsChange,
  disabled = false,
}: ServiceOptionSelectorProps) {
  const {
    data: availableOptions = [],
    isLoading,
    isError,
    error,
  } = useQuery<ServiceOption[]>({
    queryKey: ['customer', 'service-options', petId],
    queryFn: async () => {
      const response = await fetch(`/api/customer/service-options?petId=${petId}`)

      if (!response.ok) {
        throw new Error('옵션을 불러오는데 실패했습니다')
      }

      return response.json()
    },
    enabled: !!petId,
  })

  const handleOptionToggle = (option: ServiceOption, checked: boolean) => {
    if (checked) {
      onOptionsChange([...selectedOptions, option])
    } else {
      onOptionsChange(selectedOptions.filter((o) => o.id !== option.id))
    }
  }

  const isOptionSelected = (optionId: string) => {
    return selectedOptions.some((o) => o.id === optionId)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{petName} - 추가 옵션</CardTitle>
          <CardDescription>반려동물 상태에 따른 추가 옵션을 선택해주세요</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{petName} - 추가 옵션</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">
              {error instanceof Error ? error.message : '옵션을 불러오는데 실패했습니다'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (availableOptions.length === 0) {
    return null // 옵션이 없으면 표시하지 않음
  }

  const totalOptionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{petName} - 추가 옵션</CardTitle>
        <CardDescription>반려동물 상태에 따른 추가 옵션을 선택해주세요 (선택사항)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {availableOptions.map((option) => {
            const selected = isOptionSelected(option.id)
            return (
              <div
                key={option.id}
                className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                  selected ? 'border-primary bg-primary/5' : 'border-gray-200'
                } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}
                onClick={() => !disabled && handleOptionToggle(option, !selected)}
              >
                <Checkbox
                  id={`option-${option.id}`}
                  checked={selected}
                  onCheckedChange={(checked) => handleOptionToggle(option, checked as boolean)}
                  disabled={disabled}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor={`option-${option.id}`}
                    className={`font-medium ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {option.name}
                  </Label>
                  {option.description && (
                    <p className="text-muted-foreground text-sm">{option.description}</p>
                  )}
                  <p className="text-primary text-sm font-semibold">
                    +{option.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {selectedOptions.length > 0 && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">선택한 옵션 합계</span>
              <span className="text-primary text-lg font-bold">
                +{totalOptionsPrice.toLocaleString()}원
              </span>
            </div>
            <div className="text-muted-foreground mt-2 text-xs">
              {selectedOptions.map((opt) => opt.name).join(', ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

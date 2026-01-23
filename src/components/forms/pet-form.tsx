'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertCircleIcon, CameraIcon, ChevronDown, ChevronUp, Dog } from 'lucide-react'

const petFormSchema = z.object({
  name: z
    .string()
    .min(1, '반려동물 이름을 입력해주세요')
    .max(50, '이름은 50자 이내로 입력해주세요'),
  species: z.enum(['DOG', 'CAT', 'OTHER']),
  breed: z.string().min(1, '품종을 입력해주세요').max(100, '품종은 100자 이내로 입력해주세요'),
  gender: z.enum(['MALE', 'FEMALE', 'NEUTERED_MALE', 'SPAYED_FEMALE']),
  birthDate: z
    .string()
    .min(1, '생년월일을 입력해주세요')
    .refine((date) => {
      const birthDate = new Date(date)
      // Check for invalid date
      if (isNaN(birthDate.getTime())) {
        return false
      }
      const today = new Date()
      const maxAge = new Date()
      maxAge.setFullYear(today.getFullYear() - 30)
      return birthDate >= maxAge && birthDate <= today
    }, '올바른 생년월일을 입력해주세요'),
  weight: z
    .string()
    .min(1, '몸무게를 입력해주세요')
    .refine((val) => {
      const weight = parseFloat(val)
      return !isNaN(weight) && weight > 0 && weight <= 100
    }, '올바른 몸무게를 입력해주세요 (0.1kg ~ 100kg)'),
  color: z.string().min(1, '털색을 입력해주세요').max(50, '털색은 50자 이내로 입력해주세요'),
  notes: z.string().max(500, '특이사항은 500자 이내로 입력해주세요').optional(),
  allergies: z.string().max(200, '알러지 정보는 200자 이내로 입력해주세요').optional(),
  medications: z.string().max(200, '복용 약물은 200자 이내로 입력해주세요').optional(),
  lastGrooming: z.string().optional(),
  isVaccinated: z.boolean(),
  isInsured: z.boolean(),
  termsAcception: z.boolean().refine((val) => val === true, {
    message: '지병·노령견 미용 동의서에 동의해주셔야 합니다',
  }),
})

type PetFormData = z.infer<typeof petFormSchema>

interface PetFormProps {
  initialData?: Partial<PetFormData>
  onSubmit: (data: PetFormData) => Promise<void>
  isLoading?: boolean
  isEditing?: boolean
}

const PET_SPECIES = [
  { value: 'DOG', label: '강아지' },
  { value: 'CAT', label: '고양이' },
  { value: 'OTHER', label: '기타' },
] as const

const PET_GENDERS = [
  { value: 'MALE', label: '남자' },
  { value: 'FEMALE', label: '여자' },
  { value: 'NEUTERED_MALE', label: '중성화 남자' },
  { value: 'SPAYED_FEMALE', label: '중성화 여자' },
] as const

export function PetForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEditing = false,
}: PetFormProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showTerms, setShowTerms] = useState(false)

  const form = useForm<PetFormData>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      species: initialData?.species ?? 'DOG',
      breed: initialData?.breed ?? '',
      gender: initialData?.gender ?? 'MALE',
      birthDate: initialData?.birthDate ?? '',
      weight: initialData?.weight ?? '',
      color: initialData?.color ?? '',
      notes: initialData?.notes ?? '',
      allergies: initialData?.allergies ?? '',
      medications: initialData?.medications ?? '',
      lastGrooming: initialData?.lastGrooming ?? '',
      isVaccinated: initialData?.isVaccinated !== undefined ? initialData.isVaccinated : false,
      isInsured: initialData?.isInsured !== undefined ? initialData.isInsured : false,
      termsAcception:
        initialData?.termsAcception !== undefined ? initialData.termsAcception : false,
    },
    mode: 'onChange',
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        form.setError('root', {
          type: 'manual',
          message: '이미지 크기는 5MB 이하여야 합니다',
        })
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return ''

    const birth = new Date(birthDate)
    // Check for invalid date
    if (isNaN(birth.getTime())) {
      return ''
    }

    const today = new Date()
    const ageInMonths =
      (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())

    if (ageInMonths < 12) {
      return `${ageInMonths}개월`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      return months > 0 ? `${years}살 ${months}개월` : `${years}살`
    }
  }

  const watchedBirthDate = form.watch('birthDate')

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Dog className="text-primary h-6 w-6" />
          <CardTitle>{isEditing ? '반려동물 정보 수정' : '반려동물 등록'}</CardTitle>
        </div>
        <CardDescription>
          반려동물의 정보를 입력해주세요. * 표시는 필수 입력 항목입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 프로필 이미지 업로드 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Pet profile"
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <CameraIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-xs text-gray-500">사진 추가</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
              <p className="text-muted-foreground text-xs">프로필 사진 (선택사항, 최대 5MB)</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        이름 <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="예: 코코" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          종류 <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PET_SPECIES.map((species) => (
                              <SelectItem key={species.value} value={species.value}>
                                {species.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          품종 <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="예: 푸들" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        성별 <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="성별 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PET_GENDERS.map((gender) => (
                            <SelectItem key={gender.value} value={gender.value}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          생년월일 <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        {watchedBirthDate && (
                          <FormDescription>
                            현재 나이: {calculateAge(watchedBirthDate)}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          몸무게 (kg) <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="100"
                            placeholder="예: 3.5"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        털색 <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="예: 갈색" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 건강 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">건강 정보</h3>

                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>알러지 정보</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="알러지가 있다면 입력해주세요"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>음식, 약물, 환경 알러지 등</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>복용 약물</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="현재 복용 중인 약물이 있다면 입력해주세요"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastGrooming"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>마지막 미용일</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>가장 최근 미용을 받은 날짜</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isVaccinated"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>예방접종 완료</FormLabel>
                          <FormDescription>필수 예방접종을 모두 완료했습니다</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isInsured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>펫보험 가입</FormLabel>
                          <FormDescription>펫보험에 가입되어 있습니다</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* 특이사항 */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>특이사항</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="미용사가 알아야 할 특별한 사항이 있다면 입력해주세요"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>성격, 행동 특성, 주의사항 등</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 지병·노령견 미용 동의서 */}
            <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6">
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold text-orange-900">
                  지병·노령견 미용 동의서
                </h3>
                <p className="text-sm text-orange-700">
                  반려동물의 안전한 미용을 위해 아래 동의서를 확인하고 동의해주세요.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowTerms(!showTerms)}
                className="mb-4 w-full justify-between border-orange-300 bg-white hover:bg-orange-100"
              >
                <span className="text-sm font-medium">
                  {showTerms ? '동의서 내용 접기' : '동의서 내용 보기'}
                </span>
                {showTerms ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {showTerms && (
                <div className="mb-4 space-y-4 rounded-lg bg-white p-4 text-sm">
                  <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-3">
                    <p className="mb-1 font-semibold text-orange-800">※ 안내사항 ※</p>
                    <p className="text-orange-700">
                      지병(뇌질환, 심장질환, 보행불가 등)이 있거나 노령견(만 10세 이상)인 경우
                      반드시 &quot;지병·노령견 미용 동의서&quot;를 작성해주셔야 합니다.
                    </p>
                  </div>

                  <ol className="list-decimal space-y-3 pl-5 text-gray-700">
                    <li>
                      미미살롱펫은 반려견 미용 시 반려견의 건강과 안전을 최우선으로 고려하여 소홀함
                      없이 최대한 주의를 기울여 미용을 진행할 것을 약속드립니다.
                    </li>
                    <li>
                      다만, 노령견 및 지병이 있는 반려견의 경우 노화 및 기존 질환으로 인한 각종 위험
                      요인이 존재할 수 있으며 미용 후 상태 악화 또는 스트레스 유발로 인한 원치 않는
                      상황이 발생할 가능성이 있음을 사전 고지드립니다.
                    </li>
                    <li>
                      미미살롱펫은 최대한 보호자의 입장에서 아이들의 상태를 살피며 미용을
                      진행하겠습니다. 그러나 위와 같은 상황으로 인해 발생하는 건강 이상 및 사고에
                      대해 미미살롱펫은 법적 책임을 지지 않음에 대해 보호자의 사전 동의를
                      요청드립니다.
                    </li>
                    <li>
                      또한, 본 동의서는 미용 서비스 진행 시마다 매번 작성하실 필요 없이, 1회
                      서명으로 향후 동일 조건 하에 동일하게 적용됩니다.
                    </li>
                  </ol>
                </div>
              )}

              <FormField
                control={form.control}
                name="termsAcception"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-semibold text-orange-900">
                        위 내용을 확인하였으며 지병·노령견 미용 동의서에 동의합니다{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* 에러 메시지 */}
            {form.formState.errors.root && (
              <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircleIcon className="text-destructive h-4 w-4" />
                  <p className="text-destructive text-sm">{form.formState.errors.root.message}</p>
                </div>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" disabled={isLoading}>
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                {isEditing ? '수정하기' : '등록하기'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

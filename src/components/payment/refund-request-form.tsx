'use client';

import { ko } from 'date-fns/locale';
import { parseISO, format } from 'date-fns';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CUSTOMER_SERVICE } from '@/lib/constants/customer-service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  ArrowLeftIcon,
  AlertCircleIcon,
  InfoIcon,
  BanknoteIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { refundRequestSchema, type RefundRequestInput } from '@/lib/validations/payment';
import { cn } from '@/lib/utils';

interface BookingDetails {
  id: string;
  totalAmount: number;
  paidAmount: number;
  services: Array<{
    id: string;
    name: string;
    price: number;
    status: string;
  }>;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
}

interface RefundRequestFormProps {
  booking: BookingDetails;
  onSubmit: (data: RefundRequestInput) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

const REFUND_REASONS = [
  {
    value: 'CUSTOMER_REQUEST',
    label: '고객 변심',
    description: '개인 사정으로 인한 취소',
  },
  {
    value: 'GROOMER_CANCELLATION',
    label: '미용사 취소',
    description: '미용사 사정으로 인한 취소',
  },
  {
    value: 'SALON_CLOSURE',
    label: '매장 휴업',
    description: '매장 사정으로 인한 휴업',
  },
  {
    value: 'FORCE_MAJEURE',
    label: '불가항력',
    description: '천재지변, 감염병 등',
  },
  {
    value: 'OTHER',
    label: '기타',
    description: '기타 사유',
  },
] as const;

const BANK_CODES = [
  { value: '004', label: 'KB국민은행' },
  { value: '011', label: 'NH농협은행' },
  { value: '020', label: '우리은행' },
  { value: '088', label: '신한은행' },
  { value: '081', label: '하나은행' },
  { value: '027', label: '씨티은행' },
  { value: '003', label: 'IBK기업은행' },
  { value: '007', label: '수협은행' },
  { value: '023', label: 'SC제일은행' },
  { value: '039', label: '경남은행' },
] as const;

export function RefundRequestForm({
  booking,
  onSubmit,
  onCancel,
  className,
}: RefundRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<RefundRequestInput>({
    resolver: zodResolver(refundRequestSchema),
    defaultValues: {
      bookingId: booking.id,
      refundAmount: booking.paidAmount,
    },
    mode: 'onChange',
  });

  const selectedReason = watch('reason');

  const calculateRefundFee = () => {
    const now = new Date();
    const scheduledDateTime = parseISO(`${booking.scheduledDate} ${booking.scheduledTime}`);
    const hoursUntilScheduled = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // 취소 수수료 계산 로직
    if (hoursUntilScheduled >= 24) {
      return 0; // 24시간 전 취소: 수수료 없음
    } else if (hoursUntilScheduled >= 12) {
      return booking.paidAmount * 0.1; // 12시간 전 취소: 10% 수수료
    } else if (hoursUntilScheduled >= 2) {
      return booking.paidAmount * 0.2; // 2시간 전 취소: 20% 수수료
    } else {
      return booking.paidAmount * 0.5; // 2시간 이내 취소: 50% 수수료
    }
  };

  const refundFee = calculateRefundFee();
  const actualRefundAmount = Math.max(0, booking.paidAmount - refundFee);

  const onFormSubmit = async (data: RefundRequestInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        refundAmount: actualRefundAmount,
      });
    } catch (error) {
      console.error('Refund request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowLeftIcon className="h-5 w-5" />
            <span>환불 신청</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* 예약 정보 */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="mb-3 font-medium">예약 정보</h4>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                  <div className="text-muted-foreground">예약 번호</div>
                  <div className="font-mono">{booking.id}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">예약 일시</div>
                  <div>
                    {booking.scheduledDate} {booking.scheduledTime}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">결제 금액</div>
                  <div className="font-medium">{booking.paidAmount.toLocaleString('ko-KR')}원</div>
                </div>
                <div>
                  <div className="text-muted-foreground">예약 상태</div>
                  <div>{booking.status}</div>
                </div>
              </div>
            </div>

            {/* 환불 금액 정보 */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <InfoIcon className="mt-1 h-5 w-5 flex-shrink-0 text-orange-600" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-medium text-orange-900">환불 금액 안내</h4>
                      <p className="mt-1 text-sm text-orange-800">
                        취소 시점에 따라 취소 수수료가 부과될 수 있습니다.
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>결제 금액</span>
                        <span>{booking.paidAmount.toLocaleString('ko-KR')}원</span>
                      </div>
                      {refundFee > 0 && (
                        <div className="flex justify-between text-orange-700">
                          <span>취소 수수료</span>
                          <span>-{refundFee.toLocaleString('ko-KR')}원</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>실제 환불 금액</span>
                        <span className="text-green-600">
                          {actualRefundAmount.toLocaleString('ko-KR')}원
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 환불 사유 선택 */}
            <div className="space-y-4">
              <Label>환불 사유 *</Label>
              <RadioGroup
                value={selectedReason}
                onValueChange={(value) =>
                  setValue(
                    'reason',
                    value as
                      | 'CUSTOMER_REQUEST'
                      | 'GROOMER_CANCELLATION'
                      | 'SALON_CLOSURE'
                      | 'FORCE_MAJEURE'
                      | 'OTHER'
                  )
                }
              >
                {REFUND_REASONS.map((reason) => (
                  <div key={reason.value} className="flex items-start space-x-3">
                    <RadioGroupItem value={reason.value} id={reason.value} className="mt-1" />
                    <div className="flex-1">
                      <label htmlFor={reason.value} className="cursor-pointer font-medium">
                        {reason.label}
                      </label>
                      <p className="text-muted-foreground text-sm">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              {errors.reason && <p className="text-sm text-red-600">{errors.reason.message}</p>}
            </div>

            {/* 기타 사유 입력 */}
            {selectedReason === 'OTHER' && (
              <div className="space-y-2">
                <Label htmlFor="customReason">상세 사유 *</Label>
                <Textarea
                  id="customReason"
                  placeholder="환불 사유를 자세히 입력해주세요"
                  {...register('customReason')}
                />
                {errors.customReason && (
                  <p className="text-sm text-red-600">{errors.customReason.message}</p>
                )}
              </div>
            )}

            {/* 환불 계좌 정보 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BanknoteIcon className="h-5 w-5" />
                <Label>환불 계좌 정보</Label>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="bankCode">은행 *</Label>
                  <Select onValueChange={(value) => setValue('bankAccount.bankCode', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="은행 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANK_CODES.map((bank) => (
                        <SelectItem key={bank.value} value={bank.value}>
                          {bank.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bankAccount?.bankCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bankAccount.bankCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="accountNumber">계좌번호 *</Label>
                  <Input
                    id="accountNumber"
                    placeholder="계좌번호"
                    {...register('bankAccount.accountNumber')}
                  />
                  {errors.bankAccount?.accountNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bankAccount.accountNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="accountHolder">예금주 *</Label>
                  <Input
                    id="accountHolder"
                    placeholder="예금주명"
                    {...register('bankAccount.accountHolder')}
                  />
                  {errors.bankAccount?.accountHolder && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bankAccount.accountHolder.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 환불 안내 */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start space-x-2">
                <AlertCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">환불 처리 안내</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>환불 신청 후 3-5 영업일 내에 계좌로 입금됩니다</li>
                    <li>카드 결제의 경우 카드사 정책에 따라 취소 처리됩니다</li>
                    <li>환불 처리 상태는 예약 상세 페이지에서 확인 가능합니다</li>
                    <li>문의사항은 고객센터({CUSTOMER_SERVICE.PHONE})로 연락해주세요</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                취소
              </Button>

              <Button type="submit" disabled={!isValid || isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    처리 중...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                    환불 신청
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

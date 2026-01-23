'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreditCardIcon,
  BanknoteIcon,
  SmartphoneIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { paymentMethodSchema, type PaymentMethod } from '@/lib/validations/payment';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
  className?: string;
}

const PAYMENT_TYPES = [
  {
    id: 'CARD',
    label: '신용/체크카드',
    description: '안전한 카드 결제',
    icon: CreditCardIcon,
    color: 'blue',
  },
  {
    id: 'DIGITAL_WALLET',
    label: '간편결제',
    description: '카카오페이, 토스페이, 네이버페이',
    icon: SmartphoneIcon,
    color: 'green',
  },
  {
    id: 'BANK_TRANSFER',
    label: '계좌이체',
    description: '실시간 계좌이체',
    icon: BanknoteIcon,
    color: 'purple',
  },
] as const;

const DIGITAL_WALLETS = [
  { value: 'KAKAO_PAY', label: '카카오페이' },
  { value: 'TOSS_PAY', label: '토스페이' },
  { value: 'NAVER_PAY', label: '네이버페이' },
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

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  className,
}: PaymentMethodSelectorProps) {
  const [selectedType, setSelectedType] = useState<string>(selectedMethod?.type || '');

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<PaymentMethod>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: selectedMethod || { type: 'CARD' },
  });

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setValue('type', type as PaymentMethod['type']);

    // Create new payment method object and notify parent
    const newMethod: PaymentMethod = { type: type as PaymentMethod['type'] };
    onMethodChange(newMethod);

    // Reset other fields when type changes
    setValue('cardNumber', undefined);
    setValue('expiryDate', undefined);
    setValue('cvv', undefined);
    setValue('cardHolderName', undefined);
    setValue('bankCode', undefined);
    setValue('accountNumber', undefined);
    setValue('walletProvider', undefined);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-5 w-5" />
            <span>결제 방법 선택</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedType} onValueChange={handleTypeChange} className="space-y-4">
            {PAYMENT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <label
                      htmlFor={type.id}
                      className="flex flex-1 cursor-pointer items-center space-x-3"
                    >
                      <div
                        className={cn(
                          'rounded-lg p-2',
                          type.color === 'blue' && 'bg-blue-100 text-blue-600',
                          type.color === 'green' && 'bg-green-100 text-green-600',
                          type.color === 'purple' && 'bg-purple-100 text-purple-600'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-muted-foreground text-sm">{type.description}</div>
                      </div>
                    </label>
                  </div>

                  {selectedType === type.id && (
                    <div className="bg-muted ml-8 space-y-4 rounded-lg p-4">
                      {type.id === 'CARD' && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <Label htmlFor="cardNumber">카드번호</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              {...register('cardNumber')}
                              onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                setValue('cardNumber', formatted);
                              }}
                            />
                            {errors.cardNumber && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.cardNumber.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="expiryDate">유효기간</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              maxLength={5}
                              {...register('expiryDate')}
                              onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                setValue('expiryDate', formatted);
                              }}
                            />
                            {errors.expiryDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.expiryDate.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" maxLength={4} {...register('cvv')} />
                            {errors.cvv && (
                              <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                            )}
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="cardHolderName">카드 소유자명</Label>
                            <Input
                              id="cardHolderName"
                              placeholder="홍길동"
                              {...register('cardHolderName')}
                            />
                            {errors.cardHolderName && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.cardHolderName.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {type.id === 'DIGITAL_WALLET' && (
                        <div>
                          <Label htmlFor="walletProvider">간편결제 선택</Label>
                          <Select
                            onValueChange={(value) =>
                              setValue(
                                'walletProvider',
                                value as 'KAKAO_PAY' | 'TOSS_PAY' | 'NAVER_PAY'
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="간편결제를 선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                              {DIGITAL_WALLETS.map((wallet) => (
                                <SelectItem key={wallet.value} value={wallet.value}>
                                  {wallet.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.walletProvider && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.walletProvider.message}
                            </p>
                          )}
                        </div>
                      )}

                      {type.id === 'BANK_TRANSFER' && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="bankCode">은행 선택</Label>
                            <Select onValueChange={(value) => setValue('bankCode', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="은행을 선택해주세요" />
                              </SelectTrigger>
                              <SelectContent>
                                {BANK_CODES.map((bank) => (
                                  <SelectItem key={bank.value} value={bank.value}>
                                    {bank.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.bankCode && (
                              <p className="mt-1 text-sm text-red-600">{errors.bankCode.message}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="accountNumber">계좌번호</Label>
                            <Input
                              id="accountNumber"
                              placeholder="계좌번호를 입력해주세요"
                              {...register('accountNumber')}
                            />
                            {errors.accountNumber && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.accountNumber.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-start space-x-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <AlertCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">보안 안내</p>
                          <p className="mt-1">
                            결제 정보는 SSL 암호화로 안전하게 보호되며, 당사는 결제 정보를 저장하지
                            않습니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}

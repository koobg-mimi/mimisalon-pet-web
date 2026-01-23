'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { X, Plus } from 'lucide-react';

interface AdditionalService {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface QuoteModalProps {
  bookingId: string;
  trigger: React.ReactNode;
  onQuoteSubmitted?: () => void;
}

export function QuoteModal({ bookingId, trigger, onQuoteSubmitted }: QuoteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([
    { name: '', description: '', price: 0, quantity: 1 },
  ]);
  const [reason, setReason] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  const updateService = (index: number, field: keyof AdditionalService, value: any) => {
    const updated = [...additionalServices];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalServices(updated);
  };

  const addService = () => {
    setAdditionalServices([
      ...additionalServices,
      { name: '', description: '', price: 0, quantity: 1 },
    ]);
  };

  const removeService = (index: number) => {
    if (additionalServices.length > 1) {
      setAdditionalServices(additionalServices.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return additionalServices.reduce((total, service) => {
      return total + service.price * service.quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/groomer/bookings/${bookingId}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          additionalServices: additionalServices.filter(
            (service) => service.name.trim() && service.price > 0
          ),
          reason,
          estimatedTime,
          totalAdditionalAmount: calculateTotal(),
        }),
      });

      if (response.ok) {
        setIsOpen(false);
        setAdditionalServices([{ name: '', description: '', price: 0, quantity: 1 }]);
        setReason('');
        setEstimatedTime(0);
        onQuoteSubmitted?.();
        alert('견적이 성공적으로 전송되었습니다!');
      } else {
        const error = await response.json();
        alert(error.message || '견적 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      alert('견적 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>추가 서비스 견적</span>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">견적 안내</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• 서비스 시작 전 추가 서비스가 필요한 경우 견적을 보내주세요</li>
              <li>• 고객이 승인한 후에만 추가 요금이 발생합니다</li>
              <li>• 견적 없이 추가 서비스를 진행하지 마세요</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">추가 서비스 항목</h3>

              <div className="space-y-4">
                {additionalServices.map((service, index) => (
                  <div key={index} className="border-border bg-muted/50 rounded-lg border p-4">
                    <div className="mb-4 flex items-start justify-between">
                      <h4 className="font-medium">서비스 {index + 1}</h4>
                      {additionalServices.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeService(index)}
                        >
                          삭제
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium">서비스명 *</label>
                        <input
                          type="text"
                          required
                          value={service.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          placeholder="예: 털 엉킴 제거"
                          className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">가격 (원) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="1000"
                          value={service.price}
                          onChange={(e) =>
                            updateService(index, 'price', parseInt(e.target.value) || 0)
                          }
                          placeholder="10000"
                          className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">수량</label>
                        <input
                          type="number"
                          min="1"
                          value={service.quantity}
                          onChange={(e) =>
                            updateService(index, 'quantity', parseInt(e.target.value) || 1)
                          }
                          className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">소계</label>
                        <div className="bg-muted rounded-md px-3 py-2">
                          {(service.price * service.quantity).toLocaleString()}원
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">설명</label>
                        <textarea
                          value={service.description}
                          onChange={(e) => updateService(index, 'description', e.target.value)}
                          placeholder="추가 서비스에 대한 상세 설명을 입력하세요"
                          rows={2}
                          className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button type="button" variant="outline" onClick={addService} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                서비스 추가
              </Button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">추가 작업 예상 시간 (분)</label>
              <input
                type="number"
                min="0"
                step="15"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 0)}
                placeholder="30"
                className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">추가 서비스 사유</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="추가 서비스가 필요한 이유를 설명해주세요"
                rows={3}
                className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
              />
            </div>

            <div className="border-t pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold">총 추가 금액</span>
                <span className="text-primary text-lg font-bold">
                  {calculateTotal().toLocaleString('ko-KR')}원
                </span>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting || calculateTotal() === 0}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      견적 전송 중...
                    </>
                  ) : (
                    '견적 전송'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

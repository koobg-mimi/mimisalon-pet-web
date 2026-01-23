'use client';

import { useCallback } from 'react';
import DaumPostcode, { type Address } from 'react-daum-postcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DaumPostcodeEmbedProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    sido: string;
    district: string;
    area: string;
    address: string;
    postalCode: string;
  }) => void;
}

export function DaumPostcodeEmbed({ isOpen, onClose, onComplete }: DaumPostcodeEmbedProps) {
  const handleComplete = useCallback(
    (data: Address) => {
      // Extract data from Daum response
      const addressData = {
        sido: data.sido || '',
        district: data.sigungu || '',
        area: data.bname || '',
        address: data.roadAddress || data.jibunAddress || '',
        postalCode: data.zonecode || '',
      };

      onComplete(addressData);
      onClose();
    },
    [onComplete, onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>주소 검색</DialogTitle>
        </DialogHeader>
        <div className="h-[450px] w-full">
          <DaumPostcode
            onComplete={handleComplete}
            style={{ width: '100%', height: '100%' }}
            autoClose={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

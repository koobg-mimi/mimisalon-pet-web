'use client';

import { useDaumPostcodePopup, Address } from 'react-daum-postcode';
import { Button } from '@/components/ui/button';

// Custom interface for simplified address data
interface SimplifiedAddress {
  address: string;
  zonecode: string;
  buildingName?: string;
}

interface DaumPostcodeProps {
  onComplete: (address: SimplifiedAddress) => void;
  onClose?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DaumPostcode({
  onComplete,
  onClose,
  placeholder = '주소를 검색하세요',
  className = '',
  disabled = false,
}: DaumPostcodeProps) {
  const open = useDaumPostcodePopup();

  const handleSearch = () => {
    if (disabled) return;

    open({
      onComplete: (data: Address) => {
        // 선택된 주소 정보 처리 (좌표 변환은 서버에서 처리)
        const selectedAddress =
          data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        const finalAddress = selectedAddress || data.address;

        const addressData: SimplifiedAddress = {
          address: finalAddress,
          zonecode: data.zonecode,
          buildingName: data.buildingName,
        };

        onComplete(addressData);
      },
      onClose: () => {
        onClose?.();
      },
      animation: true,
      shorthand: true,
      pleaseReadGuide: 5,
      showMoreHName: true,
      focusInput: true,
      autoMapping: true,
    });
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        onClick={handleSearch}
        disabled={disabled}
        className="w-full"
      >
        {placeholder}
      </Button>
    </div>
  );
}

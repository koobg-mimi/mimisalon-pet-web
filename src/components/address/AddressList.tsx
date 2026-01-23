'use client';

import { Edit2, MapPin, Plus, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressListProps {
  addresses: Address[];
  onAdd: () => void;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  isLoading?: boolean;
}

export function AddressList({
  addresses,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  isLoading = false,
}: AddressListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleDeleteClick = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (addressToDelete) {
      onDelete(addressToDelete);
      setAddressToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border-border animate-pulse rounded-lg border p-4">
            <div className="bg-muted mb-2 h-4 w-3/4 rounded"></div>
            <div className="bg-muted h-3 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="border-border rounded-lg border-2 border-dashed p-8 text-center">
        <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-medium">주소가 없습니다</h3>
        <p className="text-muted-foreground mb-4 text-sm">배송받을 주소를 등록해주세요</p>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          주소 추가
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">등록된 주소</h3>
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            주소 추가
          </Button>
        </div>

        <div className="grid gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border-border relative rounded-lg border p-4 transition-shadow hover:shadow-md"
            >
              {address.isDefault && (
                <Badge className="absolute top-4 right-4" variant="default">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  기본 주소
                </Badge>
              )}

              <div className="space-y-2 pr-20">
                <div className="flex items-start gap-2">
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{address.street}</p>
                    <p className="text-muted-foreground text-sm">
                      {address.city} {address.state}
                    </p>
                    <p className="text-muted-foreground text-sm">우편번호: {address.zipCode}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {!address.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => onSetDefault(address.id)}>
                      기본 주소로 설정
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
                    <Edit2 className="mr-1 h-3 w-3" />
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(address.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>주소 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 주소를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAddressToDelete(null)}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

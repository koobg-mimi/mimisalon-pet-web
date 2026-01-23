'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  centerLat?: number;
  centerLng?: number;
  createdAt: string;
  updatedAt: string;
}

interface AddressFormData {
  name?: string;
  street: string;
  detailAddress?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all addresses
  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/customer/addresses');

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddresses(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('주소를 불러오는데 실패했습니다');
      toast.error('주소를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new address
  const createAddress = useCallback(async (addressData: AddressFormData) => {
    try {
      const response = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Failed to create address');
      }

      const newAddress = await response.json();
      setAddresses((prev) => [newAddress, ...prev]);
      toast.success('주소가 추가되었습니다');
      return newAddress;
    } catch (err) {
      console.error('Error creating address:', err);
      toast.error('주소 추가에 실패했습니다');
      throw err;
    }
  }, []);

  // Update an existing address
  const updateAddress = useCallback(
    async (addressId: string, addressData: Partial<AddressFormData>) => {
      try {
        const response = await fetch(`/api/customer/addresses/${addressId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addressData),
        });

        if (!response.ok) {
          throw new Error('Failed to update address');
        }

        const updatedAddress = await response.json();
        setAddresses((prev) => prev.map((addr) => (addr.id === addressId ? updatedAddress : addr)));
        toast.success('주소가 수정되었습니다');
        return updatedAddress;
      } catch (err) {
        console.error('Error updating address:', err);
        toast.error('주소 수정에 실패했습니다');
        throw err;
      }
    },
    []
  );

  // Delete an address
  const deleteAddress = useCallback(async (addressId: string) => {
    try {
      const response = await fetch(`/api/customer/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      toast.success('주소가 삭제되었습니다');
    } catch (err) {
      console.error('Error deleting address:', err);
      toast.error('주소 삭제에 실패했습니다');
      throw err;
    }
  }, []);

  // Set an address as default
  const setDefaultAddress = useCallback(async (addressId: string) => {
    try {
      const response = await fetch(`/api/customer/addresses/${addressId}/default`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      const updatedAddress = await response.json();

      // Update local state to reflect the change
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );

      toast.success('기본 주소가 설정되었습니다');
      return updatedAddress;
    } catch (err) {
      console.error('Error setting default address:', err);
      toast.error('기본 주소 설정에 실패했습니다');
      throw err;
    }
  }, []);

  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    isLoading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}

'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface PetImage {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  isPrimary: boolean;
  displayOrder: number;
  petId: string;
  createdAt: string;
  updatedAt: string;
}

interface UploadProgress {
  [key: string]: number;
}

export function usePetImages(petId: string) {
  const [images, setImages] = useState<PetImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);

  // Fetch all images for a pet
  const fetchImages = useCallback(async () => {
    if (!petId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/customer/pets/${petId}/images`);

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching pet images:', error);
      toast.error('이미지를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, [petId]);

  // Upload multiple images using simplified server upload
  const uploadImages = useCallback(
    async (files: File[]) => {
      if (!petId) {
        console.error('No petId provided for image upload');
        toast.error('펫 정보가 필요합니다. 펫을 먼저 저장해주세요.');
        return;
      }

      console.log('Starting pet image upload:', {
        petId,
        filesCount: files.length,
        files: files.map((f) => ({
          name: f.name,
          type: f.type,
          size: f.size,
          sizeMB: (f.size / (1024 * 1024)).toFixed(2),
        })),
      });

      setIsUploading(true);
      const failedFiles: string[] = [];

      try {
        // Validate files before upload
        const validFiles = files.filter((file) => {
          if (!file.type || !file.type.startsWith('image/')) {
            console.error(`Invalid file type for ${file.name}: ${file.type || 'unknown'}`);
            toast.error(`${file.name}: 이미지 파일이 아닙니다`);
            failedFiles.push(file.name);
            return false;
          }

          if (file.size > 10 * 1024 * 1024) {
            console.error(
              `File too large: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`
            );
            toast.error(`${file.name}: 파일이 너무 큽니다 (최대 10MB)`);
            failedFiles.push(file.name);
            return false;
          }

          return true;
        });

        if (validFiles.length === 0) {
          toast.error('업로드할 유효한 이미지가 없습니다');
          return [];
        }

        // Create FormData with all files
        const formData = new FormData();
        validFiles.forEach((file) => {
          formData.append('files', file);
        });

        console.log(`Uploading ${validFiles.length} files to server...`);

        // Upload all files in one request
        const response = await fetch(`/api/customer/pets/${petId}/images`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({
            error: `HTTP ${response.status}: ${response.statusText}`,
          }));
          console.error('Failed to upload images:', error);
          throw new Error(error.error || 'Failed to upload images');
        }

        const result = await response.json();
        console.log('Upload result:', result);

        const uploadedImages = result.images || [];

        // Update images state
        if (uploadedImages.length > 0) {
          setImages((prev) => [...prev, ...uploadedImages]);
          toast.success(`${uploadedImages.length}개 이미지 업로드 완료`);
        }

        if (failedFiles.length > 0) {
          toast.warning(`일부 파일 업로드 실패: ${failedFiles.join(', ')}`);
        }

        return uploadedImages;
      } catch (error) {
        console.error('Failed to upload images:', error);

        // Provide more specific error messages
        if (error instanceof Error) {
          if (error.message.includes('network') || error.message.includes('fetch')) {
            toast.error('네트워크 오류가 발생했습니다');
          } else {
            toast.error(`업로드 실패: ${error.message}`);
          }
        } else {
          toast.error('이미지 업로드에 실패했습니다');
        }

        return [];
      } finally {
        setIsUploading(false);
        setUploadProgress({});
      }
    },
    [petId]
  );

  // Delete an image
  const deleteImage = useCallback(
    async (imageId: string) => {
      if (!petId) return;

      try {
        const response = await fetch(`/api/customer/pets/${petId}/images/${imageId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        setImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success('이미지가 삭제되었습니다');
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('이미지 삭제에 실패했습니다');
        throw error;
      }
    },
    [petId]
  );

  // Delete multiple images
  const deleteImages = useCallback(
    async (imageIds: string[]) => {
      if (!petId || imageIds.length === 0) return;

      try {
        const response = await fetch(`/api/customer/pets/${petId}/images`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete images');
        }

        setImages((prev) => prev.filter((img) => !imageIds.includes(img.id)));
        toast.success('이미지가 삭제되었습니다');
      } catch (error) {
        console.error('Error deleting images:', error);
        toast.error('이미지 삭제에 실패했습니다');
        throw error;
      }
    },
    [petId]
  );

  // Set image as primary
  const setPrimaryImage = useCallback(
    async (imageId: string) => {
      if (!petId) return;

      try {
        const response = await fetch(`/api/customer/pets/${petId}/images/${imageId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isPrimary: true }),
        });

        if (!response.ok) {
          throw new Error('Failed to set primary image');
        }

        // Update local state
        setImages((prev) =>
          prev.map((img) => ({
            ...img,
            isPrimary: img.id === imageId,
          }))
        );

        toast.success('대표 이미지가 설정되었습니다');
      } catch (error) {
        console.error('Error setting primary image:', error);
        toast.error('대표 이미지 설정에 실패했습니다');
        throw error;
      }
    },
    [petId]
  );

  // Reorder images
  const reorderImages = useCallback(
    async (imageId: string, newOrder: number) => {
      if (!petId) return;

      try {
        const response = await fetch(`/api/customer/pets/${petId}/images/${imageId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ displayOrder: newOrder }),
        });

        if (!response.ok) {
          throw new Error('Failed to reorder image');
        }

        // Refetch images to get updated order
        await fetchImages();
      } catch (error) {
        console.error('Error reordering image:', error);
        toast.error('이미지 순서 변경에 실패했습니다');
        throw error;
      }
    },
    [petId, fetchImages]
  );

  return {
    images,
    isLoading,
    isUploading,
    uploadProgress,
    fetchImages,
    uploadImages,
    deleteImage,
    deleteImages,
    setPrimaryImage,
    reorderImages,
  };
}

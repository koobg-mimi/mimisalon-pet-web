'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Star, Loader2, Image as ImageIcon, Trash2, Camera, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
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

interface ImageUploadAreaProps {
  images: Array<{
    id: string;
    url: string;
    filename: string;
    isPrimary: boolean;
  }>;
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (imageId: string) => Promise<void>;
  onSetPrimary: (imageId: string) => Promise<void>;
  maxImages?: number;
  isUploading?: boolean;
  className?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export function ImageUploadArea({
  images = [],
  onUpload,
  onDelete,
  onSetPrimary,
  maxImages = 10,
  isUploading = false,
  className,
}: ImageUploadAreaProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      console.log('Processing files for upload:', {
        count: files.length,
        files: files.map((f) => ({
          name: f.name,
          type: f.type || 'unknown',
          size: f.size,
          sizeMB: (f.size / (1024 * 1024)).toFixed(2),
        })),
      });

      // Filter valid files
      const validFiles = files.filter((file) => {
        // Check if file type is detected
        if (!file.type) {
          console.error(`No file type detected for ${file.name}`);
          alert(`${file.name}: 파일 형식을 인식할 수 없습니다. 다른 이미지를 사용해주세요.`);
          return false;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
          console.error(`Invalid file type: ${file.type} for ${file.name}`);
          alert(
            `${file.name}: 지원하지 않는 파일 형식입니다 (${file.type}). JPG, PNG, WebP, GIF만 가능합니다.`
          );
          return false;
        }
        if (file.size > MAX_FILE_SIZE) {
          console.error(
            `File too large: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`
          );
          alert(
            `${file.name}: 파일이 너무 큽니다 (${(file.size / (1024 * 1024)).toFixed(2)}MB). 최대 10MB까지 가능합니다.`
          );
          return false;
        }
        return true;
      });

      console.log(`Valid files after filtering: ${validFiles.length}`);

      // Check max images limit
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다`);
        return;
      }

      const filesToUpload = validFiles.slice(0, remainingSlots);
      if (filesToUpload.length > 0) {
        console.log(`Uploading ${filesToUpload.length} files...`);
        try {
          await onUpload(filesToUpload);
        } catch (error) {
          console.error('Upload failed:', error);
          if (error instanceof Error && error.message.includes('Invalid files data')) {
            alert(
              '파일 업로드에 실패했습니다. 스크린샷 파일은 직접 업로드할 수 없을 수 있습니다. 다른 이미지를 사용해주세요.'
            );
          }
        }
      } else {
        console.log('No files to upload after validation');
      }

      if (validFiles.length > filesToUpload.length) {
        alert(`${validFiles.length - filesToUpload.length}개 파일이 제한을 초과했습니다`);
      }
    },
    [images.length, maxImages, onUpload]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      console.log(`File input selected ${files.length} files`);

      if (files.length === 0) {
        console.log('No files selected from input');
        return;
      }

      await handleFiles(files);

      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
    },
    [handleFiles]
  );

  const handleDeleteClick = (imageId: string) => {
    setImageToDelete(imageId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (imageToDelete) {
      await onDelete(imageToDelete);
      setImageToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Upload Buttons Area */}
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-muted-foreground mb-3 text-sm">
              JPG, PNG, WebP, GIF (최대 10MB) • {images.length}/{maxImages} 이미지
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {/* File Upload Button */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || images.length >= maxImages}
              className="h-12 max-w-[160px] flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <FolderOpen className="mr-2 h-5 w-5" />
                  이미지 열기
                </>
              )}
            </Button>

            {/* Camera Button */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isUploading || images.length >= maxImages}
              className="h-12 max-w-[160px] flex-1"
            >
              <Camera className="mr-2 h-5 w-5" />
              카메라 사용
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading || images.length >= maxImages}
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading || images.length >= maxImages}
          />
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <div
                key={image.id}
                className={cn(
                  'group relative overflow-hidden rounded-lg border',
                  selectedImages.has(image.id)
                    ? 'border-primary ring-primary ring-2'
                    : 'border-border'
                )}
              >
                <div className="bg-muted relative aspect-square">
                  {image.url ? (
                    <Image
                      src={image.url}
                      alt={image.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="text-muted-foreground h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="bg-primary text-primary-foreground absolute top-2 left-2 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium">
                    <Star className="h-3 w-3 fill-current" />
                    대표
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  {!image.isPrimary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => onSetPrimary(image.id)}
                      className="h-8"
                    >
                      <Star className="mr-1 h-4 w-4" />
                      대표
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(image.id)}
                    className="h-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selection Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleImageSelection(image.id)}
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-md border-2 border-gray-300 bg-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  {selectedImages.has(image.id) && (
                    <div className="bg-primary h-3 w-3 rounded-sm" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedImages.size > 0 && (
          <div className="bg-muted flex items-center gap-2 rounded-lg p-3">
            <span className="text-sm font-medium">{selectedImages.size}개 선택됨</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setSelectedImages(new Set())}
            >
              선택 해제
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => {
                // Handle bulk delete
                selectedImages.forEach((id) => onDelete(id));
                setSelectedImages(new Set());
              }}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              삭제
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이미지 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 이미지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setImageToDelete(null)}>취소</AlertDialogCancel>
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

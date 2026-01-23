'use client'

import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ImagePreview,
  ImageUploadPreviewProps,
  MAX_IMAGES,
  MAX_IMAGE_SIZE,
  ALLOWED_IMAGE_TYPES,
} from '@/types/error-report'
import { validateImages } from '@/lib/validations/error-report'

export function ImageUploadPreview({
  images,
  onImagesChange,
  onRemoveImage,
  disabled = false,
  maxImages = MAX_IMAGES,
  maxFileSize = MAX_IMAGE_SIZE,
  className,
}: ImageUploadPreviewProps) {
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const fileArray = Array.from(files)
      const currentImageCount = images.length

      // Check if adding these files would exceed the limit
      if (currentImageCount + fileArray.length > maxImages) {
        setErrors([`최대 ${maxImages}개의 이미지까지 업로드할 수 있습니다`])
        return
      }

      // Validate files
      const validation = validateImages(fileArray)
      if (validation.errors.length > 0) {
        setErrors(validation.errors)
        return
      }

      // Clear errors if validation passes
      setErrors([])

      // Create image previews
      const newImagePreviews: ImagePreview[] = validation.valid.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }))

      // Add to existing images
      onImagesChange([...images, ...newImagePreviews])
    },
    [images, maxImages, onImagesChange]
  )

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(event.target.files)
      // Reset input value so the same file can be selected again
      event.target.value = ''
    },
    [handleFileSelect]
  )

  const handleDrag = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleDragIn = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragOut = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
      setDragActive(false)

      if (disabled) return

      const files = event.dataTransfer.files
      handleFileSelect(files)
    },
    [disabled, handleFileSelect]
  )

  const handleRemove = useCallback(
    (imageId: string) => {
      const imageToRemove = images.find((img) => img.id === imageId)
      if (imageToRemove) {
        // Cleanup object URL to prevent memory leaks
        URL.revokeObjectURL(imageToRemove.url)
      }
      onRemoveImage(imageId)
    },
    [images, onRemoveImage]
  )

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const canAddMore = images.length < maxImages

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed p-6 transition-colors',
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="error-report-images"
            multiple
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="mb-4 h-10 w-10 text-gray-400" />
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-medium">클릭하여 업로드</span> 또는 파일을 드래그하세요
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, GIF, WebP (최대 {formatFileSize(maxFileSize)})
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {images.length}/{maxImages}개 이미지
            </p>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
            <div className="space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700">
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">첨부된 이미지 ({images.length})</h4>
            {!canAddMore && (
              <p className="text-xs text-gray-500">최대 {maxImages}개까지 업로드 가능</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <Card key={image.id} className="group relative">
                <CardContent className="p-2">
                  <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.file.name}
                      className="h-full w-full object-cover"
                      onLoad={() => {
                        // Image loaded successfully
                      }}
                      onError={() => {
                        console.error('Failed to load image preview:', image.file.name)
                      }}
                    />

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => handleRemove(image.id)}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    {/* File Info Overlay */}
                    <div className="absolute right-0 bottom-0 left-0 bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-xs" title={image.file.name}>
                        {image.file.name}
                      </p>
                      <p className="text-xs">{formatFileSize(image.file.size)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !canAddMore && (
        <div className="py-8 text-center text-gray-500">
          <ImageIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm">이미지가 첨부되지 않았습니다</p>
        </div>
      )}

      {/* Help Text */}
      <div className="space-y-1 text-xs text-gray-500">
        <p>• 스크린샷이나 에러 화면 캡처를 첨부하면 문제 해결에 도움이 됩니다</p>
        <p>• 개인정보가 포함된 이미지는 업로드하지 마세요</p>
        <p>• 각 이미지는 최대 {formatFileSize(maxFileSize)}까지 업로드 가능합니다</p>
      </div>
    </div>
  )
}

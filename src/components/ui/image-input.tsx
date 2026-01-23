'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useWebViewBridge } from '@/hooks/use-webview-bridge'
import { isMobileDevice, isValidBase64Image, uploadImageToServer } from '@/lib/image-utils'
import { Camera, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageInputProps {
  onImageSelect?: (file: File | string) => void
  onImageUpload?: (url: string) => void
  uploadUrl?: string
  className?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  placeholder?: string
}

export function ImageInput({
  onImageSelect,
  onImageUpload,
  uploadUrl,
  className,
  accept = 'image/*',
  multiple = false,
  disabled = false,
  placeholder = '이미지를 선택하세요',
}: ImageInputProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const { isWebView, requestImageUpload, requestCamera } = useWebViewBridge()
  const isMobile = isMobileDevice()
  const showMobileButtons = isMobile && isWebView

  const handleWebViewImageResponse = useCallback(
    async (event: MessageEvent) => {
      if (event.data?.type === 'IMAGE_UPLOAD_RESPONSE') {
        const { imageData } = event.data

        if (!imageData || !isValidBase64Image(imageData)) {
          setUploadError('유효하지 않은 이미지 데이터입니다.')
          return
        }

        setUploadError(null)

        if (uploadUrl) {
          setIsUploading(true)
          try {
            const result = await uploadImageToServer(imageData, uploadUrl)
            if (result.success && result.url) {
              onImageUpload?.(result.url)
            } else {
              setUploadError(result.error || '업로드에 실패했습니다.')
            }
          } catch {
            setUploadError('업로드 중 오류가 발생했습니다.')
          } finally {
            setIsUploading(false)
          }
        } else {
          onImageSelect?.(imageData)
        }
      }
    },
    [uploadUrl, onImageSelect, onImageUpload]
  )

  useEffect(() => {
    if (showMobileButtons) {
      window.addEventListener('message', handleWebViewImageResponse)
      return () => {
        window.removeEventListener('message', handleWebViewImageResponse)
      }
    }
  }, [showMobileButtons, handleWebViewImageResponse])

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || files.length === 0) return

      const file = files[0]
      if (uploadUrl) {
        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.url) {
              onImageUpload?.(result.url)
            } else {
              throw new Error('업로드 응답에 URL이 없습니다.')
            }
          })
          .catch((error) => {
            setUploadError('업로드에 실패했습니다: ' + error.message)
          })
          .finally(() => {
            setIsUploading(false)
          })
      } else {
        onImageSelect?.(file)
      }

      event.target.value = ''
    },
    [uploadUrl, onImageSelect, onImageUpload]
  )

  if (showMobileButtons) {
    return (
      <div className={cn('flex gap-2', className)}>
        <Button
          type="button"
          variant="outline"
          onClick={requestImageUpload}
          disabled={disabled || isUploading}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          갤러리
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={requestCamera}
          disabled={disabled || isUploading}
          className="flex items-center gap-2"
        >
          <Camera size={16} />
          카메라
        </Button>
        {isUploading && <div className="text-muted-foreground text-sm">업로드 중...</div>}
        {uploadError && <div className="text-sm text-red-500">{uploadError}</div>}
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <input
        type="file"
        id="image-input"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />
      <label
        htmlFor="image-input"
        className={cn(
          'flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100',
          disabled && 'cursor-not-allowed opacity-50',
          'transition-colors'
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="mb-4 h-8 w-8 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">클릭하여 업로드</span>
          </p>
          <p className="text-xs text-gray-500">{placeholder}</p>
        </div>
      </label>
      {isUploading && <div className="text-muted-foreground mt-2 text-sm">업로드 중...</div>}
      {uploadError && <div className="mt-2 text-sm text-red-500">{uploadError}</div>}
    </div>
  )
}

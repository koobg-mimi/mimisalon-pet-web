'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, X, FolderOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useWebViewBridge } from '@/hooks/use-webview-bridge'
import { isMobileDevice, isValidBase64Image, base64ToBlob } from '@/lib/image-utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProfileImageUploadProps {
  currentImageUrl?: string | null
  userName?: string
  onImageUpdate?: (imageUrl: string) => void
  className?: string
}

export function ProfileImageUpload({
  currentImageUrl,
  userName,
  onImageUpdate,
  className,
}: ProfileImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // WebView 브릿지 및 모바일 감지
  const { isWebView, requestImageUpload, requestCamera } = useWebViewBridge()
  const isMobile = isMobileDevice()
  const showMobileButtons = isMobile && isWebView

  // 서버를 통한 이미지 업로드
  const uploadFileToServer = useCallback(
    async (file: File) => {
      console.log('📤 uploadFileToServer called with file:', {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      setIsUploading(true)

      try {
        // Convert file to Base64
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        console.log('🔄 Uploading to server...')

        // Upload via server
        const response = await fetch('/api/groomer/profile/image/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: base64Data,
            filename: file.name,
            mimeType: file.type,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        const result = await response.json()
        console.log('✅ Server upload successful:', result.imageUrl)

        // Update UI
        onImageUpdate?.(result.imageUrl)
        toast.success('Profile image updated successfully')
      } catch (error) {
        console.error('❌ uploadFileToServer error:', error)
        toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setPreviewUrl(null)
        throw error
      } finally {
        setIsUploading(false)
      }
    },
    [onImageUpdate]
  )

  // WebView에서 받은 이미지 응답 처리
  const handleWebViewImageResponse = useCallback(
    async (event: MessageEvent) => {
      if (event.data?.type === 'IMAGE_UPLOAD_RESPONSE') {
        const { imageData } = event.data

        console.log('📱 Received image data from React Native:', {
          dataLength: imageData?.length || 0,
          hasValidFormat: isValidBase64Image(imageData),
        })

        if (!imageData || !isValidBase64Image(imageData)) {
          console.error('❌ Invalid image data received from React Native')
          toast.error('유효하지 않은 이미지 데이터입니다.')
          return
        }

        // Base64를 File 객체로 변환
        try {
          console.log('🔄 Converting Base64 to File object...')
          const blob = base64ToBlob(imageData.replace(/^data:image\/[a-z]+;base64,/, ''))
          const file = new File([blob], 'camera-image.jpg', { type: 'image/jpeg' })

          // 미리보기 설정
          setPreviewUrl(imageData)
          console.log('✅ Preview set for mobile image')

          // 서버 업로드 실행
          console.log('🚀 Starting mobile image upload to server...')
          await uploadFileToServer(file)
          console.log('🎉 Mobile image upload completed successfully')
        } catch (error) {
          console.error('❌ Base64 변환 오류:', error)
          toast.error('이미지 처리에 실패했습니다.')
        }
      }
    },
    [uploadFileToServer]
  )

  // WebView 메시지 리스너 등록
  useEffect(() => {
    if (showMobileButtons) {
      window.addEventListener('message', handleWebViewImageResponse)
      return () => {
        window.removeEventListener('message', handleWebViewImageResponse)
      }
    }
  }, [showMobileButtons, handleWebViewImageResponse])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      console.log('📁 Starting file selection:', {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to server
      console.log('🚀 Starting server upload...')
      await uploadFileToServer(file)
      console.log('✅ Server upload completed successfully')
    } catch (error) {
      console.error('❌ handleFileSelect error:', error)
      toast.error(
        `파일 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      )
      // 에러 발생 시 미리보기 초기화
      setPreviewUrl(null)
    } finally {
      // Reset the input
      e.target.value = ''
    }
  }

  const handleRemoveImage = async () => {
    try {
      const response = await fetch('/api/groomer/profile/image/upload', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove image')
      }

      setPreviewUrl(null)
      onImageUpdate?.('')
      toast.success('Profile image removed')
    } catch (error) {
      console.error('❌ Failed to remove image:', error)
      toast.error(
        `Failed to remove image: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  const displayUrl = previewUrl || currentImageUrl

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={displayUrl || undefined} alt={userName} />
          <AvatarFallback className="text-2xl">
            {userName?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <div className="text-center text-white">
              <Loader2 className="mx-auto h-6 w-6 animate-spin" />
              <span className="text-xs">업로드중...</span>
            </div>
          </div>
        )}

        {displayUrl && !isUploading && (
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-muted-foreground mb-3 text-xs">JPEG, PNG, WebP, GIF (최대 5MB)</p>
      </div>

      <div className="flex justify-center gap-3">
        {showMobileButtons ? (
          <>
            {/* Mobile WebView: Native Gallery/Camera Buttons */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={requestImageUpload}
              disabled={isUploading}
              className="h-10"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  갤러리
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={requestCamera}
              disabled={isUploading}
              className="h-10"
            >
              <Camera className="mr-2 h-4 w-4" />
              카메라
            </Button>
          </>
        ) : (
          <>
            {/* Web: File Input Buttons */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-10"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  사진 선택
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isUploading}
              className="h-10"
            >
              <Camera className="mr-2 h-4 w-4" />
              카메라 사용
            </Button>
          </>
        )}
      </div>

      {/* File inputs only shown for web browsers */}
      {!showMobileButtons && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </>
      )}

      {displayUrl && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemoveImage}
          disabled={isUploading}
          className="text-destructive hover:text-destructive"
        >
          <X className="mr-2 h-4 w-4" />
          사진 삭제
        </Button>
      )}
    </div>
  )
}

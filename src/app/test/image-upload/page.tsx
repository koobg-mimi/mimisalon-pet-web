'use client'

import React, { useState } from 'react'
import { ImageInput } from '@/components/ui/image-input'

export default function ImageUploadTestPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const handleImageSelect = (file: File | string) => {
    console.log('Image selected:', file)
    if (typeof file === 'string') {
      // Base64 이미지 데이터인 경우
      setSelectedImage(file)
    } else {
      // File 객체인 경우
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = (url: string) => {
    console.log('Image uploaded:', url)
    setUploadedImageUrl(url)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">이미지 업로드 테스트</h1>

      <div className="space-y-8">
        <div>
          <h2 className="mb-4 text-xl font-semibold">파일 선택만 (업로드 없음)</h2>
          <ImageInput
            onImageSelect={handleImageSelect}
            placeholder="이미지를 선택하세요 (업로드하지 않음)"
          />
          {selectedImage && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-600">선택된 이미지:</p>
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-48 max-w-xs rounded border object-contain"
              />
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">서버 업로드</h2>
          <ImageInput
            onImageUpload={handleImageUpload}
            uploadUrl="/api/upload" // 실제 업로드 API 엔드포인트로 변경 필요
            placeholder="이미지를 선택하여 서버에 업로드"
          />
          {uploadedImageUrl && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-600">업로드된 이미지 URL:</p>
              <a
                href={uploadedImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-blue-600 hover:underline"
              >
                {uploadedImageUrl}
              </a>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">테스트 방법:</h3>
          <ol className="list-inside list-decimal space-y-1 text-sm">
            <li>웹 브라우저에서: 파일 선택 UI가 표시됩니다</li>
            <li>React Native WebView에서: 갤러리/카메라 버튼이 표시됩니다</li>
            <li>Android/iOS에서 UserAgent 자동 감지하여 적절한 UI를 보여줍니다</li>
            <li>이미지 선택/촬영 후 자동으로 처리됩니다</li>
          </ol>
        </div>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="mb-2 font-semibold text-yellow-800">참고사항:</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-yellow-700">
            <li>서버 업로드 기능을 사용하려면 /api/upload 엔드포인트 구현이 필요합니다</li>
            <li>React Native에서 테스트할 때는 카메라/갤러리 권한이 필요합니다</li>
            <li>Base64 이미지는 크기가 큰 파일의 경우 성능에 영향을 줄 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

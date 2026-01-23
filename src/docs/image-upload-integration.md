# 이미지 업로드 & 카메라 통합 가이드

Next.js와 React Native 간 postMessage를 통한 이미지 업로드 및 카메라 기능 구현 가이드입니다.

## 아키텍처 개요

```
Next.js WebApp (Browser/WebView)
         ↕ postMessage
React Native App (iOS/Android)
         ↕ Native APIs
  Device Camera/Gallery
```

## 주요 특징

- **UserAgent 자동 감지**: 모바일 환경에서만 네이티브 기능 활성화
- **inject 없이 직접 등록**: Next.js에서 직접 postMessage 시스템 구현
- **Base64 전송**: React Native에서 Next.js로 이미지를 Base64 blob으로 전송
- **API가 아닌 컴포넌트 수신**: 수신된 값을 컴포넌트에서 직접 처리 후 서버 업로드

## 구현된 파일 목록

### Next.js 측

- `src/hooks/use-webview-bridge.ts`: WebView 브릿지 Hook (메시지 타입 및 요청 메서드 추가)
- `src/lib/image-utils.ts`: 이미지 유틸리티 함수 (Base64/Blob 변환, 업로드)
- `src/components/ui/image-input.tsx`: 이미지 입력 컴포넌트 (모바일 감지 및 postMessage)
- `src/app/test/image-upload/page.tsx`: 테스트 페이지

### React Native 측

- `application/src/utils/imageUtils.ts`: 이미지 Base64 변환 유틸리티
- `application/src/components/WebView/MainWebView.tsx`: WebView 메시지 핸들러 확장

## 사용 방법

### 1. Next.js 컴포넌트에서 사용

```tsx
import { ImageInput } from '@/components/ui/image-input'

function MyComponent() {
  const handleImageSelect = (file: File | string) => {
    // 모바일에서는 string (base64), 웹에서는 File 객체
    console.log('Selected image:', file)
  }

  const handleImageUpload = (url: string) => {
    // 서버에 업로드된 이미지 URL
    console.log('Uploaded URL:', url)
  }

  return (
    <ImageInput
      onImageSelect={handleImageSelect}
      onImageUpload={handleImageUpload}
      uploadUrl="/api/upload" // 선택사항: 서버 업로드 URL
      placeholder="이미지를 선택하세요"
    />
  )
}
```

### 2. 자동 플랫폼 감지

컴포넌트가 자동으로 플랫폼을 감지하여 적절한 UI를 제공합니다:

- **웹 브라우저**: 파일 선택 대화상자
- **React Native WebView**: 갤러리/카메라 버튼

## 메시지 플로우

### 이미지 업로드 요청

1. Next.js: `IMAGE_UPLOAD_REQUEST` postMessage 전송
2. React Native: 갤러리 권한 요청 및 ImagePicker 실행
3. React Native: 선택된 이미지를 Base64로 변환
4. React Native: `IMAGE_UPLOAD_RESPONSE` injectJavaScript로 전송
5. Next.js: 수신된 Base64 이미지를 처리 (Blob 변환 또는 서버 업로드)

### 카메라 요청

1. Next.js: `CAMERA_REQUEST` postMessage 전송
2. React Native: Camera Screen으로 네비게이션
3. React Native: 촬영된 이미지를 Base64로 변환
4. React Native: `IMAGE_UPLOAD_RESPONSE` injectJavaScript로 전송
5. Next.js: 수신된 Base64 이미지를 처리

## 테스트 방법

### 웹 브라우저 테스트

```bash
cd mimisalon-nextjs
npm run dev
```

브라우저에서 `http://localhost:3000/test/image-upload` 방문

### React Native 테스트

```bash
cd application
npm start
```

시뮬레이터/실제 디바이스에서 WebView를 통해 동일한 페이지 접근

## API 구현 예시

```typescript
// pages/api/upload.ts 또는 app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  // 파일 업로드 로직 구현
  // S3, Cloudinary, 로컬 저장소 등

  return Response.json({
    success: true,
    url: 'https://example.com/uploaded-image.jpg',
  })
}
```

## 권한 설정

### React Native (application/app.json)

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "앱에서 카메라를 사용하여 사진을 촬영합니다."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "앱에서 갤러리에서 이미지를 선택합니다."
        }
      ]
    ]
  }
}
```

## 성능 최적화

1. **이미지 압축**: React Native에서 Base64 변환 시 자동 압축 적용
2. **크기 제한**: 최대 1024x1024 해상도로 리사이징
3. **품질 조정**: JPEG 압축 품질 80% 적용
4. **파일 크기 체크**: 10MB 제한 적용

## 에러 처리

- 권한 거부 시 알림 표시
- 이미지 변환 실패 시 에러 메시지
- 네트워크 오류 시 재시도 옵션
- 유효하지 않은 파일 형식 차단

## 보안 고려사항

- Base64 데이터 크기 검증
- 허용된 MIME 타입 체크
- 파일 크기 제한 적용
- 업로드 URL 검증 필수

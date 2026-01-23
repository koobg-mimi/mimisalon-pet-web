# Expo Push Notification Setup

Firebase FCM을 Expo Push Notification으로 마이그레이션했습니다.

## 환경 변수 설정

### `.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# Expo Push Notification 설정 (선택적)
EXPO_ACCESS_TOKEN=your_expo_access_token_here

# 기본 설정으로도 작동하지만, 프로덕션에서는 AccessToken 설정을 권장합니다.
```

### Expo Access Token 얻는 방법:

1. [Expo Developer Console](https://expo.dev/)에 로그인
2. 프로젝트 선택
3. Settings → Access Tokens에서 생성
4. Server-to-server 용도로 생성된 토큰을 사용

## 클라이언트 측 설정 (React Native WebView)

웹뷰에서 ExponentPushToken을 NextJS로 전송하려면 React Native 앱에서 다음과 같이 설정하세요:

### 1. React Native에서 WebView로 토큰 전송

```javascript
// React Native 코드
import * as Notifications from 'expo-notifications'

const getExpoPushToken = async () => {
  const { status } = await Notifications.requestPermissionsAsync()
  if (status !== 'granted') {
    console.log('Permission not granted for push notifications')
    return null
  }

  const token = await Notifications.getExpoPushTokenAsync()
  return token.data
}

// WebView에 토큰 전송
const sendTokenToWebView = async (webViewRef) => {
  const token = await getExpoPushToken()
  if (token && webViewRef.current) {
    const message = JSON.stringify({
      type: 'EXPO_PUSH_TOKEN',
      token: token,
    })

    webViewRef.current.postMessage(message)
  }
}
```

### 2. React Native에서 토큰 요청 리스너 설정

```javascript
// WebView에서 토큰 요청을 받았을 때 응답
const handleWebViewMessage = async (event) => {
  try {
    const data = JSON.parse(event.nativeEvent.data)

    if (data.type === 'REQUEST_EXPO_PUSH_TOKEN') {
      await sendTokenToWebView(webViewRef)
    }
  } catch (error) {
    console.log('Error handling WebView message:', error)
  }
}

// WebView 컴포넌트 설정
;<WebView
  ref={webViewRef}
  source={{ uri: 'https://your-nextjs-app.com' }}
  onMessage={handleWebViewMessage}
  onLoadEnd={() => {
    // 페이지 로드 완료 후 토큰 전송
    sendTokenToWebView(webViewRef)
  }}
/>
```

## 작동 방식

1. **자동 토큰 수집**: React Native WebView에서 NextJS 웹앱으로 ExponentPushToken을 자동으로 전송
2. **로그인 시 등록**: 사용자가 로그인하면 자동으로 토큰이 `fcmToken` 필드에 저장됨
3. **토큰 검증**: 서버에서 유효한 ExponentPushToken인지 검증
4. **푸시 전송**: expo-server-sdk를 사용하여 푸시 알림 전송

## 주요 변경사항

### 이전 (Firebase FCM)

- Firebase Admin SDK 사용
- FCM 토큰 관리
- Firebase 서비스 계정 필요

### 현재 (Expo Push Notification)

- expo-server-sdk 사용
- ExponentPushToken 관리
- Expo Access Token (선택적)

## API 엔드포인트

### 토큰 등록/수정

```
POST /api/notifications/token
{
  "fcmToken": "ExponentPushToken[xxxxxx]"
}
```

### 토큰 삭제

```
DELETE /api/notifications/token
```

### 관리자용 알림 전송

```
POST /api/admin/notifications/send-fcm
{
  "userId": "user_id",
  "title": "알림 제목",
  "body": "알림 내용"
}
```

## 주의사항

1. **토큰 형식**: ExponentPushToken은 `ExponentPushToken[xxxxxx]` 형식이어야 함
2. **WebView 감지**: React Native WebView 환경에서만 토큰 자동 수집 작동
3. **권한 요청**: React Native 앱에서 알림 권한을 미리 요청해야 함
4. **토큰 갱신**: ExponentPushToken은 앱 재설치 시 변경될 수 있음

## 테스트

1. React Native WebView에서 웹앱 접속
2. 로그인 수행
3. 브라우저 콘솔에서 토큰 수신 확인
4. 관리자 패널에서 테스트 알림 전송

## 문제 해결

### 토큰이 수신되지 않는 경우:

1. React Native 앱에서 알림 권한 확인
2. WebView 설정에서 JavaScript 활성화 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### 알림 전송이 실패하는 경우:

1. ExponentPushToken 형식 확인
2. Expo Access Token 설정 확인
3. 서버 로그에서 에러 확인

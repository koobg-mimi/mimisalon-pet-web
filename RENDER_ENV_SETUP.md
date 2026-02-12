# Render 환경변수 설정 가이드

Render에서 배포할 때 필요한 환경변수입니다. Render 대시보드의 "Environment" 섹션에 다음 변수들을 추가하세요.

## 필수 환경변수 (Required)

### 데이터베이스
```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

### 인증 (better-auth)
```
BETTER_AUTH_URL=https://[your-app-url]
BETTER_AUTH_SECRET=[32자 이상의 암호화 키]
```

### 이메일 (SMTP)
```
SMTP_HOST=[SMTP 서버 주소]
SMTP_PORT=[SMTP 포트 번호]
SMTP_USERNAME=[이메일 주소]
SMTP_PASSWORD=[이메일 비밀번호 또는 앱 비밀번호]
```

### 문자 인증 (Twilio)
```
TWILIO_ACCOUNT_SID=[Twilio 계정 ID]
TWILIO_AUTH_TOKEN=[Twilio 인증 토큰]
TWILIO_VERIFY_SERVICE_SID=[Twilio Verify 서비스 ID]
TWILIO_PHONE_NUMBER=[Twilio 전화번호 (E.164 형식)]
```

### 결제 (PortOne)
```
PORTONE_API_SECRET=[PortOne API 비밀키]
PORTONE_CHANNEL_KEY=[PortOne 채널 키]
PORTONE_STORE_ID=[PortOne 스토어 ID]
```

### 클라우드 스토리지 (Google Cloud Storage)
```
GCS_PROJECT_ID=[GCS 프로젝트 ID]
GCS_APP_BUCKET=[GCS 버킷 이름]
```

### 카카오 API
```
KAKAO_REST_API_KEY=[카카오 REST API 키]
NEXT_PUBLIC_KAKAO_MAP_KEY=[카카오 지도 API 키]
```

### 기타 옵션
```
NODE_ENV=production
SMS_SEND_ENABLED=true
EMAIL_OTP_ENABLED=true
SETTLEMENT_COMMISSION_RATE=10
LOG_LEVEL=info
```

## 클라이언트 환경변수 (NEXT_PUBLIC_*)

이 변수들은 브라우저에 노출되므로 NEXT_PUBLIC_ 접두사가 필요합니다.

```
NEXT_PUBLIC_KAKAO_MAP_KEY=[카카오 지도 API 키]
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=[PortOne 채널 키]
NEXT_PUBLIC_PORTONE_STORE_ID=[PortOne 스토어 ID]
NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE=+82-10-4043-9775
NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL=koobg@mimisalon.pet
NEXT_PUBLIC_LOGGING_ENABLED=true
```

## 설정 방법

1. Render 대시보드에서 해당 서비스로 이동
2. "Settings" → "Environment" 클릭
3. "Add Environment Variable" 클릭
4. 각 변수를 추가
5. "Deploy" 클릭하여 배포

## 주의사항

- 모든 필수 변수가 설정되지 않으면 배포가 실패합니다
- 보안을 위해 민감한 정보는 직접 입력하지 말고 Render의 환경변수 관리 기능을 사용하세요
- `.env.production.example` 파일을 템플릿으로 참조하세요
- DATABASE_URL은 프로덕션 데이터베이스로 변경해야 합니다

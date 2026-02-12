#!/bin/bash

# Render 배포 환경변수 설정 스크립트
# 사용법: ./scripts/setup-render-env.sh

set -e

echo "🚀 Render 배포 환경변수 설정 시작"
echo ""

# 현재 디렉토리가 프로젝트 루트인지 확인
if [ ! -f "package.json" ]; then
    echo "❌ 에러: 프로젝트 루트 디렉토리에서 실행하세요"
    exit 1
fi

echo "Render 대시보드에서 다음 환경변수들을 설정해주세요:"
echo ""
echo "📋 필수 환경변수 (Required):"
echo ""
echo "1️⃣  DATABASE_URL"
echo "   설명: PostgreSQL 데이터베이스 연결 문자열"
echo "   형식: postgresql://user:password@host:port/database"
echo ""

echo "2️⃣  BETTER_AUTH_SECRET"
echo "   설명: 인증 비밀키 (최소 32자)"
echo ""

echo "3️⃣  BETTER_AUTH_URL"
echo "   설명: 애플리케이션 기본 URL"
echo "   예시: https://your-app.render.com"
echo ""

echo "4️⃣  SMTP 설정 (이메일)"
echo "   - SMTP_HOST: smtp.gmail.com"
echo "   - SMTP_PORT: 587"
echo "   - SMTP_USERNAME: your-email@gmail.com"
echo "   - SMTP_PASSWORD: your-app-password"
echo ""

echo "5️⃣  Twilio 설정 (문자 인증)"
echo "   - TWILIO_ACCOUNT_SID"
echo "   - TWILIO_AUTH_TOKEN"
echo "   - TWILIO_VERIFY_SERVICE_SID"
echo "   - TWILIO_PHONE_NUMBER"
echo ""

echo "6️⃣  PortOne 설정 (결제)"
echo "   - PORTONE_API_SECRET"
echo "   - PORTONE_CHANNEL_KEY"
echo "   - PORTONE_STORE_ID"
echo "   - NEXT_PUBLIC_PORTONE_CHANNEL_KEY"
echo "   - NEXT_PUBLIC_PORTONE_STORE_ID"
echo ""

echo "7️⃣  Google Cloud Storage"
echo "   - GCS_PROJECT_ID"
echo "   - GCS_APP_BUCKET"
echo ""

echo "8️⃣  Kakao API"
echo "   - KAKAO_REST_API_KEY"
echo "   - NEXT_PUBLIC_KAKAO_MAP_KEY"
echo ""

echo "📝 설정 방법:"
echo "1. Render 대시보드 (https://dashboard.render.com) 접속"
echo "2. 해당 서비스 선택"
echo "3. 'Settings' → 'Environment' 클릭"
echo "4. 'Add Environment Variable' 클릭"
echo "5. 위 변수들을 하나씩 추가"
echo "6. 'Deploy' 클릭하여 배포 시작"
echo ""

echo "💡 팁:"
echo "- .env.production.example 파일에서 템플릿 참조"
echo "- 민감한 정보는 .env 파일에 저장하지 말고 Render에서 관리"
echo "- render.yaml 파일에 빌드 명령어 정의됨"
echo ""

echo "✅ 모든 환경변수를 설정했으면 Render에서 재배포하세요!"

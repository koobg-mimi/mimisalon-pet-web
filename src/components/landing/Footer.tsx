import { Building, Mail, Phone, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CUSTOMER_SERVICE } from '@/lib/constants/customer-service';

export function Footer() {
  const customerServicePhone = CUSTOMER_SERVICE.PHONE;
  return (
    <footer data-cy="footer" className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        {/* 상단 - 브랜드 및 연락처 */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* 1칸 - 브랜드 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="border-primary/20 flex h-8 w-8 items-center justify-center rounded-md border bg-white p-1">
                <Image
                  src="/icon.svg"
                  alt="미미살롱펫 로고"
                  width={24}
                  height={24}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <span className="text-primary text-lg font-bold">미미살롱펫</span>
            </div>
            <p className="text-muted-foreground text-sm">프리미엄 방문 반려동물 미용 서비스</p>
            <p className="text-muted-foreground text-sm">
              우리 아이를 위한 최고의 케어를 집에서 편안하게 받으세요.
            </p>
          </div>

          {/* 2칸 - 빈 공간 */}
          <div className="hidden lg:block"></div>

          {/* 3칸 - 고객센터 */}
          <div className="space-y-4">
            <h4 className="font-medium">고객센터</h4>
            <div className="text-muted-foreground space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+82-10-4043-9775</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>koobg@mimisalon.pet</span>
              </div>
              <div>운영시간: 평일 09:00 - 18:00</div>
              <div>주말 및 공휴일 휴무</div>
            </div>
          </div>

          {/* 4칸 - 정책 */}
          <div className="space-y-4">
            <h4 className="font-medium">정책 및 약관</h4>
            <div className="space-y-2 text-sm">
              <Link
                href="/terms?tab=service"
                className="text-muted-foreground hover:text-primary block transition-colors"
              >
                이용약관
              </Link>
              <Link
                href="/terms?tab=privacy"
                className="text-muted-foreground hover:text-primary block transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/terms?tab=partner"
                className="text-muted-foreground hover:text-primary block transition-colors"
              >
                파트너 약관
              </Link>
              <Link
                href="/terms?tab=payment"
                className="text-muted-foreground hover:text-primary block transition-colors"
              >
                취소/환불 정책
              </Link>
            </div>
          </div>
        </div>

        {/* 하단 - 기업 정보 */}
        <div className="border-t pt-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 법인 정보 */}
            <div className="space-y-2">
              <div className="mb-3 flex items-center gap-2">
                <Building className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">기업정보</span>
              </div>
              <div className="text-muted-foreground grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div>
                  <span className="font-medium">회사명:</span> 주식회사 미미펫
                </div>
                <div>
                  <span className="font-medium">대표자:</span> 구본기
                </div>
                <div>
                  <span className="font-medium">사업자등록번호:</span> 828-87-00919
                </div>
                <div>
                  <span className="font-medium">통신판매업신고:</span> 제2017-서울동작-0000호
                </div>
              </div>
              <div className="text-muted-foreground mt-2 text-xs">
                <div className="flex items-start gap-1">
                  <span className="font-medium">주소:</span>
                  <span>서울특별시 동작구 사당로 65-1 (상도동)</span>
                </div>
              </div>
              <div className="text-muted-foreground text-xs">
                <span className="font-medium">개인정보보호책임자:</span> 구본기
                (koobg@mimisalon.pet)
              </div>
            </div>

            {/* 추가 정보 및 저작권 */}
            <div className="space-y-2">
              <div className="text-muted-foreground text-xs">
                <div className="mb-2">
                  <span className="font-medium">호스팅 서비스:</span> Google Cloud Platform (GCP)
                </div>
                <div className="mb-2">
                  <span className="font-medium">결제대행사:</span> 토스페이먼츠
                </div>
                <div className="mb-3">
                  미미살롱펫은 통신판매중개자로서 통신판매의 당사자가 아니며, 미용사가 등록한
                  상품정보 및 거래에 대해 미미살롱펫은 책임을 지지 않습니다.
                </div>
              </div>
              <div className="text-muted-foreground text-xs">
                © 2025 mimipet Co., Ltd. All rights reserved.
              </div>
            </div>
          </div>

          {/* 에러 리포트 버튼 */}
          <div className="mt-4 border-t pt-4">
            <Link
              href="/error-report"
              className="text-muted-foreground hover:text-primary flex items-center gap-2 text-xs transition-colors"
            >
              <AlertTriangle className="h-3 w-3" />
              <span>문제 신고하기</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

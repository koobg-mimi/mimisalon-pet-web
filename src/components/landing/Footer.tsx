import { Building, Mail, Phone, AlertTriangle, Instagram, Facebook, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CUSTOMER_SERVICE } from '@/lib/constants/customer-service'

export function Footer() {
  const customerServicePhone = CUSTOMER_SERVICE.PHONE
  return (
    <footer data-cy="footer" className="bg-gradient-to-b from-gray-50 to-gray-100 border-t">
      <div className="container mx-auto px-4 py-16">
        {/* 상단 - 브랜드 및 연락처 */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* 1칸 - 브랜드 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 p-1">
                <Image
                  src="/icon.svg"
                  alt="미미살롱펫 로고"
                  width={24}
                  height={24}
                  className="h-full w-full object-contain filter invert"
                  priority
                />
              </div>
              <div>
                <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  미미살롱펫
                </p>
                <p className="text-xs text-gray-600">프리미엄 반려동물 미용</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              우리 아이의 행복한 미용을 위한 최고의 케어를 집에서 편안하게 받으세요.
            </p>
            {/* 소셜 링크 */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-white text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white text-gray-600 hover:text-blue-400 hover:bg-blue-50 transition">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* 2칸 - 빠른 링크 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">빠른 링크</h4>
            <div className="space-y-2 text-sm">
              <Link href="/booking/new" className="text-gray-600 hover:text-purple-600 transition block">
                예약하기
              </Link>
              <Link href="/terms?tab=service" className="text-gray-600 hover:text-purple-600 transition block">
                이용약관
              </Link>
              <Link href="/terms?tab=privacy" className="text-gray-600 hover:text-purple-600 transition block">
                개인정보처리방침
              </Link>
              <Link href="/error-report" className="text-gray-600 hover:text-purple-600 transition block">
                문제 신고
              </Link>
            </div>
          </div>

          {/* 3칸 - 고객센터 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">고객센터</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">전화</p>
                  <p className="text-gray-900 font-medium">+82-10-4043-9775</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">이메일</p>
                  <p className="text-gray-900 font-medium">koobg@mimisalon.pet</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">운영시간</p>
                <p className="text-gray-900">평일 09:00 - 18:00</p>
                <p className="text-gray-900">주말/공휴일 휴무</p>
              </div>
            </div>
          </div>

          {/* 4칸 - 파트너 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">파트너</h4>
            <div className="space-y-2 text-sm">
              <Link href="/terms?tab=partner" className="text-gray-600 hover:text-purple-600 transition block">
                그루머 가입
              </Link>
              <Link href="/terms?tab=partner" className="text-gray-600 hover:text-purple-600 transition block">
                파트너 약관
              </Link>
              <Link href="/terms?tab=payment" className="text-gray-600 hover:text-purple-600 transition block">
                취소/환불 정책
              </Link>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">결제 대행</p>
                <p className="text-gray-900 font-medium">토스페이먼츠</p>
              </div>
            </div>
          </div>
        </div>

        {/* 중간 - 기업 정보 */}
        <div className="border-t border-gray-200 py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* 법인 정보 */}
            <div className="space-y-2">
              <div className="mb-3 flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-gray-900">기업정보</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div><span className="font-medium text-gray-700">회사명:</span> 주식회사 미미펫</div>
                <div><span className="font-medium text-gray-700">대표자:</span> 구본기</div>
                <div><span className="font-medium text-gray-700">사업자등록번호:</span> 828-87-00919</div>
                <div><span className="font-medium text-gray-700">통신판매업신고:</span> 제2017-서울동작-0000호</div>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="space-y-2">
              <div className="mb-3 font-semibold text-gray-900">주소</div>
              <div className="text-sm text-gray-600 leading-relaxed">
                서울특별시 동작구 사당로 65-1 (상도동)
              </div>
              <div className="pt-2 border-t border-gray-200 mt-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">개인정보보호책임자:</span>
                  <br />
                  구본기 (koobg@mimisalon.pet)
                </div>
              </div>
            </div>

            {/* 호스팅 정보 */}
            <div className="space-y-2">
              <div className="mb-3 font-semibold text-gray-900">기술</div>
              <div className="space-y-1 text-sm text-gray-600">
                <div><span className="font-medium text-gray-700">호스팅:</span> Google Cloud Platform (GCP)</div>
                <div><span className="font-medium text-gray-700">결제:</span> 토스페이먼츠</div>
              </div>
              <div className="pt-2 border-t border-gray-200 mt-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  미미살롱펫은 통신판매중개자로서 통신판매의 당사자가 아니며, 미용사가 등록한 상품정보 및 거래에 대해 책임을 지지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 - 저작권 */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2017-2025 mimipet Co., Ltd. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Made with <span className="text-pink-600">❤️</span> for our furry friends
          </p>
        </div>
      </div>
    </footer>
  )
}

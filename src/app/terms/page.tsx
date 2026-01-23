import { Metadata } from 'next'
import TermsNavigation from './terms-navigation'
import { CUSTOMER_SERVICE } from '@/lib/constants/customer-service'

export const metadata: Metadata = {
  title: '이용약관 | 미미살롱',
  description: '미미살롱 서비스 이용약관, 개인정보처리방침 및 정책을 확인하실 수 있습니다.',
  keywords: ['미미살롱', '이용약관', '개인정보처리방침', '결제정책', '반려동물 미용'],
  openGraph: {
    title: '미미살롱 이용약관',
    description: '미미살롱 서비스 이용에 관한 약관 및 정책',
    type: 'website',
    locale: 'ko_KR',
    siteName: '미미살롱',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Server Component - Pre-rendered on the server
export default function TermsPage() {
  // All terms content is rendered server-side for SEO
  const serviceTerms = (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="mb-2 text-lg font-semibold">제 1 조 (목적)</h3>
        <p className="leading-relaxed text-gray-700">
          이 약관은 미미살롱(이하 {'"회사"'})이 제공하는 반려동물 미용 예약 플랫폼 서비스(이하{' '}
          {'"서비스"'})의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을
          규정함을 목적으로 합니다.
        </p>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">제 2 조 (정의)</h3>
        <p className="mb-2 leading-relaxed text-gray-700">
          이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>
            {'"서비스"'}란 회사가 제공하는 반려동물 미용 예약 플랫폼 및 관련 제반 서비스를
            의미합니다.
          </li>
          <li>
            {'"회원"'}이란 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를
            이용하는 고객을 말합니다.
          </li>
          <li>
            {'"미용사"'}란 회사의 플랫폼을 통해 반려동물 미용 서비스를 제공하는 전문가를 말합니다.
          </li>
          <li>{'"예약"'}이란 회원이 플랫폼을 통해 미용사의 서비스를 예약하는 행위를 말합니다.</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">제 3 조 (약관의 게시와 개정)</h3>
        <ol className="list-decimal space-y-2 pl-5 text-gray-700">
          <li>
            회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 내 또는 연결화면에 게시합니다.
          </li>
          <li>회사는 관련법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
          <li>
            회사가 약관을 개정할 경우 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 내
            적절한 장소에 적용일자 7일 전부터 게시합니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">제 4 조 (서비스의 제공 및 변경)</h3>
        <ol className="list-decimal space-y-2 pl-5 text-gray-700">
          <li>
            회사는 다음과 같은 서비스를 제공합니다.
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>반려동물 미용 예약 서비스</li>
              <li>미용사 정보 제공 서비스</li>
              <li>결제 대행 서비스</li>
              <li>리뷰 및 평점 서비스</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
          </li>
          <li>회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">제 5 조 (회원가입)</h3>
        <ol className="list-decimal space-y-2 pl-5 text-gray-700">
          <li>
            회원가입은 이용자가 이 약관의 내용에 대하여 동의를 하고 회원가입 신청을 한 후 회사가
            이러한 신청에 대하여 승낙함으로써 체결됩니다.
          </li>
          <li>
            회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할
            수 있습니다.
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>가입신청자가 이전에 회원자격을 상실한 적이 있는 경우</li>
              <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
              <li>허위의 정보를 기재한 경우</li>
              <li>14세 미만 아동이 법정대리인 동의 없이 가입한 경우</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">제 6 조 (회원의 의무)</h3>
        <p className="mb-2 leading-relaxed text-gray-700">
          회원은 다음 각 호의 행위를 하여서는 안 됩니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>신청 또는 변경 시 허위 내용의 등록</li>
          <li>타인의 정보 도용</li>
          <li>회사가 게시한 정보의 변경</li>
          <li>회사가 금지한 정보의 송신 또는 게시</li>
          <li>기타 불법적이거나 부당한 행위</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">제 7 조 (지병·노령견 미용 동의서)</h3>
        <div className="mb-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4">
          <p className="mb-2 font-semibold text-orange-800">※ 안내사항 ※</p>
          <p className="leading-relaxed text-orange-700">
            지병(뇌질환, 심장질환, 보행불가 등)이 있거나 노령견(만 10세 이상)인 경우 반드시
            &quot;지병·노령견 미용 동의서&quot;를 작성해주셔야 합니다.
          </p>
        </div>
        <ol className="list-decimal space-y-3 pl-5 text-gray-700">
          <li>
            미미살롱펫은 반려견 미용 시 반려견의 건강과 안전을 최우선으로 고려하여 소홀함 없이
            최대한 주의를 기울여 미용을 진행할 것을 약속드립니다.
          </li>
          <li>
            다만, 노령견 및 지병이 있는 반려견의 경우 노화 및 기존 질환으로 인한 각종 위험 요인이
            존재할 수 있으며 미용 후 상태 악화 또는 스트레스 유발로 인한 원치 않는 상황이 발생할
            가능성이 있음을 사전 고지드립니다.
          </li>
          <li>
            미미살롱펫은 최대한 보호자의 입장에서 아이들의 상태를 살피며 미용을 진행하겠습니다.
            그러나 위와 같은 상황으로 인해 발생하는 건강 이상 및 사고에 대해 미미살롱펫은 법적
            책임을 지지 않음에 대해 보호자의 사전 동의를 요청드립니다.
          </li>
        </ol>
      </section>

      <div className="mt-8 rounded-lg bg-gray-100 p-4">
        <p className="text-xs text-gray-600">최종 수정일: 2025년 10월 3일</p>
      </div>
    </div>
  )

  const privacyPolicy = (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="mb-2 text-lg font-semibold">1. 개인정보의 수집 및 이용목적</h3>
        <p className="mb-2 leading-relaxed text-gray-700">
          회사는 다음의 목적을 위하여 개인정보를 처리합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>회원제 서비스 제공에 따른 본인 식별·인증</li>
          <li>반려동물 미용 예약 및 관리</li>
          <li>결제 및 정산 처리</li>
          <li>고객 상담, 불만처리, 공지사항 전달</li>
          <li>마케팅 및 광고에 활용</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">2. 수집하는 개인정보 항목</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">필수항목</h4>
            <ul className="list-disc space-y-1 pl-5 text-gray-700">
              <li>이메일 주소, 비밀번호</li>
              <li>이름, 연락처</li>
              <li>반려동물 정보 (이름, 종류, 나이, 특이사항)</li>
              <li>서비스 이용 기록, 접속 로그</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">선택항목</h4>
            <ul className="list-disc space-y-1 pl-5 text-gray-700">
              <li>프로필 사진</li>
              <li>주소</li>
              <li>생년월일</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">3. 개인정보의 보유 및 이용기간</h3>
        <p className="mb-2 leading-relaxed text-gray-700">
          회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이
          파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
          <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
          <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">4. 개인정보의 파기</h3>
        <p className="leading-relaxed text-gray-700">
          회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
          지체없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는
          기술적 방법을 사용하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여
          파기합니다.
        </p>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">5. 개인정보 보호책임자</h3>
        <div className="rounded bg-gray-50 p-4">
          <p className="mb-2 font-medium">개인정보 보호책임자</p>
          <ul className="space-y-1 text-gray-700">
            <li>성명: 홍길동</li>
            <li>직책: 개인정보보호팀장</li>
            <li>이메일: privacy@mimisalon.com</li>
            <li>전화번호: {CUSTOMER_SERVICE.PHONE}</li>
          </ul>
        </div>
      </section>

      <div className="mt-8 rounded-lg bg-gray-100 p-4">
        <p className="text-xs text-gray-600">시행일: 2025년 10월 3일</p>
      </div>
    </div>
  )

  const paymentTerms = (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="mb-2 text-lg font-semibold">1. 결제 방법</h3>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>신용카드 (VISA, MasterCard, JCB, AMEX)</li>
          <li>체크카드</li>
          <li>카카오페이, 네이버페이, 토스페이</li>
          <li>실시간 계좌이체</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">2. 취소 및 환불 정책</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">취소 수수료</h4>
            <ul className="list-disc space-y-1 pl-5 text-gray-700">
              <li>예약 24시간 전 취소: 전액 환불</li>
              <li>예약 12시간 전 취소: 70% 환불</li>
              <li>예약 3시간 전 취소: 50% 환불</li>
              <li>예약 3시간 이내 취소: 환불 불가</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">환불 처리 기간</h4>
            <ul className="list-disc space-y-1 pl-5 text-gray-700">
              <li>신용카드: 영업일 기준 3-5일</li>
              <li>체크카드: 영업일 기준 3-5일</li>
              <li>간편결제: 영업일 기준 1-3일</li>
              <li>계좌이체: 영업일 기준 1-2일</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">3. 노쇼(No-Show) 정책</h3>
        <p className="mb-2 leading-relaxed text-gray-700">
          예약 시간에 연락 없이 방문하지 않은 경우:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>결제 금액의 환불 불가</li>
          <li>3회 이상 노쇼 시 서비스 이용 제한</li>
        </ul>
      </section>

      <div className="mt-8 rounded-lg bg-gray-100 p-4">
        <p className="text-xs text-gray-600">최종 수정일: 2025년 10월 3일</p>
      </div>
    </div>
  )

  const marketingTerms = (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="mb-2 text-lg font-semibold">1. 마케팅 정보 수신 동의</h3>
        <p className="mb-2 leading-relaxed text-gray-700">
          미미살롱은 회원님께 다양한 혜택과 정보를 제공하기 위해 마케팅 정보를 발송할 수 있습니다.
        </p>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">2. 수신 정보의 종류</h3>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>신규 미용사 및 서비스 소개</li>
          <li>할인 쿠폰 및 이벤트 정보</li>
          <li>예약 리마인더 및 추천 서비스</li>
          <li>설문조사 및 리서치 참여 요청</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">3. 수신 방법</h3>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>이메일</li>
          <li>SMS/MMS</li>
          <li>푸시 알림</li>
          <li>카카오톡 알림톡</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-semibold">4. 수신 동의 철회</h3>
        <p className="mb-2 leading-relaxed text-gray-700">
          수신 동의 철회는 다음의 방법으로 가능합니다:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>마이페이지 알림 설정에서 변경</li>
          <li>수신된 이메일 하단의 {'"수신거부"'} 링크 클릭</li>
          <li>문자메시지 회신으로 {'"수신거부"'} 발송</li>
          <li>고객센터({CUSTOMER_SERVICE.PHONE})로 연락</li>
        </ul>
      </section>

      <div className="mt-8 rounded-lg bg-gray-100 p-4">
        <p className="text-xs text-gray-600">최종 수정일: 2025년 10월 3일</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header - Server Rendered */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">미미살롱 이용약관</h1>
          <p className="mt-2 text-gray-600">
            미미살롱 서비스 이용에 관한 약관 및 정책을 확인하실 수 있습니다.
          </p>
        </div>

        {/* Interactive Navigation - Client Component */}
        <TermsNavigation
          serviceTerms={serviceTerms}
          privacyPolicy={privacyPolicy}
          paymentTerms={paymentTerms}
          marketingTerms={marketingTerms}
        />
      </div>
    </div>
  )
}

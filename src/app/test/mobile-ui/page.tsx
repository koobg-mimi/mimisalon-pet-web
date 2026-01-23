'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ResponsiveTable } from '@/components/ui/table-responsive'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircleIcon } from 'lucide-react'

// Sample data for table testing
const sampleData = [
  {
    id: 1,
    name: '김미미',
    service: '전체 미용',
    date: '2024-03-15',
    time: '14:00',
    price: 60000,
    status: 'confirmed',
  },
  {
    id: 2,
    name: '이포메',
    service: '목욕 + 부분 미용',
    date: '2024-03-16',
    time: '10:00',
    price: 45000,
    status: 'pending',
  },
  {
    id: 3,
    name: '박몽이',
    service: '스파 + 전체 미용',
    date: '2024-03-17',
    time: '15:30',
    price: 80000,
    status: 'completed',
  },
]

export default function MobileUITestPage() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [selectValue, setSelectValue] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              모바일 UI 개선 테스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Button Section */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">1. 버튼 (최소 44px 터치 영역)</h3>
              <div className="flex flex-wrap gap-3">
                <Button>기본 버튼</Button>
                <Button variant="outline">아웃라인</Button>
                <Button variant="secondary">보조 버튼</Button>
                <Button size="sm">작은 버튼</Button>
                <Button size="lg">큰 버튼</Button>
                <Button size="icon">🔔</Button>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                ✅ 모바일: 최소 44px 높이 | 데스크톱: 40px
              </p>
            </div>

            {/* Input Section */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">2. 입력 필드 (16px 폰트로 줌 방지)</h3>
              <div className="space-y-3">
                <Input
                  placeholder="이름을 입력하세요"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Input type="email" placeholder="이메일을 입력하세요" />
                <Input type="tel" placeholder="전화번호를 입력하세요" />
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                ✅ 16px 폰트 크기로 모바일 줌 방지
              </p>
            </div>

            {/* Textarea Section */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">3. 텍스트 영역</h3>
              <Textarea
                placeholder="메시지를 입력하세요..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={4}
              />
              <p className="text-muted-foreground mt-2 text-sm">
                ✅ 세로 크기 조절 가능 (resize-y)
              </p>
            </div>

            {/* Select Section */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">4. 선택 드롭다운 (터치 영역 확대)</h3>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger>
                  <SelectValue placeholder="서비스를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">전체 미용</SelectItem>
                  <SelectItem value="partial">부분 미용</SelectItem>
                  <SelectItem value="bath">목욕만</SelectItem>
                  <SelectItem value="spa">스파 + 미용</SelectItem>
                  <SelectItem value="nail">발톱 관리</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground mt-2 text-sm">✅ 드롭다운 항목 44px 높이</p>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Table Section */}
        <Card>
          <CardHeader>
            <CardTitle>5. 반응형 테이블 (모바일 카드 뷰)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveTable
              data={sampleData}
              columns={[
                {
                  key: 'name',
                  label: '고객명',
                  priority: 'high',
                },
                {
                  key: 'service',
                  label: '서비스',
                  priority: 'high',
                },
                {
                  key: 'date',
                  label: '날짜',
                  priority: 'medium',
                },
                {
                  key: 'time',
                  label: '시간',
                  priority: 'medium',
                },
                {
                  key: 'price',
                  label: '금액',
                  priority: 'medium',
                  render: (value) => `${value.toLocaleString('ko-KR')}원`,
                },
                {
                  key: 'status',
                  label: '상태',
                  priority: 'low',
                  render: (value) => (
                    <Badge
                      variant={
                        value === 'completed'
                          ? 'default'
                          : value === 'confirmed'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {value === 'completed' ? '완료' : value === 'confirmed' ? '확정' : '대기'}
                    </Badge>
                  ),
                },
              ]}
              onRowClick={(item) => console.log('Clicked:', item)}
            />
            <p className="text-muted-foreground mt-4 text-sm">
              ✅ 모바일: 카드 뷰 | 데스크톱: 테이블 뷰
            </p>
          </CardContent>
        </Card>

        {/* Touch Feedback Test */}
        <Card>
          <CardHeader>
            <CardTitle>6. 터치 피드백 테스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground mb-3 text-sm">
              버튼을 터치/클릭하여 피드백을 확인하세요
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button className="active:scale-[0.98]">스케일 피드백</Button>
              <Button variant="outline" className="active:bg-accent">
                배경색 피드백
              </Button>
              <Button variant="secondary" className="active:opacity-80">
                투명도 피드백
              </Button>
              <Button variant="ghost" className="active:bg-accent/90">
                고스트 피드백
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Optimization Summary */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">✅ 모바일 최적화 완료 항목</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>버튼: 최소 44px 터치 타겟</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>입력 필드: 16px 폰트로 줌 방지</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>선택 드롭다운: 터치 영역 확대</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>테이블: 모바일 카드 뷰 지원</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>네비게이션: 터치 피드백 강화</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

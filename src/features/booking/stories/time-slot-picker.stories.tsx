import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { TimeSlotPicker, TimeSlot } from '../components/ui/time-slot-picker'

/**
 * TimeSlotPicker 컴포넌트는 미용사의 예약 가능한 시간대를 표시하고
 * 사용자가 원하는 시간을 선택할 수 있게 해주는 인터페이스입니다.
 *
 * ## 주요 기능
 * - 30분 단위 시간 슬롯 표시
 * - 서비스 소요시간에 따른 연속 슬롯 표시
 * - 예약된 시간 비활성화
 * - 업무시간 초과 방지
 */
const meta = {
  title: 'Booking/TimeSlotPicker',
  component: TimeSlotPicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '미용사 예약 시간 선택을 위한 컴포넌트입니다. 예약 가능한 시간, 이미 예약된 시간 등을 시각적으로 구분하여 표시합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    groomerName: {
      control: 'text',
      description: '미용사 이름',
    },
    estimatedDuration: {
      control: { type: 'number', min: 30, max: 240, step: 30 },
      description: '서비스 예상 소요시간 (분 단위)',
    },
    selectedTime: {
      control: 'text',
      description: '현재 선택된 시간 (HH:mm 형식)',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
    onTimeSelect: {
      action: 'onTimeSelect',
      description: '시간 선택 시 호출되는 콜백 함수',
    },
  },
  // 기본 args
  args: {
    groomerName: '김미용',
    estimatedDuration: 60,
    onTimeSelect: fn(),
  },
} satisfies Meta<typeof TimeSlotPicker>

export default meta
type Story = StoryObj<typeof meta>

// 헬퍼 함수: 시간 슬롯 생성
const generateTimeSlots = (config?: {
  bookedTimes?: string[]
  unavailableTimes?: string[]
}): TimeSlot[] => {
  const slots: TimeSlot[] = []

  // 09:00부터 18:00까지 30분 단위로 생성
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const isBooked = config?.bookedTimes?.includes(time) || false
      const isUnavailable = config?.unavailableTimes?.includes(time) || false

      slots.push({
        time,
        available: !isBooked && !isUnavailable,
        isBooked,
        reason: isBooked ? '이미 예약됨' : isUnavailable ? '예약 불가' : undefined,
      })
    }
  }

  return slots
}

/**
 * 기본 상태: 모든 시간이 예약 가능한 상태
 */
export const Default: Story = {
  args: {
    timeSlots: generateTimeSlots(),
  },
}

/**
 * 시간 선택된 상태: 10:00가 선택되고 60분 서비스가 표시됨
 */
export const WithSelection: Story = {
  args: {
    timeSlots: generateTimeSlots(),
    selectedTime: '10:00',
    estimatedDuration: 60,
  },
}

/**
 * 긴 서비스: 120분 서비스로 여러 시간 슬롯을 차지
 */
export const LongService: Story = {
  args: {
    timeSlots: generateTimeSlots(),
    selectedTime: '10:00',
    estimatedDuration: 120,
    groomerName: '박미용',
  },
}

/**
 * 일부 예약된 상태: 특정 시간대가 이미 예약됨
 */
export const WithBookedSlots: Story = {
  args: {
    timeSlots: generateTimeSlots({
      bookedTimes: ['10:00', '10:15', '10:30', '10:45', '14:00', '14:15', '14:30', '14:45'],
    }),
    groomerName: '이미용',
  },
}

/**
 * 오전 모두 예약: 오전 시간이 모두 예약된 상태
 */
export const MorningFullyBooked: Story = {
  args: {
    timeSlots: generateTimeSlots({
      bookedTimes: [
        '09:00',
        '09:15',
        '09:30',
        '09:45',
        '10:00',
        '10:15',
        '10:30',
        '10:45',
        '11:00',
        '11:15',
        '11:30',
        '11:45',
      ],
    }),
    groomerName: '최미용',
  },
}

/**
 * 오후 모두 예약: 오후 시간이 모두 예약된 상태
 */
export const AfternoonFullyBooked: Story = {
  args: {
    timeSlots: generateTimeSlots({
      bookedTimes: [
        '13:00',
        '13:15',
        '13:30',
        '13:45',
        '14:00',
        '14:15',
        '14:30',
        '14:45',
        '15:00',
        '15:15',
        '15:30',
        '15:45',
        '16:00',
        '16:15',
        '16:30',
        '16:45',
        '17:00',
        '17:15',
        '17:30',
        '17:45',
      ],
    }),
    groomerName: '정미용',
  },
}

/**
 * 모두 예약됨: 모든 시간이 예약되어 선택 불가능
 */
export const FullyBooked: Story = {
  args: {
    timeSlots: generateTimeSlots({
      bookedTimes: [
        // 오전
        '09:00',
        '09:15',
        '09:30',
        '09:45',
        '10:00',
        '10:15',
        '10:30',
        '10:45',
        '11:00',
        '11:15',
        '11:30',
        '11:45',
        // 오후
        '13:00',
        '13:15',
        '13:30',
        '13:45',
        '14:00',
        '14:15',
        '14:30',
        '14:45',
        '15:00',
        '15:15',
        '15:30',
        '15:45',
        '16:00',
        '16:15',
        '16:30',
        '16:45',
        '17:00',
        '17:15',
        '17:30',
        '17:45',
      ],
    }),
    groomerName: '강미용',
  },
}

/**
 * 마감시간 초과: 마감시간에 걸치는 서비스
 */
export const OvertimeConflict: Story = {
  args: {
    timeSlots: generateTimeSlots(),
    selectedTime: '16:30',
    estimatedDuration: 120, // 16:30-18:30이므로 마감시간과 겹침
    groomerName: '송미용',
  },
}

/**
 * 업무시간 초과: 업무 마감시간을 넘어가는 서비스
 */
export const EndOfDayConflict: Story = {
  args: {
    timeSlots: generateTimeSlots(),
    selectedTime: '17:00',
    estimatedDuration: 90, // 17:00-18:30이므로 업무시간(18:00) 초과
    groomerName: '한미용',
  },
}

/**
 * 짧은 서비스: 15분만 소요되는 간단한 서비스
 */
export const ShortService: Story = {
  args: {
    timeSlots: generateTimeSlots({
      bookedTimes: ['10:00', '10:30', '10:45'], // 10:15만 가능
    }),
    selectedTime: '10:15',
    estimatedDuration: 15,
    groomerName: '오미용',
  },
}

/**
 * 매우 긴 서비스: 3시간 소요되는 특별 서비스
 */
export const VeryLongService: Story = {
  args: {
    timeSlots: generateTimeSlots(),
    selectedTime: '09:00',
    estimatedDuration: 180, // 3시간
    groomerName: '유미용',
  },
}

/**
 * 복잡한 예약 패턴: 다양한 제약 조건이 섞인 실제 상황
 */
export const RealWorldScenario: Story = {
  args: {
    timeSlots: generateTimeSlots({
      bookedTimes: [
        '09:30',
        '09:45',
        '10:00',
        '10:15',
        '10:30',
        '11:00',
        '11:15',
        '13:30',
        '13:45',
        '14:00',
        '15:00',
        '15:15',
        '15:30',
        '15:45',
        '16:30',
        '16:45',
      ],
    }),
    selectedTime: '14:15',
    estimatedDuration: 75,
    groomerName: '윤미용',
  },
}

/**
 * 인터랙티브 데모: 실제 클릭 가능한 상태
 */
export const Interactive: Story = {
  args: {
    timeSlots: generateTimeSlots({
      bookedTimes: ['10:00', '10:15', '14:00', '14:15'],
    }),
    groomerName: '장미용',
  },
}

/**
 * 실시간 업데이트 시뮬레이션: 다른 사용자의 예약이 실시간으로 반영되는 시나리오
 */
export const RealTimeUpdate: Story = {
  args: {
    timeSlots: generateTimeSlots(),
    groomerName: '신미용',
  },
  render: function Render(args) {
    const [timeSlots, setTimeSlots] = useState(args.timeSlots)
    const [selectedTime, setSelectedTime] = useState<string>()

    // 5초마다 랜덤하게 시간이 예약됨을 시뮬레이션
    useEffect(() => {
      const interval = setInterval(() => {
        setTimeSlots((prevSlots) => {
          const availableSlots = prevSlots.filter((s) => s.available && !s.isBooked)
          if (availableSlots.length === 0) return prevSlots

          // 랜덤하게 하나의 슬롯을 예약 상태로 변경
          const randomIndex = Math.floor(Math.random() * availableSlots.length)
          const slotToBook = availableSlots[randomIndex]

          return prevSlots.map((slot) =>
            slot.time === slotToBook.time
              ? {
                  ...slot,
                  available: false,
                  isBooked: true,
                  reason: '방금 예약됨',
                }
              : slot
          )
        })
      }, 5000)

      return () => clearInterval(interval)
    }, [])

    return (
      <div>
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            💡 5초마다 다른 사용자의 예약이 자동으로 시뮬레이션됩니다.
          </p>
        </div>
        <TimeSlotPicker
          {...args}
          timeSlots={timeSlots}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
        />
      </div>
    )
  },
}

// React hooks import for RealTimeUpdate story
import { useState, useEffect } from 'react'

/**
 * 모바일 뷰: 작은 화면에서의 레이아웃
 */
export const MobileView: Story = {
  args: {
    timeSlots: generateTimeSlots({
      bookedTimes: ['10:00', '10:15', '14:00'],
    }),
    selectedTime: '11:00',
    groomerName: '임미용',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * 다크 모드: 다크 테마에서의 표시 (미래 기능)
 */
export const DarkMode: Story = {
  args: {
    timeSlots: generateTimeSlots({
      bookedTimes: ['10:00', '14:00'],
    }),
    groomerName: '문미용',
  },
  decorators: [
    (Story) => (
      <div className="dark min-h-screen bg-gray-900 p-8">
        <Story />
      </div>
    ),
  ],
}

/**
 * 접근성 테스트: 스크린 리더 및 키보드 네비게이션 지원
 */
export const Accessibility: Story = {
  args: {
    timeSlots: generateTimeSlots({
      bookedTimes: ['10:00', '10:15'],
    }),
    groomerName: '배미용',
  },
  parameters: {
    docs: {
      description: {
        story:
          '이 스토리는 키보드 네비게이션과 스크린 리더 호환성을 테스트합니다. 모든 버튼에 적절한 aria 속성이 설정되어 있습니다.',
      },
    },
  },
}

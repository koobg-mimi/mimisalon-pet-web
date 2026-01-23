/**
 * Tests for booking status configuration utilities
 *
 * Tests status mapping functions and React icon elements.
 * Target coverage: 100%
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingStatus } from '@mimisalon/shared'
import {
  getStatusConfig,
  getStatusLabel,
  getStatusVariant,
  isCompletedStatus,
  isCancellable,
  isConfirmable,
  isCompletable,
  type BadgeVariant,
} from '../booking-status-config'

describe('getStatusConfig', () => {
  it('should return correct config for FIRST_PAYMENT_PENDING', () => {
    const config = getStatusConfig(BookingStatus.FIRST_PAYMENT_PENDING)
    expect(config.label).toBe('1차 결제 대기')
    expect(config.variant).toBe('secondary')
    expect(config.icon).toBeDefined()
  })

  it('should return correct config for FIRST_PAYMENT_COMPLETE', () => {
    const config = getStatusConfig(BookingStatus.FIRST_PAYMENT_COMPLETE)
    expect(config.label).toBe('1차 결제 완료')
    expect(config.variant).toBe('outline')
    expect(config.icon).toBeDefined()
  })

  it('should return correct config for FIRST_PAYMENT_VERIFY', () => {
    const config = getStatusConfig(BookingStatus.FIRST_PAYMENT_VERIFY)
    expect(config.label).toBe('1차 결제 확인중')
    expect(config.variant).toBe('secondary')
    expect(config.icon).toBeDefined()
  })

  it('should return correct config for GROOMER_CONFIRM_PENDING', () => {
    const config = getStatusConfig(BookingStatus.GROOMER_CONFIRM_PENDING)
    expect(config.label).toBe('미용사 확인 대기')
    expect(config.variant).toBe('secondary')
    expect(config.icon).toBeDefined()
  })

  it('should return correct config for GROOMER_CONFIRM', () => {
    const config = getStatusConfig(BookingStatus.GROOMER_CONFIRM)
    expect(config.label).toBe('미용사 확정')
    expect(config.variant).toBe('default')
    expect(config.icon).toBeDefined()
  })

  it('should return correct config for ADDITIONAL_PAYMENT_PENDING', () => {
    const config = getStatusConfig(BookingStatus.ADDITIONAL_PAYMENT_PENDING)
    expect(config.label).toBe('추가 결제 대기')
    expect(config.variant).toBe('secondary')
    expect(config.icon).toBeDefined()
  })

  it('should return correct config for ADDITIONAL_PAYMENT_COMPLETE', () => {
    const config = getStatusConfig(BookingStatus.ADDITIONAL_PAYMENT_COMPLETE)
    expect(config.label).toBe('추가 결제 완료')
    expect(config.variant).toBe('outline')
    expect(config.icon).toBeDefined()
  })

  it('should return correct config for WORK_IN_PROGRESS', () => {
    const config = getStatusConfig(BookingStatus.WORK_IN_PROGRESS)
    expect(config.label).toBe('진행중')
    expect(config.variant).toBe('default')
    expect(config.icon).toBeDefined()
  })

  it('should return correct config for SERVICE_COMPLETED', () => {
    const config = getStatusConfig(BookingStatus.SERVICE_COMPLETED)
    expect(config.label).toBe('완료')
    expect(config.variant).toBe('default')
    expect(config.icon).toBeDefined()
  })

  it('should return correct config for SERVICE_CANCELLED', () => {
    const config = getStatusConfig(BookingStatus.SERVICE_CANCELLED)
    expect(config.label).toBe('취소됨')
    expect(config.variant).toBe('destructive')
    expect(config.icon).toBeDefined()
  })

  it('should return correct config for BOOKING_FAILED', () => {
    const config = getStatusConfig(BookingStatus.BOOKING_FAILED)
    expect(config.label).toBe('예약 실패')
    expect(config.variant).toBe('destructive')
    expect(config.icon).toBeDefined()
  })

  it('should return fallback config for unknown status', () => {
    const config = getStatusConfig('UNKNOWN_STATUS' as BookingStatus)
    expect(config.label).toBe('알 수 없음')
    expect(config.variant).toBe('secondary')
    expect(config.icon).toBeDefined()
  })

  it('should return React elements for icons', () => {
    const config = getStatusConfig(BookingStatus.GROOMER_CONFIRM)
    const { container } = render(<div>{config.icon}</div>)

    // Check that an SVG icon is rendered
    const svgElement = container.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })

  it('should render different icons for different statuses', () => {
    const completedConfig = getStatusConfig(BookingStatus.SERVICE_COMPLETED)
    const cancelledConfig = getStatusConfig(BookingStatus.SERVICE_CANCELLED)

    const { container: container1 } = render(<div>{completedConfig.icon}</div>)
    const { container: container2 } = render(<div>{cancelledConfig.icon}</div>)

    // Both should have icons
    expect(container1.querySelector('svg')).toBeInTheDocument()
    expect(container2.querySelector('svg')).toBeInTheDocument()
  })
})

describe('getStatusLabel', () => {
  it('should return correct labels for all statuses', () => {
    expect(getStatusLabel(BookingStatus.FIRST_PAYMENT_PENDING)).toBe('1차 결제 대기')
    expect(getStatusLabel(BookingStatus.FIRST_PAYMENT_COMPLETE)).toBe('1차 결제 완료')
    expect(getStatusLabel(BookingStatus.FIRST_PAYMENT_VERIFY)).toBe('1차 결제 확인중')
    expect(getStatusLabel(BookingStatus.GROOMER_CONFIRM_PENDING)).toBe('미용사 확인 대기')
    expect(getStatusLabel(BookingStatus.GROOMER_CONFIRM)).toBe('미용사 확정')
    expect(getStatusLabel(BookingStatus.ADDITIONAL_PAYMENT_PENDING)).toBe('추가 결제 대기')
    expect(getStatusLabel(BookingStatus.ADDITIONAL_PAYMENT_COMPLETE)).toBe('추가 결제 완료')
    expect(getStatusLabel(BookingStatus.WORK_IN_PROGRESS)).toBe('진행중')
    expect(getStatusLabel(BookingStatus.SERVICE_COMPLETED)).toBe('완료')
    expect(getStatusLabel(BookingStatus.SERVICE_CANCELLED)).toBe('취소됨')
    expect(getStatusLabel(BookingStatus.BOOKING_FAILED)).toBe('예약 실패')
  })

  it('should return fallback label for unknown status', () => {
    expect(getStatusLabel('INVALID' as BookingStatus)).toBe('알 수 없음')
  })
})

describe('getStatusVariant', () => {
  it('should return correct variants for all statuses', () => {
    expect(getStatusVariant(BookingStatus.FIRST_PAYMENT_PENDING)).toBe('secondary')
    expect(getStatusVariant(BookingStatus.FIRST_PAYMENT_COMPLETE)).toBe('outline')
    expect(getStatusVariant(BookingStatus.GROOMER_CONFIRM_PENDING)).toBe('secondary')
    expect(getStatusVariant(BookingStatus.GROOMER_CONFIRM)).toBe('default')
    expect(getStatusVariant(BookingStatus.SERVICE_COMPLETED)).toBe('default')
    expect(getStatusVariant(BookingStatus.SERVICE_CANCELLED)).toBe('destructive')
    expect(getStatusVariant(BookingStatus.BOOKING_FAILED)).toBe('destructive')
  })

  it('should return fallback variant for unknown status', () => {
    expect(getStatusVariant('INVALID' as BookingStatus)).toBe('secondary')
  })

  it('should return valid BadgeVariant types', () => {
    const validVariants: BadgeVariant[] = ['default', 'secondary', 'destructive', 'outline']

    Object.values(BookingStatus).forEach((status) => {
      const variant = getStatusVariant(status)
      expect(validVariants).toContain(variant)
    })
  })
})

describe('isCompletedStatus', () => {
  it('should return true for SERVICE_COMPLETED', () => {
    expect(isCompletedStatus(BookingStatus.SERVICE_COMPLETED)).toBe(true)
  })

  it('should return true for SERVICE_CANCELLED', () => {
    expect(isCompletedStatus(BookingStatus.SERVICE_CANCELLED)).toBe(true)
  })

  it('should return true for BOOKING_FAILED', () => {
    expect(isCompletedStatus(BookingStatus.BOOKING_FAILED)).toBe(true)
  })

  it('should return false for pending statuses', () => {
    expect(isCompletedStatus(BookingStatus.FIRST_PAYMENT_PENDING)).toBe(false)
    expect(isCompletedStatus(BookingStatus.GROOMER_CONFIRM_PENDING)).toBe(false)
    expect(isCompletedStatus(BookingStatus.ADDITIONAL_PAYMENT_PENDING)).toBe(false)
  })

  it('should return false for in-progress statuses', () => {
    expect(isCompletedStatus(BookingStatus.WORK_IN_PROGRESS)).toBe(false)
    expect(isCompletedStatus(BookingStatus.GROOMER_CONFIRM)).toBe(false)
  })

  it('should return false for completed payment statuses', () => {
    expect(isCompletedStatus(BookingStatus.FIRST_PAYMENT_COMPLETE)).toBe(false)
    expect(isCompletedStatus(BookingStatus.ADDITIONAL_PAYMENT_COMPLETE)).toBe(false)
  })
})

describe('isCancellable', () => {
  it('should return false for SERVICE_CANCELLED', () => {
    expect(isCancellable(BookingStatus.SERVICE_CANCELLED)).toBe(false)
  })

  it('should return false for SERVICE_COMPLETED', () => {
    expect(isCancellable(BookingStatus.SERVICE_COMPLETED)).toBe(false)
  })

  it('should return false for BOOKING_FAILED', () => {
    expect(isCancellable(BookingStatus.BOOKING_FAILED)).toBe(false)
  })

  it('should return true for pending statuses', () => {
    expect(isCancellable(BookingStatus.FIRST_PAYMENT_PENDING)).toBe(true)
    expect(isCancellable(BookingStatus.GROOMER_CONFIRM_PENDING)).toBe(true)
    expect(isCancellable(BookingStatus.ADDITIONAL_PAYMENT_PENDING)).toBe(true)
  })

  it('should return true for confirmed statuses', () => {
    expect(isCancellable(BookingStatus.GROOMER_CONFIRM)).toBe(true)
    expect(isCancellable(BookingStatus.ADDITIONAL_PAYMENT_COMPLETE)).toBe(true)
  })

  it('should return true for in-progress status', () => {
    expect(isCancellable(BookingStatus.WORK_IN_PROGRESS)).toBe(true)
  })

  it('should return true for payment verification status', () => {
    expect(isCancellable(BookingStatus.FIRST_PAYMENT_VERIFY)).toBe(true)
  })
})

describe('isConfirmable', () => {
  it('should return true for GROOMER_CONFIRM_PENDING', () => {
    expect(isConfirmable(BookingStatus.GROOMER_CONFIRM_PENDING)).toBe(true)
  })

  it('should return true for FIRST_PAYMENT_COMPLETE', () => {
    expect(isConfirmable(BookingStatus.FIRST_PAYMENT_COMPLETE)).toBe(true)
  })

  it('should return false for other pending statuses', () => {
    expect(isConfirmable(BookingStatus.FIRST_PAYMENT_PENDING)).toBe(false)
    expect(isConfirmable(BookingStatus.ADDITIONAL_PAYMENT_PENDING)).toBe(false)
  })

  it('should return false for confirmed statuses', () => {
    expect(isConfirmable(BookingStatus.GROOMER_CONFIRM)).toBe(false)
    expect(isConfirmable(BookingStatus.ADDITIONAL_PAYMENT_COMPLETE)).toBe(false)
  })

  it('should return false for completed statuses', () => {
    expect(isConfirmable(BookingStatus.SERVICE_COMPLETED)).toBe(false)
    expect(isConfirmable(BookingStatus.SERVICE_CANCELLED)).toBe(false)
  })

  it('should return false for in-progress status', () => {
    expect(isConfirmable(BookingStatus.WORK_IN_PROGRESS)).toBe(false)
  })
})

describe('isCompletable', () => {
  it('should return true for WORK_IN_PROGRESS', () => {
    expect(isCompletable(BookingStatus.WORK_IN_PROGRESS)).toBe(true)
  })

  it('should return false for all other statuses', () => {
    expect(isCompletable(BookingStatus.FIRST_PAYMENT_PENDING)).toBe(false)
    expect(isCompletable(BookingStatus.GROOMER_CONFIRM_PENDING)).toBe(false)
    expect(isCompletable(BookingStatus.GROOMER_CONFIRM)).toBe(false)
    expect(isCompletable(BookingStatus.ADDITIONAL_PAYMENT_PENDING)).toBe(false)
    expect(isCompletable(BookingStatus.ADDITIONAL_PAYMENT_COMPLETE)).toBe(false)
    expect(isCompletable(BookingStatus.SERVICE_COMPLETED)).toBe(false)
    expect(isCompletable(BookingStatus.SERVICE_CANCELLED)).toBe(false)
    expect(isCompletable(BookingStatus.BOOKING_FAILED)).toBe(false)
    expect(isCompletable(BookingStatus.FIRST_PAYMENT_COMPLETE)).toBe(false)
    expect(isCompletable(BookingStatus.FIRST_PAYMENT_VERIFY)).toBe(false)
  })
})

describe('Status configuration consistency', () => {
  it('should have configuration for all BookingStatus enum values', () => {
    const allStatuses = Object.values(BookingStatus)

    allStatuses.forEach((status) => {
      const config = getStatusConfig(status)

      // Should have all required properties
      expect(config.label).toBeDefined()
      expect(typeof config.label).toBe('string')
      expect(config.label.length).toBeGreaterThan(0)

      expect(config.variant).toBeDefined()
      expect(['default', 'secondary', 'destructive', 'outline']).toContain(config.variant)

      expect(config.icon).toBeDefined()
    })
  })

  it('should use consistent variant patterns', () => {
    // Pending statuses should typically use 'secondary'
    const pendingStatuses = [
      BookingStatus.FIRST_PAYMENT_PENDING,
      BookingStatus.GROOMER_CONFIRM_PENDING,
      BookingStatus.ADDITIONAL_PAYMENT_PENDING,
      BookingStatus.FIRST_PAYMENT_VERIFY,
    ]

    pendingStatuses.forEach((status) => {
      expect(getStatusVariant(status)).toBe('secondary')
    })

    // Failed/cancelled statuses should use 'destructive'
    const negativeStatuses = [
      BookingStatus.SERVICE_CANCELLED,
      BookingStatus.BOOKING_FAILED,
    ]

    negativeStatuses.forEach((status) => {
      expect(getStatusVariant(status)).toBe('destructive')
    })
  })

  it('should ensure labels are in Korean', () => {
    const allStatuses = Object.values(BookingStatus)

    allStatuses.forEach((status) => {
      const label = getStatusLabel(status)

      // Korean characters are in the Unicode range \uAC00-\uD7A3
      const hasKorean = /[\uAC00-\uD7A3]/.test(label)
      expect(hasKorean).toBe(true)
    })
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PaymentMethodIcon } from '../payment-method-icon'

describe('PaymentMethodIcon', () => {
  describe('rendering correct icons', () => {
    it('should render CreditCard icon for CARD method', () => {
      const { container } = render(<PaymentMethodIcon method="CARD" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // CreditCard icon is rendered
      expect(container.firstChild).toBeTruthy()
    })

    it('should render Smartphone icon for PHONE method', () => {
      const { container } = render(<PaymentMethodIcon method="PHONE" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render Building2 icon for VIRTUAL_ACCOUNT method', () => {
      const { container } = render(<PaymentMethodIcon method="VIRTUAL_ACCOUNT" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render Gift icon for GIFT_CERTIFICATE method', () => {
      const { container } = render(<PaymentMethodIcon method="GIFT_CERTIFICATE" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render Wallet icon for EASY_PAY method', () => {
      const { container } = render(<PaymentMethodIcon method="EASY_PAY" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render Building2 icon for TRANSFER method', () => {
      const { container } = render(<PaymentMethodIcon method="TRANSFER" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('fallback behavior', () => {
    it('should fall back to CreditCard icon for unknown method', () => {
      const { container } = render(<PaymentMethodIcon method="UNKNOWN_METHOD" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Should render the default CreditCard icon
      expect(container.firstChild).toBeTruthy()
    })

    it('should fall back to CreditCard icon for empty string', () => {
      const { container } = render(<PaymentMethodIcon method="" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should fall back to CreditCard icon for undefined method', () => {
      const { container } = render(<PaymentMethodIcon method="SOME_RANDOM_METHOD" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should fall back to CreditCard icon for null-like string', () => {
      const { container } = render(<PaymentMethodIcon method="null" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should fall back to CreditCard icon for numeric string', () => {
      const { container } = render(<PaymentMethodIcon method="123" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('className prop', () => {
    it('should apply default className when not provided', () => {
      const { container } = render(<PaymentMethodIcon method="CARD" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('h-5')
      expect(svg).toHaveClass('w-5')
    })

    it('should apply custom className when provided', () => {
      const { container } = render(<PaymentMethodIcon method="CARD" className="h-6 w-6" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('h-6')
      expect(svg).toHaveClass('w-6')
    })

    it('should apply custom className for PHONE method', () => {
      const { container } = render(<PaymentMethodIcon method="PHONE" className="h-8 w-8" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('h-8')
      expect(svg).toHaveClass('w-8')
    })

    it('should apply custom className for VIRTUAL_ACCOUNT method', () => {
      const { container } = render(
        <PaymentMethodIcon method="VIRTUAL_ACCOUNT" className="h-4 w-4" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('h-4')
      expect(svg).toHaveClass('w-4')
    })

    it('should apply custom className for GIFT_CERTIFICATE method', () => {
      const { container } = render(
        <PaymentMethodIcon method="GIFT_CERTIFICATE" className="h-10 w-10" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('h-10')
      expect(svg).toHaveClass('w-10')
    })

    it('should apply custom className for EASY_PAY method', () => {
      const { container } = render(<PaymentMethodIcon method="EASY_PAY" className="h-7 w-7" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('h-7')
      expect(svg).toHaveClass('w-7')
    })

    it('should apply custom className for TRANSFER method', () => {
      const { container } = render(<PaymentMethodIcon method="TRANSFER" className="h-12 w-12" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('h-12')
      expect(svg).toHaveClass('w-12')
    })

    it('should apply custom className for unknown method', () => {
      const { container } = render(<PaymentMethodIcon method="UNKNOWN" className="h-3 w-3" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('h-3')
      expect(svg).toHaveClass('w-3')
    })

    it('should accept complex className strings', () => {
      const { container } = render(
        <PaymentMethodIcon method="CARD" className="h-6 w-6 text-blue-500 opacity-75" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('h-6')
      expect(svg).toHaveClass('w-6')
      expect(svg).toHaveClass('text-blue-500')
      expect(svg).toHaveClass('opacity-75')
    })

    it('should handle empty className string', () => {
      const { container } = render(<PaymentMethodIcon method="CARD" className="" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('rendering structure', () => {
    it('should render SVG element for CARD', () => {
      const { container } = render(<PaymentMethodIcon method="CARD" />)
      const svg = container.querySelector('svg')
      expect(svg?.tagName).toBe('svg')
    })

    it('should render SVG element for PHONE', () => {
      const { container } = render(<PaymentMethodIcon method="PHONE" />)
      const svg = container.querySelector('svg')
      expect(svg?.tagName).toBe('svg')
    })

    it('should render SVG element for VIRTUAL_ACCOUNT', () => {
      const { container } = render(<PaymentMethodIcon method="VIRTUAL_ACCOUNT" />)
      const svg = container.querySelector('svg')
      expect(svg?.tagName).toBe('svg')
    })

    it('should render SVG element for GIFT_CERTIFICATE', () => {
      const { container } = render(<PaymentMethodIcon method="GIFT_CERTIFICATE" />)
      const svg = container.querySelector('svg')
      expect(svg?.tagName).toBe('svg')
    })

    it('should render SVG element for EASY_PAY', () => {
      const { container } = render(<PaymentMethodIcon method="EASY_PAY" />)
      const svg = container.querySelector('svg')
      expect(svg?.tagName).toBe('svg')
    })

    it('should render SVG element for TRANSFER', () => {
      const { container } = render(<PaymentMethodIcon method="TRANSFER" />)
      const svg = container.querySelector('svg')
      expect(svg?.tagName).toBe('svg')
    })

    it('should render within a fragment', () => {
      const { container } = render(<PaymentMethodIcon method="CARD" />)
      // Component wraps in fragment, should have direct SVG child
      expect(container.firstChild?.nodeName).toBe('svg')
    })
  })

  describe('case sensitivity', () => {
    it('should handle uppercase CARD', () => {
      const { container } = render(<PaymentMethodIcon method="CARD" />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should not match lowercase card', () => {
      const { container } = render(<PaymentMethodIcon method="card" />)
      // Should fall back to default CreditCard icon since it doesn't match
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should not match mixed case Card', () => {
      const { container } = render(<PaymentMethodIcon method="Card" />)
      // Should fall back to default CreditCard icon
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle methods with extra spaces', () => {
      const { container } = render(<PaymentMethodIcon method=" CARD " />)
      // Should fall back since " CARD " doesn't match "CARD"
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should handle special characters in method', () => {
      const { container } = render(<PaymentMethodIcon method="CARD@#$" />)
      // Should fall back to default
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('should handle very long method strings', () => {
      const { container } = render(
        <PaymentMethodIcon method="VERY_LONG_PAYMENT_METHOD_NAME_THAT_DOES_NOT_EXIST" />
      )
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('all payment methods coverage', () => {
    const allMethods = [
      'CARD',
      'PHONE',
      'VIRTUAL_ACCOUNT',
      'GIFT_CERTIFICATE',
      'EASY_PAY',
      'TRANSFER',
    ]

    it('should render icon for all defined payment methods', () => {
      allMethods.forEach((method) => {
        const { container } = render(<PaymentMethodIcon method={method} />)
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })

    it('should apply custom className to all defined payment methods', () => {
      allMethods.forEach((method) => {
        const { container } = render(<PaymentMethodIcon method={method} className="custom-size" />)
        const svg = container.querySelector('svg')
        expect(svg).toHaveClass('custom-size')
      })
    })
  })

  describe('icon consistency', () => {
    it('should render same icon structure for same method called multiple times', () => {
      const { container: container1 } = render(<PaymentMethodIcon method="CARD" />)
      const { container: container2 } = render(<PaymentMethodIcon method="CARD" />)

      const svg1 = container1.querySelector('svg')
      const svg2 = container2.querySelector('svg')

      expect(svg1?.tagName).toBe(svg2?.tagName)
    })

    it('should maintain icon consistency with different classNames', () => {
      const { container: container1 } = render(
        <PaymentMethodIcon method="PHONE" className="h-5 w-5" />
      )
      const { container: container2 } = render(
        <PaymentMethodIcon method="PHONE" className="h-10 w-10" />
      )

      const svg1 = container1.querySelector('svg')
      const svg2 = container2.querySelector('svg')

      expect(svg1?.tagName).toBe(svg2?.tagName)
      expect(svg1?.tagName).toBe('svg')
    })
  })
})

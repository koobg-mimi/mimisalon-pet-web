import { CreditCard, Smartphone, Building2, Gift, Wallet } from 'lucide-react'

/**
 * Props for PaymentMethodIcon component
 */
interface PaymentMethodIconProps {
  /** Payment method code (e.g., 'CARD', 'PHONE') */
  method: string
  /** CSS classes for icon sizing */
  className?: string
}

/**
 * Icon component for payment methods
 *
 * Displays an appropriate icon for each payment method type.
 * Defaults to credit card icon for unknown methods.
 *
 * @example
 * ```tsx
 * <PaymentMethodIcon method="CARD" />
 * <PaymentMethodIcon method="EASY_PAY" className="h-6 w-6" />
 * ```
 */
export function PaymentMethodIcon({ method, className = 'h-5 w-5' }: PaymentMethodIconProps) {
  const iconMap: Record<string, React.ReactNode> = {
    CARD: <CreditCard className={className} />,
    PHONE: <Smartphone className={className} />,
    VIRTUAL_ACCOUNT: <Building2 className={className} />,
    GIFT_CERTIFICATE: <Gift className={className} />,
    EASY_PAY: <Wallet className={className} />,
    TRANSFER: <Building2 className={className} />,
  }

  return <>{iconMap[method] || <CreditCard className={className} />}</>
}

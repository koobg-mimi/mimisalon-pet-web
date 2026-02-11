import { PortOneClient } from '@portone/server-sdk'
import { env } from './env'

// Initialize PortOne client
const portoneClient = PortOneClient({
  secret: env.PORTONE_API_SECRET,
})

// Log PG service connection status
if (env.PORTONE_API_SECRET) {
  console.log('✅ [PortOne] PG 서비스 연결 완료 - API Secret 설정됨')
} else {
  console.error('❌ [PortOne] PG 서비스 연결 실패 - API Secret 미설정')
}

/**
 * Get payment details from PortOne
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    const payment = await portoneClient.payment.getPayment({
      paymentId,
    })

    return payment
  } catch (error) {
    console.error('[PortOne] Failed to get payment details:', error)
    throw error
  }
}

/**
 * Cancel a payment
 */
export async function cancelPayment(paymentId: string, reason: string) {
  try {
    console.log(`[PortOne] Attempting to cancel payment: ${paymentId}, reason: ${reason}`)

    const cancellation = await portoneClient.payment.cancelPayment({
      paymentId,
      reason,
    })

    console.log(`[PortOne] Successfully cancelled payment: ${paymentId}`)
    return cancellation
  } catch (error) {
    console.error('[PortOne] Failed to cancel payment:', {
      paymentId,
      error,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorDetails: JSON.stringify(error, null, 2),
    })
    throw error
  }
}

/**
 * Verify payment status
 * This should be called after receiving a payment success callback
 */
export async function verifyPaymentStatus(paymentId: string) {
  try {
    const payment = await getPaymentDetails(paymentId)

    // Check if payment is actually successful
    if (!payment) {
      return {
        success: false,
        error: 'Payment not found',
      }
    }

    // Check payment status
    const isPaid = payment.status === 'PAID'
    const isCancelled = payment.status === 'CANCELLED' || payment.status === 'PARTIAL_CANCELLED'
    const isFailed = payment.status === 'FAILED'

    if (isPaid) {
      return {
        success: true,
        payment,
      }
    }

    if (isCancelled) {
      return {
        success: false,
        error: 'Payment was cancelled',
        payment,
      }
    }

    if (isFailed) {
      return {
        success: false,
        error: 'Payment failed',
        payment,
      }
    }

    // Payment is still pending or in another state
    return {
      success: false,
      error: `Payment is in ${String(payment.status)} status`,
      payment,
    }
  } catch (error) {
    console.error('[PortOne] Failed to verify payment status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Pre-register payment for confirm process
 * Used when you want to control when the payment is actually charged
 */
export async function preRegisterPayment(params: {
  paymentId: string
  totalAmount: number
  currency?: string
  orderName: string
}) {
  try {
    const response = await portoneClient.payment.preRegisterPayment({
      paymentId: params.paymentId,
      totalAmount: params.totalAmount,
      currency: params.currency || 'KRW',
    })

    return response
  } catch (error) {
    console.error('[PortOne] Failed to pre-register payment:', error)
    throw error
  }
}

export { portoneClient }

import twilio from 'twilio'
import { env } from './env'

// Twilio 환경 변수
const accountSid = env.TWILIO_ACCOUNT_SID
const authToken = env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = env.TWILIO_PHONE_NUMBER
const verifyServiceSid = env.TWILIO_VERIFY_SERVICE_SID

// 빌드 시에는 경고 표시하지 않음
const isBuildTime =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build'
if (!isBuildTime && (!accountSid || !authToken)) {
  console.warn('Twilio credentials not configured')
}

// Lazy Twilio client initialization
let _client: twilio.Twilio | null = null

function getTwilioClient(): twilio.Twilio | null {
  if (!_client && accountSid && authToken) {
    _client = twilio(accountSid, authToken)
  }
  return _client
}

// Build-safe client getter
function getClient(): twilio.Twilio | null {
  if (isBuildTime) {
    return null // 빌드 시에는 null 반환
  }
  return getTwilioClient()
}

const client = getClient()

export interface PhoneVerificationResult {
  success: boolean
  error?: string
  sid?: string
}

export interface PhoneVerificationCheckResult {
  success: boolean
  error?: string
  valid?: boolean
}

/**
 * E.164 format phone number validation and passthrough
 * React Phone Input component provides E.164 format, use it directly
 */
export function formatPhoneNumber(phone: string): string {
  // E.164 format is already provided by React Phone Input component
  // Simply validate and return as-is
  if (!phone.startsWith('+82')) {
    throw new Error('Only Korean phone numbers (+82) are supported')
  }

  return phone
}

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send SMS verification code using Twilio Verify Service
 * This is the recommended approach as it handles rate limiting,
 * retry logic, and code generation automatically
 */
export async function sendVerificationCode(phoneNumber: string): Promise<PhoneVerificationResult> {
  if (!client || !verifyServiceSid) {
    const configStatus = getTwilioConfig()
    let errorDetails = 'Twilio 설정이 완료되지 않았습니다. '

    if (!configStatus.accountSid) errorDetails += 'TWILIO_ACCOUNT_SID, '
    if (!configStatus.authToken) errorDetails += 'TWILIO_AUTH_TOKEN, '
    if (!configStatus.verifyServiceSid) errorDetails += 'TWILIO_VERIFY_SERVICE_SID, '

    errorDetails = errorDetails.replace(/, $/, '이(가) 필요합니다.')

    return {
      success: false,
      error: 'Twilio not configured',
    }
  }

  try {
    const formattedPhone = formatPhoneNumber(phoneNumber)

    const verification = await client.verify.v2.services(verifyServiceSid).verifications.create({
      to: formattedPhone,
      channel: 'sms',
      locale: 'ko', // Korean locale for messages
    })

    return {
      success: true,
      sid: verification.sid,
    }
  } catch (error: unknown) {
    console.error('Twilio verification error:', error)

    // Handle specific Twilio errors
    const twilioError = error as { code?: number }
    if (twilioError.code === 60200) {
      return {
        success: false,
        error: '유효하지 않은 전화번호입니다.',
      }
    }

    if (twilioError.code === 60203) {
      return {
        success: false,
        error: '최대 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.',
      }
    }

    return {
      success: false,
      error: '인증 코드 전송에 실패했습니다.',
    }
  }
}

/**
 * Verify the SMS code using Twilio Verify Service
 */
export async function verifyCode(
  phoneNumber: string,
  code: string
): Promise<PhoneVerificationCheckResult> {
  if (!client || !verifyServiceSid) {
    return {
      success: false,
      error: 'Twilio not configured',
    }
  }

  try {
    const formattedPhone = formatPhoneNumber(phoneNumber)

    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: formattedPhone,
        code: code,
      })

    return {
      success: true,
      valid: verificationCheck.status === 'approved',
    }
  } catch (error: unknown) {
    console.error('Twilio verification check error:', error)

    // Handle specific Twilio errors
    const twilioError = error as { code?: number }
    if (twilioError.code === 60202) {
      return {
        success: false,
        error: '인증 코드가 올바르지 않습니다.',
      }
    }

    if (twilioError.code === 60203) {
      return {
        success: false,
        error: '최대 시도 횟수를 초과했습니다.',
      }
    }

    return {
      success: false,
      error: '인증 코드 확인에 실패했습니다.',
    }
  }
}

/**
 * Send SMS verification code using direct SMS API
 * Alternative approach if Verify Service is not available
 * Requires manual code generation and management
 */
export async function sendSMSCode(
  phoneNumber: string,
  code: string
): Promise<PhoneVerificationResult> {
  if (!client || !twilioPhoneNumber) {
    const configStatus = getTwilioConfig()
    let errorDetails = 'Twilio SMS 설정이 완료되지 않았습니다. '

    if (!configStatus.accountSid) errorDetails += 'TWILIO_ACCOUNT_SID, '
    if (!configStatus.authToken) errorDetails += 'TWILIO_AUTH_TOKEN, '
    // if (!configStatus.phoneNumber) errorDetails += 'TWILIO_PHONE_NUMBER, ';

    errorDetails = errorDetails.replace(/, $/, '이(가) 필요합니다.')

    return {
      success: false,
      error: 'Twilio not configured',
    }
  }

  try {
    const formattedPhone = formatPhoneNumber(phoneNumber)

    const message = await client.messages.create({
      body: `미미살롱 인증 코드: ${code}\n이 코드는 10분 후 만료됩니다.`,
      from: twilioPhoneNumber,
      to: formattedPhone,
    })

    return {
      success: true,
      sid: message.sid,
    }
  } catch (error: unknown) {
    console.error('Twilio SMS error:', error)

    return {
      success: false,
      error: 'SMS 전송에 실패했습니다.',
    }
  }
}

/**
 * Check if Twilio is properly configured
 */
export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && (verifyServiceSid || twilioPhoneNumber))
}

/**
 * Get Twilio configuration status for debugging
 */
export function getTwilioConfig() {
  return {
    accountSid: !!accountSid,
    authToken: !!authToken,
    phoneNumber: !!twilioPhoneNumber,
    verifyServiceSid: !!verifyServiceSid,
    configured: isTwilioConfigured(),
  }
}

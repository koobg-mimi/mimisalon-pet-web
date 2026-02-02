import twilio from 'twilio'
import { env } from './env'

const accountSid = env.TWILIO_ACCOUNT_SID
const authToken = env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = env.TWILIO_PHONE_NUMBER
const verifyServiceSid = env.TWILIO_VERIFY_SERVICE_SID

const isBuildTime =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build'

let _client: twilio.Twilio | null = null

function getTwilioClientOrThrow(): twilio.Twilio {
  if (isBuildTime) throw new Error('Twilio client is not available at build time')

  // env가 로드된 뒤에 처음 호출되는 시점에 생성되도록
  if (!_client) {
    if (!accountSid || !authToken) {
      throw new Error('Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN')
    }
    _client = twilio(accountSid, authToken)
  }
  return _client
}

/** E.164 정규화: +8210-1234-5678 / +82 10 1234 5678 같은 입력도 안전하게 */
export function formatPhoneNumber(input: string): string {
  const raw = String(input ?? '').trim()

  // + 외 문자는 제거
  const normalized = raw.startsWith('+')
    ? '+' + raw.slice(1).replace(/\D/g, '')
    : raw.replace(/\D/g, '')

  if (!normalized.startsWith('+82'))
    throw new Error('Only Korean phone numbers (+82) are supported')

  // +82 뒤 숫자 길이 체크(대충 10~11자리 국내 번호 기준)
  const digits = normalized.replace(/\D/g, '')
  if (digits.length < 11 || digits.length > 12) {
    // +82 포함하면 보통 11~12자리(예: 8210xxxxxxxx)
    throw new Error('Invalid KR phone number length')
  }

  return normalized
}

function mapTwilioError(err: unknown) {
  const e = err as any
  return {
    code: e?.code,
    status: e?.status,
    message: e?.message,
    moreInfo: e?.moreInfo,
    details: e?.details,
  }
}

export async function sendVerificationCode(phoneNumber: string) {
  try {
    if (!verifyServiceSid) {
      return { success: false, error: 'Missing TWILIO_VERIFY_SERVICE_SID' }
    }

    const client = getTwilioClientOrThrow()
    const to = formatPhoneNumber(phoneNumber)

    const verification = await client.verify.v2.services(verifyServiceSid).verifications.create({
      to,
      channel: 'sms',
      locale: 'ko',
    })

    return { success: true, sid: verification.sid }
  } catch (err) {
    const info = mapTwilioError(err)
    console.error('Twilio verification error:', info)

    // 60200 invalid parameter :contentReference[oaicite:0]{index=0}
    if (info.code === 60200) return { success: false, error: '전화번호 형식(E.164)을 확인하세요.' }

    // 60203 rate limit (동일 대상 10분 내 5회 등) :contentReference[oaicite:1]{index=1}
    if (info.code === 60203) return { success: false, error: '시도 횟수 초과. 10분 뒤 재시도.' }

    return { success: false, error: info.message ?? '인증 코드 전송 실패' }
  }
}

export async function verifyCode(phoneNumber: string, code: string) {
  try {
    if (!verifyServiceSid) {
      return { success: false, error: 'Missing TWILIO_VERIFY_SERVICE_SID' }
    }

    const client = getTwilioClientOrThrow()
    const to = formatPhoneNumber(phoneNumber)

    const check = await client.verify.v2.services(verifyServiceSid).verificationChecks.create({
      to,
      code,
    })

    return { success: true, valid: check.status === 'approved' }
  } catch (err) {
    const info = mapTwilioError(err)
    console.error('Twilio verification check error:', info)
    return { success: false, error: info.message ?? '인증 코드 확인 실패' }
  }
}

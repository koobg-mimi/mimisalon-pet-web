/**
 * Email Service
 *
 * Provides email sending functionality using Nodemailer
 * Migrated from packages/worker for direct use in Next.js app
 */

import nodemailer from 'nodemailer'
import { env } from './env'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Get SMTP configuration from environment variables
 */
function getSMTPConfig() {
  return {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
  }
}

/**
 * Create email transporter (lazy initialization)
 */
let transporter: nodemailer.Transporter | null = null

function getEmailTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const smtpConfig = getSMTPConfig()
    transporter = nodemailer.createTransport(smtpConfig)
  }
  return transporter
}

/**
 * Send email using SMTP
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> {
  try {
    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return {
        success: false,
        error: `Invalid recipient email address: ${to}`,
      }
    }

    // Get transporter
    const transporter = getEmailTransporter()

    // Send email
    const info = await transporter.sendMail({
      from: env.SMTP_USERNAME,
      to,
      subject,
      text: text || undefined,
      html,
    })

    console.log('📧 Email sent successfully:', {
      messageId: info.messageId,
      to,
      subject,
    })

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Test SMTP connection (for health checks)
 */
export async function testSMTPConnection(): Promise<{
  success: boolean
  message: string
}> {
  try {
    const transporter = getEmailTransporter()
    await transporter.verify()

    return {
      success: true,
      message: 'SMTP connection test successful',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check SMTP health without connecting
 */
export function checkSMTPHealth(): { healthy: boolean; message: string } {
  try {
    const config = getSMTPConfig()

    if (!config.host || !config.auth.user || !config.auth.pass) {
      return {
        healthy: false,
        message: 'SMTP configuration is incomplete',
      }
    }

    return {
      healthy: true,
      message: `SMTP configured for ${config.host}:${config.port}`,
    }
  } catch (error) {
    return {
      healthy: false,
      message: error instanceof Error ? error.message : 'Unknown SMTP error',
    }
  }
}

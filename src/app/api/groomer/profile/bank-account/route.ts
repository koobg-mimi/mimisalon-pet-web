import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { z } from 'zod'

// Input sanitization helper
function sanitizeString(str: string): string {
  return str.trim().replace(/[<>"']/g, '')
}

// Error response type
export interface ErrorResponse {
  error: string
  details?: unknown
}

// Request schema
export const updateBankAccountSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z
    .string()
    .min(8, 'Account number is too short')
    .max(20, 'Account number is too long'),
  accountHolder: z
    .string()
    .min(1, 'Account holder name is required')
    .max(50, 'Account holder name is too long'),
})

export type UpdateBankAccountRequest = z.infer<typeof updateBankAccountSchema>

// Response types
export type BankAccountResponse = {
  bankName: string | null
  bankAccountNumber: string | null
  bankAccountHolderName: string | null
}

export type UpdateBankAccountResponse = {
  message: string
  data: BankAccountResponse
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse<UpdateBankAccountResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: unknown = await request.json()
    const validatedData = updateBankAccountSchema.parse(body)
    const { bankName, accountNumber, accountHolder } = validatedData

    // Sanitize inputs
    const sanitizedBankName = sanitizeString(bankName)
    const sanitizedAccountNumber = accountNumber.replace(/[-\s]/g, '') // Remove formatting
    const sanitizedAccountHolder = sanitizeString(accountHolder)

    // Validate account number format
    if (!/^\d+$/.test(sanitizedAccountNumber)) {
      return NextResponse.json(
        { error: 'Account number must contain only digits' },
        { status: 400 }
      )
    }

    // Find groomer profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        groomerProfile: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!user?.groomerProfile) {
      return NextResponse.json({ error: 'Groomer profile not found' }, { status: 404 })
    }

    // Update bank account information
    const updatedProfile = await prisma.groomerProfile.update({
      where: { id: user.groomerProfile.id },
      data: {
        bankName: sanitizedBankName,
        bankAccountNumber: sanitizedAccountNumber,
        bankAccountHolderName: sanitizedAccountHolder,
        updatedAt: new Date(),
      },
      select: {
        bankName: true,
        bankAccountNumber: true,
        bankAccountHolderName: true,
      },
    })

    // Log the update for audit purposes
    console.log(
      `Bank account updated for groomer ID: ${session.user.id} at ${new Date().toISOString()}`
    )

    return NextResponse.json({
      message: 'Bank account information updated successfully',
      data: updatedProfile,
    })
  } catch (error) {
    console.error('Failed to update bank account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<BankAccountResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find groomer profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        groomerProfile: {
          select: {
            bankName: true,
            bankAccountNumber: true,
            bankAccountHolderName: true,
          },
        },
      },
    })

    if (!user?.groomerProfile) {
      return NextResponse.json({ error: 'Groomer profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      bankName: user.groomerProfile.bankName || null,
      bankAccountNumber: user.groomerProfile.bankAccountNumber || null,
      bankAccountHolderName: user.groomerProfile.bankAccountHolderName || null,
    })
  } catch (error) {
    console.error('Failed to get bank account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

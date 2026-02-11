import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'

interface RouteParams {
  params: Promise<{
    id: string
    action: string
  }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: groomerId, action } = await params
  try {
    console.log(`🔧 [Admin Groomer] 미용사 액션 처리 시작: groomerId=${groomerId}, action=${action}`)
    
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'ADMIN') {
      console.error(`❌ [Admin Groomer] 권한 오류: role=${session?.user?.role}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log(`✅ [Admin Groomer] 관리자 권한 확인 완료`)

    // Verify groomer exists and has GROOMER role
    console.log(`🔍 [Admin Groomer] 미용사 정보 조회: ${groomerId}`)
    const groomer = await prisma.user.findFirst({
      where: {
        id: groomerId,
        role: 'GROOMER',
      },
      include: {
        groomerProfile: true,
      },
    })

    if (!groomer) {
      console.error(`❌ [Admin Groomer] 미용사를 찾을 수 없음: ${groomerId}`)
      return NextResponse.json({ error: 'Groomer not found' }, { status: 404 })
    }
    console.log(`✅ [Admin Groomer] 미용사 정보 조회 완료: ${groomer.name}`)

    // Ensure groomer profile exists
    let groomerProfile = groomer.groomerProfile
    if (!groomerProfile) {
      console.log(`⚠️ [Admin Groomer] groomerProfile 없음. 생성 시도: ${groomerId}`)
      // Use upsert to handle race conditions
      groomerProfile = await prisma.groomerProfile.upsert({
        where: { groomerId },
        create: {
          groomerId: groomerId,
          isActive: true,
        },
        update: {},
      })
      console.log(`✅ [Admin Groomer] groomerProfile 생성 완료`)
    }

    switch (action) {
      case 'activate':
        console.log(`✅ [Admin Groomer] 미용사 활성화: ${groomerId}`)
        await prisma.groomerProfile.update({
          where: { groomerId },
          data: { isActive: true },
        })
        console.log(`✅ [Admin Groomer] 미용사 활성화 완료: ${groomerId}`)
        break

      case 'deactivate':
        console.log(`⏸️ [Admin Groomer] 미용사 비활성화: ${groomerId}`)
        await prisma.groomerProfile.update({
          where: { groomerId },
          data: { isActive: false },
        })
        console.log(`✅ [Admin Groomer] 미용사 비활성화 완료: ${groomerId}`)
        break

      case 'suspend':
        console.log(`🚫 [Admin Groomer] 미용사 정지: ${groomerId}`)
        // Suspend both the user account and groomer profile
        await Promise.all([
          prisma.groomerProfile.update({
            where: { groomerId },
            data: { isActive: false },
          }),
          // Could also add a suspended flag or suspend the user account
        ])
        console.log(`✅ [Admin Groomer] 미용사 정지 완료: ${groomerId}`)
        break

      case 'update-commission':
        console.log(`💰 [Admin Groomer] 미용사 수수료 등급 업데이트: ${groomerId}`)
        const body = await request.json()
        const { commissionGradeId } = body

        if (!commissionGradeId) {
          console.error(`❌ [Admin Groomer] 수수료 등급 ID 없음`)
          return NextResponse.json({ error: 'Commission grade ID is required' }, { status: 400 })
        }

        // Verify commission grade exists
        const commissionGrade = await prisma.groomerCommissionGrade.findUnique({
          where: { id: commissionGradeId },
        })

        if (!commissionGrade) {
          console.error(`❌ [Admin Groomer] 수수료 등급을 찾을 수 없음: ${commissionGradeId}`)
          return NextResponse.json({ error: 'Commission grade not found' }, { status: 404 })
        }

        await prisma.groomerProfile.update({
          where: { groomerId },
          data: { commissionGradeId },
        })
        console.log(`✅ [Admin Groomer] 미용사 수수료 등급 업데이트 완료: ${commissionGradeId}`)
        break

      default:
        console.error(`❌ [Admin Groomer] 유효하지 않은 액션: ${action}`)
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    console.log(`✅ [Admin Groomer] 액션 처리 완료: ${action}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`❌ [Admin Groomer] 액션 처리 오류: action=${action}, groomerId=${groomerId}`)
    if (error instanceof Error) {
      console.error(`[Admin Groomer] 에러 상세:`, {
        message: error.message,
        code: (error as any).code,
        meta: (error as any).meta,
        stack: error.stack,
      })
    } else {
      console.error(`[Admin Groomer] 알 수 없는 오류:`, error)
    }
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}

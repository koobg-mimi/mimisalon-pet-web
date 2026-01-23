import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { z } from 'zod'
import { BreedCategory } from '@mimisalon/shared'

const ServiceOptionUpdateSchema = z.object({
  name: z.string().min(1, '옵션 이름을 입력해주세요').optional(),
  description: z.string().optional(),
  price: z.number().positive('가격은 0보다 커야 합니다').optional(),
  applicableCategories: z
    .array(z.nativeEnum(BreedCategory))
    .min(1, '최소 1개 이상의 품종 카테고리를 선택해주세요')
    .optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/admin/service-options/[id] - 옵션 상세 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const option = await prisma.serviceOption.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookingPetOptions: true,
          },
        },
      },
    })

    if (!option) {
      return NextResponse.json({ error: '옵션을 찾을 수 없습니다' }, { status: 404 })
    }

    return NextResponse.json(option)
  } catch (error) {
    console.error('Error fetching service option:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PUT /api/admin/service-options/[id] - 옵션 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = ServiceOptionUpdateSchema.parse(body)

    const option = await prisma.serviceOption.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(option)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating service option:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE /api/admin/service-options/[id] - 옵션 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // 사용 중인 옵션인지 확인
    const usageCount = await prisma.bookingPetOption.count({
      where: { serviceOptionId: id },
    })

    if (usageCount > 0) {
      return NextResponse.json(
        { error: '이 옵션은 예약에서 사용 중이므로 삭제할 수 없습니다. 비활성화를 권장합니다.' },
        { status: 400 }
      )
    }

    await prisma.serviceOption.delete({
      where: { id },
    })

    return NextResponse.json({ message: '옵션이 삭제되었습니다' })
  } catch (error) {
    console.error('Error deleting service option:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

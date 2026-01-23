import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { z } from 'zod'
import { BreedCategory } from '@mimisalon/shared'

const ServiceOptionSchema = z.object({
  name: z.string().min(1, '옵션 이름을 입력해주세요'),
  description: z.string().optional(),
  price: z.number().positive('가격은 0보다 커야 합니다'),
  applicableCategories: z
    .array(z.nativeEnum(BreedCategory))
    .min(1, '최소 1개 이상의 품종 카테고리를 선택해주세요'),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// GET /api/admin/service-options - 옵션 목록 조회
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get('isActive')
    const breedCategory = searchParams.get('breedCategory')

    const where: any = {}

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    if (breedCategory) {
      where.applicableCategories = {
        has: breedCategory as BreedCategory,
      }
    }

    const options = await prisma.serviceOption.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json(options)
  } catch (error) {
    console.error('Error fetching service options:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST /api/admin/service-options - 옵션 생성
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = ServiceOptionSchema.parse(body)

    const option = await prisma.serviceOption.create({
      data: validatedData,
    })

    return NextResponse.json(option, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating service option:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

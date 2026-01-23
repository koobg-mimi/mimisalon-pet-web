import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma, Prisma } from '@mimisalon/shared'
import { BreedCategory, PetType } from '@prisma/client'

// ============================================================================
// Types
// ============================================================================

/**
 * POST /api/admin/breeds - Create multiple breeds
 */
interface CreateBreedsRequest {
  petType: PetType
  category: BreedCategory
  breedNames: string // Comma-separated breed names
}

/**
 * GET /api/admin/breeds - List all breeds with pet count
 */
export type GetBreedsResponse = Prisma.BreedGetPayload<{
  include: {
    _count: {
      select: {
        pets: true
      }
    }
  }
}>[]

/**
 * POST /api/admin/breeds - Bulk create/update result
 */
export interface CreateBreedsResponse {
  message: string
  created: number
  updated: number
  total: number
}

interface ErrorResponse {
  error: string
  message?: string
}

// ============================================================================
// Handlers
// ============================================================================

// GET /api/admin/breeds - 모든 품종 조회 (관리자용)
export async function GET(): Promise<NextResponse<GetBreedsResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const breeds = await prisma.breed.findMany({
      orderBy: [{ petType: 'asc' }, { category: 'asc' }, { displayOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            pets: true,
          },
        },
      },
    })

    return NextResponse.json(breeds)
  } catch (error) {
    console.error('Error fetching breeds:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch breeds',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/breeds - 품종 일괄 저장
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateBreedsResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateBreedsRequest = await request.json()
    const { petType, category, breedNames } = body

    // 입력 검증
    if (!petType || !category) {
      return NextResponse.json({ error: 'petType과 category는 필수입니다' }, { status: 400 })
    }

    if (!breedNames) {
      return NextResponse.json({ error: '품종명을 입력해주세요' }, { status: 400 })
    }

    // 콤마로 구분된 품종명 파싱
    const names = breedNames
      .split(',')
      .map((name: string) => name.trim())
      .filter((name: string) => name.length > 0)

    if (names.length === 0) {
      return NextResponse.json({ error: '최소 하나의 품종명을 입력해주세요' }, { status: 400 })
    }

    // 트랜잭션으로 일괄 처리
    const result = await prisma.$transaction(async (tx) => {
      const created = []
      const updated = []

      for (let i = 0; i < names.length; i++) {
        const name = names[i]

        // 이미 존재하는 품종인지 확인
        const existing = await tx.breed.findUnique({
          where: {
            name_petType: {
              name,
              petType,
            },
          },
        })

        if (existing) {
          // 기존 품종 업데이트 (카테고리와 순서만 변경)
          const updatedBreed = await tx.breed.update({
            where: { id: existing.id },
            data: {
              category,
              displayOrder: i + 1,
              isActive: true,
            },
          })
          updated.push(updatedBreed)
        } else {
          // 새 품종 생성
          const newBreed = await tx.breed.create({
            data: {
              name,
              petType,
              category,
              displayOrder: i + 1,
              isActive: true,
            },
          })
          created.push(newBreed)
        }
      }

      return { created, updated }
    })

    return NextResponse.json(
      {
        message: '품종이 저장되었습니다',
        created: result.created.length,
        updated: result.updated.length,
        total: names.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving breeds:', error)
    return NextResponse.json(
      {
        error: 'Failed to save breeds',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

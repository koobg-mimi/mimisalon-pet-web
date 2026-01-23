import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock data for groomer stats
    // In a real application, this would fetch from your database
    const stats = {
      todayBookings: 3,
      weeklyBookings: 12,
      monthlyRevenue: 850000,
      averageRating: 4.8,
      totalReviews: 47,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch groomer stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

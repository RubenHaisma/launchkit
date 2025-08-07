import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TokenManager } from '@/lib/token-manager'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const metrics = await TokenManager.getUserMetrics(session.user.id)

    if (!metrics) {
      return NextResponse.json({ 
        error: 'Failed to fetch metrics' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      metrics 
    })

  } catch (error) {
    console.error('Token metrics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token metrics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get fresh metrics after any operation
    const metrics = await TokenManager.getUserMetrics(session.user.id)

    return NextResponse.json({ 
      success: true, 
      metrics 
    })

  } catch (error) {
    console.error('Token metrics refresh API error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token metrics' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TokenManager, TokenUsageType } from '@/lib/token-manager'

interface UseTokensRequest {
  usageType: TokenUsageType
  count?: number
  metadata?: {
    provider?: string
    model?: string
    endpoint?: string
    actualTokens?: number
    actualCost?: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: UseTokensRequest = await request.json()
    const { usageType, count = 1, metadata } = body

    if (!usageType) {
      return NextResponse.json({ 
        error: 'Usage type is required' 
      }, { status: 400 })
    }

    const result = await TokenManager.useTokens(
      session.user.id, 
      usageType, 
      count, 
      metadata
    )

    return NextResponse.json(result)

  } catch (error) {
    console.error('Token usage API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process token usage' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const usageType = url.searchParams.get('type') as TokenUsageType
    const count = parseInt(url.searchParams.get('count') || '1')

    if (!usageType) {
      return NextResponse.json({ 
        error: 'Usage type is required' 
      }, { status: 400 })
    }

    const canUse = await TokenManager.canUseTokens(session.user.id, usageType, count)

    return NextResponse.json(canUse)

  } catch (error) {
    console.error('Token check API error:', error)
    return NextResponse.json(
      { error: 'Failed to check token availability' },
      { status: 500 }
    )
  }
}

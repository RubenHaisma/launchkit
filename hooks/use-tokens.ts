'use client';

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { TokenUsageType, TokenUsageConfig, TokenUsageMetrics } from '@/lib/token-manager'
import toast from 'react-hot-toast'

export interface UseTokensReturn {
  tokens: number
  plan: string
  isUnlimited: boolean
  isLowTokens: boolean
  canUse: (type: TokenUsageType, count?: number) => boolean
  getTokenCost: (type: TokenUsageType, count?: number) => number
  useTokens: (type: TokenUsageType, count?: number, metadata?: any) => Promise<boolean>
  metrics: TokenUsageMetrics | null
  refreshTokens: () => Promise<void>
  loading: boolean
}

const TOKEN_COSTS: TokenUsageConfig = {
  // Basic Content Generation (1-3 tokens)
  'tweet': 1,
  'instagram-caption': 1,
  'email-subject': 1,
  'blog-title': 1,
  
  // Medium Content (2-3 tokens)
  'linkedin-post': 2,
  'reddit-post': 2,
  'tiktok-script': 2,
  'email-body': 2,
  'cold-email': 2,
  'community-response': 2,
  'outreach-message': 2,
  'visual-content': 2,
  
  // Complex Content (3-5 tokens)
  'twitter-thread': 3,
  'newsletter': 3,
  'product-hunt-launch': 3,
  'viral-content': 3,
  'personal-brand': 3,
  'email-sequence': 4,
  
  // Advanced Content (5-10 tokens)
  'blog-post': 5,
  'competitor-analysis': 7,
  'analytics-insight': 5,
  
  // Premium Features (10+ tokens)
  'website-scraping': 10,
  'daily-suggestions': 8,
  'calendar-integration': 5,
  
  // Bulk Operations
  'bulk-tweet-generation': 3,
  'bulk-email-campaign': 15,
  'mass-outreach': 20,
}

export function useTokens(): UseTokensReturn {
  const { data: session, update: updateSession } = useSession()
  const [tokens, setTokens] = useState<number>(0)
  const [plan, setPlan] = useState<string>('free')
  const [metrics, setMetrics] = useState<TokenUsageMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  const isUnlimited = plan === 'growth'
  const isLowTokens = tokens < 10 && !isUnlimited

  // Initialize tokens from session
  useEffect(() => {
    if (session?.user) {
      setTokens(session.user.credits || 0)
      setPlan(session.user.plan || 'free')
      setLoading(false)
    }
  }, [session])

  // Fetch detailed metrics
  useEffect(() => {
    if (session?.user?.id) {
      fetchMetrics()
    }
  }, [session?.user?.id])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/tokens/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics)
      }
    } catch (error) {
      console.error('Error fetching token metrics:', error)
    }
  }

  const refreshTokens = async () => {
    try {
      setLoading(true)
      await updateSession()
      await fetchMetrics()
    } catch (error) {
      console.error('Error refreshing tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTokenCost = (type: TokenUsageType, count: number = 1): number => {
    return TOKEN_COSTS[type] * count
  }

  const canUse = (type: TokenUsageType, count: number = 1): boolean => {
    if (isUnlimited) return true
    const cost = getTokenCost(type, count)
    return tokens >= cost
  }

  const useTokens = async (
    type: TokenUsageType, 
    count: number = 1, 
    metadata?: any
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/tokens/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usageType: type,
          count,
          metadata
        })
      })

      const result = await response.json()

      if (result.success) {
        // Update local token count
        if (!isUnlimited) {
          setTokens(result.remainingTokens || 0)
        }
        
        // Show success feedback for expensive operations
        const cost = getTokenCost(type, count)
        if (cost >= 5) {
          toast.success(`Generated successfully! Used ${cost} tokens.`)
        }
        
        // Refresh metrics
        await fetchMetrics()
        
        return true
      } else {
        // Handle insufficient tokens
        if (result.upgradeRequired) {
          toast.error('Insufficient tokens! Please upgrade your plan to continue.', {
            duration: 5000
          })
        } else {
          toast.error(result.error || 'Failed to use tokens')
        }
        return false
      }

    } catch (error) {
      console.error('Error using tokens:', error)
      toast.error('Failed to process request')
      return false
    }
  }

  return {
    tokens,
    plan,
    isUnlimited,
    isLowTokens,
    canUse,
    getTokenCost,
    useTokens,
    metrics,
    refreshTokens,
    loading
  }
}

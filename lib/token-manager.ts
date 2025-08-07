import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export interface TokenUsageConfig {
  // Content Generation
  'tweet': number
  'twitter-thread': number
  'linkedin-post': number
  'reddit-post': number
  'instagram-caption': number
  'tiktok-script': number
  'email-subject': number
  'email-body': number
  'blog-title': number
  'blog-post': number
  'product-hunt-launch': number
  'cold-email': number
  'newsletter': number
  
  // Advanced Features
  'website-scraping': number
  'competitor-analysis': number
  'daily-suggestions': number
  'email-sequence': number
  'community-response': number
  'viral-content': number
  'personal-brand': number
  'outreach-message': number
  'visual-content': number
  'analytics-insight': number
  'calendar-integration': number
  
  // Bulk Operations
  'bulk-tweet-generation': number
  'bulk-email-campaign': number
  'mass-outreach': number
}

// Token costs for different features - aligned with pricing strategy
export const TOKEN_COSTS: TokenUsageConfig = {
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
  
  // Bulk Operations (multiplied by count)
  'bulk-tweet-generation': 3, // per 5 tweets
  'bulk-email-campaign': 15, // per campaign
  'mass-outreach': 20, // per 50 contacts
}

export type TokenUsageType = keyof TokenUsageConfig

export interface TokenUsageResult {
  success: boolean
  tokensUsed?: number
  remainingTokens?: number
  plan?: string
  error?: string
  upgradeRequired?: boolean
}

export interface TokenUsageMetrics {
  totalTokensUsed: number
  totalCost: Decimal
  usageByType: Record<string, number>
  usageByDate: Record<string, number>
  remainingTokens: number
  plan: string
  resetDate?: Date
}

export class TokenManager {
  
  /**
   * Check if user has sufficient tokens and deduct them
   */
  static async useTokens(
    userId: string, 
    usageType: TokenUsageType, 
    count: number = 1,
    metadata?: {
      provider?: string
      model?: string
      endpoint?: string
      actualTokens?: number
      actualCost?: number
    }
  ): Promise<TokenUsageResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          credits: true, 
          plan: true,
          stripeCurrentPeriodEnd: true 
        }
      })

      if (!user) {
        return { 
          success: false, 
          error: 'User not found' 
        }
      }

      // Growth plan has unlimited tokens
      if (user.plan === 'growth') {
        await this.recordUsage(userId, usageType, count, metadata)
        return { 
          success: true, 
          tokensUsed: 0, 
          remainingTokens: 999999, 
          plan: user.plan 
        }
      }

      const tokenCost = TOKEN_COSTS[usageType] * count
      
      // Check if user has enough credits
      if (user.credits < tokenCost) {
        return { 
          success: false, 
          error: 'Insufficient tokens', 
          remainingTokens: user.credits,
          plan: user.plan,
          upgradeRequired: true
        }
      }

      // Deduct credits and record usage
      await prisma.$transaction(async (tx) => {
        // Update user credits
        await tx.user.update({
          where: { id: userId },
          data: {
            credits: {
              decrement: tokenCost
            }
          }
        })

        // Record the usage
        await this.recordUsage(userId, usageType, count, metadata, tx)
      })

      return { 
        success: true, 
        tokensUsed: tokenCost, 
        remainingTokens: user.credits - tokenCost, 
        plan: user.plan 
      }

    } catch (error) {
      console.error('Error in token usage:', error)
      return { 
        success: false, 
        error: 'Failed to process token usage' 
      }
    }
  }

  /**
   * Record usage in database for analytics
   */
  private static async recordUsage(
    userId: string, 
    usageType: TokenUsageType, 
    count: number,
    metadata?: {
      provider?: string
      model?: string
      endpoint?: string
      actualTokens?: number
      actualCost?: number
    },
    tx?: any
  ) {
    const db = tx || prisma
    const tokenCost = TOKEN_COSTS[usageType] * count
    const estimatedCost = new Decimal(tokenCost * 0.001) // Rough cost estimation

    // Record in ApiUsage table
    await db.apiUsage.create({
      data: {
        userId,
        provider: metadata?.provider || 'launchkit',
        model: metadata?.model || usageType,
        endpoint: metadata?.endpoint || `/api/${usageType}`,
        tokens: metadata?.actualTokens || tokenCost,
        cost: metadata?.actualCost ? new Decimal(metadata.actualCost) : estimatedCost,
      }
    })

    // Update user stats
    await db.userStats.upsert({
      where: { userId },
      create: {
        userId,
        totalGenerations: 1,
        totalTokens: tokenCost,
        totalCost: estimatedCost,
        lastActiveAt: new Date(),
      },
      update: {
        totalGenerations: { increment: 1 },
        totalTokens: { increment: tokenCost },
        totalCost: { increment: estimatedCost },
        lastActiveAt: new Date(),
      }
    })
  }

  /**
   * Get user's current token usage and metrics
   */
  static async getUserMetrics(userId: string): Promise<TokenUsageMetrics | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          credits: true, 
          plan: true,
          stripeCurrentPeriodEnd: true,
          apiUsage: {
            orderBy: { createdAt: 'desc' },
            take: 100 // Last 100 usage records
          },
          userStats: true
        }
      })

      if (!user) return null

      // Calculate usage by type
      const usageByType: Record<string, number> = {}
      const usageByDate: Record<string, number> = {}
      
      user.apiUsage.forEach(usage => {
        // Group by model/type
        usageByType[usage.model] = (usageByType[usage.model] || 0) + usage.tokens
        
        // Group by date
        const date = usage.createdAt.toISOString().split('T')[0]
        usageByDate[date] = (usageByDate[date] || 0) + usage.tokens
      })

      return {
        totalTokensUsed: user.userStats?.totalTokens || 0,
        totalCost: user.userStats?.totalCost || new Decimal(0),
        usageByType,
        usageByDate,
        remainingTokens: user.plan === 'growth' ? 999999 : user.credits,
        plan: user.plan,
        resetDate: user.stripeCurrentPeriodEnd || undefined
      }

    } catch (error) {
      console.error('Error getting user metrics:', error)
      return null
    }
  }

  /**
   * Check if user can perform an action without actually using tokens
   */
  static async canUseTokens(
    userId: string, 
    usageType: TokenUsageType, 
    count: number = 1
  ): Promise<{ canUse: boolean; tokensRequired: number; remainingTokens: number; plan: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true, plan: true }
      })

      if (!user) {
        return { 
          canUse: false, 
          tokensRequired: 0, 
          remainingTokens: 0, 
          plan: 'free' 
        }
      }

      const tokensRequired = TOKEN_COSTS[usageType] * count

      return {
        canUse: user.plan === 'growth' || user.credits >= tokensRequired,
        tokensRequired,
        remainingTokens: user.plan === 'growth' ? 999999 : user.credits,
        plan: user.plan
      }

    } catch (error) {
      console.error('Error checking token availability:', error)
      return { 
        canUse: false, 
        tokensRequired: 0, 
        remainingTokens: 0, 
        plan: 'free' 
      }
    }
  }

  /**
   * Reset monthly credits for users (called by cron job)
   */
  static async resetMonthlyCredits(): Promise<void> {
    try {
      // Get credit allocations from plan definitions
      const PLAN_CREDITS = {
        'free': 50,
        'pro': 500,
        'growth': 999999 // Keep high number for unlimited
      }

      // Reset credits for each plan
      for (const [plan, credits] of Object.entries(PLAN_CREDITS)) {
        await prisma.user.updateMany({
          where: { plan },
          data: { credits }
        })
      }

      console.log('Monthly credits reset successfully')
    } catch (error) {
      console.error('Error resetting monthly credits:', error)
    }
  }

  /**
   * Get token costs for display in UI
   */
  static getTokenCosts(): TokenUsageConfig {
    return TOKEN_COSTS
  }

  /**
   * Get estimated cost in USD for token usage
   */
  static getEstimatedCost(usageType: TokenUsageType, count: number = 1): number {
    const tokens = TOKEN_COSTS[usageType] * count
    return tokens * 0.001 // Rough estimate: $0.001 per token
  }
}

// Export legacy functions for backward compatibility
export async function deductCredits(userId: string, amount: number = 1): Promise<boolean> {
  const result = await TokenManager.useTokens(userId, 'tweet', amount) // Default to tweet cost
  return result.success
}

export async function getUserCredits(userId: string): Promise<{ credits: number; plan: string } | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, plan: true }
    })
    return user
  } catch (error) {
    console.error('Error getting user credits:', error)
    return null
  }
}

export async function resetMonthlyCredits(): Promise<void> {
  return TokenManager.resetMonthlyCredits()
}

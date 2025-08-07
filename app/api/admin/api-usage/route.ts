import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '24h';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default: // 24h
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get comprehensive API usage data
    const [
      totalUsage,
      todayUsage,
      recentUsage,
      modelStats,
      errorStats,
      responseTimeStats
    ] = await Promise.all([
      // Total usage in range
      prisma.apiUsage.aggregate({
        where: {
          createdAt: { gte: startDate }
        },
        _count: true,
        _sum: {
          tokens: true,
          cost: true,
          responseTime: true
        },
        _avg: {
          responseTime: true
        }
      }),
      
      // Today's usage
      prisma.apiUsage.aggregate({
        where: {
          createdAt: { gte: todayStart }
        },
        _count: true,
        _sum: {
          tokens: true,
          cost: true
        }
      }),

      // Recent usage with user info
      prisma.apiUsage.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      }),

      // Model statistics with performance data
      prisma.apiUsage.groupBy({
        by: ['provider', 'model'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: true,
        _sum: {
          tokens: true,
          cost: true
        },
        _avg: {
          responseTime: true
        },
        orderBy: {
          _count: {
            _all: 'desc'
          }
        },
        take: 10
      }),

      // Error statistics
      prisma.apiUsage.groupBy({
        by: ['provider', 'success'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: true
      }),

      // Response time statistics by provider
      prisma.apiUsage.groupBy({
        by: ['provider'],
        where: {
          createdAt: { gte: startDate },
          responseTime: { not: null }
        },
        _avg: {
          responseTime: true
        },
        _min: {
          responseTime: true
        },
        _max: {
          responseTime: true
        }
      })
    ]);

    // Generate time-based usage data based on range
    const timeIntervals = range === '1h' ? 12 : range === '7d' ? 7 : range === '30d' ? 30 : 24;
    const intervalDuration = range === '1h' ? 5 * 60 * 1000 : // 5 minutes
                           range === '7d' ? 24 * 60 * 60 * 1000 : // 1 day
                           range === '30d' ? 24 * 60 * 60 * 1000 : // 1 day
                           60 * 60 * 1000; // 1 hour

    const usage24h = [];
    for (let i = timeIntervals - 1; i >= 0; i--) {
      const intervalStart = new Date(now.getTime() - i * intervalDuration);
      const intervalEnd = new Date(intervalStart.getTime() + intervalDuration);
      
      const intervalUsage = await prisma.apiUsage.aggregate({
        where: {
          createdAt: {
            gte: intervalStart,
            lt: intervalEnd
          }
        },
        _count: true,
        _sum: {
          tokens: true,
          cost: true
        }
      });

      const label = range === '1h' ? intervalStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                   range === '7d' || range === '30d' ? intervalStart.toLocaleDateString([], { month: 'short', day: 'numeric' }) :
                   intervalStart.toLocaleTimeString([], { hour: '2-digit' });

      usage24h.push({
        hour: label,
        requests: intervalUsage._count || 0,
        tokens: intervalUsage._sum.tokens || 0,
        cost: intervalUsage._sum.cost?.toNumber() || 0
      });
    }

    // Calculate error rates by provider
    const errorRates = new Map();
    errorStats.forEach(stat => {
      if (!errorRates.has(stat.provider)) {
        errorRates.set(stat.provider, { total: 0, errors: 0 });
      }
      const providerStats = errorRates.get(stat.provider);
      providerStats.total += stat._count;
      if (!stat.success) {
        providerStats.errors += stat._count;
      }
    });

    // Transform model stats with real performance data
    const topModels = modelStats.map(stat => {
      const providerErrors = errorRates.get(stat.provider) || { total: 0, errors: 0 };
      const successRate = providerErrors.total > 0 ? 
        ((providerErrors.total - providerErrors.errors) / providerErrors.total) * 100 : 100;
      
      return {
        provider: stat.provider,
        model: stat.model,
        requests: stat._count,
        tokens: stat._sum.tokens || 0,
        cost: stat._sum.cost?.toNumber() || 0,
        avgResponseTime: Math.round(stat._avg.responseTime || 0),
        successRate: Math.round(successRate)
      };
    });

    // Transform recent usage with real data
    const recentUsageData = recentUsage.map(usage => ({
      id: usage.id,
      provider: usage.provider,
      model: usage.model,
      endpoint: usage.endpoint,
      tokens: usage.tokens,
      cost: usage.cost.toNumber(),
      userId: usage.userId,
      userName: usage.user?.name || 'Anonymous',
      userEmail: usage.user?.email,
      timestamp: usage.createdAt.toISOString(),
      responseTime: usage.responseTime || 0,
      success: usage.success,
      errorMessage: usage.errorMessage
    }));

    // Calculate real averages
    const avgResponseTime = Math.round(totalUsage._avg.responseTime || 0);
    const totalErrors = errorStats.filter(s => !s.success).reduce((sum, s) => sum + s._count, 0);
    const totalRequests = totalUsage._count || 0;
    const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

    // Provider performance summary
    const providerPerformance = responseTimeStats.map(stat => ({
      provider: stat.provider,
      avgResponseTime: Math.round(stat._avg.responseTime || 0),
      minResponseTime: stat._min.responseTime || 0,
      maxResponseTime: stat._max.responseTime || 0
    }));

    return NextResponse.json({
      totalRequests,
      totalTokens: totalUsage._sum.tokens || 0,
      totalCost: totalUsage._sum.cost?.toNumber() || 0,
      requestsToday: todayUsage._count || 0,
      tokensToday: todayUsage._sum.tokens || 0,
      costToday: todayUsage._sum.cost?.toNumber() || 0,
      avgResponseTime,
      errorRate: Math.round(errorRate * 100) / 100,
      totalErrors,
      topModels,
      usage24h,
      recentUsage: recentUsageData,
      providerPerformance,
      timeRange: range
    });

  } catch (error) {
    console.error('Admin API usage analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API usage analytics' },
      { status: 500 }
    );
  }
}

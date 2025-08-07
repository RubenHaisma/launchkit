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

    // Get current date for calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Get comprehensive user statistics
    const [
      totalUsers,
      activeUsers,
      paidUsers,
      bannedUsers,
      recentUsers,
      totalGenerations,
      totalApiUsage,
      systemLogs,
      recentActivity,
      stripeWebhooks
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users (logged in or updated in last 30 days)
      prisma.user.count({
        where: {
          OR: [
            { updatedAt: { gte: thirtyDaysAgo } },
            { userStats: { lastActiveAt: { gte: thirtyDaysAgo } } }
          ]
        }
      }),

      // Paid users
      prisma.user.count({
        where: {
          plan: { not: 'free' }
        }
      }),

      // Banned users
      prisma.user.count({
        where: { status: 'banned' }
      }),

      // Recent new users
      prisma.user.count({
        where: { createdAt: { gte: oneMonthAgo } }
      }),

      // Generation statistics
      prisma.generation.aggregate({
        _count: true,
        _sum: {
          tokens: true,
          cost: true
        }
      }),

      // API usage statistics
      prisma.apiUsage.aggregate({
        _sum: {
          tokens: true,
          cost: true
        },
        _count: true
      }),

      // Recent system logs for errors/warnings
      prisma.systemLogs.findMany({
        where: {
          level: { in: ['error', 'warning'] },
          timestamp: { gte: thirtyDaysAgo }
        },
        orderBy: { timestamp: 'desc' },
        take: 10
      }),

      // Recent user activity
      prisma.userActivity.findMany({
        where: { timestamp: { gte: thirtyDaysAgo } },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { timestamp: 'desc' },
        take: 20
      }),

      // Recent Stripe webhooks for revenue calculation
      prisma.stripeWebhook.findMany({
        where: {
          eventType: { startsWith: 'invoice.payment_succeeded' },
          createdAt: { gte: oneMonthAgo }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Calculate real revenue from Stripe webhooks
    const totalRevenue = stripeWebhooks.reduce((sum, webhook) => {
      return sum + (webhook.amount || 0);
    }, 0) / 100; // Convert from cents

    const monthlyRevenue = stripeWebhooks
      .filter(w => w.createdAt >= oneMonthAgo)
      .reduce((sum, webhook) => sum + (webhook.amount || 0), 0) / 100;

    // Calculate total AI costs
    const totalCost = (totalGenerations._sum.cost?.toNumber() || 0) + 
                     (totalApiUsage._sum.cost?.toNumber() || 0);

    // Determine system health based on real data
    const errorLogs = systemLogs.filter(log => log.level === 'error').length;
    const warningLogs = systemLogs.filter(log => log.level === 'warning').length;
    
    // Check database health by testing a query
    let databaseHealth: 'healthy' | 'warning' | 'error' = 'healthy';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      databaseHealth = 'error';
    }

    // Check AI provider health based on recent API usage
    const recentApiUsage = await prisma.apiUsage.findMany({
      where: { 
        createdAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) }, // Last hour
        success: false 
      }
    });
    
    const aiProviderHealth = recentApiUsage.length > 10 ? 'error' : 
                           recentApiUsage.length > 5 ? 'warning' : 'healthy';

    // Get latest system metrics if available
    const latestMetrics = await prisma.systemMetrics.findMany({
      where: {
        timestamp: { gte: new Date(now.getTime() - 15 * 60 * 1000) } // Last 15 minutes
      },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    const memoryMetric = latestMetrics.find(m => m.metricType === 'memory_percentage');
    const cpuMetric = latestMetrics.find(m => m.metricType === 'cpu_percentage');

    const systemHealth = {
      database: databaseHealth,
      aiProviders: aiProviderHealth,
      memory: memoryMetric ? memoryMetric.value.toNumber() : 45, // Fallback
      cpu: cpuMetric ? cpuMetric.value.toNumber() : 25 // Fallback
    };

    // Transform recent activity from database
    const recentActivityFormatted = [
      ...recentActivity.slice(0, 10).map(activity => ({
        id: activity.id,
        type: activity.activity,
        message: activity.description || `${activity.user.name || activity.user.email} ${activity.activity}`,
        timestamp: activity.timestamp.toISOString(),
        severity: 'info' as const
      })),
      ...systemLogs.slice(0, 5).map(log => ({
        id: log.id,
        type: log.service,
        message: log.message,
        timestamp: log.timestamp.toISOString(),
        severity: log.level as 'info' | 'warning' | 'error'
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 15);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      paidUsers,
      bannedUsers,
      recentUsers,
      totalRevenue,
      monthlyRevenue,
      totalGenerations: totalGenerations._count || 0,
      totalTokens: (totalGenerations._sum.tokens || 0) + (totalApiUsage._sum.tokens || 0),
      totalCost,
      systemHealth,
      recentActivity: recentActivityFormatted,
      errorCount: errorLogs,
      warningCount: warningLogs
    });

  } catch (error) {
    console.error('Admin stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}

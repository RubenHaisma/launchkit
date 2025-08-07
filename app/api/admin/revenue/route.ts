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
    const range = searchParams.get('range') || '12m';

    // Calculate date range
    const now = new Date();
    let months: number;
    
    switch (range) {
      case '3m':
        months = 3;
        break;
      case '6m':
        months = 6;
        break;
      case '12m':
        months = 12;
        break;
      default:
        months = 12;
    }

    const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get comprehensive user and revenue data
    const [
      totalUsers,
      paidUsers,
      usersByPlan,
      stripeWebhooks,
      recentSubscriptions,
      churnedUsers
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Paid users
      prisma.user.count({
        where: { plan: { not: 'free' } }
      }),
      
      // Users by plan with creation dates for trend analysis
      prisma.user.groupBy({
        by: ['plan'],
        _count: true,
        where: {
          plan: { not: 'free' },
          createdAt: { gte: startDate }
        }
      }),
      
      // Real Stripe webhook data for revenue calculation
      prisma.stripeWebhook.findMany({
        where: {
          eventType: { 
            in: ['invoice.payment_succeeded', 'checkout.session.completed'] 
          },
          createdAt: { gte: startDate },
          processed: true
        },
        orderBy: { createdAt: 'desc' }
      }),

      // Recent subscription changes
      prisma.user.findMany({
        where: {
          plan: { not: 'free' },
          updatedAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          stripeCustomerId: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' },
        take: 50
      }),

      // Users who downgraded to free (churn)
      prisma.user.count({
        where: {
          plan: 'free',
          updatedAt: { gte: lastMonth },
          // This is a simplified churn calculation - in reality you'd track plan changes
        }
      })
    ]);

    // Calculate real revenue from Stripe webhooks
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    const revenueByMonth = new Map<string, number>();
    
    stripeWebhooks.forEach(webhook => {
      const amount = (webhook.amount || 0) / 100; // Convert from cents
      totalRevenue += amount;
      
      // Calculate monthly revenue
      const monthKey = webhook.createdAt.toISOString().substring(0, 7); // YYYY-MM
      revenueByMonth.set(monthKey, (revenueByMonth.get(monthKey) || 0) + amount);
      
      // Current month revenue
      if (webhook.createdAt >= new Date(now.getFullYear(), now.getMonth(), 1)) {
        monthlyRevenue += amount;
      }
    });

    // Plan pricing for calculations where Stripe data is missing
    const planPricing = {
      pro: 29,
      premium: 99,
      enterprise: 299
    };

    // Calculate revenue by plan from real data
    const revenueByPlan = usersByPlan.map(planGroup => {
      // Try to get real revenue for this plan from Stripe webhooks
      const planRevenue = stripeWebhooks
        .filter(w => {
          const data = w.data as any;
          return data?.lines?.data?.[0]?.price?.nickname?.toLowerCase().includes(planGroup.plan);
        })
        .reduce((sum, w) => sum + ((w.amount || 0) / 100), 0);
      
      // Fallback to calculated revenue if no Stripe data
      const revenue = planRevenue || (planGroup._count * (planPricing[planGroup.plan as keyof typeof planPricing] || 0));
      
      return {
        plan: planGroup.plan,
        revenue,
        customers: planGroup._count,
        percentage: 0 // Will calculate after total is known
      };
    });

    // Calculate percentages
    const totalPlanRevenue = revenueByPlan.reduce((sum, plan) => sum + plan.revenue, 0);
    revenueByPlan.forEach(plan => {
      plan.percentage = totalPlanRevenue > 0 ? Math.round((plan.revenue / totalPlanRevenue) * 100) : 0;
    });

    // Generate monthly trend from real data
    const monthlyTrend = [];
    for (let i = months - 1; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = month.toISOString().substring(0, 7);
      const monthName = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const revenue = revenueByMonth.get(monthKey) || 0;
      const prevMonthKey = new Date(month.getFullYear(), month.getMonth() - 1, 1).toISOString().substring(0, 7);
      const prevRevenue = revenueByMonth.get(prevMonthKey) || 0;
      const growth = prevRevenue > 0 ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : 0;
      
      // Count customers for this month
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      const monthCustomers = await prisma.user.count({
        where: {
          plan: { not: 'free' },
          createdAt: { lte: monthEnd }
        }
      });
      
      monthlyTrend.push({
        month: monthName,
        revenue: Math.round(revenue),
        customers: monthCustomers,
        growth
      });
    }

    // Transform recent Stripe webhooks into transaction data
    const recentTransactions = stripeWebhooks.slice(0, 20).map(webhook => {
      const data = webhook.data as any;
      return {
        id: webhook.id,
        customerName: data?.customer_details?.name || 'Unknown',
        customerEmail: data?.customer_details?.email || data?.customer_email || 'Unknown',
        amount: (webhook.amount || 0) / 100,
        plan: data?.lines?.data?.[0]?.price?.nickname || 'Unknown',
        status: webhook.eventType.includes('succeeded') ? 'completed' : 'pending',
        timestamp: webhook.createdAt.toISOString(),
        stripeId: webhook.stripeEventId
      };
    });

    // Calculate top customers from real subscription data
    const topCustomers = await Promise.all(
      recentSubscriptions.slice(0, 10).map(async (user) => {
        // Calculate total spent from Stripe webhooks for this customer
        const customerWebhooks = stripeWebhooks.filter(w => 
          w.customerId === user.stripeCustomerId
        );
        const totalSpent = customerWebhooks.reduce((sum, w) => sum + ((w.amount || 0) / 100), 0);
        
        // Get last payment
        const lastPayment = customerWebhooks.length > 0 ? 
          customerWebhooks[0].createdAt.toISOString() : 
          user.updatedAt.toISOString();
        
        return {
          id: user.id,
          name: user.name || 'Unknown User',
          email: user.email,
          totalSpent: totalSpent || (planPricing[user.plan as keyof typeof planPricing] || 0),
          plan: user.plan,
          joinedAt: user.createdAt.toISOString(),
          lastPayment
        };
      })
    );

    // Sort by total spent
    topCustomers.sort((a, b) => b.totalSpent - a.totalSpent);

    // Calculate real metrics
    const annualRevenue = totalRevenue; // Already calculated from real data
    const lastMonthRevenue = revenueByMonth.get(lastMonth.toISOString().substring(0, 7)) || 0;
    const currentMonthRevenue = monthlyRevenue;
    const revenueGrowth = lastMonthRevenue > 0 ? 
      Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0;
    
    const churnRate = paidUsers > 0 ? Math.round((churnedUsers / paidUsers) * 100) : 0;
    const avgRevenuePerUser = paidUsers > 0 ? Math.round(totalRevenue / paidUsers) : 0;

    const revenueData = {
      overview: {
        totalRevenue: Math.round(totalRevenue),
        monthlyRevenue: Math.round(monthlyRevenue),
        annualRevenue: Math.round(annualRevenue),
        revenueGrowth,
        totalCustomers: totalUsers,
        activeSubscriptions: paidUsers,
        churnRate,
        avgRevenuePerUser
      },
      revenueByPlan,
      monthlyTrend,
      recentTransactions,
      topCustomers,
      timeRange: range
    };

    return NextResponse.json(revenueData);

  } catch (error) {
    console.error('Admin revenue analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue analytics' },
      { status: 500 }
    );
  }
}

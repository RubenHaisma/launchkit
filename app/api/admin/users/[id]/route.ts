import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: userId } = await params;

    // Get comprehensive user information
    const [user, userActivity, apiUsage] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          userStats: true,
          businessProfile: true,
          accounts: {
            select: {
              provider: true
            }
          },
          sessions: {
            orderBy: { expires: 'desc' },
            take: 5,
            select: {
              id: true,
              expires: true
            }
          },
          generations: {
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
              id: true,
              type: true,
              model: true,
              tokens: true,
              cost: true,
              createdAt: true
            }
          },
          posts: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
              id: true,
              platform: true,
              published: true,
              publishedAt: true,
              createdAt: true
            }
          },
          campaigns: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
              id: true,
              name: true,
              type: true,
              status: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              generations: true,
              posts: true,
              campaigns: true,
              apiUsage: true,
              userActivity: true
            }
          }
        }
      }),
      
      // Get recent user activity
      prisma.userActivity.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 50
      }),

      // Get API usage for this user
      prisma.apiUsage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          provider: true,
          model: true,
          tokens: true,
          cost: true,
          success: true,
          createdAt: true
        }
      })
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate real totals from generations and API usage
    const [generationTotals, apiUsageTotals] = await Promise.all([
      prisma.generation.aggregate({
        where: { userId },
        _sum: {
          tokens: true,
          cost: true
        }
      }),
      prisma.apiUsage.aggregate({
        where: { userId },
        _sum: {
          tokens: true,
          cost: true
        }
      })
    ]);

    const totalTokens = (generationTotals._sum.tokens || 0) + (apiUsageTotals._sum.tokens || 0);
    const totalCost = (generationTotals._sum.cost?.toNumber() || 0) + (apiUsageTotals._sum.cost?.toNumber() || 0);

    // Transform user activity into recent activity
    const recentActivity = userActivity.map((activity: any) => ({
      id: activity.id,
      type: activity.activity,
      description: activity.description || `User performed ${activity.activity}`,
      timestamp: activity.timestamp.toISOString(),
      metadata: activity.metadata
    }));

    // Calculate advanced statistics
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [recent30DaysActivity, recent7DaysActivity, costLast30Days] = await Promise.all([
      prisma.generation.count({
        where: {
          userId,
          createdAt: { gte: last30Days }
        }
      }),
      prisma.generation.count({
        where: {
          userId,
          createdAt: { gte: last7Days }
        }
      }),
      prisma.generation.aggregate({
        where: {
          userId,
          createdAt: { gte: last30Days }
        },
        _sum: { cost: true }
      })
    ]);

    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      credits: user.credits,
      status: user.status,
      isAdmin: user.isAdmin,
      emailVerified: !!user.emailVerified,
      image: user.image,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastActiveAt: user.userStats?.lastActiveAt?.toISOString(),
      stripeCustomerId: user.stripeCustomerId,
      stripePriceId: user.stripePriceId,
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.toISOString(),
      
      // Statistics
      totalGenerations: user._count.generations,
      totalPosts: user._count.posts,
      totalCampaigns: user._count.campaigns,
      totalApiCalls: user._count.apiUsage,
      totalUserActivity: user._count.userActivity,
      totalTokens,
      totalCost,
      
      // Recent activity metrics
      generationsLast30Days: recent30DaysActivity,
      generationsLast7Days: recent7DaysActivity,
      costLast30Days: costLast30Days._sum.cost?.toNumber() || 0,
      
      // Activity data
      recentActivity,
      recentGenerations: user.generations,
      recentPosts: user.posts,
      recentCampaigns: user.campaigns,
      recentApiUsage: apiUsage,
      
      // Profile data
      businessProfile: user.businessProfile,
      
      // Account data
      authProviders: user.accounts.map((acc: any) => acc.provider),
      activeSessions: user.sessions.filter((s: any) => s.expires > now).length,
      
      // Calculated metrics
      avgGenerationsPerDay: user._count.generations / Math.max(1, (now.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
      avgCostPerGeneration: totalCost / Math.max(1, user._count.generations),
      publishedPostsRatio: user.posts.length > 0 ? user.posts.filter((p: any) => p.published).length / user.posts.length : 0
    };

    return NextResponse.json({ user: userDetails });

  } catch (error) {
    console.error('Admin user details API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: userId } = await params;
    const { action, data } = await request.json();

    let updateData: any = {};
    let logMessage = '';

    switch (action) {
      case 'ban':
        updateData = { 
          status: 'banned',
          updatedAt: new Date() 
        };
        logMessage = `User banned by admin ${currentUser.email}`;
        break;
        
      case 'activate':
        updateData = { 
          status: 'active',
          updatedAt: new Date()
        };
        logMessage = `User activated by admin ${currentUser.email}`;
        break;
        
      case 'reset_credits':
        const creditsAmount = data?.credits || 50;
        updateData = { 
          credits: creditsAmount,
          updatedAt: new Date() 
        };
        logMessage = `User credits reset to ${creditsAmount} by admin ${currentUser.email}`;
        break;
        
      case 'update_plan':
        if (!data?.plan) {
          return NextResponse.json({ error: 'Plan is required' }, { status: 400 });
        }
        updateData = { 
          plan: data.plan,
          updatedAt: new Date() 
        };
        logMessage = `User plan changed to ${data.plan} by admin ${currentUser.email}`;
        break;
        
      case 'make_admin':
        updateData = { 
          isAdmin: true,
          updatedAt: new Date() 
        };
        logMessage = `User granted admin privileges by admin ${currentUser.email}`;
        break;
        
      case 'remove_admin':
        updateData = { 
          isAdmin: false,
          updatedAt: new Date() 
        };
        logMessage = `User admin privileges removed by admin ${currentUser.email}`;
        break;

      case 'update_credits':
        if (data?.credits === undefined) {
          return NextResponse.json({ error: 'Credits amount is required' }, { status: 400 });
        }
        updateData = { 
          credits: data.credits,
          updatedAt: new Date() 
        };
        logMessage = `User credits updated to ${data.credits} by admin ${currentUser.email}`;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Perform the update in a transaction
    const result = await prisma.$transaction(async (tx: any ) => {
      // Update the user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: updateData
      });

      // Log the admin action
      await tx.systemLogs.create({
        data: {
          level: 'info',
          service: 'admin',
          message: logMessage,
          details: {
            adminUserId: currentUser.id,
            targetUserId: userId,
            action,
            data: updateData
          }
        }
      });

      // Log user activity
      await tx.userActivity.create({
        data: {
          userId: userId,
          activity: `admin_${action}`,
          description: logMessage,
          metadata: {
            adminUserId: currentUser.id,
            adminEmail: currentUser.email
          }
        }
      });

      return updatedUser;
    });

    return NextResponse.json({ 
      success: true, 
      message: `User ${action.replace('_', ' ')} completed successfully`,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        plan: result.plan,
        credits: result.credits,
        status: result.status,
        isAdmin: result.isAdmin,
        updatedAt: result.updatedAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Admin user action API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform user action' },
      { status: 500 }
    );
  }
}

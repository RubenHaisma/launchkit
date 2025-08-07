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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (plan && plan !== 'all') {
      where.plan = plan;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Get users with comprehensive data
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          userStats: true,
          businessProfile: {
            select: {
              businessName: true,
              website: true,
              industry: true
            }
          },
          _count: {
            select: {
              generations: true,
              posts: true,
              campaigns: true,
              apiUsage: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Get aggregated data for each user
    const userIds = users.map(u => u.id);
    
    const [generationStats, apiUsageStats] = await Promise.all([
      prisma.generation.groupBy({
        by: ['userId'],
        where: { userId: { in: userIds } },
        _sum: {
          tokens: true,
          cost: true
        }
      }),
      prisma.apiUsage.groupBy({
        by: ['userId'],
        where: { userId: { in: userIds } },
        _sum: {
          tokens: true,
          cost: true
        }
      })
    ]);

    // Transform users data with real statistics
    const transformedUsers = users.map(user => {
      const genStats = generationStats.find(g => g.userId === user.id);
      const apiStats = apiUsageStats.find(a => a.userId === user.id);
      
      const totalTokens = (genStats?._sum.tokens || 0) + (apiStats?._sum.tokens || 0);
      const totalCost = (genStats?._sum.cost?.toNumber() || 0) + (apiStats?._sum.cost?.toNumber() || 0);
      
      // Determine user status based on activity and explicit status
      let userStatus = user.status;
      if (userStatus === 'active' && user.userStats?.lastActiveAt) {
        const daysSinceActive = (new Date().getTime() - user.userStats.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceActive > 30) {
          userStatus = 'inactive';
        }
      }
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        credits: user.credits,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastActiveAt: user.userStats?.lastActiveAt?.toISOString(),
        stripeCustomerId: user.stripeCustomerId,
        totalGenerations: user._count.generations,
        totalPosts: user._count.posts,
        totalCampaigns: user._count.campaigns,
        totalApiCalls: user._count.apiUsage,
        totalTokens,
        totalCost,
        status: userStatus,
        businessProfile: user.businessProfile,
        isAdmin: user.isAdmin,
        emailVerified: !!user.emailVerified
      };
    });

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

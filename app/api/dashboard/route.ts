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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate mock marketing plan based on current date
    const today = new Date();
    const marketingPlan = [
      {
        day: 'Today',
        task: 'Generate viral Twitter thread',
        description: 'Chat with AI to create engaging X/Twitter content',
        status: 'pending',
        icon: 'Twitter',
        action: '/dashboard/generate',
        priority: 'high'
      },
      {
        day: 'Tomorrow',
        task: 'Send cold email campaign',
        description: 'Reach out to 50 potential customers',
        status: 'pending',
        icon: 'Mail',
        action: '/dashboard/outreach',
        priority: 'high'
      },
      {
        day: 'Day 3',
        task: 'Create LinkedIn content',
        description: 'Professional posts to engage your network',
        status: 'pending',
        icon: 'FileText',
        action: '/dashboard/generate',
        priority: 'medium'
      },
      {
        day: 'Day 4',
        task: 'Product Hunt preparation',
        description: 'Finalize launch assets and strategy',
        status: 'pending',
        icon: 'Rocket',
        action: '/dashboard/generate',
        priority: 'high'
      },
      {
        day: 'Day 5',
        task: 'Email newsletter',
        description: 'Weekly update to subscribers',
        status: 'pending',
        icon: 'Mail',
        action: '/dashboard/email-campaigns',
        priority: 'medium'
      },
      {
        day: 'Day 6',
        task: 'Social media engagement',
        description: 'Respond to comments and build community',
        status: 'pending',
        icon: 'Users',
        action: '/dashboard/twitter',
        priority: 'low'
      },
      {
        day: 'Day 7',
        task: 'Analytics review',
        description: 'Analyze performance and plan next week',
        status: 'pending',
        icon: 'BarChart3',
        action: '/dashboard/analytics',
        priority: 'medium'
      }
    ];

    // Generate mock campaigns
    const campaigns = [
      {
        id: '1',
        name: 'Product Launch Tweet',
        content: '🚀 Excited to announce LaunchPilot is now live! The AI marketing co-founder you\'ve been waiting for...',
        type: 'twitter',
        status: 'active',
        metrics: {
          impressions: 1247,
          engagement: 89,
          clicks: 23
        },
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Welcome Email Series',
        content: 'Welcome to LaunchPilot! Here\'s everything you need to know to get started...',
        type: 'email',
        status: 'scheduled',
        metrics: {
          opened: 234,
          clicked: 45,
          subscribers: 1250
        },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    // Generate mock notifications
    const notifications = [
      {
        id: '1',
        type: 'success',
        title: 'Campaign Performance',
        message: 'Your Twitter thread gained 1.2k impressions in the last hour!',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'info',
        title: 'New Feature',
        message: 'AI-powered content scheduling is now available',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      },
      {
        id: '3',
        type: 'warning',
        title: 'Credit Usage',
        message: 'You\'ve used 80% of your monthly credits',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true
      }
    ];

    // Calculate stats
    const stats = {
      totalGenerations: 47,
      totalCampaigns: campaigns.length,
      activeUsers: 1,
      totalTokensUsed: 15420
    };

    return NextResponse.json({
      marketingPlan,
      campaigns,
      notifications,
      stats
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
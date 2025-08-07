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

    // Get user from database with business profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businessProfile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate personalized marketing plan based on business profile
    const profile = user.businessProfile;
    
    // Check if user has an active marketing plan for this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    let existingPlan = await prisma.marketingPlan.findFirst({
      where: {
        userId: user.id,
        weekStarting: startOfWeek,
        isActive: true
      }
    });
    
    // If no plan exists or user requests regeneration, create a new one
    const shouldGenerateNewPlan = !existingPlan || 
      new URL(request.url).searchParams.get('regenerate') === 'true';
    
    let marketingPlan;
    
    if (shouldGenerateNewPlan) {
      const generatePersonalizedPlan = () => {
      const basePlans = {
        'SaaS': [
          {
            day: 'Today',
            task: 'Create product demo content',
            description: 'Share your SaaS features and benefits on X/Twitter',
            action: '/dashboard/generate',
            icon: 'Twitter',
            priority: 'high'
          },
          {
            day: 'Tomorrow', 
            task: 'Launch cold outreach campaign',
            description: 'Target potential enterprise customers',
            action: '/dashboard/outreach',
            icon: 'Mail',
            priority: 'high'
          },
          {
            day: 'Day 3',
            task: 'Share technical insights',
            description: 'Post thought leadership content on LinkedIn',
            action: '/dashboard/linkedin',
            icon: 'FileText',
            priority: 'high'
          },
          {
            day: 'Day 4',
            task: 'Product Hunt launch prep',
            description: 'Prepare assets and build launch strategy',
            action: '/dashboard/launch',
            icon: 'Rocket',
            priority: 'high'
          }
        ],
        'E-commerce': [
          {
            day: 'Today',
            task: 'Showcase bestselling products',
            description: 'Create engaging product showcase for social media',
            action: '/dashboard/generate',
            icon: 'Twitter',
            priority: 'high'
          },
          {
            day: 'Tomorrow',
            task: 'Email marketing campaign',
            description: 'Send promotional campaign to subscriber list',
            action: '/dashboard/email-campaigns',
            icon: 'Mail',
            priority: 'high'
          },
          {
            day: 'Day 3',
            task: 'User-generated content',
            description: 'Encourage customers to share reviews',
            action: '/dashboard/community',
            icon: 'Users',
            priority: 'medium'
          },
          {
            day: 'Day 4',
            task: 'Visual content creation',
            description: 'Create product lifestyle images and videos',
            action: '/dashboard/visual-content',
            icon: 'Camera',
            priority: 'high'
          }
        ],
        'default': [
          {
            day: 'Today',
            task: 'Generate viral content',
            description: 'Create engaging social media content',
            action: '/dashboard/generate',
            icon: 'Twitter', 
            priority: 'high'
          },
          {
            day: 'Tomorrow',
            task: 'Build your network',
            description: 'Connect with potential customers and partners',
            action: '/dashboard/outreach',
            icon: 'Mail',
            priority: 'high'
          },
          {
            day: 'Day 3',
            task: 'Professional content',
            description: 'Share expertise on LinkedIn',
            action: '/dashboard/linkedin',
            icon: 'FileText',
            priority: 'medium'
          },
          {
            day: 'Day 4',
            task: 'Community building',
            description: 'Engage with your target audience',
            action: '/dashboard/community',
            icon: 'Users',
            priority: 'medium'
          }
        ]
      };
      
      const businessType = profile?.businessModel || 'default';
      const industry = profile?.industry || '';
      
      let planKey: keyof typeof basePlans = 'default';
      if (businessType.toLowerCase().includes('saas') || industry.toLowerCase().includes('software')) {
        planKey = 'SaaS';
      } else if (businessType.toLowerCase().includes('ecommerce') || businessType.toLowerCase().includes('retail')) {
        planKey = 'E-commerce';
      }
      
      const basePlan = basePlans[planKey];
      
      // Add remaining days with generic tasks
      const fullPlan = [...basePlan];
      const remainingDays = [
        { day: 'Day 5', task: 'Email newsletter', description: 'Send weekly update to subscribers', action: '/dashboard/email-campaigns', icon: 'Mail', priority: 'medium' },
        { day: 'Day 6', task: 'Social media engagement', description: 'Respond to comments and build community', action: '/dashboard/twitter', icon: 'Users', priority: 'low' },
        { day: 'Day 7', task: 'Analytics review', description: 'Analyze performance and plan next week', action: '/dashboard/analytics', icon: 'BarChart3', priority: 'medium' }
      ];
      
      fullPlan.push(...remainingDays);
      
      // Personalize descriptions based on business profile
      return fullPlan.map(item => {
        let personalizedDescription = item.description;
        if (profile?.businessName) {
          personalizedDescription = personalizedDescription.replace('your', `${profile.businessName}'s`);
        }
        if (profile?.targetAudience && item.description.includes('audience')) {
          personalizedDescription += ` (${profile.targetAudience})`;
        }
        
        return {
          ...item,
          description: personalizedDescription,
          status: 'pending'
        };
      });
    }
    
      const newPlan = generatePersonalizedPlan();
      
      // Save or update the marketing plan in database
      if (existingPlan) {
        existingPlan = await prisma.marketingPlan.update({
          where: { id: existingPlan.id },
          data: {
            planData: newPlan,
            completedTasks: [], // Reset completed tasks on regeneration
            updatedAt: new Date()
          }
        });
      } else {
        existingPlan = await prisma.marketingPlan.create({
          data: {
            userId: user.id,
            planData: newPlan,
            weekStarting: startOfWeek,
            isActive: true,
            completedTasks: []
          }
        });
      }
      
      marketingPlan = newPlan;
    } else {
      // Use existing plan
      marketingPlan = existingPlan?.planData as any[];
      
      // Mark completed tasks
      marketingPlan = marketingPlan.map((item: any) => ({
        ...item,
        status: existingPlan!.completedTasks.includes(item.day) ? 'completed' : 'pending'
      }));
    }

    // Get real campaigns from database
    const campaigns = await prisma.campaign.findMany({
      where: { userId: user.id },
      include: {
        emails: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    // Transform campaigns to include content and metrics
    const transformedCampaigns = campaigns.map((campaign: any) => ({
      id: campaign.id,
      name: campaign.name,
      content: campaign.emails[0]?.body || 'No content available',
      subject: campaign.emails[0]?.subject,
      type: campaign.type,
      status: campaign.status,
      scheduledFor: campaign.emails[0]?.sentAt,
      createdAt: campaign.createdAt.toISOString(),
      metrics: {
        // Real metrics would come from email service or analytics
        opened: 0,
        clicked: 0,
        impressions: 0,
        engagement: 0
      }
    }));

    // Get real user activity as notifications
    const recentActivity = await prisma.userActivity.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 10
    });
    
    // Transform user activity into notifications
    const notifications = recentActivity.map((activity: any) => ({
      id: activity.id,
      type: activity.activity.includes('error') ? 'error' : 
            activity.activity.includes('warning') ? 'warning' :
            activity.activity.includes('success') || activity.activity.includes('generated') ? 'success' : 'info',
      title: activity.activity.charAt(0).toUpperCase() + activity.activity.slice(1).replace('_', ' '),
      message: activity.description || `${activity.activity.replace('_', ' ')} completed`,
      timestamp: activity.timestamp.toISOString(),
      read: Math.random() > 0.5 // This could be stored in a separate notifications table
    }));
    
    // Add credit usage warning if user is running low
    const creditWarningThreshold = 0.8;
    const maxCredits = user.plan === 'pro' ? 1000 : user.plan === 'premium' ? 5000 : 50;
    if (user.credits / maxCredits < (1 - creditWarningThreshold)) {
      notifications.unshift({
        id: 'credit-warning',
        type: 'warning',
        title: 'Credit Usage Alert',
        message: `You have ${user.credits} credits remaining (${Math.round((user.credits / maxCredits) * 100)}% of ${maxCredits})`,
        timestamp: new Date().toISOString(),
        read: false
      });
    }

    // Get real stats from database
    const userStats = await prisma.userStats.findUnique({
      where: { userId: user.id }
    });
    
    const generationsCount = await prisma.generation.count({
      where: { userId: user.id }
    });
    
    const postsCount = await prisma.post.count({
      where: { userId: user.id }
    });
    
    const stats = {
      totalGenerations: userStats?.totalGenerations || generationsCount,
      totalCampaigns: campaigns.length,
      totalPosts: postsCount,
      totalTokensUsed: userStats?.totalTokens || 0,
      totalCost: userStats?.totalCost || 0,
      creditsRemaining: user.credits
    };

    return NextResponse.json({
      marketingPlan,
      campaigns: transformedCampaigns,
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
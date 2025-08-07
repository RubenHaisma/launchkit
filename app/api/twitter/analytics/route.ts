import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Refresh analytics for all user's tweets
    const tweets = await prisma.tweet.findMany({
      where: { 
        userId: session.user.id,
        tweetUrl: { not: null }
      },
      orderBy: { publishedAt: 'desc' },
    });

    const updatedTweets = [];
    for (const tweet of tweets) {
      try {
        // Mock analytics update - in production you'd call Twitter API
        const newStats = await fetchTweetAnalytics(tweet.tweetUrl!);
        
        const updatedTweet = await prisma.tweet.update({
          where: { id: tweet.id },
          data: {
            views: newStats.views,
            likes: newStats.likes,
            retweets: newStats.retweets,
            replies: newStats.replies,
            impressions: newStats.impressions,
            engagements: newStats.engagements,
          },
        });

        // Store analytics history
        await prisma.twitterAnalytics.create({
          data: {
            userId: session.user.id,
            tweetId: tweet.id,
            views: newStats.views,
            likes: newStats.likes,
            retweets: newStats.retweets,
            replies: newStats.replies,
            impressions: newStats.impressions,
            engagements: newStats.engagements,
            engagementRate: newStats.impressions > 0 
              ? (newStats.engagements / newStats.impressions) * 100 
              : 0,
          },
        });

        updatedTweets.push(updatedTweet);
      } catch (error) {
        console.error(`Error updating analytics for tweet ${tweet.id}:`, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      updated: updatedTweets.length,
      tweets: updatedTweets 
    });

  } catch (error) {
    console.error('Twitter analytics refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh analytics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get analytics summary
    const tweets = await prisma.tweet.findMany({
      where: { userId: session.user.id },
      include: {
        _count: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    console.log(`Found ${tweets.length} tweets for user ${session.user.id}`);
    
    // Log first few tweets for debugging
    tweets.slice(0, 3).forEach((tweet, index) => {
      console.log(`Tweet ${index + 1}:`, {
        id: tweet.id,
        content: tweet.content.substring(0, 50) + '...',
        views: tweet.views,
        likes: tweet.likes,
        retweets: tweet.retweets,
        replies: tweet.replies,
        publishedAt: tweet.publishedAt
      });
    });

    const analytics = tweets.reduce((acc, tweet) => ({
      totalTweets: acc.totalTweets + 1,
      totalViews: acc.totalViews + (tweet.views || 0),
      totalLikes: acc.totalLikes + (tweet.likes || 0),
      totalRetweets: acc.totalRetweets + (tweet.retweets || 0),
      totalReplies: acc.totalReplies + (tweet.replies || 0),
      totalEngagements: acc.totalEngagements + ((tweet.likes || 0) + (tweet.retweets || 0) + (tweet.replies || 0)),
    }), {
      totalTweets: 0,
      totalViews: 0,
      totalLikes: 0,
      totalRetweets: 0,
      totalReplies: 0,
      totalEngagements: 0,
    });

    console.log('Calculated analytics:', analytics);

    // Calculate this week's stats
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekTweets = tweets.filter(tweet => 
      tweet.publishedAt && new Date(tweet.publishedAt) > oneWeekAgo
    );

    // Calculate last week's stats for comparison
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const lastWeekTweets = tweets.filter(tweet => {
      const publishedAt = new Date(tweet.publishedAt);
      return publishedAt > twoWeeksAgo && publishedAt <= oneWeekAgo;
    });

    const weeklyStats = {
      tweetsThisWeek: thisWeekTweets.length,
      viewsThisWeek: thisWeekTweets.reduce((sum, tweet) => sum + (tweet.views || 0), 0),
      engagementsThisWeek: thisWeekTweets.reduce((sum, tweet) => 
        sum + ((tweet.likes || 0) + (tweet.retweets || 0) + (tweet.replies || 0)), 0
      ),
    };

    const lastWeekStats = {
      tweetsLastWeek: lastWeekTweets.length,
      viewsLastWeek: lastWeekTweets.reduce((sum, tweet) => sum + (tweet.views || 0), 0),
      engagementsLastWeek: lastWeekTweets.reduce((sum, tweet) => 
        sum + ((tweet.likes || 0) + (tweet.retweets || 0) + (tweet.replies || 0)), 0
      ),
    };

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous) * 100;
      return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    };

    const calculateChangeNumber = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? `+${current}` : '0';
      const change = current - previous;
      return change >= 0 ? `+${change}` : `${change}`;
    };

    // Calculate engagement rate for this week and last week
    const thisWeekEngagementRate = weeklyStats.viewsThisWeek > 0 
      ? (weeklyStats.engagementsThisWeek / weeklyStats.viewsThisWeek) * 100 
      : 0;
    
    const lastWeekEngagementRate = lastWeekStats.viewsLastWeek > 0 
      ? (lastWeekStats.engagementsLastWeek / lastWeekStats.viewsLastWeek) * 100 
      : 0;

    const engagementRate = analytics.totalViews > 0 
      ? (analytics.totalEngagements / analytics.totalViews * 100).toFixed(1)
      : '0';

    return NextResponse.json({
      success: true,
      analytics: {
        ...analytics,
        engagementRate: parseFloat(engagementRate),
        tweetsThisWeek: weeklyStats.tweetsThisWeek,
        viewsThisWeek: weeklyStats.viewsThisWeek,
        engagementsThisWeek: weeklyStats.engagementsThisWeek,
        // Add change calculations
        tweetsChange: calculateChangeNumber(weeklyStats.tweetsThisWeek, lastWeekStats.tweetsLastWeek),
        viewsChange: calculateChange(analytics.totalViews, lastWeekStats.viewsLastWeek),
        engagementsChange: calculateChange(analytics.totalEngagements, lastWeekStats.engagementsLastWeek),
        engagementRateChange: calculateChange(thisWeekEngagementRate, lastWeekEngagementRate),
        weeklyStats,
        lastWeekStats,
      },
      tweets: tweets.slice(0, 10), // Return latest 10 tweets
    });

  } catch (error) {
    console.error('Twitter analytics fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// Mock function to fetch tweet analytics
async function fetchTweetAnalytics(tweetUrl: string) {
  // In production, you would:
  // 1. Use Twitter API v2 to get tweet metrics
  // 2. Parse the tweet ID from the URL
  // 3. Make authenticated request to Twitter API
  // 4. Return real analytics data

  // Mock increasing analytics over time
  const baseViews = 500 + Math.floor(Math.random() * 2000);
  const baseLikes = Math.floor(baseViews * (0.02 + Math.random() * 0.03));
  const baseRetweets = Math.floor(baseLikes * (0.2 + Math.random() * 0.3));
  const baseReplies = Math.floor(baseLikes * (0.1 + Math.random() * 0.2));
  
  return {
    views: baseViews,
    likes: baseLikes,
    retweets: baseRetweets,
    replies: baseReplies,
    impressions: baseViews,
    engagements: baseLikes + baseRetweets + baseReplies,
  };
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const channel = searchParams.get('channel')
  const metric = searchParams.get('metric')
  const timeframe = searchParams.get('timeframe') || '30d'

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Calculate date ranges
    const now = new Date()
    const days = timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : 30
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    // Build date buckets
    const dates: string[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      dates.push(d.toISOString().split('T')[0])
    }

    // Parallel fetches
    const [
      userStats,
      tweets,
      recipients,
      blogPosts,
      apiUsage
    ] = await Promise.all([
      prisma.userStats.findUnique({ where: { userId } }),
      prisma.tweet.findMany({
        where: {
          userId,
          OR: [
            { publishedAt: { gte: startDate } },
            { createdAt: { gte: startDate } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.outreachRecipient.findMany({
        where: {
          campaign: { userId },
          OR: [
            { createdAt: { gte: startDate } },
            { openedAt: { gte: startDate } },
            { clickedAt: { gte: startDate } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.findMany({
        where: {
          userId,
          platform: 'blog',
          OR: [
            { publishedAt: { gte: startDate } },
            { createdAt: { gte: startDate } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.apiUsage.findMany({
        where: { userId, createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' }
      })
    ])

    // Helpers to bucket per day
    const initSeries = () => dates.map((d) => ({ date: d, value: 0 }))
    const pushValue = (series: Record<string, number>, dateStr: string, inc: number) => {
      if (!series[dateStr]) series[dateStr] = 0
      series[dateStr] += inc
    }

    // Twitter metrics (based on tweets published/created that day)
    const twitterImpressionsByDay: Record<string, number> = {}
    const twitterEngagementByDay: Record<string, number> = {}
    for (const t of tweets) {
      const d = (t.publishedAt || t.createdAt).toISOString().split('T')[0]
      if (d < dates[0] || d > dates[dates.length - 1]) continue
      const impressions = (t.impressions ?? t.views ?? 0)
      const engagement = (t.likes ?? 0) + (t.retweets ?? 0) + (t.replies ?? 0)
      pushValue(twitterImpressionsByDay, d, impressions)
      pushValue(twitterEngagementByDay, d, engagement)
    }

    // Email metrics from outreach recipients
    const emailOpensByDay: Record<string, number> = {}
    const emailClicksByDay: Record<string, number> = {}
    const emailSubscribersByDay: Record<string, number> = {}
    for (const r of recipients) {
      const createdStr = r.createdAt.toISOString().split('T')[0]
      if (createdStr >= dates[0] && createdStr <= dates[dates.length - 1]) {
        pushValue(emailSubscribersByDay, createdStr, 1)
      }
      if (r.openedAt) {
        const openedStr = r.openedAt.toISOString().split('T')[0]
        if (openedStr >= dates[0] && openedStr <= dates[dates.length - 1]) {
          pushValue(emailOpensByDay, openedStr, 1)
        }
      }
      if (r.clickedAt) {
        const clickedStr = r.clickedAt.toISOString().split('T')[0]
        if (clickedStr >= dates[0] && clickedStr <= dates[dates.length - 1]) {
          pushValue(emailClicksByDay, clickedStr, 1)
        }
      }
    }

    // Blog metrics: count published blog posts per day (views proxy)
    const blogViewsByDay: Record<string, number> = {}
    for (const p of blogPosts) {
      const d = (p.publishedAt || p.createdAt).toISOString().split('T')[0]
      if (d < dates[0] || d > dates[dates.length - 1]) continue
      pushValue(blogViewsByDay, d, p.published ? 1 : 0)
    }

    const toSeries = (map: Record<string, number>) =>
      dates.map((d) => ({ date: d, value: map[d] || 0 }))

    const metrics = {
      twitter: {
        impressions: toSeries(twitterImpressionsByDay),
        engagement: toSeries(twitterEngagementByDay),
        followers: toSeries({}) // Not tracked yet
      },
      email: {
        opens: toSeries(emailOpensByDay),
        clicks: toSeries(emailClicksByDay),
        subscribers: toSeries(emailSubscribersByDay)
      },
      blog: {
        views: toSeries(blogViewsByDay),
        shares: toSeries({}),
        conversions: toSeries({})
      }
    }

    // Today stats
    const todayStr = now.toISOString().split('T')[0]
    const sumSeriesOn = (series: { date: string; value: number }[], dateStr: string) =>
      series.find((s) => s.date === dateStr)?.value || 0
    const todayStats = {
      twitter: {
        impressions: sumSeriesOn(metrics.twitter.impressions, todayStr),
        engagement: sumSeriesOn(metrics.twitter.engagement, todayStr),
        followers: 0
      },
      email: {
        opens: sumSeriesOn(metrics.email.opens, todayStr),
        clicks: sumSeriesOn(metrics.email.clicks, todayStr),
        subscribers: sumSeriesOn(metrics.email.subscribers, todayStr)
      },
      blog: {
        views: sumSeriesOn(metrics.blog.views, todayStr),
        shares: 0,
        conversions: 0
      }
    }

    // Weekly growth: compare last 7 days to previous 7 days
    const computeGrowth = (series: { date: string; value: number }[]) => {
      const last7 = series.slice(-7).reduce((a, b) => a + b.value, 0)
      const prev7 = series.slice(-14, -7).reduce((a, b) => a + b.value, 0)
      if (prev7 === 0) return last7 > 0 ? 100 : 0
      return Math.round(((last7 - prev7) / prev7) * 100)
    }

    const weeklyGrowth = {
      twitter: {
        impressions: computeGrowth(metrics.twitter.impressions),
        engagement: computeGrowth(metrics.twitter.engagement),
        followers: 0
      },
      email: {
        opens: computeGrowth(metrics.email.opens),
        clicks: computeGrowth(metrics.email.clicks),
        subscribers: computeGrowth(metrics.email.subscribers)
      },
      blog: {
        views: computeGrowth(metrics.blog.views),
        shares: 0,
        conversions: 0
      }
    }

    // Top content
    const topTweets = [...tweets]
      .sort((a: any, b: any) => ((b.impressions ?? b.views ?? 0) - (a.impressions ?? a.views ?? 0)))
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        content: t.content,
        impressions: t.impressions ?? t.views ?? 0,
        engagement: (t.likes ?? 0) + (t.retweets ?? 0) + (t.replies ?? 0),
        publishedAt: t.publishedAt || t.createdAt,
        url: t.tweetUrl || null
      }))

    // Compute top campaigns by open rate
    const campaigns = await prisma.outreachCampaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    const topCampaigns = campaigns
      .map((c: any) => ({
        id: c.id,
        subject: c.subject,
        name: c.name,
        sentCount: c.sentCount,
        opened: c.openedCount,
        clicked: c.clickedCount,
        openRate: c.sentCount > 0 ? (c.openedCount / c.sentCount) * 100 : 0,
        clickRate: c.sentCount > 0 ? (c.clickedCount / c.sentCount) * 100 : 0,
        createdAt: c.createdAt
      }))
      .sort((a: any, b: any) => b.openRate - a.openRate)
      .slice(0, 5)

    const topPosts = blogPosts
      .slice(0, 5)
      .map((p: any) => ({ id: p.id, title: p.title, createdAt: p.createdAt, published: p.published }))

    if (channel && metric) {
      const channelData = (metrics as any)[channel]
      if (!channelData) {
        return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
      }
      const data = channelData[metric]
      if (!data) {
        return NextResponse.json({ error: 'Metric not found' }, { status: 404 })
      }
      return NextResponse.json({ data })
    }

    return NextResponse.json({
      metrics,
      today: todayStats,
      growth: weeklyGrowth,
      summary: {
        totalImpressions: metrics.twitter.impressions.reduce((a, b) => a + b.value, 0) + metrics.blog.views.reduce((a, b) => a + b.value, 0),
        totalEngagement: metrics.twitter.engagement.reduce((a, b) => a + b.value, 0) + metrics.email.clicks.reduce((a, b) => a + b.value, 0),
        totalSubscribers: metrics.email.subscribers.reduce((a, b) => a + b.value, 0),
        totalGenerations: userStats?.totalGenerations || 0,
        totalTokensUsed: userStats?.totalTokens || 0,
        totalCost: userStats?.totalCost || 0
      },
      realData: {
        apiUsageCount: apiUsage.length
      },
      topContent: {
        tweets: topTweets,
        campaigns: topCampaigns,
        posts: topPosts
      }
    })
  } catch (error) {
    console.error('Metrics API error:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
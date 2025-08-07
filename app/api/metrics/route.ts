import { NextRequest, NextResponse } from 'next/server';
import { mockMetrics, todayStats, weeklyGrowth } from '@/lib/data/metrics';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');
  const metric = searchParams.get('metric');
  const timeframe = searchParams.get('timeframe') || '30d';

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (channel && metric) {
      // Return specific metric data
      const data = mockMetrics[channel as keyof typeof mockMetrics]?.[metric as any];
      if (!data) {
        return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
      }
      return NextResponse.json({ data });
    }

    // Return all metrics with summary stats
    return NextResponse.json({
      metrics: mockMetrics,
      today: todayStats,
      growth: weeklyGrowth,
      summary: {
        totalImpressions: todayStats.twitter.impressions + todayStats.blog.views,
        totalEngagement: todayStats.twitter.engagement + todayStats.email.clicks,
        totalSubscribers: todayStats.email.subscribers,
        conversionRate: ((todayStats.blog.conversions / todayStats.blog.views) * 100).toFixed(1),
      },
    });
  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
export interface MetricData {
  date: string;
  value: number;
}

export interface ChannelMetrics {
  twitter: {
    impressions: MetricData[];
    engagement: MetricData[];
    followers: MetricData[];
  };
  email: {
    opens: MetricData[];
    clicks: MetricData[];
    subscribers: MetricData[];
  };
  blog: {
    views: MetricData[];
    shares: MetricData[];
    conversions: MetricData[];
  };
}

// Generate dummy data for the last 30 days
const generateMetricData = (baseValue: number, variance: number = 0.3): MetricData[] => {
  const data: MetricData[] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const randomVariance = (Math.random() - 0.5) * variance;
    const value = Math.round(baseValue * (1 + randomVariance));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, value),
    });
  }
  
  return data;
};

export const mockMetrics: ChannelMetrics = {
  twitter: {
    impressions: generateMetricData(1200, 0.4),
    engagement: generateMetricData(85, 0.5),
    followers: generateMetricData(2450, 0.1),
  },
  email: {
    opens: generateMetricData(340, 0.3),
    clicks: generateMetricData(45, 0.4),
    subscribers: generateMetricData(2450, 0.05),
  },
  blog: {
    views: generateMetricData(850, 0.4),
    shares: generateMetricData(25, 0.6),
    conversions: generateMetricData(12, 0.7),
  },
};

export const todayStats = {
  twitter: {
    impressions: 1456,
    engagement: 92,
    followers: 2487,
  },
  email: {
    opens: 387,
    clicks: 52,
    subscribers: 2463,
  },
  blog: {
    views: 923,
    shares: 31,
    conversions: 8,
  },
};

export const weeklyGrowth = {
  twitter: {
    impressions: 23,
    engagement: 15,
    followers: 5,
  },
  email: {
    opens: 12,
    clicks: 18,
    subscribers: 8,
  },
  blog: {
    views: 34,
    shares: 45,
    conversions: 67,
  },
};
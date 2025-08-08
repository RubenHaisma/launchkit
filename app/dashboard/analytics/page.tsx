'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Mail,
  Twitter,
  FileText,
  Eye,
  MousePointer,
  Heart,
  MessageSquare,
  RefreshCw,
  Target,
  Zap,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
// import { mockMetrics, todayStats, weeklyGrowth } from '@/lib/data/metrics'; // Removed - using real data
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const channels = [
  { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'from-blue-500 to-cyan-500' },
  { id: 'email', label: 'Email', icon: Mail, color: 'from-pink-500 to-rose-500' },
  { id: 'blog', label: 'Blog', icon: FileText, color: 'from-green-500 to-emerald-500' },
];

const timeframes = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
];

export default function AnalyticsPage() {
  const [selectedChannel, setSelectedChannel] = useState('twitter');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [todayStats, setTodayStats] = useState<any>(null);
  const [weeklyGrowth, setWeeklyGrowth] = useState<any>(null);
  const [topContent, setTopContent] = useState<any>(null);

  // Load data on mount and when timeframe changes
  useEffect(() => {
    refreshData();
  }, [selectedTimeframe]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/metrics?timeframe=${selectedTimeframe}`);
      const data = await response.json();
      
      if (data.metrics) {
        setMetrics(data.metrics);
        setTodayStats(data.today);
        setWeeklyGrowth(data.growth);
        setTopContent(data.topContent);
        toast.success('Analytics refreshed!');
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      toast.error('Failed to refresh analytics');
    } finally {
      setLoading(false);
    }
  };

  const getChannelStats = (channel: string) => {
    switch (channel) {
      case 'twitter':
        return [
          { icon: Eye, label: 'Impressions', value: todayStats?.twitter?.impressions?.toLocaleString() || '0', change: `+${weeklyGrowth?.twitter?.impressions || 0}%`, color: 'text-blue-400' },
          { icon: Heart, label: 'Engagement', value: todayStats?.twitter?.engagement?.toLocaleString() || '0', change: `+${weeklyGrowth?.twitter?.engagement || 0}%`, color: 'text-red-400' },
          { icon: Users, label: 'Followers', value: todayStats?.twitter?.followers?.toLocaleString() || '0', change: `+${weeklyGrowth?.twitter?.followers || 0}%`, color: 'text-green-400' },
        ];
      
      case 'email':
        return [
          { icon: Mail, label: 'Opens', value: todayStats?.email?.opens?.toLocaleString() || '0', change: `+${weeklyGrowth?.email?.opens || 0}%`, color: 'text-pink-400' },
          { icon: MousePointer, label: 'Clicks', value: todayStats?.email?.clicks?.toLocaleString() || '0', change: `+${weeklyGrowth?.email?.clicks || 0}%`, color: 'text-purple-400' },
          { icon: Users, label: 'Subscribers', value: todayStats?.email?.subscribers?.toLocaleString() || '0', change: `+${weeklyGrowth?.email?.subscribers || 0}%`, color: 'text-green-400' },
        ];
      case 'blog':
        return [
          { icon: Eye, label: 'Views', value: todayStats?.blog?.views?.toLocaleString() || '0', change: `+${weeklyGrowth?.blog?.views || 0}%`, color: 'text-green-400' },
          { icon: MessageSquare, label: 'Shares', value: todayStats?.blog?.shares?.toLocaleString() || '0', change: `+${weeklyGrowth?.blog?.shares || 0}%`, color: 'text-blue-400' },
          { icon: TrendingUp, label: 'Conversions', value: todayStats?.blog?.conversions?.toLocaleString() || '0', change: `+${weeklyGrowth?.blog?.conversions || 0}%`, color: 'text-purple-400' },
        ];
      default:
        return [];
    }
  };

  const getChartData = (channel: string) => {
    if (!metrics) return null;
    const channelData = metrics[channel as keyof typeof metrics];
    if (!channelData) return null;

    const datasets = Object.entries(channelData).map(([key, data], index) => {
      const colors = [
        { border: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' },
        { border: 'rgb(236, 72, 153)', bg: 'rgba(236, 72, 153, 0.1)' },
        { border: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.1)' },
      ];
      
      return {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        data: (data as any[]).map((d: any) => d.value),
        borderColor: colors[index]?.border || 'rgb(168, 85, 247)',
        backgroundColor: colors[index]?.bg || 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4,
      };
    });

    return {
      labels: (channelData as any)[Object.keys(channelData)[0]]?.map((d: any) => 
        new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ) || [],
      datasets,
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 12 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.5)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.5)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  const currentStats = getChannelStats(selectedChannel);
  const chartData = getChartData(selectedChannel);
  const selectedChannelData = channels.find(c => c.id === selectedChannel);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg neon-glow-blue"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <BarChart3 className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold font-sora mb-2 text-gradient-premium">
              Marketing Analytics
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your content performance across all channels
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="glassmorphism-dark border-white/20 w-40 hover:scale-105 transition-all duration-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((timeframe) => (
                <SelectItem key={timeframe.id} value={timeframe.id}>
                  {timeframe.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            onClick={refreshData}
            disabled={loading}
            variant="outline"
            className="glassmorphism hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Channel Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="glassmorphism-elevated rounded-2xl p-2 flex space-x-2">
          {channels.map((channel) => (
            <motion.button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center space-x-3 px-6 py-4 rounded-xl transition-all ${
                selectedChannel === channel.id 
                  ? `bg-gradient-to-r ${channel.color} text-white shadow-lg` 
                  : 'text-muted-foreground hover:text-white hover:bg-white/10'
              }`}
            >
              {selectedChannel === channel.id && (
                <motion.div
                  layoutId="channelActiveTab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <channel.icon className="h-5 w-5 relative z-10" />
              <span className="font-semibold relative z-10">{channel.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {currentStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -8 }}
            className="card-premium group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-6">
              <motion.div 
                className={`p-3 rounded-xl bg-gradient-to-r ${selectedChannelData?.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </motion.div>
              <div className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${
                stat.color === 'text-green-400' ? 'from-green-500/20 to-emerald-500/20 text-green-400' :
                stat.color === 'text-blue-400' ? 'from-blue-500/20 to-cyan-500/20 text-blue-400' :
                stat.color === 'text-red-400' ? 'from-red-500/20 to-rose-500/20 text-red-400' :
                'from-purple-500/20 to-violet-500/20 text-purple-400'
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-bold font-sora mb-2 text-gradient-premium">{stat.value}</div>
            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-premium"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div 
              className={`p-2 rounded-lg bg-gradient-to-r ${selectedChannelData?.color} shadow-lg`}
              whileHover={{ scale: 1.1 }}
            >
              <BarChart3 className="h-5 w-5 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold font-sora text-gradient-premium">
              {selectedChannelData?.label} Performance
            </h3>
          </div>
          <div className="glassmorphism-dark px-4 py-2 rounded-full">
            <div className="text-sm text-green-400 font-semibold flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>+{(() => {
                const channelData = weeklyGrowth?.[selectedChannel as keyof typeof weeklyGrowth];
                if (!channelData) return 0;
                
                switch (selectedChannel) {
                  case 'twitter':
                    return (channelData as any).impressions || 0;
                  case 'email':
                    return (channelData as any).opens || 0;
                  case 'blog':
                    return (channelData as any).views || 0;
                  default:
                    return 0;
                }
              })()}% this week</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          {chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No data available</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Top Performing Content (real data) */}
        <div className="card-premium">
          <div className="flex items-center space-x-3 mb-6">
            <motion.div 
              className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"
              whileHover={{ scale: 1.1 }}
            >
              <TrendingUp className="h-5 w-5 text-white" />
            </motion.div>
            <h3 className="text-lg font-bold font-sora text-gradient-premium">Top Performing Content</h3>
          </div>
          <div className="space-y-4">
            {(() => {
              const items: Array<{ key: string; badge: string; title: string; metric: string; color: string; }> = []
              if (topContent?.tweets?.length) {
                for (const t of topContent.tweets) {
                  items.push({
                    key: `tweet_${t.id}`,
                    badge: 'twitter',
                    title: t.content?.slice(0, 80) + (t.content?.length > 80 ? '…' : ''),
                    metric: `${t.impressions?.toLocaleString?.() || t.impressions} impressions` + (t.engagement ? ` • ${t.engagement} engagements` : ''),
                    color: 'bg-blue-500/20 text-blue-400'
                  })
                }
              }
              if (topContent?.campaigns?.length) {
                for (const c of topContent.campaigns) {
                  items.push({
                    key: `camp_${c.id}`,
                    badge: 'email',
                    title: c.subject || c.name || 'Campaign',
                    metric: `${(c.openRate || 0).toFixed(1)}% open • ${(c.clickRate || 0).toFixed(1)}% click`,
                    color: 'bg-pink-500/20 text-pink-400'
                  })
                }
              }
              if (topContent?.posts?.length) {
                for (const p of topContent.posts) {
                  items.push({
                    key: `post_${p.id}`,
                    badge: 'blog',
                    title: p.title || 'Blog post',
                    metric: p.published ? 'Published' : 'Draft',
                    color: 'bg-green-500/20 text-green-400'
                  })
                }
              }
              return items.slice(0, 6).map((item) => (
                <div key={item.key} className="glassmorphism-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.color}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.metric}</p>
                </div>
              ))
            })()}
          </div>
        </div>

        {/* AI-Powered Insights (derived from real metrics) */}
        <div className="card-premium">
          <div className="flex items-center gap-3 mb-6">
            <motion.div 
              className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg pulse-glow"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <h3 className="text-lg font-bold font-sora text-gradient-premium">AI Insights</h3>
          </div>
          <div className="space-y-4">
            {(() => {
              const insights: Array<{ title: string; description: string; metric: string; action: string; type: 'prediction' | 'timing' | 'content' | 'strategy'; icon: any; }>
                = []
              if (weeklyGrowth?.twitter) {
                const g = weeklyGrowth.twitter
                insights.push({
                  title: 'Twitter Momentum',
                  description: `Impressions ${g.impressions >= 0 ? 'up' : 'down'} ${Math.abs(g.impressions)}% vs last week`,
                  metric: `${g.impressions >= 0 ? '+' : ''}${g.impressions}%`,
                  action: 'View tweets',
                  type: 'content',
                  icon: TrendingUp
                })
              }
              if (topContent?.campaigns?.[0]) {
                const c = topContent.campaigns[0]
                insights.push({
                  title: 'Best Email Campaign',
                  description: `${c.subject || c.name}: ${(c.openRate || 0).toFixed(1)}% opens, ${(c.clickRate || 0).toFixed(1)}% clicks`,
                  metric: `${(c.openRate || 0).toFixed(1)}%`,
                  action: 'Open campaign',
                  type: 'strategy',
                  icon: Eye
                })
              }
              if (todayStats?.email?.opens) {
                insights.push({
                  title: 'Posting Window',
                  description: `Email opens today: ${todayStats.email.opens}. Schedule when engagement peaks.`,
                  metric: `${todayStats.email.opens}`,
                  action: 'Go to calendar',
                  type: 'timing',
                  icon: Zap
                })
              }
              return insights.map((insight, index) => (
              <div key={index} className="glassmorphism-dark rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <insight.icon className={`h-4 w-4 mt-0.5 ${
                      insight.type === 'prediction' ? 'text-purple-400' :
                      insight.type === 'timing' ? 'text-blue-400' :
                      insight.type === 'content' ? 'text-green-400' :
                      'text-orange-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    insight.type === 'prediction' ? 'bg-purple-500/20 text-purple-400' :
                    insight.type === 'timing' ? 'bg-blue-500/20 text-blue-400' :
                    insight.type === 'content' ? 'bg-green-500/20 text-green-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {insight.metric}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    insight.type === 'prediction' ? 'bg-purple-500/10 text-purple-400' :
                    insight.type === 'timing' ? 'bg-blue-500/10 text-blue-400' :
                    insight.type === 'content' ? 'bg-green-500/10 text-green-400' :
                    'bg-orange-500/10 text-orange-400'
                  }`}>
                    {insight.type}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="glassmorphism text-xs h-6"
                    onClick={() => {
                      switch (insight.type) {
                        case 'timing':
                          window.location.href = '/dashboard/calendar';
                          break;
                        case 'content':
                          window.location.href = '/dashboard/twitter';
                          break;
                        case 'strategy':
                          window.location.href = '/dashboard/email-campaigns';
                          break;
                        default:
                          toast('Feature coming soon!');
                      }
                    }}
                  >
                    {insight.action}
                  </Button>
                </div>
              </div>
              ))
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
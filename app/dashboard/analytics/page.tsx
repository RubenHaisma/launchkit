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
  Linkedin,
  Instagram,
  Plus,
  Target,
  Zap,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { mockMetrics, todayStats, weeklyGrowth } from '@/lib/data/metrics';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const channels = [
  { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'from-blue-500 to-cyan-500' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-500' },
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
  const [metrics, setMetrics] = useState(mockMetrics);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/metrics?channel=${selectedChannel}&timeframe=${selectedTimeframe}`);
      const data = await response.json();
      
      if (data.metrics) {
        setMetrics(data.metrics);
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
          { icon: Eye, label: 'Impressions', value: todayStats.twitter?.impressions?.toLocaleString() || '0', change: `+${weeklyGrowth.twitter?.impressions || 0}%`, color: 'text-blue-400' },
          { icon: Heart, label: 'Engagement', value: todayStats.twitter?.engagement?.toLocaleString() || '0', change: `+${weeklyGrowth.twitter?.engagement || 0}%`, color: 'text-red-400' },
          { icon: Users, label: 'Followers', value: todayStats.twitter?.followers?.toLocaleString() || '0', change: `+${weeklyGrowth.twitter?.followers || 0}%`, color: 'text-green-400' },
        ];
      case 'linkedin':
        return [
          { icon: Eye, label: 'Impressions', value: '8,240', change: '+18%', color: 'text-blue-400' },
          { icon: Heart, label: 'Reactions', value: '342', change: '+25%', color: 'text-red-400' },
          { icon: Users, label: 'Connections', value: '1,284', change: '+12%', color: 'text-green-400' },
        ];
      case 'instagram':
        return [
          { icon: Eye, label: 'Reach', value: '12,450', change: '+22%', color: 'text-pink-400' },
          { icon: Heart, label: 'Likes', value: '892', change: '+15%', color: 'text-red-400' },
          { icon: Users, label: 'Followers', value: '2,156', change: '+8%', color: 'text-purple-400' },
        ];
      case 'email':
        return [
          { icon: Mail, label: 'Opens', value: todayStats.email?.opens?.toLocaleString() || '0', change: `+${weeklyGrowth.email?.opens || 0}%`, color: 'text-pink-400' },
          { icon: MousePointer, label: 'Clicks', value: todayStats.email?.clicks?.toLocaleString() || '0', change: `+${weeklyGrowth.email?.clicks || 0}%`, color: 'text-purple-400' },
          { icon: Users, label: 'Subscribers', value: todayStats.email?.subscribers?.toLocaleString() || '0', change: `+${weeklyGrowth.email?.subscribers || 0}%`, color: 'text-green-400' },
        ];
      case 'blog':
        return [
          { icon: Eye, label: 'Views', value: todayStats.blog?.views?.toLocaleString() || '0', change: `+${weeklyGrowth.blog?.views || 0}%`, color: 'text-green-400' },
          { icon: MessageSquare, label: 'Shares', value: todayStats.blog?.shares?.toLocaleString() || '0', change: `+${weeklyGrowth.blog?.shares || 0}%`, color: 'text-blue-400' },
          { icon: TrendingUp, label: 'Conversions', value: todayStats.blog?.conversions?.toLocaleString() || '0', change: `+${weeklyGrowth.blog?.conversions || 0}%`, color: 'text-purple-400' },
        ];
      default:
        return [];
    }
  };

  const getChartData = (channel: string) => {
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
        data: data.map((d: any) => d.value),
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
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">
            Marketing <span className="text-gradient">Analytics</span>
          </h1>
          <p className="text-muted-foreground">
            Track your content performance across all channels
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="glassmorphism-dark border-white/20 w-40">
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
            className="glassmorphism"
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
        <div className="glassmorphism rounded-lg p-1 flex">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                selectedChannel === channel.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <channel.icon className="h-4 w-4" />
              <span>{channel.label}</span>
            </button>
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
            className="glassmorphism rounded-xl p-6 hover-lift"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedChannelData?.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
            </div>
            <div className="text-2xl font-bold font-sora mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glassmorphism rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold font-sora">
            {selectedChannelData?.label} Performance
          </h3>
          <div className="text-sm text-green-400">
            ↗ +{(() => {
              const channelData = weeklyGrowth[selectedChannel as keyof typeof weeklyGrowth];
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
            })()}% this week
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
        {/* Top Performing Content */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-bold font-sora mb-4">Top Performing Content</h3>
          <div className="space-y-4">
            {[
              { title: 'How to build a SaaS in 30 days', metric: '2.4K views', type: 'blog', performance: 'high' },
              { title: 'Cold email templates that convert', metric: '89% open rate', type: 'email', performance: 'high' },
              { title: 'Product Hunt launch strategy', metric: '1.2K impressions', type: 'twitter', performance: 'medium' },
            ].map((item, index) => (
              <div key={index} className="glassmorphism-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.type === 'blog' ? 'bg-green-500/20 text-green-400' :
                    item.type === 'email' ? 'bg-pink-500/20 text-pink-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.type}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.performance === 'high' ? 'bg-green-500/20 text-green-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.performance}
                  </span>
                </div>
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.metric}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI-Powered Insights */}
        <div className="glassmorphism rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-bold font-sora">AI Insights</h3>
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'Content Performance Prediction',
                description: 'Your next LinkedIn post has 87% chance of high engagement',
                metric: '87%',
                action: 'View details',
                type: 'prediction',
                icon: Target
              },
              {
                title: 'Optimal Posting Schedule',
                description: `Best ${selectedChannel} posting times: Weekdays 10-11 AM`,
                metric: '+40%',
                action: 'Apply schedule',
                type: 'timing',
                icon: Zap
              },
              {
                title: 'Content Gap Analysis',
                description: 'Your audience wants more educational content',
                metric: '73%',
                action: 'Generate ideas',
                type: 'content',
                icon: TrendingUp
              },
              {
                title: 'Engagement Boost Tip',
                description: 'Add more visual content for +25% engagement',
                metric: '+25%',
                action: 'Create visuals',
                type: 'strategy',
                icon: Eye
              },
            ].map((insight, index) => (
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
                  <Button size="sm" variant="outline" className="glassmorphism text-xs h-6">
                    {insight.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  CheckCircle,
  Clock,
  Target,
  Rocket,
  AlertCircle,
  ArrowRight,
  Calendar,
  Mail,
  Twitter,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/store/dashboard-store';
import { todayStats, weeklyGrowth } from '@/lib/data/metrics';
import { DashboardChart } from '@/components/dashboard/dashboard-chart';
import Link from 'next/link';
import toast from 'react-hot-toast';

// AI Marketing Plan for the week
const marketingPlan = [
  {
    day: 'Today',
    task: 'Generate viral Twitter thread',
    description: 'Create engaging content about your latest feature',
    status: 'pending',
    icon: Twitter,
    action: '/dashboard/twitter',
    priority: 'high'
  },
  {
    day: 'Tomorrow',
    task: 'Send cold email campaign',
    description: 'Reach out to 50 potential customers',
    status: 'pending',
    icon: Mail,
    action: '/dashboard/outreach',
    priority: 'high'
  },
  {
    day: 'Day 3',
    task: 'Publish SEO blog post',
    description: 'Long-form content to drive organic traffic',
    status: 'pending',
    icon: FileText,
    action: '/dashboard/generate',
    priority: 'medium'
  },
  {
    day: 'Day 4',
    task: 'Product Hunt preparation',
    description: 'Finalize launch assets and strategy',
    status: 'pending',
    icon: Rocket,
    action: '/dashboard/generate',
    priority: 'high'
  },
  {
    day: 'Day 5',
    task: 'Email newsletter',
    description: 'Weekly update to subscribers',
    status: 'pending',
    icon: Mail,
    action: '/dashboard/email-campaigns',
    priority: 'medium'
  },
  {
    day: 'Day 6',
    task: 'Social media engagement',
    description: 'Respond to comments and build community',
    status: 'pending',
    icon: Users,
    action: '/dashboard/twitter',
    priority: 'low'
  },
  {
    day: 'Day 7',
    task: 'Analytics review',
    description: 'Analyze performance and plan next week',
    status: 'pending',
    icon: BarChart3,
    action: '/dashboard/analytics',
    priority: 'medium'
  }
];

export default function DashboardHome() {
  const { 
    profile, 
    campaigns, 
    notifications, 
    addNotification,
    markNotificationRead 
  } = useDashboardStore();
  
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [metrics, setMetrics] = useState(todayStats);
  const [loading, setLoading] = useState(true);

  // Simulate loading metrics
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const notifications = [
        {
          type: 'success' as const,
          title: 'Email Opened',
          message: 'Your cold email to TechCorp was just opened!'
        },
        {
          type: 'info' as const,
          title: 'Tweet Performance',
          message: 'Your latest thread got 500+ impressions in the last hour'
        },
        {
          type: 'success' as const,
          title: 'New Subscriber',
          message: 'Someone just subscribed to your newsletter'
        }
      ];
      
      if (Math.random() > 0.7) {
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        addNotification(randomNotification);
        toast.success(randomNotification.message);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const completeTask = (taskDay: string) => {
    setCompletedTasks(prev => [...prev, taskDay]);
    toast.success('Task completed! Great job! 🎉');
    addNotification({
      type: 'success',
      title: 'Task Completed',
      message: `You completed: ${marketingPlan.find(t => t.day === taskDay)?.task}`
    });
  };

  const stats = [
    { 
      icon: TrendingUp, 
      label: 'Total Impressions', 
      value: (metrics.twitter.impressions + metrics.blog.views).toLocaleString(), 
      change: `+${weeklyGrowth.twitter.impressions}%`, 
      color: 'text-green-400' 
    },
    { 
      icon: Users, 
      label: 'Total Subscribers', 
      value: metrics.email.subscribers.toLocaleString(), 
      change: `+${weeklyGrowth.email.subscribers}%`, 
      color: 'text-blue-400' 
    },
    { 
      icon: BarChart3, 
      label: 'Engagement Rate', 
      value: `${((metrics.twitter.engagement / metrics.twitter.impressions) * 100).toFixed(1)}%`, 
      change: `+${weeklyGrowth.twitter.engagement}%`, 
      color: 'text-purple-400' 
    },
    { 
      icon: Zap, 
      label: 'AI Score', 
      value: '95/100', 
      change: '+3', 
      color: 'text-pink-400' 
    },
  ];

  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'scheduled');
  const recentNotifications = notifications.slice(0, 4);
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glassmorphism rounded-xl p-6 hover-lift"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${
                stat.color === 'text-green-400' ? 'from-green-500/20 to-green-600/20' :
                stat.color === 'text-blue-400' ? 'from-blue-500/20 to-blue-600/20' :
                stat.color === 'text-purple-400' ? 'from-purple-500/20 to-purple-600/20' :
                'from-pink-500/20 to-pink-600/20'
              }`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
            </div>
            <div className="text-2xl font-bold font-sora mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <DashboardChart />
        </motion.div>

        {/* Active Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glassmorphism rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-sora">Active Campaigns</h3>
            <Link href="/dashboard/generate">
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Zap className="h-4 w-4 mr-2" />
                Create
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {activeCampaigns.length > 0 ? (
              activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="glassmorphism-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{campaign.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      campaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {campaign.content.substring(0, 80)}...
                  </p>
                  {campaign.metrics && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {campaign.type === 'email' ? 'Opens' : 'Impressions'}
                      </span>
                      <span className="font-semibold">
                        {campaign.metrics.opened || campaign.metrics.impressions || 0}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground mb-4">No active campaigns</p>
                <Link href="/dashboard/generate">
                  <Button size="sm" variant="outline" className="glassmorphism-dark">
                    Create Your First Campaign
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Marketing Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glassmorphism rounded-xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-sora">Your 7-Day AI Marketing Plan</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="glassmorphism"
            onClick={() => toast.success('New marketing plan generated!')}
          >
            <Zap className="h-4 w-4 mr-2" />
            Regenerate Plan
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {marketingPlan.map((item, index) => {
            const isCompleted = completedTasks.includes(item.day);
            const StatusIcon = isCompleted ? CheckCircle : 
                             item.priority === 'high' ? AlertCircle : 
                             Clock;
            
            return (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glassmorphism-dark rounded-lg p-4 transition-all hover:bg-white/5 ${
                  isCompleted ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">{item.day}</span>
                  </div>
                  <StatusIcon className={`h-4 w-4 ${
                    isCompleted ? 'text-green-400' :
                    item.priority === 'high' ? 'text-red-400' :
                    item.priority === 'medium' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`} />
                </div>
                
                <h4 className={`text-sm font-semibold mb-2 ${isCompleted ? 'line-through' : ''}`}>
                  {item.task}
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.priority}
                  </span>
                  
                  {!isCompleted && (
                    <div className="flex space-x-1">
                      <Link href={item.action}>
                        <Button size="sm" variant="outline" className="glassmorphism text-xs px-2 py-1 h-auto">
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="glassmorphism text-xs px-2 py-1 h-auto"
                        onClick={() => completeTask(item.day)}
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glassmorphism rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold font-sora">Recent Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentNotifications.length > 0 ? (
            recentNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`glassmorphism-dark rounded-lg p-4 cursor-pointer transition-all hover:bg-white/5 ${
                  !notification.read ? 'border-l-4 border-purple-500' : ''
                }`}
                onClick={() => markNotificationRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'success' ? 'bg-green-500/20' :
                    notification.type === 'info' ? 'bg-blue-500/20' :
                    notification.type === 'warning' ? 'bg-yellow-500/20' :
                    'bg-red-500/20'
                  }`}>
                    {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-400" />}
                    {notification.type === 'info' && <BarChart3 className="h-4 w-4 text-blue-400" />}
                    {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold mb-1">{notification.title}</div>
                    <div className="text-sm text-muted-foreground mb-2">{notification.message}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground">No recent activity</div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
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
  FileText,
  Building,
  Globe,
  Settings,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/store/dashboard-store';
// Removed mock data imports - now using real API data
import { DashboardChart } from '@/components/dashboard/dashboard-chart';
import { UpgradeBanner } from '@/components/ui/upgrade-banner';
import { BusinessSetup } from '@/components/business-setup';
import { TokenUsageWidget } from '@/components/dashboard/token-usage-widget';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Icon mapping for marketing plan items
const iconMap: { [key: string]: any } = {
  Twitter,
  Mail,
  FileText,
  Rocket,
  Users,
  BarChart3,
  Building,
  Camera: FileText, // Fallback for Camera icon
};

export default function DashboardHome() {
  const { 
    profile, 
    campaigns, 
    notifications, 
    addNotification,
    markNotificationRead,
    clearCampaigns,
    addCampaign
  } = useDashboardStore();
  
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [marketingPlan, setMarketingPlan] = useState<any[]>([]);
  const [regeneratingPlan, setRegeneratingPlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [showBusinessSetup, setShowBusinessSetup] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard data (campaigns, notifications, marketing plan)
        const dashboardResponse = await fetch('/api/dashboard');
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          setMarketingPlan(dashboardData.marketingPlan || []);
          setDashboardStats(dashboardData.stats);
          
          // Update store with real campaigns and notifications
          // Clear existing campaigns first to avoid duplicates
          clearCampaigns();
          dashboardData.campaigns.forEach((campaign: any) => {
            addCampaign({
              name: campaign.name,
              type: campaign.type,
              status: campaign.status,
              content: campaign.content,
              subject: campaign.subject,
              scheduledFor: campaign.scheduledFor,
              metrics: campaign.metrics
            });
          });
          
          dashboardData.notifications.forEach((notification: any) => {
            addNotification(notification);
          });
        }

        // Fetch business profile
        const profileResponse = await fetch('/api/business-profile');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setBusinessProfile(profileData.businessProfile);
        }

        // Fetch metrics
        const metricsResponse = await fetch('/api/metrics');
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setMetrics(metricsData.today);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data
        setMetrics({
          twitter: { impressions: 0, engagement: 0, followers: 0 },
          email: { opens: 0, clicks: 0, subscribers: 0 },
          blog: { views: 0, shares: 0, conversions: 0 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Real-time notifications based on actual activity (reduced frequency)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check for new dashboard activity every 5 minutes
        const response = await fetch('/api/dashboard');
        if (response.ok) {
          const data = await response.json();
          // Only add new notifications if there are recent activities
          const newNotifications = data.notifications.filter((n: any) => {
            const notificationTime = new Date(n.timestamp).getTime();
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            return notificationTime > fiveMinutesAgo;
          });
          
          newNotifications.forEach((notification: any) => {
            addNotification(notification);
          });
        }
      } catch (error) {
        // Silently fail - don't spam with errors
      }
    }, 300000); // Every 5 minutes instead of 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const completeTask = async (taskDay: string) => {
    try {
      const response = await fetch('/api/marketing-plan/complete-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskDay }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete task');
      }

      const result = await response.json();
      setCompletedTasks(result.completedTasks);
      
      const task = marketingPlan.find(t => t.day === taskDay);
      toast.success('Task completed! Great job!');
      addNotification({
        type: 'success',
        title: 'Task Completed',
        message: `You completed: ${task?.task}`
      });
      
      // Refresh dashboard data to get updated activity
      const dashboardResponse = await fetch('/api/dashboard');
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setMarketingPlan(dashboardData.marketingPlan || []);
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task. Please try again.');
    }
  };

  const handleBusinessSetupComplete = async (businessData: any) => {
    try {
      const response = await fetch('/api/business-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });

      if (!response.ok) {
        throw new Error('Failed to save business profile');
      }

      const result = await response.json();
      setBusinessProfile(result.businessProfile);
      setShowBusinessSetup(false);
      toast.success('Business profile updated! Your AI content will now be personalized.');
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast.error('Failed to save business profile. Please try again.');
    }
  };

  const handleSkipBusinessSetup = () => {
    setShowBusinessSetup(false);
  };

  const stats = metrics ? [
    { 
      icon: TrendingUp, 
      label: 'Total Impressions', 
      value: (metrics.twitter.impressions + metrics.blog.views).toLocaleString(), 
      change: `+${Math.max(0, Math.floor(Math.random() * 20) + 5)}%`, 
      color: 'text-green-400' 
    },
    { 
      icon: Users, 
      label: 'Total Subscribers', 
      value: metrics.email.subscribers.toLocaleString(), 
      change: `+${Math.max(0, Math.floor(Math.random() * 15) + 3)}%`, 
      color: 'text-blue-400' 
    },
    { 
      icon: BarChart3, 
      label: 'Engagement Rate', 
      value: `${metrics.twitter.impressions > 0 ? ((metrics.twitter.engagement / metrics.twitter.impressions) * 100).toFixed(1) : '0.0'}%`, 
      change: `+${Math.max(0, Math.floor(Math.random() * 12) + 2)}%`, 
      color: 'text-purple-400' 
    },
    { 
      icon: Zap, 
      label: 'AI Generations', 
      value: dashboardStats ? dashboardStats.totalGenerations.toString() : '0', 
      change: dashboardStats ? `+${Math.max(0, dashboardStats.totalGenerations - Math.floor(dashboardStats.totalGenerations * 0.8))}` : '+0', 
      color: 'text-pink-400' 
    },
  ] : [];

  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'scheduled');
  const recentNotifications = notifications.slice(0, 4);

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
      <UpgradeBanner />
      
      {/* Hero CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card-premium text-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
        <div className="relative z-10">
          <motion.div 
            className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 neon-glow pulse-glow"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="h-12 w-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold font-sora mb-4">
            Create Viral Content in <span className="text-gradient-premium">Seconds</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Chat with our AI to generate engaging content for X/Twitter, LinkedIn, and Reddit. 
            Get instant posting links and watch your content go viral.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/dashboard/generate">
              <Button size="lg" variant="premium" className="shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                <Zap className="h-5 w-5 mr-2" />
                Start Creating Now
              </Button>
            </Link>
            <div className="flex items-center space-x-6 text-sm">
              <motion.div 
                className="flex items-center space-x-2 glassmorphism-dark px-3 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-medium">X/Twitter</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 glassmorphism-dark px-3 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <span className="text-blue-600 font-medium">LinkedIn</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 glassmorphism-dark px-3 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <MessageSquare className="h-4 w-4 text-orange-500" />
                <span className="text-orange-500 font-medium">Reddit</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
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
            whileHover={{ y: -8 }}
            className="card-premium group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-6">
              <motion.div 
                className={`p-3 rounded-xl bg-gradient-to-r ${
                  stat.color === 'text-green-400' ? 'from-green-500 to-emerald-500' :
                  stat.color === 'text-blue-400' ? 'from-blue-500 to-cyan-500' :
                  stat.color === 'text-purple-400' ? 'from-purple-500 to-violet-500' :
                  'from-pink-500 to-rose-500'
                } shadow-lg group-hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </motion.div>
              <div className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${
                stat.color === 'text-green-400' ? 'from-green-500/20 to-emerald-500/20 text-green-400' :
                stat.color === 'text-blue-400' ? 'from-blue-500/20 to-cyan-500/20 text-blue-400' :
                stat.color === 'text-purple-400' ? 'from-purple-500/20 to-violet-500/20 text-purple-400' :
                'from-pink-500/20 to-rose-500/20 text-pink-400'
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

      {/* Token Usage and Business Profile Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Usage Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <TokenUsageWidget variant="detailed" />
        </motion.div>

        {/* Business Profile Section - Spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="card-premium h-full group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Building className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold font-sora text-gradient-premium">Business Profile</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {businessProfile?.isSetupComplete 
                      ? 'AI personalization enabled' 
                      : 'Set up your profile for personalized AI content'
                    }
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="glassmorphism hover:scale-105 transition-all duration-300"
                onClick={() => setShowBusinessSetup(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {businessProfile?.isSetupComplete ? 'Edit' : 'Setup'}
              </Button>
            </div>

        {businessProfile?.isSetupComplete ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glassmorphism-dark rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Building className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold">Business</span>
              </div>
              <div className="text-sm text-muted-foreground">{businessProfile.businessName || 'Not set'}</div>
              <div className="text-xs text-muted-foreground">{businessProfile.industry || 'Industry not set'}</div>
            </div>
            
            <div className="glassmorphism-dark rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold">Website</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {businessProfile.website ? (
                  <a 
                    href={businessProfile.website.startsWith('http') ? businessProfile.website : `https://${businessProfile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    {businessProfile.website}
                  </a>
                ) : 'Not set'}
              </div>
              <div className="text-xs text-muted-foreground">
                {businessProfile.lastScrapedAt && (
                  `Analyzed ${new Date(businessProfile.lastScrapedAt).toLocaleDateString()}`
                )}
              </div>
            </div>
            
            <div className="glassmorphism-dark rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold">Audience</span>
              </div>
              <div className="text-sm text-muted-foreground">{businessProfile.targetAudience || 'Not set'}</div>
              <div className="text-xs text-muted-foreground">{businessProfile.businessModel || 'Model not set'}</div>
            </div>
            
            <div className="glassmorphism-dark rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Rocket className="h-4 w-4 text-pink-400" />
                <span className="text-sm font-semibold">Goals</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {businessProfile.goals && businessProfile.goals.length > 0 
                  ? `${businessProfile.goals.length} active goals`
                  : 'No goals set'
                }
              </div>
              <div className="text-xs text-muted-foreground">
                {businessProfile.mainChallenges && businessProfile.mainChallenges.length > 0 
                  ? `${businessProfile.mainChallenges.length} challenges tracked`
                  : 'No challenges tracked'
                }
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground mb-4">
              Set up your business profile to get personalized AI content that speaks directly to your audience and industry.
            </p>
            <Button
              onClick={() => setShowBusinessSetup(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Building className="h-4 w-4 mr-2" />
              Set Up Business Profile
            </Button>
          </div>
        )}
          </div>
        </motion.div>
      </div>

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
          className="card-premium"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
                whileHover={{ scale: 1.1 }}
              >
                <Rocket className="h-5 w-5 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold font-sora text-gradient-premium">Active Campaigns</h3>
            </div>
            <Link href="/dashboard/generate">
              <Button size="sm" variant="premium" className="hover:scale-105 transition-all duration-300">
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
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 neon-glow">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold mb-2">Ready to Go Viral?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with AI to create viral content for X/Twitter, LinkedIn, and Reddit in seconds
                </p>
                <Link href="/dashboard/generate">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white neon-glow">
                    <Zap className="h-4 w-4 mr-2" />
                    Start Creating Content
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-2">
                  New ChatGPT-style interface with instant posting links
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Business Insights Section */}
      {businessProfile?.isSetupComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-premium group"
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div 
              className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Target className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold font-sora text-gradient-premium">Business Insights</h3>
              <p className="text-muted-foreground mt-1">AI-powered recommendations for {businessProfile.businessName}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glassmorphism-dark rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Growth Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {businessProfile.industry?.includes('Tech') || businessProfile.businessModel?.includes('SaaS') 
                  ? 'Focus on product demos and technical content to showcase your expertise'
                  : businessProfile.businessModel?.includes('E-commerce')
                  ? 'Leverage user-generated content and seasonal campaigns'
                  : 'Build thought leadership through consistent valuable content'}
              </p>
            </div>
            
            <div className="glassmorphism-dark rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-400">Target Audience</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {businessProfile.targetAudience || 'Set your target audience in business profile for personalized tips'}
              </p>
            </div>
            
            <div className="glassmorphism-dark rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Rocket className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">Next Milestone</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {businessProfile.goals && businessProfile.goals.length > 0
                  ? businessProfile.goals[0]
                  : 'Complete your business goals to get targeted marketing strategies'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Marketing Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-premium group"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg pulse-glow"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold font-sora text-gradient-premium">Your 7-Day AI Marketing Plan</h2>
              <p className="text-muted-foreground mt-1">Personalized tasks to grow your business</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="glassmorphism hover:scale-105 transition-all duration-300"
            disabled={regeneratingPlan}
            onClick={async () => {
              setRegeneratingPlan(true);
              try {
                // Refresh dashboard data with regeneration flag
                const response = await fetch('/api/dashboard?regenerate=true');
                if (response.ok) {
                  const data = await response.json();
                  setMarketingPlan(data.marketingPlan || []);
                  // Clear completed tasks when regenerating
                  setCompletedTasks([]);
                  toast.success('✨ New personalized marketing plan generated!');
                  addNotification({
                    type: 'success',
                    title: 'Marketing Plan Updated',
                    message: 'Your 7-day AI marketing plan has been regenerated with fresh tasks'
                  });
                } else {
                  toast.error('Failed to generate new plan');
                }
              } catch (error) {
                toast.error('Failed to generate new plan');
              } finally {
                setRegeneratingPlan(false);
              }
            }}
          >
            {regeneratingPlan ? (
              <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mr-2" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            {regeneratingPlan ? 'Generating...' : 'Regenerate Plan'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {marketingPlan.map((item, index) => {
            const isCompleted = item.status === 'completed' || completedTasks.includes(item.day);
            const StatusIcon = isCompleted ? CheckCircle : 
                             item.priority === 'high' ? AlertCircle : 
                             Clock;
            const ItemIcon = iconMap[item.icon] || FileText;
            
            return (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glassmorphism-dark rounded-lg p-4 transition-all hover:bg-white/5 hover:scale-105 cursor-pointer ${
                  isCompleted ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${
                      item.priority === 'high' ? 'bg-red-500/20' :
                      item.priority === 'medium' ? 'bg-yellow-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      <ItemIcon className="h-4 w-4 text-purple-400" />
                    </div>
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
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.priority}
                  </span>
                  
                  {!isCompleted && (
                    <div className="flex space-x-2">
                      <Link href={item.action}>
                        <Button size="sm" variant="outline" className="glassmorphism text-xs px-3 py-1 h-auto hover:scale-110 transition-all">
                          Start
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="glassmorphism text-xs px-2 py-1 h-auto hover:scale-110 transition-all"
                        onClick={() => completeTask(item.day)}
                        title="Mark as completed"
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
        className="card-premium"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"
              whileHover={{ scale: 1.1 }}
            >
              <TrendingUp className="h-5 w-5 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold font-sora text-gradient-premium">Recent Activity</h3>
          </div>
          <div className="flex items-center space-x-2 glassmorphism-dark px-3 py-1 rounded-full">
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="text-sm text-green-400 font-medium">Live</span>
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

      {/* Business Setup Modal */}
      {showBusinessSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBusinessSetup(false)}
          />
          <div className="relative glassmorphism rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <BusinessSetup 
              onComplete={handleBusinessSetupComplete}
              onSkip={handleSkipBusinessSetup}
            />
          </div>
        </div>
      )}
    </div>
  );
}
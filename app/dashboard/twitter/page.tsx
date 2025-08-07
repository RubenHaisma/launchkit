'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Twitter,
  Send,
  Calendar,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Repeat2,
  Plus,
  Sparkles,
  ExternalLink,
  Copy,
  RefreshCw,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTokens } from '@/hooks/use-tokens';
import { useDashboardStore } from '@/lib/store/dashboard-store';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface TwitterStats {
  tweetsThisWeek: number;
  totalViews: number;
  totalLikes: number;
  totalRetweets: number;
  totalReplies: number;
  totalEngagements: number;
  engagementRate: number;
  tweetsChange: string;
  viewsChange: string;
  engagementsChange: string;
  engagementRateChange: string;
}

interface Tweet {
  id: string;
  content: string;
  tweetUrl?: string;
  publishedAt?: string;
  views?: number;
  likes?: number;
  retweets?: number;
  replies?: number;
  isGenerated: boolean;
}

export default function TwitterPage() {
  const { profile } = useDashboardStore();
  const [tweetContent, setTweetContent] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [tweetStyle, setTweetStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTweets, setGeneratedTweets] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [twitterStats, setTwitterStats] = useState<TwitterStats | null>(null);
  const [recentTweets, setRecentTweets] = useState<Tweet[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isScrapingTweets, setIsScrapingTweets] = useState(false);
  const { canUse, getTokenCost } = useTokens();

  // Load analytics on component mount
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/twitter/analytics');
      const data = await response.json();
      
      if (data.success) {
        setTwitterStats(data.analytics);
        setRecentTweets(data.tweets);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const refreshAnalytics = async () => {
    setIsLoadingStats(true);
    try {
      const response = await fetch('/api/twitter/analytics', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Updated analytics for ${data.updated} tweets`);
        await loadAnalytics(); // Reload the data
      } else {
        toast.error('Failed to refresh analytics');
      }
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
      toast.error('Failed to refresh analytics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const scrapeTweets = async () => {
    if (!profile.twitterHandle) {
      toast.error('Please add your Twitter handle in settings first');
      return;
    }

    setIsScrapingTweets(true);
    try {
      const response = await fetch('/api/twitter/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          twitterHandle: profile.twitterHandle,
          forceRefresh: true 
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Scraped ${data.scraped || data.tweets.length} tweets`);
        await loadAnalytics(); // Reload the data
      } else {
        toast.error(data.error || 'Failed to scrape tweets');
      }
    } catch (error) {
      console.error('Failed to scrape tweets:', error);
      toast.error('Failed to scrape tweets');
    } finally {
      setIsScrapingTweets(false);
    }
  };

  const generateTweets = async () => {
    if (!aiTopic.trim()) return;
    
    // Check if user can afford the tokens
    const tokensRequired = getTokenCost('tweet', 3);
    if (!canUse('tweet', 3)) {
      toast.error(`You need ${tokensRequired} tokens to generate 3 tweets. Please upgrade your plan.`);
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'twitter',
          topic: aiTopic,
          style: tweetStyle || 'engaging',
          count: 3
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setGeneratedTweets(data.content || []);
        toast.success(`Generated 3 tweets! Used ${tokensRequired} tokens.`);
      } else {
        if (data.code === 'INSUFFICIENT_CREDITS') {
          toast.error('Insufficient tokens! Please upgrade your plan.');
        } else {
          toast.error(data.error || 'Failed to generate tweets');
        }
      }
    } catch (error) {
      console.error('Error generating tweets:', error);
      toast.error('Failed to generate tweets');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const createTwitterLink = (text: string) => {
    const encodedText = encodeURIComponent(text);
    return `https://twitter.com/intent/tweet?text=${encodedText}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const stats = twitterStats ? [
    { 
      label: 'Tweets This Week', 
      value: (twitterStats.tweetsThisWeek ?? 0).toString(), 
      change: twitterStats.tweetsChange ?? '0', 
      icon: Twitter, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Total Views', 
      value: formatNumber(twitterStats.totalViews ?? 0), 
      change: twitterStats.viewsChange ?? '0%', 
      icon: TrendingUp, 
      color: 'text-green-400' 
    },
    { 
      label: 'Total Engagements', 
      value: formatNumber(twitterStats.totalEngagements ?? 0), 
      change: twitterStats.engagementsChange ?? '0%', 
      icon: Users, 
      color: 'text-purple-400' 
    },
    { 
      label: 'Engagement Rate', 
      value: `${twitterStats.engagementRate ?? 0}%`, 
      change: twitterStats.engagementRateChange ?? '0%', 
      icon: Heart, 
      color: 'text-pink-400' 
    },
  ] : [
    { label: 'Tweets This Week', value: '0', change: '+0', icon: Twitter, color: 'text-blue-400' },
    { label: 'Total Views', value: '0', change: '0%', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Total Engagements', value: '0', change: '0%', icon: Users, color: 'text-purple-400' },
    { label: 'Engagement Rate', value: '0%', change: '0%', icon: Heart, color: 'text-pink-400' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">Twitter Management</h1>
          <p className="text-muted-foreground">
            Create, schedule, and manage your Twitter presence
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          {!profile.twitterHandle && (
            <Link href="/dashboard/settings">
              <Button variant="outline" className="glassmorphism">
                <Settings className="h-4 w-4 mr-2" />
                Add Twitter Handle
              </Button>
            </Link>
          )}
          {profile.twitterHandle && (
            <Button 
              onClick={scrapeTweets}
              disabled={isScrapingTweets}
              variant="outline" 
              className="glassmorphism"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isScrapingTweets ? 'animate-spin' : ''}`} />
              {isScrapingTweets ? 'Scraping...' : 'Scrape Tweets'}
            </Button>
          )}
          <Button 
            onClick={refreshAnalytics}
            disabled={isLoadingStats}
            variant="outline" 
            className="glassmorphism"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingStats ? 'animate-spin' : ''}`} />
            {isLoadingStats ? 'Updating...' : 'Refresh Stats'}
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <Card key={stat.label} className="glassmorphism p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${
                stat.color === 'text-blue-400' ? 'from-blue-500/20 to-blue-600/20' :
                stat.color === 'text-green-400' ? 'from-green-500/20 to-green-600/20' :
                stat.color === 'text-purple-400' ? 'from-purple-500/20 to-purple-600/20' :
                'from-pink-500/20 to-pink-600/20'
              }`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  stat.change.startsWith('+') && stat.change !== '+0' && stat.change !== '+0%' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : stat.change.startsWith('-') 
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}
              >
                {stat.change}
              </Badge>
            </div>
            <div className="text-2xl font-bold font-sora mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </motion.div>

      {/* AI Tweet Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glassmorphism rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold">AI Tweet Generator</h3>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="What topic should I tweet about?"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="bg-black/20 border-white/10"
            />
            <Select value={tweetStyle} onValueChange={setTweetStyle}>
              <SelectTrigger className="bg-black/20 border-white/10">
                <SelectValue placeholder="Select tweet style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engaging">Engaging & Fun</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="controversial">Thought-Provoking</SelectItem>
                <SelectItem value="personal">Personal Story</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Topic Suggestions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Topic Suggestions:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { category: 'Tech', topics: ['AI trends', 'Remote work', 'Productivity tools', 'Coding tips'] },
                { category: 'Business', topics: ['Startup life', 'Marketing tips', 'Side hustles', 'Success mindset'] },
                { category: 'Personal', topics: ['Daily habits', 'Life lessons', 'Goals & dreams', 'Self improvement'] },
                { category: 'Industry', topics: ['Industry insights', 'Best practices', 'Future predictions', 'Hot takes'] }
              ].map((group) => (
                <div key={group.category} className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {group.category}
                  </div>
                  <div className="space-y-1">
                    {group.topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setAiTopic(topic)}
                        className="block w-full text-left px-2 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={generateTweets}
          disabled={!aiTopic.trim() || isGenerating || !canUse('tweet', 3)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full mb-6"
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Generating Tweets...' : `Generate AI Tweets (${getTokenCost('tweet', 3)} tokens)`}
        </Button>

        {generatedTweets.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Generated Tweet Options:</h4>
            {generatedTweets.map((tweet, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4 space-y-3">
                <p className="text-sm leading-relaxed">{tweet}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {tweet.length}/280 characters
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(tweet, index)}
                      className="glassmorphism h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.open(createTwitterLink(tweet), '_blank')}
                      className="bg-blue-500 hover:bg-blue-600 h-8"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Post on X
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Manual Tweet Composer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glassmorphism rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Manual Compose</h3>
        <div className="space-y-4">
          <Textarea
            placeholder="What's happening?"
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            className="min-h-[120px] bg-black/20 border-white/10"
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {tweetContent.length}/280 characters
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(tweetContent, -1)}
                disabled={!tweetContent.trim()}
                className="glassmorphism"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={() => window.open(createTwitterLink(tweetContent), '_blank')}
                disabled={!tweetContent.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Post on X
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Tweets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glassmorphism rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Tweets</h3>
          <div className="text-sm text-muted-foreground">
            {recentTweets.length} tweets loaded
          </div>
        </div>
        <div className="space-y-4">
          {recentTweets.length > 0 ? recentTweets.map((tweet, index) => (
            <div key={tweet.id} className="bg-black/20 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm leading-relaxed flex-1">{tweet.content}</p>
                {tweet.isGenerated && (
                  <Badge variant="outline" className="ml-3 text-xs">
                    AI Generated
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  {tweet.views && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{formatNumber(tweet.views)}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{tweet.likes || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Repeat2 className="h-3 w-3" />
                    <span>{tweet.retweets || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{tweet.replies || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(tweet.publishedAt)}
                  </span>
                  {tweet.tweetUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(tweet.tweetUrl, '_blank')}
                      className="glassmorphism h-6 px-2 text-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-muted-foreground">
              <Twitter className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>No tweets found</p>
              {!profile.twitterHandle ? (
                <p className="text-sm mt-2">Add your Twitter handle in settings to get started</p>
              ) : (
                <p className="text-sm mt-2">Click "Scrape Tweets" to import your recent tweets</p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
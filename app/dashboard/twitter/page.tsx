'use client';

import { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTokens } from '@/hooks/use-tokens';
import toast from 'react-hot-toast';

export default function TwitterPage() {
  const [tweetContent, setTweetContent] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [tweetStyle, setTweetStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTweets, setGeneratedTweets] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { canUse, getTokenCost } = useTokens();

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

  const stats = [
    { label: 'Tweets This Week', value: '23', change: '+5', icon: Twitter, color: 'text-blue-400' },
    { label: 'Total Impressions', value: '12.4K', change: '+18%', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Followers Gained', value: '+47', change: '+12%', icon: Users, color: 'text-purple-400' },
    { label: 'Engagement Rate', value: '4.2%', change: '+0.8%', icon: Heart, color: 'text-pink-400' },
  ];

  const recentTweets = [
    {
      content: "🚀 Just shipped a new feature for LaunchPilot! AI now generates platform-specific content in seconds. What would you build with extra time?",
      stats: { likes: 24, retweets: 8, replies: 5 },
      time: '2 hours ago'
    },
    {
      content: "The biggest mistake indie hackers make? Spending 80% of time building, 20% marketing. Should be 50/50. LaunchPilot helps you do marketing right.",
      stats: { likes: 156, retweets: 42, replies: 18 },
      time: '1 day ago'
    }
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
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Compose Tweet
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
              <Badge variant="secondary" className="text-xs">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        <h3 className="text-lg font-semibold mb-6">Recent Tweets</h3>
        <div className="space-y-4">
          {recentTweets.map((tweet, index) => (
            <div key={index} className="bg-black/20 rounded-lg p-4">
              <p className="text-sm mb-3 leading-relaxed">{tweet.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{tweet.stats.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Repeat2 className="h-3 w-3" />
                    <span>{tweet.stats.retweets}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{tweet.stats.replies}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{tweet.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  Zap,
  Target,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Clock,
  Users,
  BarChart3,
  Plus,
  Sparkles,
  Copy,
  RefreshCw,
  ExternalLink,
  Flame,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TrendingTopic {
  id: string;
  topic: string;
  hashtag?: string;
  platform: string;
  volume: number;
  growth: number;
  viralScore: number;
  category: string;
  timeframe: string;
  relatedTopics: string[];
  opportunity: 'high' | 'medium' | 'low';
  competition: 'low' | 'medium' | 'high';
}

interface ViralContent {
  id: string;
  platform: string;
  content: string;
  author: string;
  engagement: number;
  viralScore: number;
  contentType: string;
  timestamp: string;
  reasons: string[];
  hashtags: string[];
  metrics: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
}

interface ContentIdea {
  id: string;
  topic: string;
  angle: string;
  platforms: string[];
  viralPotential: number;
  difficulty: 'easy' | 'medium' | 'hard';
  contentType: string;
  hook: string;
  cta: string;
  hashtags: string[];
  estimatedReach: number;
}

export default function ViralContentPage() {
  const [trendingTopics] = useState<TrendingTopic[]>([
    {
      id: '1',
      topic: 'AI Marketing Tools',
      hashtag: '#AIMarketing',
      platform: 'twitter',
      volume: 45600,
      growth: 156,
      viralScore: 87,
      category: 'Technology',
      timeframe: '24 hours',
      relatedTopics: ['Marketing Automation', 'Content Creation', 'SaaS Tools'],
      opportunity: 'high',
      competition: 'medium'
    },
    {
      id: '2',
      topic: 'Work From Home Setup',
      hashtag: '#WFHSetup',
      platform: 'instagram',
      volume: 28900,
      growth: 89,
      viralScore: 76,
      category: 'Lifestyle',
      timeframe: '12 hours',
      relatedTopics: ['Remote Work', 'Productivity', 'Home Office'],
      opportunity: 'medium',
      competition: 'high'
    },
    {
      id: '3',
      topic: 'Founder Mental Health',
      hashtag: '#FounderLife',
      platform: 'linkedin',
      volume: 12400,
      growth: 234,
      viralScore: 92,
      category: 'Business',
      timeframe: '6 hours',
      relatedTopics: ['Entrepreneurship', 'Burnout', 'Work-Life Balance'],
      opportunity: 'high',
      competition: 'low'
    },
    {
      id: '4',
      topic: 'No-Code Development',
      hashtag: '#NoCode',
      platform: 'twitter',
      volume: 18700,
      growth: 67,
      viralScore: 71,
      category: 'Technology',
      timeframe: '18 hours',
      relatedTopics: ['App Development', 'Productivity Tools', 'Tech Democratization'],
      opportunity: 'medium',
      competition: 'medium'
    }
  ]);

  const [viralContent] = useState<ViralContent[]>([
    {
      id: '1',
      platform: 'twitter',
      content: 'I built a $10K/month SaaS with no-code tools in 3 months. Here\'s exactly how I did it 🧵\n\n1. Identified a problem I faced daily\n2. Validated with 50 potential customers\n3. Built MVP with Bubble in 2 weeks\n4. Launched on Product Hunt\n\nThread below 👇',
      author: '@sarahbuilds',
      engagement: 15600,
      viralScore: 94,
      contentType: 'Educational Thread',
      timestamp: '2 hours ago',
      reasons: ['Personal success story', 'Actionable insights', 'Thread format', 'Strong hook'],
      hashtags: ['#NoCode', '#SaaS', '#Entrepreneurship'],
      metrics: {
        likes: 3400,
        shares: 890,
        comments: 245,
        views: 156000
      }
    },
    {
      id: '2',
      platform: 'linkedin',
      content: 'After 2 years of remote work, I\'ve learned that productivity isn\'t about working more hours.\n\nIt\'s about working smarter.\n\nHere are 7 systems that transformed my daily output:',
      author: 'Mike Chen',
      engagement: 8900,
      viralScore: 89,
      contentType: 'Tips List',
      timestamp: '5 hours ago',
      reasons: ['Relatable problem', 'Promise of value', 'List format', 'Personal experience'],
      hashtags: ['#Productivity', '#RemoteWork', '#WorkFromHome'],
      metrics: {
        likes: 2100,
        shares: 456,
        comments: 123
      }
    },
    {
      id: '3',
      platform: 'instagram',
      content: 'POV: You finally organized your home office and it actually looks like those Pinterest boards ✨',
      author: '@minimalist_jane',
      engagement: 23400,
      viralScore: 96,
      contentType: 'Before/After Visual',
      timestamp: '8 hours ago',
      reasons: ['Visual transformation', 'POV format', 'Aspirational content', 'Trending audio'],
      hashtags: ['#HomeOffice', '#Organization', '#WFH', '#Aesthetic'],
      metrics: {
        likes: 18900,
        shares: 2100,
        comments: 890,
        views: 234000
      }
    }
  ]);

  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([
    {
      id: '1',
      topic: 'AI Marketing Tools',
      angle: 'Personal transformation story',
      platforms: ['twitter', 'linkedin'],
      viralPotential: 85,
      difficulty: 'easy',
      contentType: 'Thread/Carousel',
      hook: 'I replaced my entire marketing team with AI tools for $50/month',
      cta: 'What AI tools are you using in your business?',
      hashtags: ['#AIMarketing', '#MarketingAutomation', '#SaaS'],
      estimatedReach: 45000
    },
    {
      id: '2',
      topic: 'Founder Mental Health',
      angle: 'Vulnerability and authenticity',
      platforms: ['linkedin', 'twitter'],
      viralPotential: 92,
      difficulty: 'medium',
      contentType: 'Personal Story',
      hook: 'I had a panic attack during a board meeting. Here\'s what I learned about founder pressure.',
      cta: 'How do you handle the mental pressure of building a company?',
      hashtags: ['#FounderLife', '#MentalHealth', '#Entrepreneurship'],
      estimatedReach: 67000
    }
  ]);

  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newIdeaTopic, setNewIdeaTopic] = useState('');

  const generateViralIdeas = async () => {
    if (!newIdeaTopic.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'viral-content',
          topic: newIdeaTopic,
          style: 'viral',
          count: 3
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Create new content ideas from generated content
        const newIdeas = data.content.map((content: string, index: number) => ({
          id: Date.now().toString() + index,
          topic: newIdeaTopic,
          angle: `AI-generated angle ${index + 1}`,
          platforms: ['twitter', 'linkedin'],
          viralPotential: Math.floor(Math.random() * 20) + 80,
          difficulty: 'medium' as const,
          contentType: 'AI Generated',
          hook: content.substring(0, 80) + '...',
          cta: 'What do you think about this approach?',
          hashtags: [`#${newIdeaTopic.replace(/\s+/g, '')}`],
          estimatedReach: Math.floor(Math.random() * 50000) + 20000
        }));
        
        setContentIdeas(prev => [...newIdeas, ...prev]);
        setNewIdeaTopic('');
      }
    } catch (error) {
      console.error('Error generating viral ideas:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyContent = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  const filteredTopics = trendingTopics.filter(topic => {
    const platformMatch = selectedPlatform === 'all' || topic.platform === selectedPlatform;
    const categoryMatch = selectedCategory === 'all' || topic.category.toLowerCase() === selectedCategory.toLowerCase();
    return platformMatch && categoryMatch;
  });

  const stats = [
    { label: 'Trending Topics', value: '24', change: '+12', icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Viral Score Avg', value: '82', change: '+7', icon: Flame, color: 'text-red-400' },
    { label: 'Content Ideas', value: contentIdeas.length.toString(), change: '+8', icon: Sparkles, color: 'text-purple-400' },
    { label: 'Opportunities', value: trendingTopics.filter(t => t.opportunity === 'high').length.toString(), change: '+5', icon: Target, color: 'text-green-400' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">Viral Content Detection</h1>
          <p className="text-muted-foreground">
            Discover trending topics, analyze viral content, and generate ideas with high engagement potential
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            className="glassmorphism"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Trends
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
                stat.color === 'text-red-400' ? 'from-red-500/20 to-red-600/20' :
                stat.color === 'text-purple-400' ? 'from-purple-500/20 to-purple-600/20' :
                'from-green-500/20 to-green-600/20'
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

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glassmorphism">
          <TabsTrigger value="trending">Trending Topics</TabsTrigger>
          <TabsTrigger value="viral">Viral Content</TabsTrigger>
          <TabsTrigger value="ideas">Content Ideas</TabsTrigger>
          <TabsTrigger value="generator">Idea Generator</TabsTrigger>
        </TabsList>

        {/* Trending Topics Tab */}
        <TabsContent value="trending" className="space-y-6 mt-6">
          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-48 glassmorphism-dark border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 glassmorphism-dark border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredTopics.map((topic) => (
              <Card key={topic.id} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{topic.topic}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          topic.viralScore >= 90 ? 'border-red-400 text-red-400' :
                          topic.viralScore >= 75 ? 'border-orange-400 text-orange-400' :
                          'border-yellow-400 text-yellow-400'
                        }`}
                      >
                        {topic.viralScore} viral score
                      </Badge>
                    </div>
                    {topic.hashtag && (
                      <p className="text-sm text-blue-400 mb-2">{topic.hashtag}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{topic.platform}</span>
                      <span>•</span>
                      <span>{topic.category}</span>
                      <span>•</span>
                      <span>{topic.timeframe}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">+{topic.growth}%</div>
                    <div className="text-xs text-muted-foreground">growth</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-sm font-semibold">{topic.volume.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Mentions</div>
                  </div>
                  <div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        topic.opportunity === 'high' ? 'border-green-400 text-green-400' :
                        topic.opportunity === 'medium' ? 'border-yellow-400 text-yellow-400' :
                        'border-red-400 text-red-400'
                      }`}
                    >
                      {topic.opportunity} opportunity
                    </Badge>
                  </div>
                  <div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        topic.competition === 'low' ? 'border-green-400 text-green-400' :
                        topic.competition === 'medium' ? 'border-yellow-400 text-yellow-400' :
                        'border-red-400 text-red-400'
                      }`}
                    >
                      {topic.competition} competition
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Related Topics:</div>
                  <div className="flex flex-wrap gap-1">
                    {topic.relatedTopics.map((related, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {related}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generate Content Ideas
                </Button>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Viral Content Tab */}
        <TabsContent value="viral" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {viralContent.map((content) => (
              <Card key={content.id} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{content.author}</h3>
                    <Badge variant="outline" className="text-xs">
                      {content.platform}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        content.viralScore >= 90 ? 'border-red-400 text-red-400' :
                        content.viralScore >= 75 ? 'border-orange-400 text-orange-400' :
                        'border-yellow-400 text-yellow-400'
                      }`}
                    >
                      {content.viralScore} viral score
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {content.contentType}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{content.timestamp}</div>
                </div>

                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <p className="text-sm leading-relaxed mb-3">{content.content}</p>
                  {content.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {content.hashtags.map((hashtag, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-blue-400">
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-sm font-semibold">{content.metrics.likes.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{content.metrics.shares.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Shares</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{content.metrics.comments.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{content.engagement.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Engagement</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-semibold text-purple-400 mb-2">Why it went viral:</div>
                  <div className="space-y-1">
                    {content.reasons.map((reason, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyContent(content.content)}
                    className="glassmorphism flex-1"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Content
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glassmorphism flex-1"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Adapt Style
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Content Ideas Tab */}
        <TabsContent value="ideas" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {contentIdeas.map((idea) => (
              <Card key={idea.id} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{idea.topic}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          idea.viralPotential >= 90 ? 'border-red-400 text-red-400' :
                          idea.viralPotential >= 75 ? 'border-orange-400 text-orange-400' :
                          'border-yellow-400 text-yellow-400'
                        }`}
                      >
                        {idea.viralPotential}% viral potential
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{idea.angle}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{idea.contentType}</span>
                      <span>•</span>
                      <span>{idea.difficulty} difficulty</span>
                      <span>•</span>
                      <span>{idea.estimatedReach.toLocaleString()} reach</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-green-400 mb-1">Hook:</div>
                    <p className="text-sm bg-black/20 rounded p-2">{idea.hook}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-blue-400 mb-1">Call to Action:</div>
                    <p className="text-sm bg-black/20 rounded p-2">{idea.cta}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Platforms & Hashtags:</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {idea.platforms.map((platform, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {idea.hashtags.map((hashtag, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-blue-400">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Create Content
                </Button>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Idea Generator Tab */}
        <TabsContent value="generator" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold">AI Viral Content Generator</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a topic or trend to generate viral content ideas..."
                  value={newIdeaTopic}
                  onChange={(e) => setNewIdeaTopic(e.target.value)}
                  className="bg-black/20 border-white/10 flex-1"
                />
                <Button
                  onClick={generateViralIdeas}
                  disabled={isGenerating || !newIdeaTopic.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Generate Ideas
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                💡 Try topics like: "Personal productivity", "AI in marketing", "Remote work challenges", "Startup funding"
              </div>
            </div>
          </motion.div>

          {/* Quick Viral Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glassmorphism rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Proven Viral Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Personal Transformation',
                  template: 'I [achieved something] in [timeframe]. Here\'s exactly how I did it:',
                  example: 'I grew my Twitter to 10K followers in 6 months. Here\'s exactly how I did it:',
                  platforms: ['Twitter', 'LinkedIn']
                },
                {
                  name: 'Contrarian Take',
                  template: 'Everyone says [common belief]. But I think [opposite view]. Here\'s why:',
                  example: 'Everyone says "consistency is key". But I think strategic inconsistency works better. Here\'s why:',
                  platforms: ['Twitter', 'LinkedIn']
                },
                {
                  name: 'Behind The Scenes',
                  template: 'POV: [Relatable situation that your audience faces]',
                  example: 'POV: You finally organized your home office and it actually looks productive',
                  platforms: ['Instagram', 'TikTok']
                },
                {
                  name: 'Mistake + Learning',
                  template: 'I made a [big mistake] that cost me [consequence]. Here\'s what I learned:',
                  example: 'I made a hiring mistake that cost me $50K. Here\'s what I learned:',
                  platforms: ['LinkedIn', 'Twitter']
                }
              ].map((template, index) => (
                <Card key={index} className="glassmorphism-dark p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm">{template.name}</h4>
                    <div className="flex gap-1">
                      {template.platforms.map((platform, pIndex) => (
                        <Badge key={pIndex} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Template:</div>
                    <p className="text-xs bg-black/30 rounded p-2">{template.template}</p>
                    <div className="text-xs text-muted-foreground">Example:</div>
                    <p className="text-xs bg-black/30 rounded p-2 italic">{template.example}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyContent(template.template)}
                    className="glassmorphism w-full mt-3 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Template
                  </Button>
                </Card>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
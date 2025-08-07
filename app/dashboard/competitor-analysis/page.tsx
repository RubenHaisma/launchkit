'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  TrendingUp,
  Eye,
  Users,
  Heart,
  MessageCircle,
  BarChart3,
  Target,
  Zap,
  Plus,
  Sparkles,
  Copy,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Competitor {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: number;
  engagement: number;
  category: string;
  lastAnalyzed: string;
  strengths: string[];
  weaknesses: string[];
  contentTypes: string[];
  postingFrequency: string;
  averagePerformance: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface ContentAnalysis {
  id: string;
  competitor: string;
  platform: string;
  content: string;
  engagement: number;
  contentType: string;
  timestamp: string;
  insights: string[];
  hashtags: string[];
  performance: 'high' | 'medium' | 'low';
}

interface CompetitorInsight {
  type: 'opportunity' | 'threat' | 'trend' | 'gap';
  title: string;
  description: string;
  competitor?: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  platform: string;
}

export default function CompetitorAnalysisPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([
    {
      id: '1',
      name: 'Buffer',
      handle: '@buffer',
      platform: 'twitter',
      followers: 487000,
      engagement: 3.2,
      category: 'Social Media Management',
      lastAnalyzed: '2 hours ago',
      strengths: ['Educational content', 'Data-driven insights', 'Consistent posting'],
      weaknesses: ['Limited visual content', 'Low video engagement'],
      contentTypes: ['Educational', 'Tips', 'Industry News', 'Company Updates'],
      postingFrequency: '3-4 times per day',
      averagePerformance: { likes: 245, shares: 67, comments: 34 }
    },
    {
      id: '2',
      name: 'Hootsuite',
      handle: '@hootsuite',
      platform: 'twitter',
      followers: 892000,
      engagement: 2.8,
      category: 'Social Media Management',
      lastAnalyzed: '6 hours ago',
      strengths: ['Brand awareness', 'Large following', 'Industry authority'],
      weaknesses: ['Low engagement rate', 'Generic content'],
      contentTypes: ['Industry News', 'Product Updates', 'Tips', 'Webinars'],
      postingFrequency: '5-6 times per day',
      averagePerformance: { likes: 189, shares: 43, comments: 21 }
    },
    {
      id: '3',
      name: 'Later',
      handle: '@latermedia',
      platform: 'instagram',
      followers: 654000,
      engagement: 4.7,
      category: 'Social Media Scheduling',
      lastAnalyzed: '1 day ago',
      strengths: ['Visual storytelling', 'High engagement', 'User-generated content'],
      weaknesses: ['Limited to visual platforms', 'Narrow focus'],
      contentTypes: ['Visual Tips', 'Behind-the-scenes', 'User Features', 'Tutorials'],
      postingFrequency: '2-3 times per day',
      averagePerformance: { likes: 1240, shares: 89, comments: 156 }
    }
  ]);

  const [contentAnalyses] = useState<ContentAnalysis[]>([
    {
      id: '1',
      competitor: 'Buffer',
      platform: 'twitter',
      content: 'The anatomy of a viral tweet: 3 key elements that make content shareable 🧵\n\n1. Emotional hook\n2. Clear value proposition\n3. Call to action\n\nWhich element do you focus on most?',
      engagement: 892,
      contentType: 'Educational Thread',
      timestamp: '3 hours ago',
      insights: ['Uses thread format for deeper engagement', 'Asks question to drive comments', 'Clear structure with numbered points'],
      hashtags: [],
      performance: 'high'
    },
    {
      id: '2',
      competitor: 'Later',
      platform: 'instagram',
      content: 'Behind the scenes of our content creation process ✨ From idea to published post in 5 steps!',
      engagement: 2341,
      contentType: 'Behind-the-scenes',
      timestamp: '1 day ago',
      insights: ['Personal/authentic content performs well', 'Step-by-step format is engaging', 'Uses relevant emojis effectively'],
      hashtags: ['#BehindTheScenes', '#ContentCreation', '#SocialMediaTips'],
      performance: 'high'
    },
    {
      id: '3',
      competitor: 'Hootsuite',
      platform: 'twitter',
      content: 'New feature alert! 🚨 Our AI scheduling tool is now live. Schedule smarter, not harder.',
      engagement: 234,
      contentType: 'Product Update',
      timestamp: '2 days ago',
      insights: ['Product updates get moderate engagement', 'Alert emoji catches attention', 'Simple messaging works'],
      hashtags: [],
      performance: 'medium'
    }
  ]);

  const [competitorInsights] = useState<CompetitorInsight[]>([
    {
      type: 'opportunity',
      title: 'Video Content Gap',
      description: 'Competitors are underutilizing video content on Twitter - opportunity to differentiate',
      action: 'Create more video tutorials and demos',
      priority: 'high',
      platform: 'twitter'
    },
    {
      type: 'trend',
      title: 'AI Feature Messaging',
      description: 'All competitors are heavily promoting AI features - trending topic to leverage',
      competitor: 'All major competitors',
      action: 'Highlight unique AI capabilities',
      priority: 'high',
      platform: 'all'
    },
    {
      type: 'threat',
      title: 'Buffer\'s Educational Strategy',
      description: 'Buffer is gaining traction with educational thread content',
      competitor: 'Buffer',
      action: 'Develop educational content series',
      priority: 'medium',
      platform: 'twitter'
    },
    {
      type: 'gap',
      title: 'Personal Brand Focus',
      description: 'No competitor is focusing on personal brand building for founders',
      action: 'Position as personal brand solution',
      priority: 'high',
      platform: 'all'
    }
  ]);

  const [newCompetitor, setNewCompetitor] = useState({
    name: '',
    handle: '',
    platform: 'twitter',
    category: ''
  });

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddCompetitor, setShowAddCompetitor] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCompetitor = async (competitorId: string) => {
    setIsAnalyzing(true);
    try {
      // In a real app, this would call your competitor analysis API
      // For now, simulate the analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last analyzed time
      setCompetitors(prev => prev.map(comp => 
        comp.id === competitorId 
          ? { ...comp, lastAnalyzed: 'Just now' }
          : comp
      ));
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addCompetitor = () => {
    if (!newCompetitor.name || !newCompetitor.handle) return;
    
    const competitor: Competitor = {
      id: Date.now().toString(),
      name: newCompetitor.name,
      handle: newCompetitor.handle,
      platform: newCompetitor.platform,
      followers: 0,
      engagement: 0,
      category: newCompetitor.category || 'Unknown',
      lastAnalyzed: 'Never',
      strengths: [],
      weaknesses: [],
      contentTypes: [],
      postingFrequency: 'Unknown',
      averagePerformance: { likes: 0, shares: 0, comments: 0 }
    };
    
    setCompetitors(prev => [...prev, competitor]);
    setNewCompetitor({ name: '', handle: '', platform: 'twitter', category: '' });
    setShowAddCompetitor(false);
  };

  const generateCompetitorReport = async () => {
    // In a real app, this would generate a comprehensive report
    const reportData = {
      competitors: competitors.length,
      topPerformer: competitors.reduce((prev, current) => 
        (prev.engagement > current.engagement) ? prev : current
      ),
      opportunities: competitorInsights.filter(i => i.type === 'opportunity').length,
      threats: competitorInsights.filter(i => i.type === 'threat').length
    };
    
    console.log('Generated report:', reportData);
  };

  const filteredCompetitors = selectedFilter === 'all' 
    ? competitors 
    : competitors.filter(c => c.platform === selectedFilter);

  const stats = [
    { label: 'Competitors Tracked', value: competitors.length.toString(), change: '+2', icon: Users, color: 'text-blue-400' },
    { label: 'Avg Engagement', value: '3.6%', change: '+0.4%', icon: Heart, color: 'text-pink-400' },
    { label: 'Opportunities Found', value: competitorInsights.filter(i => i.type === 'opportunity').length.toString(), change: '+3', icon: Target, color: 'text-green-400' },
    { label: 'Content Analyzed', value: '147', change: '+23', icon: BarChart3, color: 'text-purple-400' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">Competitor Analysis</h1>
          <p className="text-muted-foreground">
            Track competitors, analyze their strategies, and identify opportunities in your market
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            onClick={generateCompetitorReport}
            variant="outline"
            className="glassmorphism"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={() => setShowAddCompetitor(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Competitor
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
                stat.color === 'text-pink-400' ? 'from-pink-500/20 to-pink-600/20' :
                stat.color === 'text-green-400' ? 'from-green-500/20 to-green-600/20' :
                'from-purple-500/20 to-purple-600/20'
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

      {/* Add Competitor Modal */}
      {showAddCompetitor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold">Add New Competitor</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Company name"
              value={newCompetitor.name}
              onChange={(e) => setNewCompetitor(prev => ({...prev, name: e.target.value}))}
              className="bg-black/20 border-white/10"
            />
            <Input
              placeholder="Social handle (e.g., @company)"
              value={newCompetitor.handle}
              onChange={(e) => setNewCompetitor(prev => ({...prev, handle: e.target.value}))}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select value={newCompetitor.platform} onValueChange={(value) => setNewCompetitor(prev => ({...prev, platform: value}))}>
              <SelectTrigger className="bg-black/20 border-white/10">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Category/Industry"
              value={newCompetitor.category}
              onChange={(e) => setNewCompetitor(prev => ({...prev, category: e.target.value}))}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={addCompetitor} disabled={!newCompetitor.name || !newCompetitor.handle} className="bg-green-600 hover:bg-green-700">
              Add Competitor
            </Button>
            <Button variant="outline" onClick={() => setShowAddCompetitor(false)} className="glassmorphism">
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      <Tabs defaultValue="competitors" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glassmorphism">
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="space-y-6 mt-6">
          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredCompetitors.map((competitor) => (
              <Card key={competitor.id} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{competitor.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {competitor.platform}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{competitor.handle}</p>
                    <p className="text-xs text-muted-foreground">{competitor.category}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => analyzeCompetitor(competitor.id)}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isAnalyzing ? <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> : <Search className="h-3 w-3 mr-1" />}
                    Analyze
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-sm font-semibold">{competitor.followers.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{competitor.engagement}%</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{competitor.postingFrequency}</div>
                    <div className="text-xs text-muted-foreground">Posts/day</div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-green-400 mb-1">Strengths:</div>
                    <div className="flex flex-wrap gap-1">
                      {competitor.strengths.map((strength, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-green-400/50 text-green-400">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-red-400 mb-1">Weaknesses:</div>
                    <div className="flex flex-wrap gap-1">
                      {competitor.weaknesses.map((weakness, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-red-400/50 text-red-400">
                          {weakness}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground border-t border-white/10 pt-3">
                  Last analyzed: {competitor.lastAnalyzed}
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Content Analysis Tab */}
        <TabsContent value="content" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {contentAnalyses.map((analysis) => (
              <Card key={analysis.id} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{analysis.competitor}</h3>
                    <Badge variant="outline" className="text-xs">
                      {analysis.platform}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        analysis.performance === 'high' ? 'border-green-400 text-green-400' :
                        analysis.performance === 'medium' ? 'border-yellow-400 text-yellow-400' :
                        'border-red-400 text-red-400'
                      }`}
                    >
                      {analysis.performance} performance
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{analysis.engagement.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">engagements</div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <p className="text-sm leading-relaxed mb-2">{analysis.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{analysis.contentType}</span>
                    <span>{analysis.timestamp}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-purple-400 mb-2">Key Insights:</div>
                    <div className="space-y-1">
                      {analysis.insights.map((insight, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {analysis.hashtags.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-blue-400 mb-1">Hashtags:</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.hashtags.map((hashtag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Market Insights Tab */}
        <TabsContent value="insights" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {competitorInsights.map((insight, index) => (
              <Card key={index} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'opportunity' ? 'bg-green-500/20' :
                      insight.type === 'threat' ? 'bg-red-500/20' :
                      insight.type === 'trend' ? 'bg-purple-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      {insight.type === 'opportunity' && <Target className="h-4 w-4 text-green-400" />}
                      {insight.type === 'threat' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                      {insight.type === 'trend' && <TrendingUp className="h-4 w-4 text-purple-400" />}
                      {insight.type === 'gap' && <Zap className="h-4 w-4 text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                      {insight.competitor && (
                        <p className="text-xs text-muted-foreground">Related to: {insight.competitor}</p>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      insight.priority === 'high' ? 'border-red-400 text-red-400' :
                      insight.priority === 'medium' ? 'border-yellow-400 text-yellow-400' :
                      'border-green-400 text-green-400'
                    } text-xs`}
                  >
                    {insight.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Platform: {insight.platform}
                  </div>
                  <Button size="sm" variant="outline" className="glassmorphism text-xs">
                    {insight.action}
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="glassmorphism p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold">AI-Generated Opportunities</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'Untapped Video Content Opportunity',
                    description: 'Your competitors are posting 60% fewer videos than the platform average. Video content gets 3x more engagement.',
                    action: 'Create video content strategy',
                    impact: 'High',
                    effort: 'Medium'
                  },
                  {
                    title: 'Personal Story Gap',
                    description: 'None of your competitors share founder stories or behind-the-scenes content consistently.',
                    action: 'Share personal journey content',
                    impact: 'High',
                    effort: 'Low'
                  },
                  {
                    title: 'Educational Thread Potential',
                    description: 'Educational threads are getting 40% more engagement than regular posts in your niche.',
                    action: 'Develop educational thread series',
                    impact: 'Medium',
                    effort: 'Medium'
                  }
                ].map((opp, index) => (
                  <div key={index} className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{opp.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs border-green-400 text-green-400">
                          {opp.impact} Impact
                        </Badge>
                        <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                          {opp.effort} Effort
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{opp.description}</p>
                    <Button size="sm" variant="outline" className="glassmorphism text-xs">
                      {opp.action}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
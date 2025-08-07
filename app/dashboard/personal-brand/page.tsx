'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Target,
  MessageCircle,
  Eye,
  Heart,
  TrendingUp,
  Sparkles,
  Plus,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Mic,
  Palette,
  Users,
  Zap,
  Settings,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

interface BrandVoice {
  tone: string;
  personality: string[];
  values: string[];
  expertise: string[];
  audience: string;
  uniqueValue: string;
  communicationStyle: {
    formality: number; // 1-10 scale
    energy: number; // 1-10 scale
    empathy: number; // 1-10 scale
    authority: number; // 1-10 scale
  };
}

interface BrandConsistency {
  platform: string;
  score: number;
  issues: string[];
  recommendations: string[];
  recentContent: string[];
}

interface BrandGuideline {
  category: string;
  title: string;
  description: string;
  examples: {
    good: string;
    bad: string;
  };
}

export default function PersonalBrandPage() {
  const [brandVoice, setBrandVoice] = useState<BrandVoice>({
    tone: 'Professional yet approachable',
    personality: ['Innovative', 'Helpful', 'Authentic', 'Data-driven'],
    values: ['Transparency', 'Growth mindset', 'Community first', 'Continuous learning'],
    expertise: ['SaaS Development', 'AI Marketing', 'Content Strategy', 'Entrepreneurship'],
    audience: 'SaaS founders and marketing professionals looking to scale their content',
    uniqueValue: 'I help SaaS founders turn their expertise into consistent, engaging content that builds authority and drives growth',
    communicationStyle: {
      formality: 6,
      energy: 7,
      empathy: 8,
      authority: 7
    }
  });

  const [brandConsistency] = useState<BrandConsistency[]>([
    {
      platform: 'Twitter',
      score: 87,
      issues: ['Inconsistent posting frequency', 'Occasional off-brand casual tone'],
      recommendations: ['Maintain daily posting schedule', 'Use brand voice checker before posting'],
      recentContent: [
        'Just shipped a new AI feature that writes like you 🚀',
        'Here\'s how I analyze competitor content in 10 minutes',
        'Coffee break thoughts on the future of content creation ☕'
      ]
    },
    {
      platform: 'LinkedIn',
      score: 94,
      issues: ['Could use more personal stories'],
      recommendations: ['Share more behind-the-scenes founder journey content'],
      recentContent: [
        'The mistake that taught me the most about building SaaS products',
        '5 lessons from scaling LaunchPilot to 1000+ users',
        'Why I believe AI will democratize content creation'
      ]
    },
    {
      platform: 'Instagram',
      score: 73,
      issues: ['Visual brand inconsistency', 'Captions don\'t match brand voice'],
      recommendations: ['Create visual brand guidelines', 'Align caption tone with overall brand'],
      recentContent: [
        'Behind the scenes of building LaunchPilot ✨',
        'My home office setup for maximum productivity',
        'Coffee and code: the perfect combination ☕💻'
      ]
    }
  ]);

  const [brandGuidelines] = useState<BrandGuideline[]>([
    {
      category: 'Tone & Voice',
      title: 'Professional yet Approachable',
      description: 'Strike a balance between authority and accessibility. Be knowledgeable but not condescending.',
      examples: {
        good: 'Here\'s a proven strategy that helped me 3x my content engagement (and it only takes 10 minutes)',
        bad: 'You\'re probably doing content marketing all wrong. Let me teach you the right way.'
      }
    },
    {
      category: 'Storytelling',
      title: 'Data-Driven Personal Stories',
      description: 'Combine personal experiences with concrete metrics and outcomes.',
      examples: {
        good: 'I spent 6 months analyzing 1,000+ viral posts. Here are the 3 patterns I discovered:',
        bad: 'I think good content is really important for growing your business.'
      }
    },
    {
      category: 'Value Delivery',
      title: 'Actionable Insights First',
      description: 'Always lead with value. Make every post teach something specific and actionable.',
      examples: {
        good: 'The 5-minute content audit that increased my engagement by 40%: 1. Check your hook strength...',
        bad: 'Content is king! Make sure you\'re creating good content for your audience.'
      }
    },
    {
      category: 'Community Engagement',
      title: 'Question-Driven Interaction',
      description: 'End posts with thoughtful questions that spark genuine discussion.',
      examples: {
        good: 'What\'s the biggest content challenge you\'re facing right now? I\'ll share my approach in the replies.',
        bad: 'What do you think? Let me know in the comments!'
      }
    }
  ]);

  const [contentSample, setContentSample] = useState('');
  const [brandAnalysis, setBrandAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const copyContent = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  const analyzeBrandAlignment = async () => {
    if (!contentSample.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // In a real app, this would call your brand analysis AI
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBrandAnalysis({
        overallScore: 82,
        toneMatch: 85,
        valueAlignment: 78,
        audienceRelevance: 87,
        suggestions: [
          'Consider adding more specific metrics to strengthen authority',
          'The tone is slightly too casual - add more professional language',
          'Great job including actionable advice',
          'Could benefit from a stronger call-to-action'
        ],
        improvedVersion: `${contentSample}\n\n[AI-improved version would appear here with better brand alignment]`
      });
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateBrandedContent = async (topic: string) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'personal-brand',
          topic,
          style: brandVoice.tone,
          brandContext: {
            personality: brandVoice.personality,
            values: brandVoice.values,
            expertise: brandVoice.expertise,
            audience: brandVoice.audience
          },
          count: 1
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.content[0];
      }
    } catch (error) {
      console.error('Content generation error:', error);
    }
    return null;
  };

  const stats = [
    { label: 'Brand Consistency', value: '84%', change: '+7%', icon: Target, color: 'text-blue-400' },
    { label: 'Voice Alignment', value: '91%', change: '+12%', icon: Mic, color: 'text-purple-400' },
    { label: 'Audience Match', value: '88%', change: '+5%', icon: Users, color: 'text-green-400' },
    { label: 'Content Score', value: '79%', change: '+15%', icon: FileText, color: 'text-pink-400' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">Personal Brand AI</h1>
          <p className="text-muted-foreground">
            Develop and maintain a consistent personal brand voice across all your content and platforms
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" className="glassmorphism">
            <Download className="h-4 w-4 mr-2" />
            Export Guidelines
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <Settings className="h-4 w-4 mr-2" />
            Update Brand
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
                stat.color === 'text-purple-400' ? 'from-purple-500/20 to-purple-600/20' :
                stat.color === 'text-green-400' ? 'from-green-500/20 to-green-600/20' :
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

      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glassmorphism">
          <TabsTrigger value="voice">Brand Voice</TabsTrigger>
          <TabsTrigger value="consistency">Consistency Check</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="analyzer">Content Analyzer</TabsTrigger>
        </TabsList>

        {/* Brand Voice Tab */}
        <TabsContent value="voice" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Brand Overview */}
            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                Brand Profile
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Tone</label>
                  <p className="text-sm mt-1 bg-black/20 rounded p-2">{brandVoice.tone}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Unique Value Proposition</label>
                  <p className="text-sm mt-1 bg-black/20 rounded p-2">{brandVoice.uniqueValue}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Target Audience</label>
                  <p className="text-sm mt-1 bg-black/20 rounded p-2">{brandVoice.audience}</p>
                </div>
              </div>
            </Card>

            {/* Communication Style */}
            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-400" />
                Communication Style
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold">Formality</label>
                    <span className="text-xs text-muted-foreground">{brandVoice.communicationStyle.formality}/10</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                      style={{ width: `${brandVoice.communicationStyle.formality * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold">Energy</label>
                    <span className="text-xs text-muted-foreground">{brandVoice.communicationStyle.energy}/10</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                      style={{ width: `${brandVoice.communicationStyle.energy * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold">Empathy</label>
                    <span className="text-xs text-muted-foreground">{brandVoice.communicationStyle.empathy}/10</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full" 
                      style={{ width: `${brandVoice.communicationStyle.empathy * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold">Authority</label>
                    <span className="text-xs text-muted-foreground">{brandVoice.communicationStyle.authority}/10</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" 
                      style={{ width: `${brandVoice.communicationStyle.authority * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Personality & Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-pink-400" />
                Personality Traits
              </h3>
              <div className="flex flex-wrap gap-2">
                {brandVoice.personality.map((trait, index) => (
                  <Badge key={index} variant="outline" className="border-pink-400 text-pink-400">
                    {trait}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-400" />
                Core Values
              </h3>
              <div className="flex flex-wrap gap-2">
                {brandVoice.values.map((value, index) => (
                  <Badge key={index} variant="outline" className="border-green-400 text-green-400">
                    {value}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Areas of Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {brandVoice.expertise.map((area, index) => (
                  <Badge key={index} variant="outline" className="border-yellow-400 text-yellow-400">
                    {area}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Consistency Check Tab */}
        <TabsContent value="consistency" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {brandConsistency.map((platform, index) => (
              <Card key={platform.platform} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{platform.platform}</h3>
                    <Badge 
                      variant="outline" 
                      className={`${
                        platform.score >= 90 ? 'border-green-400 text-green-400' :
                        platform.score >= 75 ? 'border-yellow-400 text-yellow-400' :
                        'border-red-400 text-red-400'
                      }`}
                    >
                      {platform.score}% consistent
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      platform.score >= 90 ? 'text-green-400' :
                      platform.score >= 75 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {platform.score}
                    </div>
                    <div className="text-xs text-muted-foreground">Brand Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Issues Found
                    </h4>
                    <div className="space-y-1">
                      {platform.issues.map((issue, issueIndex) => (
                        <div key={issueIndex} className="text-xs text-muted-foreground bg-red-500/10 rounded p-2">
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Recommendations
                    </h4>
                    <div className="space-y-1">
                      {platform.recommendations.map((rec, recIndex) => (
                        <div key={recIndex} className="text-xs text-muted-foreground bg-green-500/10 rounded p-2">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Recent Content Analysis</h4>
                  <div className="space-y-2">
                    {platform.recentContent.map((content, contentIndex) => (
                      <div key={contentIndex} className="text-xs bg-black/20 rounded p-2 flex items-center justify-between">
                        <span>{content}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 20) + 75}% match
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Guidelines Tab */}
        <TabsContent value="guidelines" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {brandGuidelines.map((guideline, index) => (
              <Card key={index} className="glassmorphism p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {guideline.category}
                  </Badge>
                  <h3 className="font-semibold">{guideline.title}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{guideline.description}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Good Example
                    </h4>
                    <div className="text-xs bg-green-500/10 rounded p-3 border border-green-500/20">
                      {guideline.examples.good}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Avoid This
                    </h4>
                    <div className="text-xs bg-red-500/10 rounded p-3 border border-red-500/20">
                      {guideline.examples.bad}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Content Analyzer Tab */}
        <TabsContent value="analyzer" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold">Brand Voice Analyzer</h3>
            </div>
            
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your content here to analyze brand alignment..."
                value={contentSample}
                onChange={(e) => setContentSample(e.target.value)}
                className="min-h-[120px] bg-black/20 border-white/10"
              />
              
              <Button
                onClick={analyzeBrandAlignment}
                disabled={isAnalyzing || !contentSample.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isAnalyzing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Target className="h-4 w-4 mr-2" />}
                Analyze Brand Alignment
              </Button>
            </div>

            {brandAnalysis && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{brandAnalysis.overallScore}</div>
                    <div className="text-xs text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{brandAnalysis.toneMatch}</div>
                    <div className="text-xs text-muted-foreground">Tone Match</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{brandAnalysis.valueAlignment}</div>
                    <div className="text-xs text-muted-foreground">Value Alignment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400">{brandAnalysis.audienceRelevance}</div>
                    <div className="text-xs text-muted-foreground">Audience Match</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">Suggestions for Improvement:</h4>
                  <div className="space-y-1">
                    {brandAnalysis.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="text-xs text-muted-foreground bg-yellow-500/10 rounded p-2 flex items-start gap-2">
                        <AlertTriangle className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyContent(brandAnalysis.improvedVersion)}
                    className="glassmorphism"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Improved Version
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glassmorphism"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Re-analyze
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
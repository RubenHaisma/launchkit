'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail,
  Send,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Plus,
  Sparkles,
  ExternalLink,
  Copy,
  RefreshCw,
  Play,
  Pause,
  Settings,
  BarChart3,
  Eye,
  MousePointer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmailSequence {
  id: string;
  name: string;
  type: 'daily_suggestions' | 'onboarding' | 'engagement' | 'tips' | 'custom';
  status: 'active' | 'paused' | 'draft';
  subscribers: number;
  openRate: number;
  clickRate: number;
  schedule: string;
  description: string;
}

interface EmailTemplate {
  id: string;
  subject: string;
  content: string;
  type: string;
  openRate?: number;
}

export default function EmailSequencesPage() {
  const [sequences] = useState<EmailSequence[]>([
    {
      id: '1',
      name: 'Daily Content Suggestions',
      type: 'daily_suggestions',
      status: 'active',
      subscribers: 1248,
      openRate: 42.5,
      clickRate: 8.3,
      schedule: 'Daily at 9:00 AM',
      description: 'AI-powered daily content suggestions tailored to each user\'s platforms and audience'
    },
    {
      id: '2',
      name: 'New User Onboarding',
      type: 'onboarding',
      status: 'active',
      subscribers: 89,
      openRate: 65.8,
      clickRate: 24.1,
      schedule: '3-email series over 7 days',
      description: 'Welcome series to help new users get started with LaunchPilot'
    },
    {
      id: '3',
      name: 'Weekly Analytics Digest',
      type: 'engagement',
      status: 'active',
      subscribers: 892,
      openRate: 38.2,
      clickRate: 12.4,
      schedule: 'Mondays at 8:00 AM',
      description: 'Weekly performance summary and optimization tips'
    },
    {
      id: '4',
      name: 'Content Marketing Tips',
      type: 'tips',
      status: 'paused',
      subscribers: 1456,
      openRate: 35.7,
      clickRate: 6.8,
      schedule: 'Tuesdays & Thursdays',
      description: 'Educational content about marketing strategies and best practices'
    }
  ]);

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      subject: '🚀 Your Daily Content Boost - {{date}}',
      content: `Hi {{first_name}},

Ready to dominate your content game today? Here are your AI-powered suggestions:

**📱 Twitter Post Ideas:**
{{twitter_suggestions}}

**💼 LinkedIn Content:**
{{linkedin_suggestions}}

**📸 Instagram Caption:**
{{instagram_suggestions}}

**🎯 Today's Engagement Tip:**
{{daily_tip}}

**📊 Your Progress:**
- Posts this week: {{weekly_posts}}
- Engagement rate: {{engagement_rate}}
- Best performing platform: {{top_platform}}

Click to generate content: {{dashboard_link}}

Keep crushing it!
The LaunchPilot Team`,
      type: 'daily_suggestions',
      openRate: 42.5
    },
    {
      id: '2',
      subject: 'Welcome to LaunchPilot! Let\'s get you started 🎉',
      content: `Welcome {{first_name}}!

I'm thrilled you've joined LaunchPilot. You're about to transform how you create content.

**What you can do right now:**
✅ Generate your first Twitter thread
✅ Create Instagram captions with hashtags  
✅ Schedule content across all platforms
✅ Get AI-powered analytics insights

**Your next steps:**
1. Complete your profile: {{profile_link}}
2. Connect your social accounts: {{connections_link}}
3. Generate your first content: {{generate_link}}

Questions? Just reply to this email.

Welcome aboard!
Sarah from LaunchPilot`,
      type: 'onboarding',
      openRate: 65.8
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({
    subject: '',
    content: '',
    type: 'daily_suggestions'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [emailPreview, setEmailPreview] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const generateTemplate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email-sequence',
          topic: newTemplate.type,
          style: 'engaging',
          count: 1
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const generated = data.content[0];
        
        // Parse subject and body
        const lines = generated.split('\n');
        const subjectLine = lines.find((line: string) => line.toLowerCase().includes('subject:'));
        const subject = subjectLine ? subjectLine.replace(/^subject:\s*/i, '') : 'Your Daily Content Suggestions 🚀';
        const content = lines.filter((line: string) => !line.toLowerCase().includes('subject:')).join('\n').trim();
        
        setNewTemplate(prev => ({
          ...prev,
          subject,
          content
        }));
      }
    } catch (error) {
      console.error('Error generating template:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTemplate = () => {
    const template: EmailTemplate = {
      id: Date.now().toString(),
      subject: newTemplate.subject,
      content: newTemplate.content,
      type: newTemplate.type
    };
    setEmailTemplates(prev => [...prev, template]);
    setNewTemplate({ subject: '', content: '', type: 'daily_suggestions' });
    setShowNewTemplate(false);
  };

  const copyTemplate = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  const previewDailyEmail = async () => {
    setIsPreviewLoading(true);
    try {
      const response = await fetch('/api/send-daily-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-id', // In real app, get from session
          testMode: true
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmailPreview(data.preview);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Preview error:', error);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const sequenceTypeColors = {
    daily_suggestions: 'from-purple-500 to-pink-500',
    onboarding: 'from-green-500 to-emerald-500',
    engagement: 'from-blue-500 to-cyan-500',
    tips: 'from-orange-500 to-red-500',
    custom: 'from-gray-500 to-gray-600'
  };

  const sequenceTypeLabels = {
    daily_suggestions: 'Daily Suggestions',
    onboarding: 'Onboarding',
    engagement: 'Engagement',
    tips: 'Educational Tips',
    custom: 'Custom'
  };

  const stats = [
    { label: 'Active Sequences', value: '3', change: '+1', icon: Mail, color: 'text-blue-400' },
    { label: 'Total Subscribers', value: '3.2K', change: '+248', icon: Users, color: 'text-green-400' },
    { label: 'Avg. Open Rate', value: '43.2%', change: '+5.1%', icon: Eye, color: 'text-purple-400' },
    { label: 'Avg. Click Rate', value: '12.9%', change: '+2.8%', icon: MousePointer, color: 'text-pink-400' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">Email Sequences</h1>
          <p className="text-muted-foreground">
            Automated email campaigns to keep users engaged and coming back to your platform
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            onClick={() => setShowNewTemplate(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Sequence
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

      <Tabs defaultValue="sequences" className="w-full">
        <TabsList className="grid w-full grid-cols-2 glassmorphism">
          <TabsTrigger value="sequences">Active Sequences</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>

        {/* Active Sequences Tab */}
        <TabsContent value="sequences" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {sequences.map((sequence) => (
              <Card key={sequence.id} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{sequence.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`bg-gradient-to-r ${sequenceTypeColors[sequence.type]} text-white border-0`}
                      >
                        {sequenceTypeLabels[sequence.type]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{sequence.description}</p>
                    <div className="text-xs text-muted-foreground">
                      📅 {sequence.schedule}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={sequence.status === 'active'} 
                      className="data-[state=checked]:bg-green-600"
                    />
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sequence.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      sequence.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {sequence.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm font-semibold">{sequence.subscribers.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">{sequence.openRate}%</div>
                    <div className="text-xs text-muted-foreground">Open Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">{sequence.clickRate}%</div>
                    <div className="text-xs text-muted-foreground">Click Rate</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {sequence.type === 'daily_suggestions' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={previewDailyEmail}
                      disabled={isPreviewLoading}
                      className="glassmorphism flex-1"
                    >
                      {isPreviewLoading ? <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> : <Eye className="h-3 w-3 mr-1" />}
                      Preview
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="glassmorphism flex-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Analytics
                  </Button>
                  <Button size="sm" variant="outline" className="glassmorphism flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Quick Setup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glassmorphism rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Sequence Setup</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: 'Daily Content Boost',
                  description: 'Send users daily AI-generated content suggestions',
                  icon: Sparkles,
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  name: 'Weekly Digest',
                  description: 'Weekly analytics and performance insights',
                  icon: BarChart3,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  name: 'Engagement Booster',
                  description: 'Re-engage inactive users with personalized content',
                  icon: Target,
                  color: 'from-orange-500 to-red-500'
                },
                {
                  name: 'Feature Updates',
                  description: 'Notify users about new features and improvements',
                  icon: Zap,
                  color: 'from-green-500 to-emerald-500'
                }
              ].map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="glassmorphism h-auto p-4 flex flex-col items-start space-y-2"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${template.color} text-white`}>
                    <template.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {showNewTemplate && (
              <Card className="glassmorphism p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold">Create Email Template</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={newTemplate.type} onValueChange={(value) => setNewTemplate(prev => ({...prev, type: value}))}>
                      <SelectTrigger className="bg-black/20 border-white/10">
                        <SelectValue placeholder="Template type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily_suggestions">Daily Suggestions</SelectItem>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="tips">Educational Tips</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={generateTemplate}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                      Generate AI Template
                    </Button>
                  </div>

                  <Input
                    placeholder="Email subject line"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate(prev => ({...prev, subject: e.target.value}))}
                    className="bg-black/20 border-white/10"
                  />

                  <Textarea
                    placeholder="Email content (use {{variables}} for personalization)"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate(prev => ({...prev, content: e.target.value}))}
                    className="min-h-[200px] bg-black/20 border-white/10"
                  />

                  <div className="flex gap-2">
                    <Button onClick={saveTemplate} className="bg-green-600 hover:bg-green-700">
                      Save Template
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewTemplate(false)} className="glassmorphism">
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {emailTemplates.map((template) => (
              <Card key={template.id} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{template.subject}</h3>
                      <Badge variant="outline" className={`bg-gradient-to-r ${sequenceTypeColors[template.type as keyof typeof sequenceTypeColors]} text-white border-0`}>
                        {sequenceTypeLabels[template.type as keyof typeof sequenceTypeLabels]}
                      </Badge>
                    </div>
                    {template.openRate && (
                      <div className="text-sm text-green-400 mb-2">
                        📊 {template.openRate}% open rate
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyTemplate(template.content)}
                      className="glassmorphism"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4">
                  <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {template.content.substring(0, 300)}
                    {template.content.length > 300 && '...'}
                  </pre>
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Email Preview Modal */}
      {showPreview && emailPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold">Daily Email Preview</h3>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowPreview(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">Subject:</div>
                <div className="font-semibold">{emailPreview.subject}</div>
              </div>
              <div className="bg-white text-black rounded-lg p-4 text-sm">
                <div dangerouslySetInnerHTML={{ __html: emailPreview.html }} />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/10">
              <Button 
                onClick={() => copyTemplate(emailPreview.text)}
                variant="outline" 
                className="glassmorphism"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Text Version
              </Button>
              <Button 
                onClick={() => setShowPreview(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
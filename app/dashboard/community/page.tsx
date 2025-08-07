'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle,
  Users,
  Heart,
  Reply,
  AlertCircle,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Plus,
  Sparkles,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bot,
  User,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResponseTemplate {
  id: string;
  name: string;
  category: 'support' | 'engagement' | 'crisis' | 'general' | 'promotional';
  scenario: string;
  template: string;
  tone: 'friendly' | 'professional' | 'empathetic' | 'enthusiastic' | 'apologetic';
  platform: string;
  usage: number;
}

interface CommunityInsight {
  type: 'sentiment' | 'engagement' | 'trending' | 'alert';
  title: string;
  description: string;
  metric: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  platform: string;
}

export default function CommunityPage() {
  const [responseTemplates, setResponseTemplates] = useState<ResponseTemplate[]>([
    {
      id: '1',
      name: 'Thank You for Feedback',
      category: 'support',
      scenario: 'User provides positive feedback about your product',
      template: 'Thank you so much for the kind words, {{name}}! 🙏 It means the world to us to hear that {{product}} is helping you {{benefit}}. We\'re always working to make it even better. What feature would you love to see next?',
      tone: 'friendly',
      platform: 'twitter',
      usage: 45
    },
    {
      id: '2',
      name: 'Address Technical Issue',
      category: 'support',
      scenario: 'User reports a bug or technical problem',
      template: 'Hi {{name}}, thanks for bringing this to our attention. We take all technical issues seriously. I\'ve forwarded this to our dev team and we\'ll have a fix rolling out soon. In the meantime, here\'s a workaround: {{workaround}}. DM us if you need more help!',
      tone: 'professional',
      platform: 'twitter',
      usage: 32
    },
    {
      id: '3',
      name: 'Welcome New Follower',
      category: 'engagement',
      scenario: 'Someone new follows your account',
      template: 'Welcome to the {{company}} family, {{name}}! 👋 We\'re excited to have you here. You\'ll get insider tips on {{topic}}, behind-the-scenes content, and first access to new features. What brings you to our community?',
      tone: 'enthusiastic',
      platform: 'twitter',
      usage: 78
    },
    {
      id: '4',
      name: 'Handle Negative Review',
      category: 'crisis',
      scenario: 'User leaves negative feedback or review',
      template: 'Hi {{name}}, I\'m sorry to hear about your experience with {{product}}. Your feedback is valuable and we want to make this right. Could you DM us with more details? We\'re committed to turning this around and would love the chance to improve your experience.',
      tone: 'empathetic',
      platform: 'linkedin',
      usage: 23
    }
  ]);

  const [communityInsights] = useState<CommunityInsight[]>([
    {
      type: 'sentiment',
      title: 'Positive Sentiment Spike',
      description: 'Your community sentiment improved by 23% this week',
      metric: '+23%',
      action: 'Amplify positive content',
      priority: 'high',
      platform: 'twitter'
    },
    {
      type: 'engagement',
      title: 'Low Engagement Alert',
      description: 'Instagram posts getting 40% fewer likes than usual',
      metric: '-40%',
      action: 'Review content strategy',
      priority: 'medium',
      platform: 'instagram'
    },
    {
      type: 'trending',
      title: 'Trending Topic Opportunity',
      description: '#AIMarketing is trending in your niche',
      metric: '2.4K mentions',
      action: 'Join conversation',
      priority: 'high',
      platform: 'twitter'
    },
    {
      type: 'alert',
      title: 'Response Time Alert',
      description: 'Average response time increased to 4.2 hours',
      metric: '4.2h avg',
      action: 'Speed up responses',
      priority: 'medium',
      platform: 'all'
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'general' as const,
    scenario: '',
    template: '',
    tone: 'friendly' as const,
    platform: 'twitter'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResponseTemplate | null>(null);

  const generateResponseTemplate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'community-response',
          topic: `${newTemplate.category} response for ${newTemplate.scenario}`,
          style: newTemplate.tone,
          platform: newTemplate.platform,
          count: 1
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setNewTemplate(prev => ({
          ...prev,
          template: data.content[0] || ''
        }));
      }
    } catch (error) {
      console.error('Error generating template:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTemplate = () => {
    const template: ResponseTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      category: newTemplate.category,
      scenario: newTemplate.scenario,
      template: newTemplate.template,
      tone: newTemplate.tone,
      platform: newTemplate.platform,
      usage: 0
    };
    setResponseTemplates(prev => [...prev, template]);
    setNewTemplate({
      name: '',
      category: 'general',
      scenario: '',
      template: '',
      tone: 'friendly',
      platform: 'twitter'
    });
    setShowNewTemplate(false);
  };

  const copyTemplate = async (template: string) => {
    await navigator.clipboard.writeText(template);
  };

  const categoryColors = {
    support: 'from-blue-500 to-blue-600',
    engagement: 'from-green-500 to-green-600',
    crisis: 'from-red-500 to-red-600',
    general: 'from-gray-500 to-gray-600',
    promotional: 'from-purple-500 to-purple-600'
  };

  const toneIcons = {
    friendly: Smile,
    professional: User,
    empathetic: Heart,
    enthusiastic: Zap,
    apologetic: AlertCircle
  };

  const stats = [
    { label: 'Active Templates', value: '24', change: '+4', icon: MessageCircle, color: 'text-blue-400' },
    { label: 'Avg Response Time', value: '2.1h', change: '-0.8h', icon: Clock, color: 'text-green-400' },
    { label: 'Community Sentiment', value: '78%', change: '+12%', icon: Heart, color: 'text-pink-400' },
    { label: 'Engagement Rate', value: '5.4%', change: '+1.2%', icon: TrendingUp, color: 'text-purple-400' },
  ];

  const mockConversations = [
    {
      id: '1',
      platform: 'twitter',
      user: '@sarah_codes',
      message: 'Love the new AI features in LaunchPilot! Game changer for content creation 🚀',
      sentiment: 'positive',
      timestamp: '2 minutes ago',
      needsResponse: false
    },
    {
      id: '2',
      platform: 'linkedin',
      user: 'Mike Johnson',
      message: 'Having trouble connecting my Instagram account. The OAuth seems to be broken?',
      sentiment: 'negative',
      timestamp: '15 minutes ago',
      needsResponse: true
    },
    {
      id: '3',
      platform: 'reddit',
      user: 'u/techfounder',
      message: 'How does LaunchPilot compare to other AI marketing tools? Considering switching.',
      sentiment: 'neutral',
      timestamp: '1 hour ago',
      needsResponse: true
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
          <h1 className="text-3xl font-bold font-sora mb-2">Community Management</h1>
          <p className="text-muted-foreground">
            AI-powered tools to manage your community engagement and build stronger relationships
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            onClick={() => setShowNewTemplate(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Template
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
                stat.color === 'text-pink-400' ? 'from-pink-500/20 to-pink-600/20' :
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

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glassmorphism">
          <TabsTrigger value="templates">Response Templates</TabsTrigger>
          <TabsTrigger value="insights">Community Insights</TabsTrigger>
          <TabsTrigger value="conversations">Live Conversations</TabsTrigger>
        </TabsList>

        {/* Response Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          {showNewTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphism rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Create Response Template</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Template name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({...prev, name: e.target.value}))}
                    className="bg-black/20 border-white/10"
                  />
                  <Select value={newTemplate.category} onValueChange={(value: any) => setNewTemplate(prev => ({...prev, category: value}))}>
                    <SelectTrigger className="bg-black/20 border-white/10">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Customer Support</SelectItem>
                      <SelectItem value="engagement">Community Engagement</SelectItem>
                      <SelectItem value="crisis">Crisis Management</SelectItem>
                      <SelectItem value="general">General Response</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={newTemplate.tone} onValueChange={(value: any) => setNewTemplate(prev => ({...prev, tone: value}))}>
                    <SelectTrigger className="bg-black/20 border-white/10">
                      <SelectValue placeholder="Tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="empathetic">Empathetic</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="apologetic">Apologetic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newTemplate.platform} onValueChange={(value) => setNewTemplate(prev => ({...prev, platform: value}))}>
                    <SelectTrigger className="bg-black/20 border-white/10">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="reddit">Reddit</SelectItem>
                      <SelectItem value="all">All Platforms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  placeholder="Scenario (e.g., 'User complains about slow performance')"
                  value={newTemplate.scenario}
                  onChange={(e) => setNewTemplate(prev => ({...prev, scenario: e.target.value}))}
                  className="bg-black/20 border-white/10"
                />

                <div className="flex gap-2 mb-2">
                  <Button
                    onClick={generateResponseTemplate}
                    disabled={isGenerating || !newTemplate.scenario}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Generate AI Response
                  </Button>
                </div>

                <Textarea
                  placeholder="Response template (use {{variables}} for personalization)"
                  value={newTemplate.template}
                  onChange={(e) => setNewTemplate(prev => ({...prev, template: e.target.value}))}
                  className="min-h-[120px] bg-black/20 border-white/10"
                />

                <div className="flex gap-2">
                  <Button onClick={saveTemplate} disabled={!newTemplate.name || !newTemplate.template} className="bg-green-600 hover:bg-green-700">
                    Save Template
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewTemplate(false)} className="glassmorphism">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {responseTemplates.map((template) => {
              const ToneIcon = toneIcons[template.tone];
              return (
                <Card key={template.id} className="glassmorphism p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={`bg-gradient-to-r ${categoryColors[template.category]} text-white border-0 text-xs`}
                        >
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.scenario}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ToneIcon className="h-3 w-3" />
                        <span>{template.tone}</span>
                        <span>•</span>
                        <span>{template.platform}</span>
                        <span>•</span>
                        <span>{template.usage} uses</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-4 mb-4">
                    <p className="text-sm leading-relaxed">
                      {template.template.substring(0, 150)}
                      {template.template.length > 150 && '...'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyTemplate(template.template)}
                      className="glassmorphism flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTemplate(template)}
                      className="glassmorphism flex-1"
                    >
                      View Full
                    </Button>
                  </div>
                </Card>
              );
            })}
          </motion.div>
        </TabsContent>

        {/* Community Insights Tab */}
        <TabsContent value="insights" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {communityInsights.map((insight, index) => (
              <Card key={index} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'sentiment' ? 'bg-green-500/20' :
                      insight.type === 'engagement' ? 'bg-blue-500/20' :
                      insight.type === 'trending' ? 'bg-purple-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {insight.type === 'sentiment' && <Heart className="h-4 w-4 text-green-400" />}
                      {insight.type === 'engagement' && <TrendingUp className="h-4 w-4 text-blue-400" />}
                      {insight.type === 'trending' && <Zap className="h-4 w-4 text-purple-400" />}
                      {insight.type === 'alert' && <AlertCircle className="h-4 w-4 text-red-400" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      insight.priority === 'high' ? 'text-red-400' :
                      insight.priority === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {insight.metric}
                    </div>
                    <div className="text-xs text-muted-foreground">{insight.platform}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`${
                      insight.priority === 'high' ? 'border-red-400 text-red-400' :
                      insight.priority === 'medium' ? 'border-yellow-400 text-yellow-400' :
                      'border-green-400 text-green-400'
                    } text-xs`}
                  >
                    {insight.priority} priority
                  </Badge>
                  <Button size="sm" variant="outline" className="glassmorphism">
                    {insight.action}
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Live Conversations Tab */}
        <TabsContent value="conversations" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {mockConversations.map((conversation) => (
              <Card key={conversation.id} className={`glassmorphism p-6 ${conversation.needsResponse ? 'border-orange-500/50' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      conversation.platform === 'twitter' ? 'bg-blue-500/20' :
                      conversation.platform === 'linkedin' ? 'bg-blue-600/20' :
                      'bg-orange-500/20'
                    }`}>
                      {conversation.platform === 'twitter' && <MessageCircle className="h-4 w-4 text-blue-400" />}
                      {conversation.platform === 'linkedin' && <Users className="h-4 w-4 text-blue-600" />}
                      {conversation.platform === 'reddit' && <MessageCircle className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{conversation.user}</span>
                        <Badge variant="outline" className="text-xs">
                          {conversation.platform}
                        </Badge>
                        <div className={`flex items-center gap-1 ${
                          conversation.sentiment === 'positive' ? 'text-green-400' :
                          conversation.sentiment === 'negative' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {conversation.sentiment === 'positive' && <ThumbsUp className="h-3 w-3" />}
                          {conversation.sentiment === 'negative' && <ThumbsDown className="h-3 w-3" />}
                          {conversation.sentiment === 'neutral' && <Meh className="h-3 w-3" />}
                          <span className="text-xs">{conversation.sentiment}</span>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{conversation.message}</p>
                      <div className="text-xs text-muted-foreground">{conversation.timestamp}</div>
                    </div>
                  </div>
                  {conversation.needsResponse && (
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                      Needs Response
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="glassmorphism">
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  <Button size="sm" variant="outline" className="glassmorphism">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Suggest
                  </Button>
                  {conversation.sentiment === 'negative' && (
                    <Button size="sm" variant="outline" className="glassmorphism text-red-400">
                      <Flag className="h-3 w-3 mr-1" />
                      Escalate
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
              <Button size="sm" variant="ghost" onClick={() => setSelectedTemplate(null)}>
                ✕
              </Button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Scenario:</div>
                  <div className="text-sm">{selectedTemplate.scenario}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Template:</div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <pre className="text-sm whitespace-pre-wrap">{selectedTemplate.template}</pre>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span> {selectedTemplate.category}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tone:</span> {selectedTemplate.tone}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Platform:</span> {selectedTemplate.platform}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usage:</span> {selectedTemplate.usage} times
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/10">
              <Button 
                onClick={() => copyTemplate(selectedTemplate.template)}
                variant="outline" 
                className="glassmorphism"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Template
              </Button>
              <Button 
                onClick={() => setSelectedTemplate(null)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
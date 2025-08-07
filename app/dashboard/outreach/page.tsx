'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send,
  MessageCircle,
  Users,
  Target,
  Zap,
  Plus,
  Copy,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Clock,
  CheckCircle,
  Star,
  Filter,
  Search,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Instagram,
  Edit,
  ArrowRight,
  TrendingUp,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OutreachTemplate {
  id: string;
  name: string;
  platform: string;
  scenario: string;
  template: string;
  personalizationFields: string[];
  successRate: number;
  avgResponseTime: string;
  bestTimeToSend: string;
  followUpTemplate?: string;
  tags: string[];
}

interface OutreachContact {
  id: string;
  name: string;
  email?: string;
  platform: string;
  handle: string;
  company?: string;
  title?: string;
  interests: string[];
  recentActivity: string;
  connectionStrength: 'cold' | 'warm' | 'hot';
  lastContact?: string;
  notes: string;
  customFields: Record<string, string>;
}

interface GeneratedMessage {
  id: string;
  contactId: string;
  template: string;
  personalizedMessage: string;
  platform: string;
  scenario: string;
  personalizationUsed: string[];
  confidence: number;
  estimatedResponseRate: number;
  suggestions: string[];
  followUpScheduled?: string;
}

export default function OutreachPage() {
  const [outreachTemplates] = useState<OutreachTemplate[]>([
    {
      id: '1',
      name: 'SaaS Founder Collaboration',
      platform: 'twitter',
      scenario: 'Reaching out to fellow SaaS founders for partnerships',
      template: 'Hey {name}! 👋 I love what you\'re building with {company}. I\'m working on {your_product} and think there might be some interesting synergies between our tools. Would you be open to a quick chat about potential collaboration opportunities? I have some specific ideas that could benefit both our communities.',
      personalizationFields: ['name', 'company', 'your_product', 'specific_interest'],
      successRate: 34,
      avgResponseTime: '2.3 days',
      bestTimeToSend: 'Tue-Thu, 10-11 AM',
      followUpTemplate: 'Hi {name}, following up on my message about collaboration between {company} and {your_product}. I noticed you recently posted about {recent_activity} - this actually ties into one of the ideas I had! Would next week work for a brief call?',
      tags: ['Collaboration', 'SaaS', 'Partnership']
    },
    {
      id: '2',
      name: 'Influencer Feature Request',
      platform: 'instagram',
      scenario: 'Asking content creators to feature your product',
      template: 'Hi {name}! I\'ve been following your content about {topic} and really appreciate your authentic approach. I think {your_product} could genuinely help your audience with {specific_pain_point}. Would you be interested in trying it out? I\'d love to get your honest feedback and see if it resonates with your community.',
      personalizationFields: ['name', 'topic', 'your_product', 'specific_pain_point', 'recent_content'],
      successRate: 28,
      avgResponseTime: '4.1 days',
      bestTimeToSend: 'Mon-Wed, 2-4 PM',
      tags: ['Influencer', 'Feature Request', 'UGC']
    },
    {
      id: '3',
      name: 'Investor Introduction',
      platform: 'linkedin',
      scenario: 'Cold outreach to potential investors',
      template: 'Hi {name}, I came across your profile and noticed your investment in {portfolio_company}. I\'m {your_name}, founder of {your_product}, which is solving {problem} for {target_market}. We have {traction_metric} and are currently raising our {funding_round}. Given your expertise in {investor_focus}, I\'d love to share our deck and see if there\'s potential alignment.',
      personalizationFields: ['name', 'portfolio_company', 'your_name', 'your_product', 'problem', 'target_market', 'traction_metric', 'funding_round', 'investor_focus'],
      successRate: 12,
      avgResponseTime: '7.2 days',
      bestTimeToSend: 'Tue-Thu, 9-10 AM',
      tags: ['Investor', 'Fundraising', 'Cold Outreach']
    },
    {
      id: '4',
      name: 'Podcast Guest Request',
      platform: 'email',
      scenario: 'Pitching yourself as a podcast guest',
      template: 'Subject: {podcast_name} Guest Idea - {expertise_area} insights\n\nHi {host_name},\n\nI love {podcast_name} and especially enjoyed your recent episode on {recent_episode_topic}. I\'m {your_name}, founder of {company}, and I\'ve been working in {expertise_area} for {years_experience} years.\n\nI have some unique insights on {specific_topic} that I think would resonate with your audience, particularly around {specific_angle}. I\'ve helped {achievement} and have some contrarian takes on {controversial_topic}.\n\nWould you be open to a brief chat about me being a guest? I can send over some talking points that align with your show\'s style.\n\nBest,\n{your_name}',
      personalizationFields: ['podcast_name', 'expertise_area', 'host_name', 'recent_episode_topic', 'your_name', 'company', 'years_experience', 'specific_topic', 'specific_angle', 'achievement', 'controversial_topic'],
      successRate: 22,
      avgResponseTime: '5.8 days',
      bestTimeToSend: 'Mon-Tue, 8-9 AM',
      tags: ['Podcast', 'Guest', 'PR']
    },
    {
      id: '5',
      name: 'Customer Success Check-in',
      platform: 'email',
      scenario: 'Following up with customers for testimonials',
      template: 'Hey {name}! Hope you\'re doing well. It\'s been {time_since_signup} since you started using {product}, and I wanted to check in on how things are going.\n\nI noticed you\'ve been {usage_pattern} - that\'s awesome! I\'d love to hear about your experience and any wins you\'ve had. If {product} has been helpful, would you mind sharing a quick testimonial or review? It really helps other {target_audience} discover us.\n\nAlso, let me know if there\'s anything I can help optimize in your workflow!\n\nBest,\n{your_name}',
      personalizationFields: ['name', 'time_since_signup', 'product', 'usage_pattern', 'target_audience', 'your_name'],
      successRate: 67,
      avgResponseTime: '1.2 days',
      bestTimeToSend: 'Wed-Fri, 1-3 PM',
      tags: ['Customer Success', 'Testimonial', 'Retention']
    }
  ]);

  const [outreachContacts, setOutreachContacts] = useState<OutreachContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@designstudio.co',
      platform: 'twitter',
      handle: '@sarahdesigns',
      company: 'Design Studio Co',
      title: 'Creative Director',
      interests: ['UI/UX Design', 'No-code tools', 'Creative workflows'],
      recentActivity: 'Posted about design system automation',
      connectionStrength: 'warm',
      lastContact: '2 weeks ago',
      notes: 'Met at design conference. Interested in productivity tools for creative teams.',
      customFields: {
        followers: '12K',
        engagement_rate: '4.2%',
        location: 'San Francisco'
      }
    },
    {
      id: '2',
      name: 'Mike Chen',
      platform: 'linkedin',
      handle: 'mike-chen-founder',
      company: 'TechFlow',
      title: 'Co-Founder & CEO',
      interests: ['SaaS', 'AI/ML', 'Startup growth'],
      recentActivity: 'Shared article about AI in business operations',
      connectionStrength: 'cold',
      notes: 'Potential collaboration partner. Building complementary SaaS tools.',
      customFields: {
        company_size: '25-50 employees',
        funding_stage: 'Series A',
        industry: 'B2B SaaS'
      }
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      email: 'emma@podcastnetwork.com',
      platform: 'email',
      handle: 'emma@podcastnetwork.com',
      company: 'Podcast Network',
      title: 'Content Director',
      interests: ['Content creation', 'Marketing', 'Entrepreneurship'],
      recentActivity: 'Looking for guests with marketing automation expertise',
      connectionStrength: 'hot',
      lastContact: '1 month ago',
      notes: 'Expressed interest in having me on their show. Follow up needed.',
      customFields: {
        show_name: 'Growth Marketing Podcast',
        audience_size: '50K monthly downloads',
        typical_guest_profile: 'Marketing leaders, founders'
      }
    }
  ]);

  const [generatedMessages, setGeneratedMessages] = useState<GeneratedMessage[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [messageTopic, setMessageTopic] = useState('');
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    platform: 'twitter',
    handle: '',
    company: '',
    title: '',
    interests: '',
    notes: ''
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    platform: 'twitter',
    scenario: '',
    template: '',
    tags: ''
  });

  const generatePersonalizedMessage = async () => {
    if (!selectedTemplate || !selectedContact) return;

    setIsGenerating(true);
    try {
      const template = outreachTemplates.find(t => t.id === selectedTemplate);
      const contact = outreachContacts.find(c => c.id === selectedContact);
      
      if (!template || !contact) return;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'outreach',
          topic: `${template.scenario} for ${contact.name} at ${contact.company}`,
          style: 'professional',
          platform: template.platform,
          additionalContext: `Contact interests: ${contact.interests.join(', ')}. Recent activity: ${contact.recentActivity}. Connection strength: ${contact.connectionStrength}`,
          count: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const newMessage: GeneratedMessage = {
          id: Date.now().toString(),
          contactId: contact.id,
          template: template.name,
          personalizedMessage: data.content,
          platform: template.platform,
          scenario: template.scenario,
          personalizationUsed: ['name', 'company', 'recent_activity', 'interests'],
          confidence: 87,
          estimatedResponseRate: template.successRate + Math.floor(Math.random() * 20) - 10,
          suggestions: [
            'Consider mentioning their recent post about ' + contact.recentActivity,
            'Add a specific value proposition based on their interests',
            'Include a clear, low-commitment call to action'
          ]
        };

        setGeneratedMessages(prev => [newMessage, ...prev]);
      }
    } catch (error) {
      console.error('Message generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCustomMessage = async () => {
    if (!messageTopic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'outreach',
          topic: messageTopic,
          style: 'professional',
          platform: selectedPlatform === 'all' ? 'email' : selectedPlatform,
          count: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCustomMessage(data.content);
      }
    } catch (error) {
      console.error('Custom message generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyMessage = async (message: string) => {
    await navigator.clipboard.writeText(message);
    toast.success('Copied to clipboard!');
  };

  const addContact = () => {
    if (!newContact.name || !newContact.handle) {
      toast.error('Please fill in name and handle');
      return;
    }

    const contact: OutreachContact = {
      id: Date.now().toString(),
      name: newContact.name,
      email: newContact.email,
      platform: newContact.platform,
      handle: newContact.handle,
      company: newContact.company,
      title: newContact.title,
      interests: newContact.interests.split(',').map(i => i.trim()).filter(Boolean),
      recentActivity: 'Recently added contact',
      connectionStrength: 'cold',
      notes: newContact.notes,
      customFields: {}
    };

    setOutreachContacts(prev => [...prev, contact]);
    setNewContact({
      name: '',
      email: '',
      platform: 'twitter',
      handle: '',
      company: '',
      title: '',
      interests: '',
      notes: ''
    });
    setShowAddContact(false);
    toast.success('Contact added successfully!');
  };

  const addTemplate = () => {
    if (!newTemplate.name || !newTemplate.template) {
      toast.error('Please fill in template name and content');
      return;
    }

    const template: OutreachTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      platform: newTemplate.platform,
      scenario: newTemplate.scenario,
      template: newTemplate.template,
      personalizationFields: ['name', 'company', 'recent_activity'],
      successRate: Math.floor(Math.random() * 30) + 15,
      avgResponseTime: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} days`,
      bestTimeToSend: 'Tue-Thu, 10-11 AM',
      tags: newTemplate.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setOutreachTemplates(prev => [...prev, template]);
    setNewTemplate({
      name: '',
      platform: 'twitter',
      scenario: '',
      template: '',
      tags: ''
    });
    setShowNewTemplate(false);
    toast.success('Template created successfully!');
  };

  const getPlatformLink = (platform: string, message: string, contact: OutreachContact) => {
    const encodedMessage = encodeURIComponent(message);
    
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/messages/compose?recipient_id=${contact.handle.replace('@', '')}`;
      case 'linkedin':
        return `https://www.linkedin.com/messaging/compose/?recipient=${contact.handle}`;
      case 'instagram':
        return `https://www.instagram.com/direct/new/`;
      case 'email':
        return `mailto:${contact.email}?body=${encodedMessage}`;
      default:
        return '#';
    }
  };

  const filteredContacts = selectedPlatform === 'all' 
    ? outreachContacts 
    : outreachContacts.filter(c => c.platform === selectedPlatform);

  const filteredTemplates = selectedPlatform === 'all'
    ? outreachTemplates
    : outreachTemplates.filter(t => t.platform === selectedPlatform);

  const stats = [
    { label: 'Templates Created', value: outreachTemplates.length.toString(), change: '+5', icon: MessageCircle, color: 'text-blue-400' },
    { label: 'Contacts Managed', value: outreachContacts.length.toString(), change: '+12', icon: Users, color: 'text-green-400' },
    { label: 'Avg Response Rate', value: '31%', change: '+8%', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Messages Generated', value: generatedMessages.length.toString(), change: `+${generatedMessages.length}`, icon: Send, color: 'text-pink-400' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">Automated DM/Outreach</h1>
          <p className="text-muted-foreground">
            Generate personalized outreach messages for different platforms and scenarios
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            onClick={() => setShowAddContact(true)}
            variant="outline"
            className="glassmorphism"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
          <Button 
            onClick={() => setShowNewTemplate(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
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

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glassmorphism">
          <TabsTrigger value="generator">Message Generator</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="history">Generated Messages</TabsTrigger>
        </TabsList>

        {/* Message Generator Tab */}
        <TabsContent value="generator" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold">AI-Powered Message Generator</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Template-based Generation */}
              <Card className="glassmorphism-dark p-6">
                <h4 className="font-semibold mb-4">Template-Based Generation</h4>
                <div className="space-y-4">
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="bg-black/20 border-white/10">
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.platform})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedContact} onValueChange={setSelectedContact}>
                    <SelectTrigger className="bg-black/20 border-white/10">
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredContacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} ({contact.platform})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={generatePersonalizedMessage}
                    disabled={isGenerating || !selectedTemplate || !selectedContact}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Generate Personalized Message
                  </Button>
                </div>
              </Card>

              {/* Custom Generation */}
              <Card className="glassmorphism-dark p-6">
                <h4 className="font-semibold mb-4">Custom Message Generation</h4>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe the message you want to generate (e.g., 'Reaching out to a potential podcast host about being a guest to discuss SaaS marketing')"
                    value={messageTopic}
                    onChange={(e) => setMessageTopic(e.target.value)}
                    className="min-h-[100px] bg-black/20 border-white/10"
                  />

                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="bg-black/20 border-white/10">
                      <SelectValue placeholder="Target Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={generateCustomMessage}
                    disabled={isGenerating || !messageTopic.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                    Generate Custom Message
                  </Button>
                </div>
              </Card>
            </div>

            {/* Generated Custom Message Display */}
            {customMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="glassmorphism-dark p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Generated Message</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyMessage(customMessage)}
                        className="glassmorphism"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCustomMessage('')}
                        className="glassmorphism"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{customMessage}</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-48 glassmorphism-dark border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {template.platform}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{template.scenario}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-400">{template.successRate}%</div>
                    <div className="text-xs text-muted-foreground">success rate</div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <p className="text-sm leading-relaxed">{template.template}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Avg Response Time</div>
                    <div className="text-sm font-semibold">{template.avgResponseTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Best Time to Send</div>
                    <div className="text-sm font-semibold">{template.bestTimeToSend}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Personalization Fields:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.personalizationFields.map((field, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Tags:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-blue-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyMessage(template.template)}
                    className="glassmorphism flex-1"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Template
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glassmorphism flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Customize
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {outreachContacts.map((contact) => (
              <Card key={contact.id} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{contact.handle}</p>
                    {contact.company && (
                      <p className="text-xs text-muted-foreground">{contact.title} at {contact.company}</p>
                    )}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      contact.connectionStrength === 'hot' ? 'border-red-400 text-red-400' :
                      contact.connectionStrength === 'warm' ? 'border-yellow-400 text-yellow-400' :
                      'border-blue-400 text-blue-400'
                    }`}
                  >
                    {contact.connectionStrength}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {contact.platform}
                    </Badge>
                    {contact.email && <Mail className="h-3 w-3 text-muted-foreground" />}
                    {contact.platform === 'twitter' && <Twitter className="h-3 w-3 text-muted-foreground" />}
                    {contact.platform === 'linkedin' && <Linkedin className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{contact.recentActivity}</p>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-1">Interests:</div>
                  <div className="flex flex-wrap gap-1">
                    {contact.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-3 mb-4">
                  <div className="text-xs text-muted-foreground mb-1">Notes:</div>
                  <p className="text-xs">{contact.notes}</p>
                </div>

                {contact.lastContact && (
                  <div className="text-xs text-muted-foreground mb-4">
                    Last contact: {contact.lastContact}
                  </div>
                )}

                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Generate Message
                </Button>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Generated Messages History Tab */}
        <TabsContent value="history" className="space-y-6 mt-6">
          {generatedMessages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Messages Generated Yet</h3>
              <p className="text-muted-foreground mb-4">Use the Message Generator tab to create your first personalized outreach message</p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Your First Message
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {generatedMessages.map((message) => {
                const contact = outreachContacts.find(c => c.id === message.contactId);
                if (!contact) return null;

                return (
                  <Card key={message.id} className="glassmorphism p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">{message.scenario}</p>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            {message.platform}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {message.template}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-400">{message.confidence}%</div>
                        <div className="text-xs text-muted-foreground">confidence</div>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 mb-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.personalizedMessage}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Personalization Used:</div>
                        <div className="flex flex-wrap gap-1">
                          {message.personalizationUsed.map((field, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-purple-400">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Estimated Response Rate:</div>
                        <div className="text-sm font-semibold text-green-400">{message.estimatedResponseRate}%</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-2">AI Suggestions:</div>
                      <div className="space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <div key={index} className="text-xs text-muted-foreground bg-yellow-500/10 rounded p-2 flex items-start gap-2">
                            <Sparkles className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyMessage(message.personalizedMessage)}
                        className="glassmorphism flex-1"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Message
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="glassmorphism flex-1"
                        onClick={() => window.open(getPlatformLink(message.platform, message.personalizedMessage, contact), '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Send via {message.platform}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddContact(false)}
          />
          <div className="relative glassmorphism rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-sora mb-6">Add New Contact</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input
                    id="contactName"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., John Smith"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Platform</Label>
                  <Select value={newContact.platform} onValueChange={(value) => setNewContact(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger className="glassmorphism-dark border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactHandle">Handle/Username *</Label>
                  <Input
                    id="contactHandle"
                    value={newContact.handle}
                    onChange={(e) => setNewContact(prev => ({ ...prev, handle: e.target.value }))}
                    placeholder="@username or profile link"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactCompany">Company</Label>
                  <Input
                    id="contactCompany"
                    value={newContact.company}
                    onChange={(e) => setNewContact(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company name"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="contactTitle">Job Title</Label>
                  <Input
                    id="contactTitle"
                    value={newContact.title}
                    onChange={(e) => setNewContact(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., CEO, Marketing Director"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contactInterests">Interests (comma-separated)</Label>
                <Input
                  id="contactInterests"
                  value={newContact.interests}
                  onChange={(e) => setNewContact(prev => ({ ...prev, interests: e.target.value }))}
                  placeholder="SaaS, AI, Marketing, Productivity"
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="contactNotes">Notes</Label>
                <Textarea
                  id="contactNotes"
                  value={newContact.notes}
                  onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any relevant information about this contact..."
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={addContact} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Add Contact
                </Button>
                <Button onClick={() => setShowAddContact(false)} variant="outline" className="glassmorphism">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Template Modal */}
      {showNewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewTemplate(false)}
          />
          <div className="relative glassmorphism rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-sora mb-6">Create New Template</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="templateName">Template Name *</Label>
                  <Input
                    id="templateName"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Podcast Guest Outreach"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label>Platform</Label>
                  <Select value={newTemplate.platform} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger className="glassmorphism-dark border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="templateScenario">Scenario Description</Label>
                <Input
                  id="templateScenario"
                  value={newTemplate.scenario}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, scenario: e.target.value }))}
                  placeholder="e.g., Reaching out to podcast hosts for guest opportunities"
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="templateContent">Template Content *</Label>
                <Textarea
                  id="templateContent"
                  value={newTemplate.template}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, template: e.target.value }))}
                  placeholder="Use {name}, {company}, etc. for personalization fields..."
                  className="glassmorphism-dark border-white/20 min-h-[150px]"
                />
              </div>

              <div>
                <Label htmlFor="templateTags">Tags (comma-separated)</Label>
                <Input
                  id="templateTags"
                  value={newTemplate.tags}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Podcast, Cold Outreach, Partnership"
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={addTemplate} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Create Template
                </Button>
                <Button onClick={() => setShowNewTemplate(false)} variant="outline" className="glassmorphism">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Plus, 
  Send, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
  Settings,
  Upload,
  Download,
  Clock,
  Target,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

interface EmailService {
  id: string;
  serviceName: 'resend' | 'smtp' | 'sendgrid' | 'mailgun' | 'postmark';
  displayName: string;
  isActive: boolean;
  isDefault: boolean;
}

interface OutreachCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  fromName: string;
  fromEmail: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bounceCount: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  isPublic: boolean;
  variables: string[];
}

interface OutreachRecipient {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced';
  openCount: number;
  clickCount: number;
  createdAt: string;
}

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<OutreachCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [recipients, setRecipients] = useState<OutreachRecipient[]>([]);
  const [emailServices, setEmailServices] = useState<EmailService[]>([]);

  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    fromName: '',
    fromEmail: '',
    replyTo: '',
    emailServiceId: ''
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'general',
    subject: '',
    content: ''
  });

  const fetchAll = async () => {
    try {
      const [cRes, tRes, sRes] = await Promise.all([
        fetch('/api/outreach-campaigns'),
        fetch('/api/email-templates'),
        fetch('/api/email-services')
      ]);
      if (cRes.ok) {
        const data = await cRes.json();
        setCampaigns(data.campaigns || []);
      }
      if (tRes.ok) {
        const data = await tRes.json();
        setTemplates(data.templates || []);
      }
      if (sRes.ok) {
        const data = await sRes.json();
        setEmailServices(data.services || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecipients = async (campaignId: string) => {
    try {
      const res = await fetch(`/api/outreach-campaigns/recipients?campaignId=${encodeURIComponent(campaignId)}`);
      if (res.ok) {
        const data = await res.json();
        setRecipients(data.recipients || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      fetchRecipients(selectedCampaign);
    } else {
      setRecipients([]);
    }
  }, [selectedCampaign]);

  const createCampaign = async () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content || !newCampaign.emailServiceId || !newCampaign.fromName || !newCampaign.fromEmail) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const res = await fetch('/api/outreach-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign)
      });
      if (res.ok) {
        await fetchAll();
        setNewCampaign({ name: '', subject: '', content: '', fromName: '', fromEmail: '', replyTo: '', emailServiceId: '' });
        setShowNewCampaign(false);
        toast.success('Campaign created successfully!');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to create campaign');
      }
    } catch (e) {
      toast.error('Failed to create campaign');
    }
  };

  const createTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const res = await fetch('/api/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate)
      });
      if (res.ok) {
        await fetchAll();
        setNewTemplate({ name: '', category: 'general', subject: '', content: '' });
        setShowNewTemplate(false);
        toast.success('Template created successfully!');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to create template');
      }
    } catch (e) {
      toast.error('Failed to create template');
    }
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      const res = await fetch(`/api/outreach-campaigns/${campaignId}/send`, { method: 'POST' });
      if (res.ok) {
        await fetchAll();
        toast.success('Campaign sent');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to send campaign');
      }
    } catch (e) {
      toast.error('Failed to send campaign');
    }
  };

  // Duplicate/Delete not implemented with backend yet; hide related UI.

  const exportData = () => {
    const data = { campaigns, exportedAt: new Date().toISOString() };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'email-campaigns-export.json';
    link.click();
    toast.success('Data exported successfully!');
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'sent' || c.status === 'scheduled' || c.status === 'sending').length,
    totalRecipients: campaigns.reduce((sum, c) => sum + c.totalRecipients, 0),
    avgOpenRate: campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + (c.sentCount > 0 ? (c.openedCount / c.sentCount) * 100 : 0), 0) / campaigns.length : 0,
    avgClickRate: campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + (c.sentCount > 0 ? (c.clickedCount / c.sentCount) * 100 : 0), 0) / campaigns.length : 0
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">
            Email <span className="text-gradient">Campaigns</span>
          </h1>
          <p className="text-muted-foreground">
            Create, send, and track email campaigns that convert
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button onClick={exportData} variant="outline" className="glassmorphism">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setShowNewCampaign(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
      >
        <Card className="glassmorphism p-6">
          <div className="flex items-center justify-between mb-2">
            <Mail className="h-5 w-5 text-blue-400" />
            <span className="text-xs text-green-400">+12%</span>
          </div>
          <div className="text-2xl font-bold font-sora mb-1">{stats.totalCampaigns}</div>
          <div className="text-sm text-muted-foreground">Total Campaigns</div>
        </Card>
        
        <Card className="glassmorphism p-6">
          <div className="flex items-center justify-between mb-2">
            <Send className="h-5 w-5 text-green-400" />
            <span className="text-xs text-green-400">+8%</span>
          </div>
          <div className="text-2xl font-bold font-sora mb-1">{stats.activeCampaigns}</div>
          <div className="text-sm text-muted-foreground">Active Campaigns</div>
        </Card>
        
        <Card className="glassmorphism p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-purple-400" />
            <span className="text-xs text-green-400">+5%</span>
          </div>
          <div className="text-2xl font-bold font-sora mb-1">{stats.totalRecipients.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Recipients</div>
        </Card>
        
        <Card className="glassmorphism p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="h-5 w-5 text-pink-400" />
            <span className="text-xs text-green-400">+3%</span>
          </div>
          <div className="text-2xl font-bold font-sora mb-1">{stats.avgOpenRate.toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground">Avg Open Rate</div>
        </Card>
        
        <Card className="glassmorphism p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-orange-400" />
            <span className="text-xs text-green-400">+2%</span>
          </div>
          <div className="text-2xl font-bold font-sora mb-1">{stats.avgClickRate.toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground">Avg Click Rate</div>
        </Card>
      </motion.div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glassmorphism">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6 mt-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism rounded-xl p-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glassmorphism-dark border-white/20"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="glassmorphism-dark border-white/20 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="glassmorphism-dark border-white/20 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Campaign List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="glassmorphism p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <Badge variant={
                        campaign.status === 'sent' ? 'default' :
                        campaign.status === 'scheduled' ? 'secondary' :
                        campaign.status === 'draft' ? 'outline' : 'destructive'
                      }>
                        {campaign.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {campaign.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                    <div className="text-xs text-muted-foreground">
                      From: {campaign.fromName} &lt;{campaign.fromEmail}&gt;
                    </div>
                  </div>
                  
            <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedCampaign(campaign.id)}
                      className="glassmorphism"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    {campaign.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => sendCampaign(campaign.id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Subscribers</div>
                    <div className="font-semibold">{campaign.subscribers.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Sent</div>
                    <div className="font-semibold">{campaign.sent.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Opened</div>
                    <div className="font-semibold text-blue-400">
                      {campaign.opened.toLocaleString()} 
                      {campaign.sent > 0 && (
                        <span className="text-xs ml-1">
                          ({Math.round((campaign.opened / campaign.sent) * 100)}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Clicked</div>
                    <div className="font-semibold text-green-400">
                      {campaign.clicked.toLocaleString()}
                      {campaign.sent > 0 && (
                        <span className="text-xs ml-1">
                          ({Math.round((campaign.clicked / campaign.sent) * 100)}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {(campaign.sentAt || campaign.scheduledFor) && (
                  <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {campaign.sentAt ? `Sent: ${new Date(campaign.sentAt).toLocaleString()}` : 
                     campaign.scheduledFor ? `Scheduled: ${new Date(campaign.scheduledFor).toLocaleString()}` : ''}
                  </div>
                )}
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center"
          >
            <h2 className="text-xl font-bold font-sora">Email Templates</h2>
            <Button
              onClick={() => setShowNewTemplate(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {templates.map((template) => (
              <Card key={template.id} className="glassmorphism p-6 hover-lift">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Used {template.usageCount} times
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                
                <div className="glassmorphism-dark rounded-lg p-3 mb-4">
                  <div className="text-xs font-semibold mb-1">Subject:</div>
                  <div className="text-xs text-muted-foreground mb-2">{template.subject}</div>
                  <div className="text-xs font-semibold mb-1">Variables:</div>
                  <div className="text-xs text-muted-foreground">{template.variables.join(', ') || 'None'}</div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="glassmorphism flex-1"
                    onClick={() => {
                      setNewCampaign({
                        ...newCampaign,
                        subject: template.subject,
                        content: template.content
                      });
                      setShowNewCampaign(true);
                      toast.success('Template loaded into campaign builder');
                    }}
                  >
                    Use Template
                  </Button>
                   <Button size="sm" variant="outline" className="glassmorphism" disabled>
                     <Edit className="h-3 w-3" />
                   </Button>
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-sora">Subscriber Management</h2>
              <div className="flex gap-3">
                <Button variant="outline" className="glassmorphism">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subscriber
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glassmorphism-dark rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{subscribers.filter(s => s.status === 'active').length}</div>
                <div className="text-sm text-muted-foreground">Active Subscribers</div>
              </div>
              <div className="glassmorphism-dark rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">127</div>
                <div className="text-sm text-muted-foreground">New This Week</div>
              </div>
              <div className="glassmorphism-dark rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">{subscribers.filter(s => s.status === 'unsubscribed').length}</div>
                <div className="text-sm text-muted-foreground">Unsubscribed</div>
              </div>
            </div>

            <div className="space-y-4">
              {subscribers.slice(0, 10).map((subscriber) => (
                <div key={subscriber.id} className="glassmorphism-dark rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                        {subscriber.firstName?.[0] || subscriber.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {subscriber.firstName && subscriber.lastName 
                            ? `${subscriber.firstName} ${subscriber.lastName}` 
                            : subscriber.email}
                        </div>
                        <div className="text-sm text-muted-foreground">{subscriber.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={subscriber.status === 'active' ? 'default' : 'destructive'}>
                        {subscriber.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {subscriber.source}
                      </Badge>
                    </div>
                  </div>
                  {subscriber.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {subscriber.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism rounded-xl p-6"
          >
            <h2 className="text-xl font-bold font-sora mb-6">Email Performance Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glassmorphism-dark rounded-lg p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.avgOpenRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Avg Open Rate</div>
              </div>
              <div className="glassmorphism-dark rounded-lg p-4 text-center">
                <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.avgClickRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Avg Click Rate</div>
              </div>
              <div className="glassmorphism-dark rounded-lg p-4 text-center">
                <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">1.2%</div>
                <div className="text-sm text-muted-foreground">Unsubscribe Rate</div>
              </div>
              <div className="glassmorphism-dark rounded-lg p-4 text-center">
                <BarChart3 className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">8.9</div>
                <div className="text-sm text-muted-foreground">Sender Score</div>
              </div>
            </div>

            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Detailed Analytics Coming Soon</h3>
              <p className="text-muted-foreground">
                Advanced email analytics with charts, A/B testing results, and performance insights.
              </p>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewCampaign(false)}
          />
          <div className="relative glassmorphism rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-sora mb-6">Create New Campaign</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Weekly Newsletter"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label>Email Service</Label>
                  <Select value={newCampaign.emailServiceId} onValueChange={(value: string) => setNewCampaign(prev => ({ ...prev, emailServiceId: value }))}>
                    <SelectTrigger className="glassmorphism-dark border-white/20">
                      <SelectValue placeholder="Choose email service" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailServices.filter(s => s.isActive).map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.displayName} ({service.serviceName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., New features that will save you hours"
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={newCampaign.fromName}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, fromName: e.target.value }))}
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    value={newCampaign.fromEmail}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, fromEmail: e.target.value }))}
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your email content here... Use {{firstName}} for personalization."
                  className="glassmorphism-dark border-white/20 min-h-[200px]"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={createCampaign} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Create Campaign
                </Button>
                <Button onClick={() => setShowNewCampaign(false)} variant="outline" className="glassmorphism">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Template Modal */}
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
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Welcome Email"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Onboarding"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="templateDescription">Description</Label>
                <Input
                  id="templateDescription"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this template"
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="templateSubject">Subject Line</Label>
                <Input
                  id="templateSubject"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Welcome to {{companyName}}!"
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="templateContent">Template Content</Label>
                <Textarea
                  id="templateContent"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your template content here... Use {{variable}} for dynamic content."
                  className="glassmorphism-dark border-white/20 min-h-[200px]"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={createTemplate} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
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

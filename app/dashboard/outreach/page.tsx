'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Send,
  Mail,
  Users,
  Target,
  Zap,
  Plus,
  Copy,
  RefreshCw,
  RefreshCcw,
  ExternalLink,
  Sparkles,
  Clock,
  CheckCircle,
  Star,
  Filter,
  Search,
  Settings,
  Shield,
  Server,
  Key,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  Edit,
  Upload,
  Download,
  Play,
  Pause,
  BarChart3,
  FileSpreadsheet,
  Database,
  Link,
  Calendar,
  X,
  Check,
  FileText,
  Globe,
  HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
// import Papa from 'papaparse';

interface EmailService {
  id: string;
  serviceName: 'resend' | 'smtp' | 'sendgrid' | 'mailgun' | 'postmark';
  displayName: string;
  isActive: boolean;
  isDefault: boolean;
  totalSent: number;
  lastUsedAt?: string;
  createdAt: string;
  credentials?: any;
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
  customFields?: Record<string, any>;
  createdAt: string;
}

type DataSourceType = 'csv' | 'crm' | 'database' | 'api';

interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  provider?: string;
  isActive: boolean;
  createdAt: string;
  config?: Record<string, any>;
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

export default function OutreachPage() {
  const [emailServices, setEmailServices] = useState<EmailService[]>([]);
  const [campaigns, setCampaigns] = useState<OutreachCampaign[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [recipients, setRecipients] = useState<OutreachRecipient[]>([]);
  const [crmProviders, setCrmProviders] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [showAddService, setShowAddService] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showAddDataSource, setShowAddDataSource] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingService, setEditingService] = useState<EmailService | null>(null);
  const [testingService, setTestingService] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({});
  const [testEmail, setTestEmail] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  
  const [newService, setNewService] = useState({
    serviceName: 'resend' as const,
    displayName: '',
    isDefault: false,
    credentials: {} as Record<string, any>
  });

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    fromName: '',
    fromEmail: '',
    replyTo: '',
    emailServiceId: '',
    scheduledAt: '',
    useTemplate: false
  });

  const [newDataSource, setNewDataSource] = useState<{
    name: string;
    type: DataSourceType;
    provider: string;
    config: Record<string, any>;
    credentials: Record<string, any>;
  }>({
    name: '',
    type: 'csv',
    provider: '',
    config: {} as Record<string, any>,
    credentials: {} as Record<string, any>
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'general'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      fetchRecipients(selectedCampaign);
    } else {
      setRecipients([]);
    }
  }, [selectedCampaign]);

  const fetchData = async () => {
    try {
      const [servicesRes, campaignsRes, dataSourcesRes, templatesRes] = await Promise.all([
        fetch('/api/email-services'),
        fetch('/api/outreach-campaigns'),
        fetch('/api/data-sources'),
        fetch('/api/email-templates')
      ]);
      
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setEmailServices(servicesData.services || []);
      }
      
      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      if (dataSourcesRes.ok) {
        const dsData = await dataSourcesRes.json();
        setDataSources(dsData.dataSources || []);
        setCrmProviders(dsData.providers || {});
      }

      if (templatesRes.ok) {
        const tmplData = await templatesRes.json();
        setEmailTemplates(tmplData.templates || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async (campaignId: string) => {
    try {
      const res = await fetch(`/api/outreach-campaigns/recipients?campaignId=${encodeURIComponent(campaignId)}`);
      if (res.ok) {
        const data = await res.json();
        setRecipients(data.recipients || []);
      }
    } catch (error) {
      console.error('Failed to fetch recipients:', error);
    }
  };

  const serviceConfigs = {
    resend: {
      name: 'Resend',
      description: 'Modern email API for developers',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 're_xxxxxxxxxx' },
        { key: 'fromEmail', label: 'From Email', type: 'email', placeholder: 'noreply@yourdomain.com' }
      ]
    },
    smtp: {
      name: 'SMTP Server',
      description: 'Connect to any SMTP email server',
      icon: Server,
      color: 'from-gray-500 to-gray-600',
      fields: [
        { key: 'host', label: 'SMTP Host', type: 'text', placeholder: 'smtp.gmail.com' },
        { key: 'port', label: 'Port', type: 'number', placeholder: '587' },
        { key: 'username', label: 'Username', type: 'text', placeholder: 'your-email@gmail.com' },
        { key: 'password', label: 'Password', type: 'password', placeholder: 'App password or SMTP password' },
        { key: 'fromEmail', label: 'From Email', type: 'email', placeholder: 'noreply@yourdomain.com' },
        { key: 'secure', label: 'Use TLS', type: 'boolean', placeholder: 'true' }
      ]
    },
    sendgrid: {
      name: 'SendGrid',
      description: 'Reliable email delivery platform',
      icon: Send,
      color: 'from-green-500 to-green-600',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'SG.xxxxxxxxxx' },
        { key: 'fromEmail', label: 'From Email', type: 'email', placeholder: 'noreply@yourdomain.com' }
      ]
    },
    mailgun: {
      name: 'Mailgun',
      description: 'Email automation for developers',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'key-xxxxxxxxxx' },
        { key: 'domain', label: 'Domain', type: 'text', placeholder: 'mg.yourdomain.com' },
        { key: 'fromEmail', label: 'From Email', type: 'email', placeholder: 'noreply@yourdomain.com' }
      ]
    },
    postmark: {
      name: 'Postmark',
      description: 'Fast & reliable email delivery',
      icon: Target,
      color: 'from-yellow-500 to-yellow-600',
      fields: [
        { key: 'apiKey', label: 'Server Token', type: 'password', placeholder: 'xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
        { key: 'fromEmail', label: 'From Email', type: 'email', placeholder: 'noreply@yourdomain.com' }
      ]
    }
  };

  const addEmailService = async () => {
    try {
      const response = await fetch('/api/email-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      });

      if (response.ok) {
        await fetchData();
        resetServiceForm();
        setShowAddService(false);
        toast.success('Email service added successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add email service');
      }
    } catch (error) {
      console.error('Add service error:', error);
      toast.error('Failed to add email service');
    }
  };

  const createCampaign = async () => {
    try {
      const response = await fetch('/api/outreach-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign)
      });

      if (response.ok) {
        await fetchData();
        resetCampaignForm();
        setShowCreateCampaign(false);
        toast.success('Campaign created successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Create campaign error:', error);
      toast.error('Failed to create campaign');
    }
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/outreach-campaigns/${campaignId}/send`, {
        method: 'POST'
      });

      if (response.ok) {
        await fetchData();
        toast.success('Campaign sending started!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send campaign');
      }
    } catch (error) {
      console.error('Send campaign error:', error);
      toast.error('Failed to send campaign');
    }
  };

  const testEmailService = async (serviceId: string) => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }

    setTestingService(serviceId);
    try {
      const response = await fetch('/api/email-services/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, testEmail })
      });

      if (response.ok) {
        toast.success('Test email sent successfully!');
        await fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Test service error:', error);
      toast.error('Failed to send test email');
    } finally {
      setTestingService(null);
    }
  };

  const resetServiceForm = () => {
    setNewService({
      serviceName: 'resend',
      displayName: '',
      isDefault: false,
      credentials: {}
    });
  };

  const resetCampaignForm = () => {
    setNewCampaign({
      name: '',
      subject: '',
      content: '',
      fromName: '',
      fromEmail: '',
      replyTo: '',
      emailServiceId: '',
      scheduledAt: '',
      useTemplate: false
    });
  };

  const resetDataSourceForm = () => {
    setNewDataSource({
      name: '',
      type: 'csv',
      provider: '',
      config: {},
      credentials: {}
    });
  };

  const resetTemplateForm = () => {
    setNewTemplate({
      name: '',
      subject: '',
      content: '',
      category: 'general'
    });
  };

  const handleCredentialChange = (key: string, value: string | boolean) => {
    setNewService(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [key]: value
      }
    }));
  };

  const toggleCredentialVisibility = (serviceId: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const getOpenRate = (campaign: OutreachCampaign) => {
    return campaign.sentCount > 0 ? Math.round((campaign.openedCount / campaign.sentCount) * 100) : 0;
  };

  const getClickRate = (campaign: OutreachCampaign) => {
    return campaign.sentCount > 0 ? Math.round((campaign.clickedCount / campaign.sentCount) * 100) : 0;
  };

  // File upload functionality
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!selectedCampaign) {
      toast.error('Please select a campaign first');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('campaignId', selectedCampaign);

      const response = await fetch('/api/outreach-campaigns/recipients', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Successfully imported ${data.imported} recipients`);
        await fetchData();
        if (selectedCampaign) {
          await fetchRecipients(selectedCampaign);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [selectedCampaign]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  // Data source management
  const addDataSource = async () => {
    try {
      const response = await fetch('/api/data-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDataSource)
      });

      if (response.ok) {
        await fetchData();
        resetDataSourceForm();
        setShowAddDataSource(false);
        toast.success('Data source added successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add data source');
      }
    } catch (error) {
      console.error('Add data source error:', error);
      toast.error('Failed to add data source');
    }
  };

  const syncDataSource = async (dataSourceId: string) => {
    if (!selectedCampaign) {
      toast.error('Please select a campaign first');
      return;
    }

    setSyncing(dataSourceId);
    try {
      const response = await fetch('/api/data-sources/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataSourceId, campaignId: selectedCampaign })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Successfully imported ${data.imported} recipients`);
        await fetchData();
        if (selectedCampaign) {
          await fetchRecipients(selectedCampaign);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to sync data source');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync data source');
    } finally {
      setSyncing(null);
    }
  };

  // Template management
  const createTemplate = async () => {
    try {
      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate)
      });

      if (response.ok) {
        await fetchData();
        resetTemplateForm();
        setShowTemplateModal(false);
        toast.success('Template created successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create template');
      }
    } catch (error) {
      console.error('Create template error:', error);
      toast.error('Failed to create template');
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setNewCampaign(prev => ({
        ...prev,
        subject: template.subject,
        content: template.content,
        useTemplate: true
      }));
      setSelectedTemplate(templateId);
    }
  };

  const stats = [
    { 
      label: 'Email Services', 
      value: emailServices.filter(s => s.isActive).length.toString(), 
      change: `${emailServices.length} total`, 
      icon: Server, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Total Campaigns', 
      value: campaigns.length.toString(), 
      change: campaigns.filter(c => c.status === 'sent').length + ' sent', 
      icon: Mail, 
      color: 'text-green-400' 
    },
    { 
      label: 'Total Recipients', 
      value: campaigns.reduce((total, c) => total + c.totalRecipients, 0).toString(), 
      change: campaigns.reduce((total, c) => total + c.sentCount, 0) + ' sent', 
      icon: Users, 
      color: 'text-purple-400' 
    },
    { 
      label: 'Avg Open Rate', 
      value: campaigns.length > 0 ? Math.round(campaigns.reduce((total, c) => total + getOpenRate(c), 0) / campaigns.length) + '%' : '0%', 
      change: 'All campaigns', 
      icon: BarChart3, 
      color: 'text-yellow-400' 
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">Email Outreach</h1>
          <p className="text-muted-foreground">
            Create and manage email campaigns to reach your audience effectively
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          {emailServices.length > 0 && (
            <Button
              onClick={() => setShowCreateCampaign(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          )}
          <Button
            onClick={() => setShowAddService(true)}
            variant={emailServices.length === 0 ? "default" : "outline"}
            className={emailServices.length === 0 ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" : "glassmorphism"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {emailServices.length === 0 ? 'Add Email Service' : 'Add Service'}
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
                stat.color === 'text-yellow-400' ? 'from-yellow-500/20 to-yellow-600/20' :
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

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-5 glassmorphism">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="services">Email Services</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6 mt-6">
          {campaigns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="glassmorphism rounded-2xl p-12 max-w-2xl mx-auto">
                <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold font-sora mb-4">No Campaigns Yet</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {emailServices.length === 0 
                    ? "Add an email service first, then create your first outreach campaign to start reaching your audience."
                    : "Create your first outreach campaign to start reaching your audience with personalized emails."
                  }
                </p>
                {emailServices.length > 0 ? (
                  <Button 
                    onClick={() => setShowCreateCampaign(true)}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Campaign
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowAddService(true)}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Email Service First
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="glassmorphism p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            campaign.status === 'sent' ? 'text-green-400 border-green-400' :
                            campaign.status === 'sending' ? 'text-blue-400 border-blue-400' :
                            campaign.status === 'scheduled' ? 'text-yellow-400 border-yellow-400' :
                            campaign.status === 'paused' ? 'text-orange-400 border-orange-400' :
                            'text-gray-400 border-gray-400'
                          }`}
                        >
                          {campaign.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {campaign.totalRecipients} recipients
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-xs text-muted-foreground">Sent</div>
                      <div className="text-lg font-semibold">{campaign.sentCount}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Opens</div>
                      <div className="text-lg font-semibold text-green-400">
                        {getOpenRate(campaign)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Clicks</div>
                      <div className="text-lg font-semibold text-blue-400">
                        {getClickRate(campaign)}%
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-3 mb-4">
                    <div className="text-xs text-muted-foreground mb-1">From:</div>
                    <div className="text-sm font-mono">
                      {campaign.fromName} &lt;{campaign.fromEmail}&gt;
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {campaign.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => sendCampaign(campaign.id)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 flex-1"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send Campaign
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="glassmorphism flex-1"
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      View Analytics
                    </Button>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </TabsContent>

        {/* Email Services Tab */}
        <TabsContent value="services" className="space-y-6 mt-6">
          {emailServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="glassmorphism rounded-2xl p-12 max-w-2xl mx-auto">
                <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold font-sora mb-4">No Email Services Configured</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Add your first email service to start sending outreach campaigns. 
                  We support popular services like Resend, SendGrid, and SMTP servers.
                </p>
                <Button 
                  onClick={() => setShowAddService(true)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Email Service
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {emailServices.map((service) => {
                const config = serviceConfigs[service.serviceName];
                const ServiceIcon = config.icon;
                
                return (
                  <Card key={service.id} className="glassmorphism p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}/20`}>
                          <ServiceIcon className={`h-5 w-5`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{service.displayName}</h3>
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {service.isDefault && (
                          <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            service.isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'
                          }`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground">Total Sent</div>
                        <div className="text-lg font-semibold">{service.totalSent}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Last Used</div>
                        <div className="text-sm font-semibold">
                          {service.lastUsedAt ? new Date(service.lastUsedAt).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-3 mb-4">
                      <div className="text-xs text-muted-foreground mb-1">Service Type:</div>
                      <div className="text-sm font-mono">{config.name}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Fetch credentials for editing
                          fetch(`/api/email-services/${service.id}`)
                            .then(res => res.json())
                            .then(data => {
                              setEditingService({ ...service, credentials: data.credentials });
                            });
                        }}
                        className="glassmorphism flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this service?')) {
                            // Delete service logic would go here
                          }
                        }}
                        className="glassmorphism text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </motion.div>
          )}

          {/* Test Section */}
          {emailServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glassmorphism rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Test Your Email Services</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testEmail" className="text-sm font-medium mb-2 block">
                    Test Email Address
                  </Label>
                  <Input
                    id="testEmail"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      const defaultService = emailServices.find(s => s.isDefault && s.isActive);
                      if (defaultService) {
                        testEmailService(defaultService.id);
                      } else {
                        toast.error('Please set a default active service first');
                      }
                    }}
                    disabled={!testEmail || testingService !== null}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {testingService ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Test Default Service
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* Recipients Tab */}
        <TabsContent value="recipients" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Campaign Selector */}
            <Card className="glassmorphism p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Select Campaign</h3>
                {selectedCampaign && recipients.length > 0 && (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {recipients.length} recipients
                  </Badge>
                )}
              </div>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="glassmorphism-dark border-white/20">
                  <SelectValue placeholder="Choose a campaign to manage recipients" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name} ({campaign.totalRecipients} recipients)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {/* File Upload Section */}
            {selectedCampaign && (
              <Card className="glassmorphism p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Recipients
                </h3>
                
                <div {...getRootProps()} className={`
                  border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-blue-400 bg-blue-400/10' : 'hover:border-white/40'}
                  ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}>
                  <input {...getInputProps()} disabled={uploading} />
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  {uploading ? (
                    <div>
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p>Uploading and processing...</p>
                    </div>
                  ) : isDragActive ? (
                    <p>Drop the file here...</p>
                  ) : (
                    <div>
                      <p className="text-lg mb-2">Drag & drop a CSV file here, or click to select</p>
                      <p className="text-sm text-muted-foreground">
                        Supports CSV, XLS, and XLSX files. Expected columns: email, firstName, lastName, company, title
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="glassmorphism flex-1"
                    onClick={() => {
                      // Download CSV template
                      const csvContent = 'email,firstName,lastName,company,title\nexample@company.com,John,Doe,Acme Corp,CEO';
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'recipients-template.csv';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </Card>
            )}

            {/* Recipients List */}
            {selectedCampaign && recipients.length > 0 && (
              <Card className="glassmorphism p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recipients</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="glassmorphism"
                      onClick={() => fetchRecipients(selectedCampaign)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Company</th>
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipients.slice(0, 50).map((recipient) => (
                        <tr key={recipient.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-2 font-mono text-xs">{recipient.email}</td>
                          <td className="p-2">
                            {recipient.firstName || recipient.lastName
                              ? `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim()
                              : '-'
                            }
                          </td>
                          <td className="p-2">{recipient.company || '-'}</td>
                          <td className="p-2">{recipient.title || '-'}</td>
                          <td className="p-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                recipient.status === 'sent' ? 'text-green-400 border-green-400' :
                                recipient.status === 'delivered' ? 'text-blue-400 border-blue-400' :
                                recipient.status === 'opened' ? 'text-purple-400 border-purple-400' :
                                recipient.status === 'clicked' ? 'text-yellow-400 border-yellow-400' :
                                recipient.status === 'bounced' ? 'text-red-400 border-red-400' :
                                'text-gray-400 border-gray-400'
                              }`}
                            >
                              {recipient.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-xs text-muted-foreground">
                            {new Date(recipient.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {recipients.length > 50 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Showing first 50 of {recipients.length} recipients
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Empty State */}
            {!selectedCampaign && (
              <div className="text-center py-16">
                <div className="glassmorphism rounded-2xl p-12 max-w-2xl mx-auto">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-bold font-sora mb-4">Recipient Management</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Select a campaign above to upload and manage recipients. Track engagement and manage your contact lists.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </TabsContent>

        {/* Data Sources Tab */}
        <TabsContent value="data-sources" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Data Sources</h3>
                <p className="text-muted-foreground">Connect your CRM, databases, and other data sources</p>
              </div>
              <Button
                onClick={() => setShowAddDataSource(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Data Source
              </Button>
            </div>

            {/* Data Sources Grid */}
            {dataSources.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dataSources.map((source) => (
                  <Card key={source.id} className="glassmorphism p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                          <Database className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{source.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{source.type} · {source.provider || 'Custom'}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          source.isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'
                        }`}
                      >
                        {source.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="bg-black/20 rounded-lg p-3 mb-4">
                      <div className="text-xs text-muted-foreground mb-1">Created:</div>
                      <div className="text-sm">{new Date(source.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => syncDataSource(source.id)}
                        disabled={!selectedCampaign || syncing === source.id}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 flex-1"
                      >
                        {syncing === source.id ? (
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <RefreshCcw className="h-3 w-3 mr-1" />
                          )}
                        Sync to Campaign
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="glassmorphism"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="glassmorphism rounded-2xl p-12 max-w-2xl mx-auto">
                  <Database className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-bold font-sora mb-4">No Data Sources Yet</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Connect your CRM, upload CSV files, or connect to databases to automatically sync recipient data.
                  </p>
                  <Button 
                    onClick={() => setShowAddDataSource(true)}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Data Source
                  </Button>
                </div>
              </div>
            )}

            {/* Sync Info */}
            {!selectedCampaign && dataSources.length > 0 && (
              <Card className="glassmorphism p-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <h4 className="font-semibold">Select a Campaign</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  To sync data from your sources, first select a campaign in the Recipients tab.
                </p>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Email Templates</h3>
                <p className="text-muted-foreground">Create and manage reusable email templates</p>
              </div>
              <Button
                onClick={() => setShowTemplateModal(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {emailTemplates.map((template) => (
                <Card key={template.id} className="glassmorphism p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20">
                          <FileText className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{template.category}</p>
                      </div>
                    </div>
                    {template.isPublic && (
                      <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                        Public
                      </Badge>
                    )}
                  </div>

                  <div className="bg-black/20 rounded-lg p-3 mb-4">
                    <div className="text-xs text-muted-foreground mb-1">Subject:</div>
                    <div className="text-sm font-mono truncate">{template.subject}</div>
                  </div>

                  <div className="text-xs text-muted-foreground mb-4">
                    Variables: {template.variables.join(', ') || 'None'}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => applyTemplate(template.id)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Use Template
                    </Button>
                    {!template.isPublic && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="glassmorphism"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {emailTemplates.length === 0 && (
              <div className="text-center py-16">
                    <div className="glassmorphism rounded-2xl p-12 max-w-2xl mx-auto">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-bold font-sora mb-4">No Templates Yet</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Create your first email template to speed up campaign creation with pre-built content.
                  </p>
                  <Button 
                    onClick={() => setShowTemplateModal(true)}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Template
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Add Email Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddService(false)}
          />
          <div className="relative glassmorphism rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-sora mb-6">Add Email Service</h3>
            
            <div className="space-y-6">
              {/* Service Type Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Service Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(serviceConfigs).map(([key, config]) => {
                    const ServiceIcon = config.icon;
                    return (
                      <Button
                        key={key}
                        variant={newService.serviceName === key ? "default" : "outline"}
                        className={`p-4 h-auto flex flex-col gap-2 glassmorphism ${
                          newService.serviceName === key 
                            ? `bg-gradient-to-r ${config.color} text-white` 
                            : ''
                        }`}
                        onClick={() => setNewService(prev => ({ 
                          ...prev, 
                          serviceName: key as any,
                          displayName: config.name,
                          credentials: {}
                        }))}
                      >
                        <ServiceIcon className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-semibold text-sm">{config.name}</div>
                          <div className="text-xs opacity-70">{config.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Service Configuration */}
              <div>
                <Label htmlFor="displayName" className="text-sm font-medium mb-2 block">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={newService.displayName}
                  onChange={(e) => setNewService(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="My Email Service"
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              {/* Dynamic Credential Fields */}
              <div className="space-y-4">
                <Label className="text-sm font-medium block">Service Configuration</Label>
                {serviceConfigs[newService.serviceName].fields.map((field) => (
                  <div key={field.key}>
                    <Label htmlFor={field.key} className="text-sm font-medium mb-1 block">
                      {field.label}
                    </Label>
                    {field.type === 'boolean' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={field.key}
                          checked={newService.credentials[field.key] || false}
                          onChange={(e) => handleCredentialChange(field.key, e.target.checked)}
                          className="rounded border-white/20"
                        />
                        <Label htmlFor={field.key} className="text-sm">
                          {field.placeholder}
                        </Label>
                      </div>
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type}
                        value={newService.credentials[field.key] || ''}
                        onChange={(e) => handleCredentialChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="glassmorphism-dark border-white/20"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Default Service Option */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newService.isDefault}
                  onChange={(e) => setNewService(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="rounded border-white/20"
                />
                <Label htmlFor="isDefault" className="text-sm">
                  Set as default email service
                </Label>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={addEmailService}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Add Service
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddService(false);
                    resetServiceForm();
                  }}
                  variant="outline" 
                  className="glassmorphism"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateCampaign(false)}
          />
          <div className="relative glassmorphism rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-sora mb-6">Create Email Campaign</h3>
            
            <div className="space-y-6">
              {/* Campaign Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaignName" className="text-sm font-medium mb-2 block">
                    Campaign Name
                  </Label>
                  <Input
                    id="campaignName"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Product Launch Outreach"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="emailServiceSelect" className="text-sm font-medium mb-2 block">
                    Email Service
                  </Label>
                  <Select 
                    value={newCampaign.emailServiceId} 
                    onValueChange={(value) => setNewCampaign(prev => ({ ...prev, emailServiceId: value }))}
                  >
                    <SelectTrigger className="glassmorphism-dark border-white/20">
                      <SelectValue placeholder="Choose email service" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailServices.filter(s => s.isActive).map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.displayName} ({serviceConfigs[service.serviceName].name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Email Details */}
              <div>
                <Label htmlFor="emailSubject" className="text-sm font-medium mb-2 block">
                  Email Subject
                </Label>
                <Input
                  id="emailSubject"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Introducing our new product - exclusive early access"
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromName" className="text-sm font-medium mb-2 block">
                    From Name
                  </Label>
                  <Input
                    id="fromName"
                    value={newCampaign.fromName}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, fromName: e.target.value }))}
                    placeholder="John Doe"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail" className="text-sm font-medium mb-2 block">
                    From Email
                  </Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={newCampaign.fromEmail}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, fromEmail: e.target.value }))}
                    placeholder="noreply@yourcompany.com"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="replyTo" className="text-sm font-medium mb-2 block">
                  Reply To (Optional)
                </Label>
                <Input
                  id="replyTo"
                  type="email"
                  value={newCampaign.replyTo}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, replyTo: e.target.value }))}
                  placeholder="support@yourcompany.com"
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              {/* Email Content */}
              <div>
                <Label htmlFor="emailContent" className="text-sm font-medium mb-2 block">
                  Email Content
                </Label>
                <Textarea
                  id="emailContent"
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Hi {{firstName}},

I hope this email finds you well! I wanted to personally reach out to let you know about something exciting we've been working on...

Best regards,
{{fromName}}"
                  className="glassmorphism-dark border-white/20 min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use &#123;&#123;firstName&#125;&#125;, &#123;&#123;lastName&#125;&#125;, &#123;&#123;company&#125;&#125; for personalization
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={createCampaign}
                  disabled={!newCampaign.name || !newCampaign.subject || !newCampaign.content || !newCampaign.emailServiceId}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  Create Campaign
                </Button>
                <Button 
                  onClick={() => {
                    setShowCreateCampaign(false);
                    resetCampaignForm();
                  }}
                  variant="outline" 
                  className="glassmorphism"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Data Source Modal */}
      {showAddDataSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddDataSource(false)}
          />
          <div className="relative glassmorphism rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-sora mb-6">Add Data Source</h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Name</Label>
                  <Input
                    value={newDataSource.name}
                    onChange={(e) => setNewDataSource(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Sales contacts"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Type</Label>
                  <Select
                    value={newDataSource.type}
                    onValueChange={(value) => setNewDataSource(prev => ({ ...prev, type: value as 'csv' | 'crm' | 'database' | 'api' }))}
                  >
                    <SelectTrigger className="glassmorphism-dark border-white/20">
                      <SelectValue placeholder="Choose type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV Upload</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newDataSource.type === ('crm' as DataSourceType) && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium block">CRM Provider</Label>
                  <Select
                    value={newDataSource.provider}
                    onValueChange={(value) => setNewDataSource(prev => ({ ...prev, provider: value }))}
                  >
                    <SelectTrigger className="glassmorphism-dark border-white/20">
                      <SelectValue placeholder="Choose provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(crmProviders).map((key) => (
                        <SelectItem key={key} value={key}>{crmProviders[key].name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newDataSource.provider && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(crmProviders[newDataSource.provider]?.fields || []).map((field: any) => (
                        <div key={field.key}>
                          <Label className="text-sm font-medium mb-1 block">{field.label}</Label>
                          <Input
                            type={field.type === 'password' ? 'password' : 'text'}
                            value={(newDataSource.credentials as any)[field.key] || ''}
                            onChange={(e) => setNewDataSource(prev => ({
                              ...prev,
                              credentials: { ...prev.credentials, [field.key]: e.target.value }
                            }))}
                            placeholder={field.label}
                            className="glassmorphism-dark border-white/20"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {newDataSource.type === ('database' as DataSourceType) && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium block">Database Connection</Label>
                  <Input
                    placeholder="Public HTTPS URL to a query endpoint"
                    value={(newDataSource.config as any).url || ''}
                    onChange={(e) => setNewDataSource(prev => ({ ...prev, config: { ...prev.config, url: e.target.value } }))}
                    className="glassmorphism-dark border-white/20"
                  />
                  <Textarea
                    placeholder="SELECT email, firstName, lastName, company, title FROM contacts WHERE subscribed = true"
                    value={(newDataSource.config as any).query || ''}
                    onChange={(e) => setNewDataSource(prev => ({ ...prev, config: { ...prev.config, query: e.target.value } }))}
                    className="glassmorphism-dark border-white/20 min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">Only HTTPS endpoints to approved providers are allowed.</p>
                </div>
              )}

              {newDataSource.type === ('api' as DataSourceType) && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium block">API Configuration</Label>
                  <Input
                    placeholder="https://sheets.googleapis.com/..."
                    value={(newDataSource.config as any).url || ''}
                    onChange={(e) => setNewDataSource(prev => ({ ...prev, config: { ...prev.config, url: e.target.value } }))}
                    className="glassmorphism-dark border-white/20"
                  />
                  <Input
                    placeholder="GET | POST"
                    value={(newDataSource.config as any).method || ''}
                    onChange={(e) => setNewDataSource(prev => ({ ...prev, config: { ...prev.config, method: e.target.value } }))}
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={addDataSource}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Add Data Source
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddDataSource(false);
                    resetDataSourceForm();
                  }}
                  variant="outline" 
                  className="glassmorphism"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowTemplateModal(false)}
          />
          <div className="relative glassmorphism rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-sora mb-6">Create Email Template</h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Name</Label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Intro template"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Category</Label>
                  <Input
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="general"
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Subject</Label>
                <Input
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Quick intro - {{companyName}} x {{firstName}}"
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Content</Label>
                <Textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Hi {{firstName}},\n\n...\n\nBest,\n{{fromName}}"
                  className="glassmorphism-dark border-white/20 min-h-[220px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use variables like {'{{firstName}}'}, {'{{company}}'} in subject and content.
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={createTemplate}
                  disabled={!newTemplate.name || !newTemplate.subject || !newTemplate.content}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  Create Template
                </Button>
                <Button 
                  onClick={() => {
                    setShowTemplateModal(false);
                    resetTemplateForm();
                  }}
                  variant="outline" 
                  className="glassmorphism"
                >
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
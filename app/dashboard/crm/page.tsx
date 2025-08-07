'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  Star,
  MessageCircle,
  ExternalLink,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  MoreVertical,
  Tag,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  title?: string;
  phone?: string;
  website?: string;
  location?: string;
  avatar?: string;
  status: 'lead' | 'customer' | 'partner' | 'collaborator';
  score: number;
  lastContact: string;
  source: string;
  tags: string[];
  notes: string;
  interactions: number;
  value?: number;
  socialProfiles: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

interface Deal {
  id: string;
  contactId: string;
  title: string;
  value: number;
  stage: 'prospect' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  createdDate: string;
  notes: string;
}

export default function CRMPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@techstartup.com',
      company: 'TechStartup Inc',
      title: 'Founder & CEO',
      phone: '+1-555-0123',
      website: 'techstartup.com',
      location: 'San Francisco, CA',
      status: 'lead',
      score: 85,
      lastContact: '2 days ago',
      source: 'Twitter',
      tags: ['SaaS', 'Founder', 'High Priority'],
      notes: 'Interested in AI marketing tools. Has 10K Twitter followers. Mentioned budget of $500/month.',
      interactions: 12,
      value: 500,
      socialProfiles: {
        twitter: '@sarahbuilds',
        linkedin: 'sarah-chen-ceo'
      }
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      email: 'mike@growthco.io',
      company: 'Growth Co',
      title: 'Head of Marketing',
      phone: '+1-555-0124',
      location: 'New York, NY',
      status: 'customer',
      score: 92,
      lastContact: '1 week ago',
      source: 'LinkedIn',
      tags: ['Marketing', 'Customer', 'Power User'],
      notes: 'Loves the AI content features. Potential upsell opportunity for team plan.',
      interactions: 28,
      value: 1200,
      socialProfiles: {
        linkedin: 'mike-rodriguez-growth',
        twitter: '@mikegrows'
      }
    },
    {
      id: '3',
      name: 'Emma Thompson',
      email: 'emma@creativestudio.co',
      company: 'Creative Studio Co',
      title: 'Creative Director',
      phone: '+1-555-0125',
      location: 'Austin, TX',
      status: 'partner',
      score: 78,
      lastContact: '3 days ago',
      source: 'Referral',
      tags: ['Design', 'Partner', 'Content Creator'],
      notes: 'Interested in collaboration for design templates. Has strong Instagram presence.',
      interactions: 15,
      value: 2000,
      socialProfiles: {
        instagram: '@emmacreates',
        linkedin: 'emma-thompson-creative'
      }
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david@indiehacker.dev',
      company: 'IndieHacker Dev',
      title: 'Solo Founder',
      location: 'Remote',
      status: 'collaborator',
      score: 88,
      lastContact: '5 days ago',
      source: 'Product Hunt',
      tags: ['Indie Hacker', 'Developer', 'Community'],
      notes: 'Building complementary tools. Interested in API integration and cross-promotion.',
      interactions: 8,
      socialProfiles: {
        twitter: '@davidbuilds'
      }
    }
  ]);

  const [deals] = useState<Deal[]>([
    {
      id: '1',
      contactId: '1',
      title: 'TechStartup Inc - Pro Plan',
      value: 6000,
      stage: 'proposal',
      probability: 75,
      expectedCloseDate: '2024-02-15',
      createdDate: '2024-01-10',
      notes: 'Waiting for budget approval from their board meeting next week.'
    },
    {
      id: '2',
      contactId: '2',
      title: 'Growth Co - Team Upgrade',
      value: 3600,
      stage: 'negotiation',
      probability: 60,
      expectedCloseDate: '2024-02-28',
      createdDate: '2024-01-15',
      notes: 'Negotiating team size and features. Very interested in analytics dashboard.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'border-yellow-400 text-yellow-400';
      case 'customer': return 'border-green-400 text-green-400';
      case 'partner': return 'border-purple-400 text-purple-400';
      case 'collaborator': return 'border-blue-400 text-blue-400';
      default: return 'border-gray-400 text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDealStageColor = (stage: string) => {
    switch (stage) {
      case 'prospect': return 'border-gray-400 text-gray-400';
      case 'proposal': return 'border-blue-400 text-blue-400';
      case 'negotiation': return 'border-yellow-400 text-yellow-400';
      case 'closed-won': return 'border-green-400 text-green-400';
      case 'closed-lost': return 'border-red-400 text-red-400';
      default: return 'border-gray-400 text-gray-400';
    }
  };

  const stats = [
    { label: 'Total Contacts', value: contacts.length.toString(), change: '+12', icon: Users, color: 'text-blue-400' },
    { label: 'Active Deals', value: deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage)).length.toString(), change: '+3', icon: DollarSign, color: 'text-green-400' },
    { label: 'Pipeline Value', value: `$${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}`, change: '+25%', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Avg Lead Score', value: Math.round(contacts.reduce((sum, c) => sum + c.score, 0) / contacts.length).toString(), change: '+8', icon: Target, color: 'text-pink-400' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your contacts, track leads, and build stronger relationships
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" className="glassmorphism">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" className="glassmorphism">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => setShowAddContact(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
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

      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glassmorphism">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="deals">Deals Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6 mt-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-white/10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 glassmorphism-dark border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contacts</SelectItem>
                <SelectItem value="lead">Leads</SelectItem>
                <SelectItem value="customer">Customers</SelectItem>
                <SelectItem value="partner">Partners</SelectItem>
                <SelectItem value="collaborator">Collaborators</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contacts Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="glassmorphism p-6 hover:border-white/20 transition-colors cursor-pointer" 
                    onClick={() => setSelectedContact(contact)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      {contact.company && (
                        <p className="text-sm text-muted-foreground">{contact.title} at {contact.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className={`text-xs ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </Badge>
                    <div className={`text-sm font-semibold ${getScoreColor(contact.score)}`}>
                      {contact.score}/100
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{contact.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {contact.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{contact.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last contact: {contact.lastContact}</span>
                  <span>{contact.interactions} interactions</span>
                </div>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Deals Pipeline Tab */}
        <TabsContent value="deals" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {deals.map((deal) => {
              const contact = contacts.find(c => c.id === deal.contactId);
              return (
                <Card key={deal.id} className="glassmorphism p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{deal.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {contact?.name} • {contact?.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        ${deal.value.toLocaleString()}
                      </div>
                      <Badge variant="outline" className={`text-xs ${getDealStageColor(deal.stage)}`}>
                        {deal.stage}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Probability</div>
                      <div className="text-sm font-semibold">{deal.probability}%</div>
                      <div className="w-full bg-black/20 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                          style={{ width: `${deal.probability}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Expected Close</div>
                      <div className="text-sm font-semibold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(deal.expectedCloseDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Days in Pipeline</div>
                      <div className="text-sm font-semibold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.ceil((new Date().getTime() - new Date(deal.createdDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Notes:</div>
                    <p className="text-sm">{deal.notes}</p>
                  </div>
                </Card>
              );
            })}
          </motion.div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Contact Sources */}
            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
              <div className="space-y-3">
                {['Twitter', 'LinkedIn', 'Referral', 'Product Hunt', 'Direct'].map((source, index) => {
                  const count = contacts.filter(c => c.source === source).length;
                  const percentage = (count / contacts.length) * 100;
                  return (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-sm">{source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-black/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Contact Status Distribution */}
            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Distribution</h3>
              <div className="space-y-3">
                {['lead', 'customer', 'partner', 'collaborator'].map((status) => {
                  const count = contacts.filter(c => c.status === status).length;
                  const percentage = (count / contacts.length) * 100;
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-black/20 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${
                              status === 'lead' ? 'from-yellow-500 to-yellow-600' :
                              status === 'customer' ? 'from-green-500 to-green-600' :
                              status === 'partner' ? 'from-purple-500 to-purple-600' :
                              'from-blue-500 to-blue-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Top Performing Contacts */}
            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold mb-4">High-Value Contacts</h3>
              <div className="space-y-3">
                {contacts
                  .filter(c => c.value)
                  .sort((a, b) => (b.value || 0) - (a.value || 0))
                  .slice(0, 5)
                  .map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between bg-black/10 rounded p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{contact.name}</div>
                          <div className="text-xs text-muted-foreground">{contact.company}</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-green-400">
                        ${contact.value?.toLocaleString()}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'New contact added', contact: 'Sarah Chen', time: '2 hours ago' },
                  { action: 'Deal updated', contact: 'Mike Rodriguez', time: '5 hours ago' },
                  { action: 'Note added', contact: 'Emma Thompson', time: '1 day ago' },
                  { action: 'Email sent', contact: 'David Kim', time: '2 days ago' },
                  { action: 'Meeting scheduled', contact: 'Sarah Chen', time: '3 days ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between bg-black/10 rounded p-2">
                    <div>
                      <div className="text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">{activity.contact}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedContact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedContact.name}</h3>
                  {selectedContact.company && (
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.title} at {selectedContact.company}
                    </p>
                  )}
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedContact(null)}>
                ✕
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{selectedContact.email}</span>
                  </div>
                </div>
                {selectedContact.phone && (
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{selectedContact.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Profiles */}
              {Object.keys(selectedContact.socialProfiles).length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Social Profiles</div>
                  <div className="flex gap-2">
                    {selectedContact.socialProfiles.twitter && (
                      <Button size="sm" variant="outline" className="glassmorphism">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Twitter
                      </Button>
                    )}
                    {selectedContact.socialProfiles.linkedin && (
                      <Button size="sm" variant="outline" className="glassmorphism">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        LinkedIn
                      </Button>
                    )}
                    {selectedContact.socialProfiles.instagram && (
                      <Button size="sm" variant="outline" className="glassmorphism">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Instagram
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Tags</div>
                <div className="flex flex-wrap gap-1">
                  {selectedContact.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Notes</div>
                <div className="bg-black/20 rounded-lg p-3 text-sm">
                  {selectedContact.notes}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-purple-400">{selectedContact.score}</div>
                  <div className="text-xs text-muted-foreground">Lead Score</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-400">{selectedContact.interactions}</div>
                  <div className="text-xs text-muted-foreground">Interactions</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-400">
                    ${selectedContact.value?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">Value</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-white/10">
              <Button 
                variant="outline" 
                className="glassmorphism flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Contact
              </Button>
              <Button 
                variant="outline" 
                className="glassmorphism flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
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
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';

const campaigns = [
  {
    id: 1,
    name: 'Weekly Product Updates',
    subject: 'New features that will save you hours',
    status: 'sent',
    subscribers: 2450,
    sent: 2450,
    opened: 1029,
    clicked: 156,
    sentAt: '2024-01-15 09:00',
    type: 'newsletter'
  },
  {
    id: 2,
    name: 'Product Launch Announcement',
    subject: 'LaunchPilot 2.0 is here! 🚀',
    status: 'scheduled',
    subscribers: 2450,
    sent: 0,
    opened: 0,
    clicked: 0,
    sentAt: '2024-01-22 10:00',
    type: 'announcement'
  },
  {
    id: 3,
    name: 'Onboarding Series - Day 1',
    subject: 'Welcome to LaunchPilot! Let\'s get started',
    status: 'draft',
    subscribers: 2450,
    sent: 0,
    opened: 0,
    clicked: 0,
    sentAt: null,
    type: 'onboarding'
  }
];

const templates = [
  {
    id: 1,
    name: 'Product Update',
    description: 'Share new features and improvements',
    preview: 'Hey {{firstName}}, we just shipped something amazing...'
  },
  {
    id: 2,
    name: 'Launch Announcement',
    description: 'Announce your product launch',
    preview: 'The wait is over! {{productName}} is now live...'
  },
  {
    id: 3,
    name: 'Welcome Series',
    description: 'Onboard new subscribers',
    preview: 'Welcome to {{companyName}}! Here\'s what to expect...'
  }
];

export default function EmailCampaignsPage() {
  const [selectedTab, setSelectedTab] = useState('campaigns');
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-6">
              <Mail className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Email Marketing</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Email Campaigns That <span className="text-gradient">Convert</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create beautiful newsletters, product announcements, and automated sequences 
              that engage your audience and drive growth.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">2,450</div>
              <div className="text-sm text-muted-foreground">Total Subscribers</div>
              <div className="text-xs text-green-400 mt-1">+127 this week</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">42.1%</div>
              <div className="text-sm text-muted-foreground">Open Rate</div>
              <div className="text-xs text-green-400 mt-1">+3.2% vs industry</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">6.4%</div>
              <div className="text-sm text-muted-foreground">Click Rate</div>
              <div className="text-xs text-green-400 mt-1">+1.8% vs industry</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">1.2%</div>
              <div className="text-sm text-muted-foreground">Unsubscribe Rate</div>
              <div className="text-xs text-green-400 mt-1">-0.3% vs industry</div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="glassmorphism rounded-lg p-1 flex">
              {[
                { id: 'campaigns', label: 'Campaigns', icon: Mail },
                { id: 'templates', label: 'Templates', icon: Edit },
                { id: 'subscribers', label: 'Subscribers', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                    selectedTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {selectedTab === 'campaigns' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Campaigns List */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-2"
              >
                <div className="glassmorphism rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold font-sora">Email Campaigns</h2>
                    <Button
                      onClick={() => setShowNewCampaign(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Campaign
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="glassmorphism-dark rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              campaign.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                              campaign.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {campaign.status}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              campaign.type === 'newsletter' ? 'bg-purple-500/20 text-purple-400' :
                              campaign.type === 'announcement' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {campaign.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="glassmorphism">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="glassmorphism">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="glassmorphism">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-3">{campaign.subject}</div>
                        
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
                        
                        {campaign.sentAt && (
                          <div className="text-xs text-muted-foreground mt-2">
                            {campaign.status === 'sent' ? 'Sent' : 'Scheduled for'}: {campaign.sentAt}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Campaign Builder / Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {showNewCampaign ? (
                  <div className="glassmorphism rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold font-sora">New Campaign</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowNewCampaign(false)}
                        className="glassmorphism"
                      >
                        Cancel
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="campaignName">Campaign Name</Label>
                        <Input
                          id="campaignName"
                          placeholder="e.g., Weekly Newsletter"
                          className="glassmorphism-dark border-white/20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject Line</Label>
                        <Input
                          id="subject"
                          placeholder="e.g., New features that will save you hours"
                          className="glassmorphism-dark border-white/20"
                        />
                      </div>

                      <div>
                        <Label>Campaign Type</Label>
                        <Select>
                          <SelectTrigger className="glassmorphism-dark border-white/20">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newsletter">Newsletter</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="onboarding">Onboarding</SelectItem>
                            <SelectItem value="promotional">Promotional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="content">Email Content</Label>
                        <Textarea
                          id="content"
                          placeholder="Write your email content here..."
                          className="glassmorphism-dark border-white/20 min-h-[200px]"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </Button>
                        <Button variant="outline" className="glassmorphism">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="glassmorphism rounded-xl p-6">
                      <h3 className="text-xl font-bold font-sora mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start glassmorphism-dark">
                          <Upload className="h-4 w-4 mr-3" />
                          Import Subscribers
                        </Button>
                        <Button variant="outline" className="w-full justify-start glassmorphism-dark">
                          <Download className="h-4 w-4 mr-3" />
                          Export Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start glassmorphism-dark">
                          <Settings className="h-4 w-4 mr-3" />
                          Email Settings
                        </Button>
                      </div>
                    </div>

                    {/* Performance Tips */}
                    <div className="glassmorphism rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 text-purple-400">📧 Email Tips</h3>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <span>Keep subject lines under 50 characters for mobile</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <span>Send emails on Tuesday-Thursday for best open rates</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <span>Personalize with subscriber's name and preferences</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <span>Include a clear call-to-action above the fold</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {selectedTab === 'templates' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {templates.map((template) => (
                <div key={template.id} className="glassmorphism rounded-xl p-6 hover-lift">
                  <h3 className="text-lg font-bold font-sora mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <div className="glassmorphism-dark rounded-lg p-3 mb-4">
                    <div className="text-xs text-muted-foreground">{template.preview}</div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Use Template
                  </Button>
                </div>
              ))}
            </motion.div>
          )}

          {selectedTab === 'subscribers' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glassmorphism rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-sora">Subscriber Management</h2>
                <div className="flex space-x-3">
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
                  <div className="text-2xl font-bold text-green-400 mb-1">2,450</div>
                  <div className="text-sm text-muted-foreground">Active Subscribers</div>
                </div>
                <div className="glassmorphism-dark rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">127</div>
                  <div className="text-sm text-muted-foreground">New This Week</div>
                </div>
                <div className="glassmorphism-dark rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">23</div>
                  <div className="text-sm text-muted-foreground">Unsubscribed</div>
                </div>
              </div>

              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Subscriber List Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced subscriber management with segmentation, tags, and analytics is in development.
                </p>
              </div>
            </motion.div>
          )}

          {selectedTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glassmorphism rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold font-sora mb-6">Email Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glassmorphism-dark rounded-lg p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">42.1%</div>
                  <div className="text-sm text-muted-foreground">Avg Open Rate</div>
                </div>
                <div className="glassmorphism-dark rounded-lg p-4 text-center">
                  <Mail className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">6.4%</div>
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
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Plus, 
  Play, 
  Pause, 
  BarChart3, 
  Users, 
  Calendar,
  Settings,
  Upload,
  Eye,
  Edit,
  Trash2,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';

const campaigns = [
  {
    id: 1,
    name: 'SaaS Founder Outreach',
    status: 'active',
    leads: 150,
    sent: 89,
    opened: 34,
    replied: 8,
    steps: 3,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Product Hunt Hunters',
    status: 'paused',
    leads: 75,
    sent: 45,
    opened: 18,
    replied: 5,
    steps: 2,
    createdAt: '2024-01-10',
  },
  {
    id: 3,
    name: 'Tech Blogger Outreach',
    status: 'draft',
    leads: 200,
    sent: 0,
    opened: 0,
    replied: 0,
    steps: 4,
    createdAt: '2024-01-12',
  },
];

const emailTemplates = [
  {
    subject: 'Quick question about {{company}}',
    body: `Hi {{firstName}},

I noticed you're working on {{company}} and thought you might find this interesting.

Most SaaS founders I talk to struggle with marketing automation. Sound familiar?

I've been working on LaunchPilot - it's like having a marketing co-founder that never sleeps.

Early users are seeing:
→ 3x more qualified leads
→ 50% less time on content creation
→ 2x higher email open rates

Would you be interested in a quick 15-minute demo to see how it could help {{company}}?

Best,
[Your name]

P.S. - We're offering free setup for the first 100 users. Interested?`,
  },
];

export default function OutreachPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
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
              <span className="text-sm font-medium">Cold Email Engine</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Cold Outreach That <span className="text-gradient">Actually Works</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create personalized email sequences that get opened, read, and replied to. 
              Built for SaaS founders who want results, not just sends.
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
              <div className="text-3xl font-bold text-gradient mb-2">425</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">134</div>
              <div className="text-sm text-muted-foreground">Emails Sent</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">38.8%</div>
              <div className="text-sm text-muted-foreground">Open Rate</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">9.7%</div>
              <div className="text-sm text-muted-foreground">Reply Rate</div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Campaign List */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
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
                    <div
                      key={campaign.id}
                      className={`glassmorphism-dark rounded-lg p-4 cursor-pointer transition-all hover:bg-white/5 ${
                        selectedCampaign === campaign.id ? 'border-2 border-purple-500/50' : ''
                      }`}
                      onClick={() => setSelectedCampaign(campaign.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            campaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            campaign.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {campaign.status}
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
                            {campaign.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Leads</div>
                          <div className="font-semibold">{campaign.leads}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Sent</div>
                          <div className="font-semibold">{campaign.sent}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Opened</div>
                          <div className="font-semibold text-blue-400">{campaign.opened}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Replied</div>
                          <div className="font-semibold text-green-400">{campaign.replied}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Campaign Builder / Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
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
                        placeholder="e.g., SaaS Founder Outreach"
                        className="glassmorphism-dark border-white/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Quick question about {{company}}"
                        className="glassmorphism-dark border-white/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="emailBody">Email Body</Label>
                      <Textarea
                        id="emailBody"
                        placeholder="Hi {{firstName}},&#10;&#10;I noticed you're working on {{company}}..."
                        className="glassmorphism-dark border-white/20 min-h-[200px]"
                        defaultValue={emailTemplates[0].body}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Available Variables</Label>
                      <div className="flex flex-wrap gap-2">
                        {['{{firstName}}', '{{lastName}}', '{{company}}', '{{website}}', '{{industry}}'].map((variable) => (
                          <span
                            key={variable}
                            className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded cursor-pointer hover:bg-purple-500/30"
                          >
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <Send className="h-4 w-4 mr-2" />
                        Create Campaign
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
                        Import Lead List
                      </Button>
                      <Button variant="outline" className="w-full justify-start glassmorphism-dark">
                        <BarChart3 className="h-4 w-4 mr-3" />
                        View Analytics
                      </Button>
                      <Button variant="outline" className="w-full justify-start glassmorphism-dark">
                        <Settings className="h-4 w-4 mr-3" />
                        Email Settings
                      </Button>
                    </div>
                  </div>

                  {/* Performance Tips */}
                  <div className="glassmorphism rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-purple-400">💡 Performance Tips</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                        <span>Personalize the first line with specific company details</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                        <span>Keep subject lines under 50 characters for mobile</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                        <span>Follow up 3-5 days after the initial email</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                        <span>Include a clear, single call-to-action</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
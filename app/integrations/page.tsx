'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  CheckCircle, 
  ExternalLink,
  Github,
  Mail,
  MessageSquare,
  FileText,
  BarChart3,
  Calendar,
  Users,
  Globe,
  Smartphone,
  Database,
  Cloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';

const integrations = [
  {
    category: 'Content Management',
    items: [
      {
        name: 'Notion',
        description: 'Sync your content directly to Notion databases',
        icon: FileText,
        status: 'available',
        color: 'from-gray-500 to-gray-600'
      },
      {
        name: 'Ghost',
        description: 'Publish blog posts directly to your Ghost site',
        icon: FileText,
        status: 'available',
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'WordPress',
        description: 'Auto-publish to your WordPress blog',
        icon: Globe,
        status: 'coming-soon',
        color: 'from-blue-600 to-blue-700'
      }
    ]
  },
  {
    category: 'Social Media',
    items: [
      {
        name: 'Twitter/X',
        description: 'Schedule and auto-post threads and tweets',
        icon: MessageSquare,
        status: 'available',
        color: 'from-sky-500 to-sky-600'
      },
      {
        name: 'LinkedIn',
        description: 'Share professional content and articles',
        icon: Users,
        status: 'available',
        color: 'from-blue-700 to-blue-800'
      },
      {
        name: 'Reddit',
        description: 'Post to relevant subreddits automatically',
        icon: MessageSquare,
        status: 'coming-soon',
        color: 'from-orange-500 to-red-500'
      }
    ]
  },
  {
    category: 'Email Marketing',
    items: [
      {
        name: 'Mailchimp',
        description: 'Create and send email campaigns',
        icon: Mail,
        status: 'available',
        color: 'from-yellow-500 to-yellow-600'
      },
      {
        name: 'ConvertKit',
        description: 'Manage email sequences and subscribers',
        icon: Mail,
        status: 'available',
        color: 'from-pink-500 to-pink-600'
      },
      {
        name: 'Beehiiv',
        description: 'Newsletter creation and management',
        icon: Mail,
        status: 'coming-soon',
        color: 'from-orange-400 to-orange-500'
      }
    ]
  },
  {
    category: 'Analytics & Data',
    items: [
      {
        name: 'Google Analytics',
        description: 'Track content performance and engagement',
        icon: BarChart3,
        status: 'available',
        color: 'from-green-500 to-green-600'
      },
      {
        name: 'Mixpanel',
        description: 'Advanced user behavior analytics',
        icon: BarChart3,
        status: 'coming-soon',
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'Amplitude',
        description: 'Product analytics and insights',
        icon: BarChart3,
        status: 'coming-soon',
        color: 'from-blue-500 to-purple-500'
      }
    ]
  },
  {
    category: 'Development',
    items: [
      {
        name: 'GitHub',
        description: 'Generate README files and documentation',
        icon: Github,
        status: 'available',
        color: 'from-gray-700 to-gray-800'
      },
      {
        name: 'Slack',
        description: 'Get notifications and updates in Slack',
        icon: MessageSquare,
        status: 'available',
        color: 'from-green-400 to-green-500'
      },
      {
        name: 'Discord',
        description: 'Community management and announcements',
        icon: MessageSquare,
        status: 'coming-soon',
        color: 'from-indigo-500 to-purple-500'
      }
    ]
  },
  {
    category: 'Productivity',
    items: [
      {
        name: 'Zapier',
        description: 'Connect with 5000+ apps via Zapier',
        icon: Zap,
        status: 'available',
        color: 'from-orange-500 to-red-500'
      },
      {
        name: 'Airtable',
        description: 'Sync data to Airtable bases',
        icon: Database,
        status: 'coming-soon',
        color: 'from-blue-400 to-blue-500'
      },
      {
        name: 'Calendly',
        description: 'Schedule meetings from generated content',
        icon: Calendar,
        status: 'coming-soon',
        color: 'from-blue-500 to-cyan-500'
      }
    ]
  }
];

const statusConfig = {
  available: {
    label: 'Available',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: CheckCircle
  },
  'coming-soon': {
    label: 'Coming Soon',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    icon: Calendar
  }
};

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-background">
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
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Integrations</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Connect with Your <span className="text-gradient">Favorite Tools</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              LaunchPilot integrates seamlessly with the tools you already use. 
              Automate your entire marketing workflow from content creation to distribution.
            </p>
          </motion.div>

          {/* Integration Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">20+</div>
              <div className="text-sm text-muted-foreground">Native Integrations</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">5000+</div>
              <div className="text-sm text-muted-foreground">Apps via Zapier</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
          </motion.div>

          {/* Integrations Grid */}
          <div className="space-y-16">
            {integrations.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold font-sora mb-8 text-center">
                  {category.category}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((integration, index) => (
                    <motion.div
                      key={integration.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="glassmorphism rounded-xl p-6 hover-lift group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${integration.color}`}>
                          <integration.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[integration.status as keyof typeof statusConfig].bgColor} ${statusConfig[integration.status as keyof typeof statusConfig].color}`}>
                          {statusConfig[integration.status as keyof typeof statusConfig].label}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold font-sora mb-2 group-hover:text-gradient transition-colors">
                        {integration.name}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {integration.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="glassmorphism-dark"
                          disabled={integration.status === 'coming-soon'}
                        >
                          {integration.status === 'available' ? 'Connect' : 'Notify Me'}
                        </Button>
                        {integration.status === 'available' && (
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Integration CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <div className="glassmorphism rounded-2xl p-8 max-w-3xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold font-sora mb-4">Need a Custom Integration?</h3>
              <p className="text-muted-foreground mb-6">
                Don't see your favorite tool? We build custom integrations for Enterprise customers. 
                Our API makes it easy to connect LaunchPilot with any platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="glassmorphism hover-lift">
                  View API Docs
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white neon-glow">
                  Request Integration
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  Rocket,
  Brain,
  Globe,
  Smartphone,
  Users,
  BarChart3,
  Shield,
  Sparkles
} from 'lucide-react';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';

const roadmapItems = [
  {
    quarter: 'Q4 2024',
    status: 'completed',
    items: [
      {
        icon: Rocket,
        title: 'Core AI Engine',
        description: 'Advanced content generation for Twitter, blogs, and emails',
        status: 'completed'
      },
      {
        icon: BarChart3,
        title: 'Analytics Dashboard',
        description: 'Real-time performance tracking and insights',
        status: 'completed'
      },
      {
        icon: Users,
        title: 'Product Hunt Integration',
        description: 'Complete launch campaign automation',
        status: 'completed'
      }
    ]
  },
  {
    quarter: 'Q1 2025',
    status: 'in-progress',
    items: [
      {
        icon: Brain,
        title: 'Advanced AI Personas',
        description: 'Custom AI personalities for different brand voices',
        status: 'in-progress'
      },
      {
        icon: Globe,
        title: 'Multi-language Support',
        description: 'Generate content in 20+ languages',
        status: 'in-progress'
      },
      {
        icon: Smartphone,
        title: 'Mobile App',
        description: 'Native iOS and Android applications',
        status: 'planned'
      }
    ]
  },
  {
    quarter: 'Q2 2025',
    status: 'planned',
    items: [
      {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'SOC2 compliance and advanced security features',
        status: 'planned'
      },
      {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Multi-user workspaces and approval workflows',
        status: 'planned'
      },
      {
        icon: Zap,
        title: 'API Platform',
        description: 'Public API for custom integrations',
        status: 'planned'
      }
    ]
  },
  {
    quarter: 'Q3 2025',
    status: 'planned',
    items: [
      {
        icon: Brain,
        title: 'AI Video Generation',
        description: 'Create marketing videos with AI narration',
        status: 'planned'
      },
      {
        icon: Globe,
        title: 'Global Marketplace',
        description: 'Community templates and content sharing',
        status: 'planned'
      },
      {
        icon: Sparkles,
        title: 'AI Strategy Consultant',
        description: 'Personalized marketing strategy recommendations',
        status: 'planned'
      }
    ]
  }
];

const statusConfig = {
  completed: {
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    label: 'Completed'
  },
  'in-progress': {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    label: 'In Progress'
  },
  planned: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    label: 'Planned'
  }
};

export default function RoadmapPage() {
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
              <Rocket className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Product Roadmap</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              The Future of <span className="text-gradient">AI Marketing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what we're building next. Our roadmap is driven by user feedback and the latest AI breakthroughs.
            </p>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">6</div>
              <div className="text-sm text-muted-foreground">Features Completed</div>
            </div>

            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
              <div className="text-sm text-muted-foreground">In Development</div>
            </div>

            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">6</div>
              <div className="text-sm text-muted-foreground">Coming Soon</div>
            </div>
          </motion.div>

          {/* Roadmap Timeline */}
          <div className="space-y-12">
            {roadmapItems.map((quarter, quarterIndex) => (
              <motion.div
                key={quarter.quarter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: quarterIndex * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Quarter Header */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className={`px-4 py-2 rounded-full ${statusConfig[quarter.status as keyof typeof statusConfig].bgColor} ${statusConfig[quarter.status as keyof typeof statusConfig].borderColor} border`}>
                    <span className={`text-sm font-semibold ${statusConfig[quarter.status as keyof typeof statusConfig].color}`}>
                      {quarter.quarter}
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {quarter.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                      viewport={{ once: true }}
                      className={`glassmorphism rounded-xl p-6 hover-lift ${
                        item.status === 'completed' ? 'border border-green-500/30' :
                        item.status === 'in-progress' ? 'border border-yellow-500/30' :
                        'border border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${statusConfig[item.status as keyof typeof statusConfig].bgColor}`}>
                          <item.icon className={`h-6 w-6 ${statusConfig[item.status as keyof typeof statusConfig].color}`} />
                        </div>
                        {item.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        {item.status === 'in-progress' && (
                          <div className="w-5 h-5 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold font-sora mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      
                      <div className="mt-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[item.status as keyof typeof statusConfig].bgColor} ${statusConfig[item.status as keyof typeof statusConfig].color}`}>
                          {statusConfig[item.status as keyof typeof statusConfig].label}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Community Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <div className="glassmorphism rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold font-sora mb-4">Shape Our Roadmap</h3>
              <p className="text-muted-foreground mb-6">
                Your feedback drives our development. Have an idea for a feature? We'd love to hear it!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="glassmorphism hover-lift px-6 py-3 rounded-lg font-medium">
                  Request Feature
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium neon-glow">
                  Join Beta Program
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
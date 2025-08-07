'use client';

import { motion } from 'framer-motion';
import { 
  PenTool, 
  Twitter, 
  Mail, 
  FileText, 
  Rocket,
  MessageSquare,
  BarChart3,
  Calendar,
  Users,
  Zap,
  ArrowRight,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';
import Link from 'next/link';

const tools = [
  {
    icon: PenTool,
    name: 'AI Content Generator',
    description: 'Generate high-converting copy for any platform in seconds',
    features: ['Blog posts', 'Social media', 'Email campaigns', 'Ad copy'],
    color: 'from-purple-500 to-purple-600',
    popular: true,
  },
  {
    icon: Twitter,
    name: 'Twitter Thread Writer',
    description: 'Create viral Twitter threads that drive engagement',
    features: ['Thread hooks', 'Engaging content', 'Call-to-actions', 'Hashtag suggestions'],
    color: 'from-blue-500 to-cyan-500',
    popular: false,
  },
  {
    icon: Mail,
    name: 'Cold Email Engine',
    description: 'Personalized outreach sequences that get replies',
    features: ['Personalization', 'Follow-up sequences', 'A/B testing', 'Analytics'],
    color: 'from-pink-500 to-rose-500',
    popular: true,
  },
  {
    icon: FileText,
    name: 'SEO Blog Generator',
    description: 'Long-form, SEO-optimized articles that rank',
    features: ['Keyword research', 'SEO optimization', 'Content structure', 'Meta tags'],
    color: 'from-green-500 to-emerald-500',
    popular: false,
  },
  {
    icon: Rocket,
    name: 'Product Hunt Launcher',
    description: 'Complete launch strategy and campaign materials',
    features: ['Launch copy', 'Maker comments', 'Hunter outreach', 'Timeline'],
    color: 'from-orange-500 to-red-500',
    popular: true,
  },
  {
    icon: MessageSquare,
    name: 'Reddit & Community Poster',
    description: 'AI-crafted posts that follow community guidelines',
    features: ['Community analysis', 'Guideline compliance', 'Engagement optimization', 'Timing'],
    color: 'from-indigo-500 to-purple-500',
    popular: false,
  },
  {
    icon: BarChart3,
    name: 'Performance Analytics',
    description: 'Real-time insights on content performance',
    features: ['Engagement metrics', 'Conversion tracking', 'ROI analysis', 'Reports'],
    color: 'from-violet-500 to-purple-500',
    popular: false,
  },
  {
    icon: Calendar,
    name: 'Content Planner',
    description: 'AI-powered content calendar and scheduling',
    features: ['Content calendar', 'Auto-scheduling', 'Best time posting', 'Reminders'],
    color: 'from-teal-500 to-cyan-500',
    popular: false,
  },
  {
    icon: Users,
    name: 'Audience Analyzer',
    description: 'Deep insights into your target audience',
    features: ['Demographic analysis', 'Behavior patterns', 'Interest mapping', 'Personas'],
    color: 'from-yellow-500 to-orange-500',
    popular: false,
  },
];

export default function ToolsPage() {
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
              <span className="text-sm font-medium">AI Marketing Tools</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Every Tool You Need to{' '}
              <span className="text-gradient">Scale Your SaaS</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From content creation to launch campaigns, LaunchPilot provides all the AI-powered tools 
              you need to build, launch, and grow your SaaS successfully.
            </p>
          </motion.div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`glassmorphism rounded-xl p-6 hover-lift group cursor-pointer relative ${
                  tool.popular ? 'border-2 border-purple-500/50' : ''
                }`}
              >
                {tool.popular && (
                  <div className="absolute -top-3 left-6">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold font-sora mb-3 group-hover:text-gradient transition-colors">
                  {tool.name}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {tool.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/generate">
                  <Button 
                    variant="outline" 
                    className="w-full glassmorphism-dark hover:bg-purple-500/20 group-hover:border-purple-500/50"
                  >
                    Try Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-24"
          >
            <div className="glassmorphism rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold font-sora mb-4">Ready to Transform Your Marketing?</h3>
              <p className="text-muted-foreground mb-6">
                Get access to all these powerful AI tools in one unified platform. 
                Start your free trial today and see the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white neon-glow">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="glassmorphism hover-lift">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
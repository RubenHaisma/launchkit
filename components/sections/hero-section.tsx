'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardPreview } from '@/components/dashboard-preview';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium">🚀 AI-Powered Marketing Revolution</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-sora leading-tight mb-6">
            Your AI Marketing{' '}
            <span className="text-gradient-blue">Co-founder</span>
            <br />
            Has Arrived
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            LaunchPilot replaces <span className="text-purple-400 font-semibold">Jasper</span>,{' '}
            <span className="text-blue-400 font-semibold">Lemlist</span>,{' '}
            <span className="text-pink-400 font-semibold">TweetHunter</span>,{' '}
            <span className="text-green-400 font-semibold">Mailchimp</span> & more.
            <br />
            <span className="text-gradient font-semibold">One platform. Infinite possibilities.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link href="/auth/signup">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-4 neon-glow hover-lift">
              <Zap className="mr-2 h-5 w-5" />
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8 py-4 glassmorphism hover-lift">
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative"
        >
          <DashboardPreview />
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold font-sora text-gradient">50K+</div>
            <div className="text-sm text-muted-foreground">Campaigns Launched</div>
          </div>
          <div>
            <div className="text-3xl font-bold font-sora text-gradient">2.3M</div>
            <div className="text-sm text-muted-foreground">Content Generated</div>
          </div>
          <div>
            <div className="text-3xl font-bold font-sora text-gradient">98%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold font-sora text-gradient">24/7</div>
            <div className="text-sm text-muted-foreground">AI Assistant</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
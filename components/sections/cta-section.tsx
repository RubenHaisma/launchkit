'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 glassmorphism-dark rounded-full px-4 py-2 mb-6 border border-purple-500/30">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Ready to Launch?</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold font-sora mb-6">
            Stop Struggling with Marketing.
            <br />
            <span className="text-gradient">Start Scaling Today.</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of indie makers who've transformed their marketing game with LaunchPilot. 
            Your AI co-founder is waiting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-4 neon-glow hover-lift">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 glassmorphism-dark hover-lift border-white/20 text-white">
                View Pricing
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <div>✅ No credit card required</div>
            <div>✅ 7-day free trial</div>
            <div>✅ Cancel anytime</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
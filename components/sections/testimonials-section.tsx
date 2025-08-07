'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

// Testimonials removed - will be added when we have real customer feedback
const testimonials: any[] = [];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-pink-900/10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-sora mb-6">
            Built for <span className="text-gradient">Indie Makers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            LaunchPilot is designed specifically for indie makers and SaaS founders who want to scale their marketing without the complexity.
          </p>
        </motion.div>

        {/* Feature highlights instead of fake testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glassmorphism rounded-xl p-6 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold font-sora mb-3">AI-Powered</h3>
            <p className="text-muted-foreground">
              Advanced AI models trained specifically for marketing content that converts.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="glassmorphism rounded-xl p-6 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Quote className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold font-sora mb-3">All-in-One</h3>
            <p className="text-muted-foreground">
              Replace multiple expensive tools with one comprehensive marketing platform.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="glassmorphism rounded-xl p-6 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold font-sora mb-3">Launch Ready</h3>
            <p className="text-muted-foreground">
              Everything you need to successfully launch and scale your SaaS product.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-gradient">2024</div>
              <div className="text-sm text-muted-foreground">Founded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">AI-First</div>
              <div className="text-sm text-muted-foreground">Approach</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">24/7</div>
              <div className="text-sm text-muted-foreground">AI Assistant</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
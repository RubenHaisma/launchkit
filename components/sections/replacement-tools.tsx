'use client';

import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

const tools = [
  { name: 'Jasper', category: 'AI Writing', price: '$29/mo', color: 'from-purple-500 to-purple-600' },
  { name: 'TweetHunter', category: 'Twitter Growth', price: '$49/mo', color: 'from-blue-500 to-blue-600' },
  { name: 'Mailchimp', category: 'Email Marketing', price: '$35/mo', color: 'from-yellow-500 to-orange-500' },
  { name: 'Lemlist', category: 'Cold Outreach', price: '$59/mo', color: 'from-green-500 to-green-600' },
  { name: 'Buffer', category: 'Social Media', price: '$25/mo', color: 'from-indigo-500 to-indigo-600' },
  { name: 'ConvertKit', category: 'Email Lists', price: '$29/mo', color: 'from-pink-500 to-pink-600' },
];

export function ReplacementTools() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-sora mb-6">
            Replace <span className="text-gradient">6+ Expensive Tools</span>
            <br />
            With One Powerful Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stop paying for multiple subscriptions. LaunchPilot combines the power of industry-leading tools into one intelligent platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Old Tools */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <h3 className="text-2xl font-bold mb-6 text-red-400">Before: $226/month</h3>
            <div className="space-y-4">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glassmorphism-dark rounded-lg p-4 flex items-center justify-between border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${tool.color}`} />
                    <div className="text-left">
                      <div className="font-semibold">{tool.name}</div>
                      <div className="text-sm text-muted-foreground">{tool.category}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-red-400">{tool.price}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-1 flex items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 glassmorphism-dark rounded-full border border-white/20">
                <ArrowRight className="h-8 w-8 text-purple-400" />
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gradient">Simplify</div>
                <div className="text-sm text-muted-foreground">Save 87%</div>
              </div>
            </div>
          </motion.div>

          {/* LaunchPilot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <h3 className="text-2xl font-bold mb-6 text-green-400">After: $29/month</h3>
            <div className="glassmorphism-dark rounded-lg p-6 border-2 border-purple-500/50 neon-glow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">LP</span>
                </div>
                <h4 className="text-2xl font-bold text-gradient mb-2">LaunchPilot</h4>
                <p className="text-muted-foreground mb-4">All-in-One AI Marketing Platform</p>
                <div className="space-y-2 text-sm">
                  {['AI Content Generation', 'Social Media Management', 'Email Marketing', 'Cold Outreach', 'Analytics & Insights', 'Product Hunt Launches'].map((feature) => (
                    <div key={feature} className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-4 glassmorphism rounded-full px-6 py-3">
            <span className="text-lg font-semibold">Total Savings:</span>
            <span className="text-2xl font-bold text-green-400">$197/month</span>
            <span className="text-sm text-muted-foreground">($2,364/year)</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
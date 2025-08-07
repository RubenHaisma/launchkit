'use client';

import { motion } from 'framer-motion';
import { PenTool, Twitter, Mail, FileText, Rocket, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  { icon: Twitter, label: 'Generate Tweet Thread', color: 'from-blue-500 to-cyan-500' },
  { icon: FileText, label: 'Write Blog Post', color: 'from-green-500 to-emerald-500' },
  { icon: Mail, label: 'Create Email Campaign', color: 'from-pink-500 to-rose-500' },
  { icon: Rocket, label: 'Plan Product Launch', color: 'from-orange-500 to-red-500' },
];

export function QuickActions() {
  return (
    <div className="glassmorphism rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-sora">Quick Actions</h3>
        <Zap className="h-5 w-5 text-purple-400" />
      </div>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button 
              variant="outline" 
              className="w-full justify-start glassmorphism-dark hover:bg-white/10 group"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} mr-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              {action.label}
            </Button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 p-4 glassmorphism-dark rounded-lg">
        <div className="text-sm font-semibold mb-2 text-purple-400">💡 AI Suggestion</div>
        <div className="text-sm text-muted-foreground">
          Your SaaS launches next week! Create a Product Hunt launch campaign now for maximum impact.
        </div>
      </div>
    </div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';

export function DashboardPreview() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto max-w-4xl"
    >
      <div className="glassmorphism rounded-2xl p-8 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold font-sora">Dashboard Overview</h3>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp, label: 'Campaigns', value: '124', color: 'text-green-400' },
            { icon: Users, label: 'Leads', value: '3.2K', color: 'text-blue-400' },
            { icon: BarChart3, label: 'Conversion', value: '12.5%', color: 'text-purple-400' },
            { icon: Zap, label: 'AI Score', value: '95', color: 'text-pink-400' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glassmorphism-dark rounded-lg p-4 text-center"
            >
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="glassmorphism-dark rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">AI Content Performance</h4>
            <div className="text-sm text-green-400">↗ +23% this week</div>
          </div>
          <div className="h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-end justify-center space-x-2 p-4">
            {[40, 65, 45, 80, 55, 90, 70].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-sm"
                style={{ height: `${height}%`, width: '12px' }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
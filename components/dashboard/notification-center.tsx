'use client';

import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, TrendingUp } from 'lucide-react';

const notifications = [
  {
    icon: CheckCircle,
    type: 'success',
    title: 'Campaign Launched Successfully',
    message: 'Your Twitter thread is live and performing well',
    time: '2 min ago',
    color: 'text-green-400',
  },
  {
    icon: TrendingUp,
    type: 'info',
    title: 'Performance Update',
    message: 'Your email campaign has 23% open rate (+5% vs average)',
    time: '1 hour ago',
    color: 'text-blue-400',
  },
  {
    icon: AlertCircle,
    type: 'warning',
    title: 'Action Required',
    message: 'Product Hunt launch in 2 days - finalize your assets',
    time: '3 hours ago',
    color: 'text-yellow-400',
  },
  {
    icon: Info,
    type: 'info',
    title: 'New Feature Available',
    message: 'Try our new Reddit post generator for better engagement',
    time: '1 day ago',
    color: 'text-purple-400',
  },
];

export function NotificationCenter() {
  return (
    <div className="glassmorphism rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-sora">Recent Activity</h3>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-purple-400" />
          <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
            {notifications.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glassmorphism-dark rounded-lg p-4 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                notification.type === 'success' ? 'bg-green-500/20' :
                notification.type === 'warning' ? 'bg-yellow-500/20' :
                notification.type === 'info' ? 'bg-blue-500/20' :
                'bg-purple-500/20'
              }`}>
                <notification.icon className={`h-4 w-4 ${notification.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold mb-1">{notification.title}</div>
                <div className="text-sm text-muted-foreground mb-2">{notification.message}</div>
                <div className="text-xs text-muted-foreground">{notification.time}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
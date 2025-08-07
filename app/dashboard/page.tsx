'use client';

import { motion } from 'framer-motion';
import { 
  Home, 
  PenTool, 
  Mail, 
  FileText, 
  Twitter, 
  Calendar,
  Settings,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Bell,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DashboardChart } from '@/components/dashboard/dashboard-chart';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { NotificationCenter } from '@/components/dashboard/notification-center';

const sidebarItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: PenTool, label: 'Generator', active: false },
  { icon: Mail, label: 'Outreach', active: false },
  { icon: FileText, label: 'Blog', active: false },
  { icon: Twitter, label: 'Social', active: false },
  { icon: Calendar, label: 'Planner', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

const stats = [
  { icon: TrendingUp, label: 'Total Campaigns', value: '124', change: '+12%', color: 'text-green-400' },
  { icon: Users, label: 'Total Leads', value: '3,247', change: '+23%', color: 'text-blue-400' },
  { icon: BarChart3, label: 'Conversion Rate', value: '12.5%', change: '+5%', color: 'text-purple-400' },
  { icon: Zap, label: 'AI Score', value: '95/100', change: '+3', color: 'text-pink-400' },
];

export default function DashboardPage() {
  const [activePage, setActivePage] = useState('Home');

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="w-64 glassmorphism-dark border-r border-white/10 flex flex-col"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold font-sora text-gradient-blue">
              LaunchPilot
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => setActivePage(item.label)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activePage === item.label 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="glassmorphism-dark rounded-lg p-4">
            <div className="text-sm font-semibold mb-2">Usage This Month</div>
            <div className="text-xs text-muted-foreground mb-3">234 / 500 generations</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '47%' }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="glassmorphism-dark border-b border-white/10 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-sora">Good morning, Sarah! 👋</h1>
              <p className="text-muted-foreground">Ready to launch something amazing today?</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="outline" className="glassmorphism">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="glassmorphism rounded-xl p-6 hover-lift">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${
                      stat.color === 'text-green-400' ? 'from-green-500/20 to-green-600/20' :
                      stat.color === 'text-blue-400' ? 'from-blue-500/20 to-blue-600/20' :
                      stat.color === 'text-purple-400' ? 'from-purple-500/20 to-purple-600/20' :
                      'from-pink-500/20 to-pink-600/20'
                    }`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold font-sora mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <DashboardChart />
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <QuickActions />
              </motion.div>
            </div>

            {/* AI Marketing Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glassmorphism rounded-xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-sora">Your 7-Day AI Marketing Plan</h2>
                <Button variant="outline" size="sm" className="glassmorphism">
                  Regenerate Plan
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { day: 'Day 1', task: 'Product Hunt Launch Prep', status: 'completed' },
                  { day: 'Day 2', task: 'Reddit Community Posts', status: 'in-progress' },
                  { day: 'Day 3', task: 'Twitter Thread Series', status: 'pending' },
                  { day: 'Day 4', task: 'Email Campaign Launch', status: 'pending' },
                ].map((item, index) => (
                  <div key={item.day} className="glassmorphism-dark rounded-lg p-4">
                    <div className="text-sm font-semibold text-purple-400 mb-2">{item.day}</div>
                    <div className="text-sm mb-3">{item.task}</div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.status.replace('-', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notification Center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <NotificationCenter />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
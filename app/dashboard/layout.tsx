'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  PenTool, 
  Mail, 
  Twitter, 
  FileText, 
  BarChart3,
  Settings,
  X,
  Zap,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  History,
  Rocket,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/store/dashboard-store';
import { UsageStatsWidget } from '@/components/dashboard/usage-stats-widget';
import { NotificationPanel } from '@/components/dashboard/notification-panel';
import { DashboardNavigation } from '@/components/dashboard/dashboard-navigation';
import { DashboardFooter } from '@/components/dashboard/dashboard-footer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarItems = [
  { icon: Home, label: 'Home', href: '/dashboard', id: 'home' },
  { icon: PenTool, label: 'Generate', href: '/dashboard/generate', id: 'generate' },
  { icon: Twitter, label: 'Twitter', href: '/dashboard/twitter', id: 'twitter' },
  { icon: Mail, label: 'Outreach', href: '/dashboard/outreach', id: 'outreach' },
  { icon: FileText, label: 'Email Campaigns', href: '/dashboard/email-campaigns', id: 'email' },
  { icon: BookOpen, label: 'Blog', href: '/dashboard/blog', id: 'blog' },
  { icon: History, label: 'History', href: '/dashboard/history', id: 'history' },
  { icon: Rocket, label: 'Launch', href: '/dashboard/launch', id: 'launch' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar', id: 'calendar' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics', id: 'analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', id: 'settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    notifications, 
    setProfile
  } = useDashboardStore();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    // Update profile from session
    if (session.user) {
      setProfile({
        name: session.user.name || 'User',
        email: session.user.email || '',
        company: (session.user as any).company || '',
        industry: 'productivity'
      });
    }
  }, [session, status, router, setProfile]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);



  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }



  return (
    <div className="min-h-screen bg-background flex">

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`h-screen sticky top-0 glassmorphism-dark border-r border-white/10 z-50 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileMenuOpen ? 'fixed translate-x-0' : 'fixed -translate-x-full lg:sticky lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <motion.div 
                  className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg neon-glow"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Zap className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <span className="text-xl font-bold font-sora text-gradient-premium">
                    LaunchPilot
                  </span>
                  <div className="text-xs text-muted-foreground font-medium">Professional</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Collapse Toggle - Desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-2"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          {/* Close Button - Mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                             (item.href !== '/dashboard' && pathname.startsWith(item.href));
              
              return (
                <li key={item.id}>
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer group ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white shadow-lg' 
                          : 'text-muted-foreground hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <motion.div
                        className={`p-2 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                            : 'group-hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                      </motion.div>
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="font-semibold whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Usage Stats */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 border-t border-white/10"
            >
              <div className="glassmorphism-dark rounded-lg p-4">
                <UsageStatsWidget />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Dashboard Navigation */}
        <DashboardNavigation
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          showNotifications={showNotifications}
          onNotificationsToggle={() => setShowNotifications(!showNotifications)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto pt-20 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
          <DashboardFooter />
        </main>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        <NotificationPanel 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />
      </AnimatePresence>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Bell, 
  LogOut, 
  User, 
  Zap, 
  PenTool,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDashboardStore } from '@/lib/store/dashboard-store';
import { CreditBadge } from '@/components/ui/credit-badge';
import { PlanBadge } from '@/components/ui/plan-badge';
import toast from 'react-hot-toast';

interface DashboardNavigationProps {
  onMobileMenuToggle: () => void;
  showNotifications: boolean;
  onNotificationsToggle: () => void;
  sidebarCollapsed?: boolean;
}

export function DashboardNavigation({ 
  onMobileMenuToggle, 
  showNotifications, 
  onNotificationsToggle,
  sidebarCollapsed = false
}: DashboardNavigationProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { notifications } = useDashboardStore();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success('Logged out successfully');
    router.push('/');
  };

  const firstName = session?.user?.name?.split(' ')[0] || 'User';

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-4 z-50 mx-auto max-w-7xl w-full transition-all duration-500 ${
        scrolled 
          ? 'glassmorphism-dark shadow-2xl border border-white/20' 
          : 'glassmorphism-dark border border-white/10'
      }`}
      style={{
        borderRadius: '24px',
        backdropFilter: 'blur(20px)',
        background: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <div className="px-8 py-5">
        <div className="flex items-center justify-between w-full">
          {/* Left Side - Mobile Menu + Welcome */}
          <div className="flex items-center space-x-5 flex-1">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="lg:hidden text-white/80 hover:text-white hover:bg-white/10 h-10 w-10 p-0"
              title="Toggle Menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block"
            >
              <h1 className="text-xl font-bold font-sora text-gradient-premium">
                Welcome, {firstName}! 👋
              </h1>
              <p className="text-base text-white/70 font-medium hidden lg:block">
                Ready to launch something amazing today?
              </p>
            </motion.div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Token Usage - Compact */}
            <motion.div
              className="hidden xl:block"
              whileHover={{ scale: 1.05 }}
            >
              <CreditBadge variant="minimal" />
            </motion.div>

            {/* Plan Badge - Compact */}
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <PlanBadge />
            </motion.div>
            
            {/* User Profile - Compact */}
            <motion.div 
              className="flex items-center space-x-4 glassmorphism-dark px-4 py-2 rounded-lg border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
              >
                <User className="h-5 w-5 text-white" />
              </motion.div>
              <div className="hidden lg:block">
                <div className="text-base font-semibold text-white">{session?.user?.name}</div>
                <div className="text-sm text-white/70">{session?.user?.email}</div>
              </div>
            </motion.div>
            
            {/* Notifications - Icon with Count in Front */}
            <div className="relative">
              <Button 
                size="sm" 
                variant="ghost" 
                className="glassmorphism-dark border border-white/10 text-white/80 hover:text-white hover:bg-white/10 h-10 w-10 sm:w-auto sm:px-4"
                onClick={onNotificationsToggle}
                title="Notifications"
              >
                {unreadCount > 0 && (
                  <motion.span 
                    className="text-base font-bold text-red-400 mr-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
                <Bell className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Logout - Icon Only */}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleLogout}
              className="glassmorphism-dark border border-white/10 text-red-400 hover:text-red-300 hover:bg-red-500/10 h-10 w-10 p-0"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            
            {/* Generate Button - Icon Only on Mobile */}
            <Link href="/dashboard/generate">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white neon-glow shadow-lg border-0 h-10 w-10 sm:w-auto sm:px-4"
                >
                  <PenTool className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline text-base">Generate</span>
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
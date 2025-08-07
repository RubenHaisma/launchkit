'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Database,
  Activity,
  DollarSign,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

const adminSidebarItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/admin', id: 'dashboard' },
  { icon: Users, label: 'Users', href: '/admin/users', id: 'users' },
  { icon: Activity, label: 'API Usage', href: '/admin/api-usage', id: 'api-usage' },
  { icon: Cpu, label: 'Model Config', href: '/admin/models', id: 'models' },
  { icon: DollarSign, label: 'Revenue', href: '/admin/revenue', id: 'revenue' },
  { icon: Database, label: 'System', href: '/admin/system', id: 'system' },
  { icon: Settings, label: 'Settings', href: '/admin/settings', id: 'settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (status === 'loading') return;
      if (!session) {
        router.push('/auth/login');
        return;
      }
      
      // Check if user is admin
      try {
        const response = await fetch('/api/admin/stats');
        if (response.status === 403) {
          // User is not admin, redirect to main dashboard
          router.push('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/dashboard');
      }
    };

    checkAdminAccess();
  }, [session, status, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    // TODO: Implement logout
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Admin...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
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

      {/* Admin Sidebar */}
      <div
        className={`h-screen glassmorphism-dark border-r border-white/10 z-50 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileMenuOpen ? 'fixed translate-x-0' : 'fixed -translate-x-full lg:relative lg:translate-x-0'
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
                  className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg neon-glow"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <span className="text-xl font-bold font-sora text-gradient-premium">
                    Admin Panel
                  </span>
                  <div className="text-xs text-muted-foreground font-medium">System Control</div>
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
            {adminSidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                             (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <li key={item.id}>
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer group ${
                        isActive 
                          ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-white shadow-lg' 
                          : 'text-muted-foreground hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="adminActiveTab"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-orange-500 rounded-r-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <motion.div
                        className={`p-2 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
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

        {/* Admin Badge */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 border-t border-white/10"
            >
              <div className="glassmorphism-dark rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-400">Admin Access</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Full system privileges
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="glassmorphism-dark border-b border-white/10 p-6 sticky top-0 z-30"
        >
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Admin Welcome */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-2xl font-bold font-sora text-gradient-premium">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground font-medium">System monitoring and management</p>
              </motion.div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <motion.div 
                className="flex items-center space-x-3 glassmorphism-dark px-3 py-2 rounded-xl"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <User className="h-5 w-5 text-white" />
                </motion.div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold text-white">{session.user?.name}</div>
                  <div className="text-xs text-muted-foreground">{session.user?.email}</div>
                </div>
              </motion.div>
              
              <Button size="sm" variant="outline" className="glassmorphism hover:scale-105 transition-all duration-300">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Alerts</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleLogout}
                className="glassmorphism text-red-400 hover:text-red-300 hover:scale-105 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              
              <Link href="/dashboard">
                <Button size="sm" variant="premium" className="hover:scale-105 transition-all duration-300 shadow-lg">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">User Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
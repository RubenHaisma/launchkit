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
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    // TODO: Check if user is admin
    // For now, we'll assume any logged-in user can access admin
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

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 },
  };

  const contentVariants = {
    expanded: { marginLeft: 256 },
    collapsed: { marginLeft: 80 },
  };

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
      <motion.div
        variants={sidebarVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-full glassmorphism-dark border-r border-white/10 z-50 flex flex-col ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-2"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold font-sora text-gradient-red">
                  Admin Panel
                </span>
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="font-medium whitespace-nowrap"
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
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={contentVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-h-screen lg:ml-0 ml-0"
      >
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
              <h1 className="text-2xl font-bold font-sora text-red-400">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">System monitoring and management</p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{session.user?.name}</div>
                  <div className="text-xs text-muted-foreground">{session.user?.email}</div>
                </div>
              </div>
              
              <Button size="sm" variant="outline" className="glassmorphism relative">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Alerts</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleLogout}
                className="glassmorphism text-red-400 hover:text-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              
              <Link href="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
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
      </motion.div>
    </div>
  );
}
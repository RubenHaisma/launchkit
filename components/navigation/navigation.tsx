'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, Zap, Sparkles, ArrowRight, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/about', label: 'About', icon: User },
  { href: '/generate', label: 'Generator', icon: Zap },
  { href: '/tools', label: 'Tools', icon: Sparkles },
  { href: '/pricing', label: 'Pricing', icon: ChevronDown },
  { href: '/integrations', label: 'Integrations', icon: ChevronDown },
  { href: '/roadmap', label: 'Roadmap', icon: ArrowRight },
  { href: '/dashboard', label: 'Dashboard', icon: Rocket },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Floating Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-4 left-1/2 z-50 transition-all duration-500 ${
          scrolled 
            ? 'glassmorphism-dark shadow-2xl border border-white/20' 
            : 'glassmorphism-dark border border-white/10'
        }`}
        style={{
          borderRadius: '24px',
          backdropFilter: 'blur(20px)',
          background: 'rgba(0, 0, 0, 0.6)',
          transform: 'translateX(-50%)', // Ensures true centering
          right: 'auto', // Prevents right override
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-8 w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg neon-glow"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Rocket className="h-5 w-5 text-white" />
              </motion.div>
              <motion.span 
                className="text-xl font-bold font-sora text-gradient-premium hidden sm:block"
                whileHover={{ scale: 1.05 }}
              >
                LaunchPilot
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || 
                               (item.href !== '/' && pathname.startsWith(item.href));
                
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setActiveHover(item.href)}
                    onMouseLeave={() => setActiveHover(null)}
                  >
                    <Link href={item.href}>
                      <motion.div
                        className={`relative px-4 py-2 rounded-xl transition-all cursor-pointer group flex items-center space-x-2 ${
                          isActive 
                            ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white shadow-lg' 
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeNavItem"
                            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        <motion.div
                          className={`flex items-center space-x-2 relative z-10`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="font-medium text-sm">{item.label}</span>
                        </motion.div>
                        
                        {/* Hover glow effect */}
                        {activeHover === item.href && !isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 bg-white/5 rounded-xl"
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/auth/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white neon-glow shadow-lg"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start Free
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-24 left-4 right-4 glassmorphism-dark rounded-3xl border border-white/20 z-50 lg:hidden overflow-hidden"
            >
              <div className="p-6">
                <div className="space-y-2 mb-6">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href || 
                                   (item.href !== '/' && pathname.startsWith(item.href));
                    
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={item.href}>
                          <motion.div
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                              isActive 
                                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white shadow-lg' 
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div
                              className={`p-2 rounded-lg transition-all ${
                                isActive 
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                                  : 'bg-white/10'
                              }`}
                            >
                              <item.icon className="h-4 w-4" />
                            </motion.div>
                            <span className="font-medium">{item.label}</span>
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full glassmorphism text-white border-white/20">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
                      <Zap className="h-4 w-4 mr-2" />
                      Start Free
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
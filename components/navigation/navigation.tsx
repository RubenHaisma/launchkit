'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glassmorphism-dark' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-sora text-gradient-blue">
              LaunchPilot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/generate" className="text-foreground/80 hover:text-foreground transition-colors">
              Generator
            </Link>
            <Link href="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/integrations" className="text-foreground/80 hover:text-foreground transition-colors">
              Integrations
            </Link>
            <Link href="/roadmap" className="text-foreground/80 hover:text-foreground transition-colors">
              Roadmap
            </Link>
            <Link href="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <ThemeToggle />
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-foreground/80">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white neon-glow">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="flex flex-col space-y-4">
              <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/generate" className="text-foreground/80 hover:text-foreground transition-colors">
                Generator
              </Link>
              <Link href="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/integrations" className="text-foreground/80 hover:text-foreground transition-colors">
                Integrations
              </Link>
              <Link href="/roadmap" className="text-foreground/80 hover:text-foreground transition-colors">
                Roadmap
              </Link>
              <Link href="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
'use client';

import { motion } from 'framer-motion';
import { 
  Rocket, 
  Twitter, 
  Github, 
  Heart,
  Mail,
  ExternalLink,
  Zap,
  Star,
  Users,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-auto border-t border-white/10 bg-black/20 backdrop-blur-xl"
    >
      <div className="w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Brand & Mission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Zap className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-lg font-bold font-sora text-gradient-premium">
                LaunchPilot
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              Your AI marketing co-founder, built by indie hackers for indie hackers. Launch faster, market smarter.
            </p>
            <div className="flex items-center space-x-3">
              <motion.a 
                href="https://twitter.com/launchpilot" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.2, y: -2 }}
              >
                <Twitter className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="https://github.com/launchpilot" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.2, y: -2 }}
              >
                <Github className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="/contact" 
                className="text-white/60 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.2, y: -2 }}
              >
                <Mail className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link href="/dashboard/generate" className="group flex items-center space-x-2 text-sm text-white/70 hover:text-purple-400 transition-colors">
                <Rocket className="h-3 w-3" />
                <span>Generate Content</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/dashboard/analytics" className="group flex items-center space-x-2 text-sm text-white/70 hover:text-purple-400 transition-colors">
                <Star className="h-3 w-3" />
                <span>View Analytics</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/dashboard/settings" className="group flex items-center space-x-2 text-sm text-white/70 hover:text-purple-400 transition-colors">
                <Users className="h-3 w-3" />
                <span>Account Settings</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </motion.div>

          {/* Support & Resources */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
              Support & Resources
            </h3>
            <div className="space-y-2">
              <Link href="/contact" className="group flex items-center space-x-2 text-sm text-white/70 hover:text-purple-400 transition-colors">
                <Mail className="h-3 w-3" />
                <span>Get Help</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/roadmap" className="group flex items-center space-x-2 text-sm text-white/70 hover:text-purple-400 transition-colors">
                <ExternalLink className="h-3 w-3" />
                <span>Roadmap</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <a href="mailto:support@launchpilot.com" className="group flex items-center space-x-2 text-sm text-white/70 hover:text-purple-400 transition-colors">
                <Heart className="h-3 w-3" />
                <span>Feedback</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-white/10 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
        >
          <div className="flex items-center space-x-2 text-xs text-white/60">
            <span>© {currentYear} LaunchPilot.</span>
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            </motion.div>
            <span>for indie hackers</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-white/60">
            <Link href="/privacy" className="hover:text-purple-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-purple-400 transition-colors">
              Terms
            </Link>
            <Link href="/security" className="hover:text-purple-400 transition-colors">
              Security
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

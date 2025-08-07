'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';
import Link from 'next/link';

const blogPosts: any[] = []; // Empty for now - will be populated with real content

const categories = ['All', 'Growth', 'Launch', 'AI', 'Email', 'Startup', 'Social'];

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              The <span className="text-gradient">LaunchPilot</span> Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Marketing insights, growth strategies, and AI-powered tips from the team building the future of indie marketing.
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 w-80 glassmorphism-dark border-white/20"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className="glassmorphism hover:bg-purple-500/20"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Coming Soon Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center py-24"
          >
            <div className="glassmorphism rounded-xl p-12 max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold font-sora mb-4">Blog Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                We're working on creating valuable content about AI marketing, SaaS growth, and indie maker strategies. 
                Stay tuned for insights, tutorials, and case studies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Get Notified
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="glassmorphism">
                    Suggest Topics
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
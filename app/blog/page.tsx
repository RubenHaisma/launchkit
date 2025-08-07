'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'How We Generated 10K Leads in 30 Days Using AI',
    excerpt: 'The complete playbook for using LaunchPilot to scale your SaaS from zero to hero.',
    author: 'Sarah Chen',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Growth',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: true,
  },
  {
    id: 2,
    title: 'The Ultimate Product Hunt Launch Strategy for 2024',
    excerpt: 'Step-by-step guide to dominating Product Hunt and getting featured.',
    author: 'Marcus Rodriguez',
    date: '2024-01-12',
    readTime: '12 min read',
    category: 'Launch',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false,
  },
  {
    id: 3,
    title: 'AI vs Human: Which Creates Better Marketing Content?',
    excerpt: 'We tested AI-generated content against human writers. The results will surprise you.',
    author: 'Emily Watson',
    date: '2024-01-10',
    readTime: '6 min read',
    category: 'AI',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false,
  },
  {
    id: 4,
    title: 'Cold Email Templates That Convert at 23%',
    excerpt: 'The exact templates our users are using to book meetings and close deals.',
    author: 'Alex Chen',
    date: '2024-01-08',
    readTime: '10 min read',
    category: 'Email',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false,
  },
  {
    id: 5,
    title: 'Building in Public: Our Journey to $100K ARR',
    excerpt: 'Lessons learned from building LaunchPilot in public and reaching our first milestone.',
    author: 'Sarah Chen',
    date: '2024-01-05',
    readTime: '15 min read',
    category: 'Startup',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false,
  },
  {
    id: 6,
    title: 'Twitter Growth Hacks That Actually Work in 2024',
    excerpt: 'Proven strategies to grow your Twitter following and engagement using AI.',
    author: 'Marcus Rodriguez',
    date: '2024-01-03',
    readTime: '7 min read',
    category: 'Social',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false,
  },
];

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

          {/* Featured Post */}
          {blogPosts.filter(post => post.featured).map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glassmorphism rounded-2xl p-8 mb-16 hover-lift"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center space-x-2 mb-4">
                    <Tag className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">{post.category}</span>
                    <span className="text-sm text-muted-foreground">• Featured</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-sora mb-4 hover:text-gradient transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{post.readTime}</span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="glassmorphism rounded-xl overflow-hidden hover-lift group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-purple-500/80 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold font-sora mb-3 group-hover:text-gradient transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span>{post.author}</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <Button variant="outline" size="lg" className="glassmorphism hover-lift">
              Load More Articles
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
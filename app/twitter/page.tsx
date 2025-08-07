'use client';

import { useState } from 'react';
import { 
  Twitter, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  Heart, 
  Repeat2,
  BarChart3,
  Clock,
  Zap,
  Plus,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';
import { motion } from 'framer-motion';

const tweetIdeas = [
  {
    hook: "Most SaaS founders make this mistake:",
    content: "They build features users ask for instead of features users actually need.\n\nHere's how to avoid this trap 🧵",
    engagement: "High",
    type: "Thread"
  },
  {
    hook: "Unpopular opinion:",
    content: "Your SaaS doesn't need more features.\n\nIt needs better onboarding.\n\n90% of churn happens in the first 7 days.",
    engagement: "Medium",
    type: "Tweet"
  },
  {
    hook: "I analyzed 100 failed SaaS startups.",
    content: "Here are the 5 patterns I found:\n\n1. No clear value proposition\n2. Poor product-market fit\n3. Ignored customer feedback\n4. Ran out of money\n5. Founder burnout\n\nAvoid these at all costs.",
    engagement: "High",
    type: "Thread"
  }
];

const scheduledTweets = [
  {
    id: 1,
    content: "Just shipped a new feature that saves users 2 hours per week. Sometimes the best features are the ones that do less, not more. #SaaS #ProductDevelopment",
    scheduledFor: "2024-01-20 09:00",
    status: "scheduled",
    type: "tweet"
  },
  {
    id: 2,
    content: "Thread about building in public: Why transparency beats perfection every time 🧵",
    scheduledFor: "2024-01-20 14:30",
    status: "scheduled",
    type: "thread"
  }
];

export default function TwitterPage() {
  const [selectedTab, setSelectedTab] = useState('generate');
  const [tweetContent, setTweetContent] = useState('');
  const [threadContent, setThreadContent] = useState(['']);

  const addThreadTweet = () => {
    setThreadContent([...threadContent, '']);
  };

  const updateThreadTweet = (index: number, content: string) => {
    const updated = [...threadContent];
    updated[index] = content;
    setThreadContent(updated);
  };

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
            <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-6">
              <Twitter className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Twitter Growth Engine</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Build Your <span className="text-gradient">Twitter Empire</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Generate viral tweets, engaging threads, and grow your audience with AI-powered content 
              that resonates with your target market.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">2.4K</div>
              <div className="text-sm text-muted-foreground">Followers</div>
              <div className="text-xs text-green-400 mt-1">+12% this week</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">89K</div>
              <div className="text-sm text-muted-foreground">Impressions</div>
              <div className="text-xs text-green-400 mt-1">+23% this week</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">4.2%</div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
              <div className="text-xs text-green-400 mt-1">+0.8% this week</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">156</div>
              <div className="text-sm text-muted-foreground">Profile Visits</div>
              <div className="text-xs text-green-400 mt-1">+34% this week</div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="glassmorphism rounded-lg p-1 flex">
              {[
                { id: 'generate', label: 'Generate', icon: Zap },
                { id: 'schedule', label: 'Schedule', icon: Calendar },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                    selectedTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {selectedTab === 'generate' && (
              <>
                {/* Content Generator */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="lg:col-span-2"
                >
                  <div className="glassmorphism rounded-xl p-6">
                    <h2 className="text-2xl font-bold font-sora mb-6">Generate Content</h2>
                    
                    <div className="space-y-6">
                      <div className="flex space-x-4">
                        <Button
                          variant={selectedTab === 'generate' ? 'default' : 'outline'}
                          className="flex-1 glassmorphism"
                        >
                          Single Tweet
                        </Button>
                        <Button
                          variant={selectedTab === 'generate' ? 'default' : 'outline'}
                          className="flex-1 glassmorphism"
                        >
                          Thread
                        </Button>
                      </div>

                      <div>
                        <Label htmlFor="topic">What's your topic?</Label>
                        <Input
                          id="topic"
                          placeholder="e.g., SaaS marketing tips, building in public, productivity hacks"
                          className="glassmorphism-dark border-white/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tone</Label>
                          <Select>
                            <SelectTrigger className="glassmorphism-dark border-white/20">
                              <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="humorous">Humorous</SelectItem>
                              <SelectItem value="inspiring">Inspiring</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Hook Style</Label>
                          <Select>
                            <SelectTrigger className="glassmorphism-dark border-white/20">
                              <SelectValue placeholder="Select hook" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="question">Question</SelectItem>
                              <SelectItem value="controversial">Controversial</SelectItem>
                              <SelectItem value="story">Story</SelectItem>
                              <SelectItem value="statistic">Statistic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Content
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* AI Suggestions */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="glassmorphism rounded-xl p-6">
                    <h3 className="text-xl font-bold font-sora mb-4">AI Suggestions</h3>
                    <div className="space-y-4">
                      {tweetIdeas.map((idea, index) => (
                        <div key={index} className="glassmorphism-dark rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              idea.type === 'Thread' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {idea.type}
                            </span>
                            <span className={`text-xs ${
                              idea.engagement === 'High' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {idea.engagement} Engagement
                            </span>
                          </div>
                          <div className="text-sm font-semibold mb-2">{idea.hook}</div>
                          <div className="text-xs text-muted-foreground mb-3">{idea.content}</div>
                          <Button size="sm" variant="outline" className="w-full glassmorphism text-xs">
                            Use This Idea
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {selectedTab === 'schedule' && (
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="glassmorphism rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold font-sora">Scheduled Content</h2>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Tweet
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scheduledTweets.map((tweet) => (
                      <div key={tweet.id} className="glassmorphism-dark rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            tweet.type === 'thread' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {tweet.type}
                          </span>
                          <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                            {tweet.status}
                          </span>
                        </div>
                        
                        <div className="text-sm mb-3 line-clamp-3">{tweet.content}</div>
                        
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                          <Clock className="h-3 w-3" />
                          <span>{tweet.scheduledFor}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1 glassmorphism text-xs">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="glassmorphism text-xs">
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {selectedTab === 'analytics' && (
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="glassmorphism rounded-xl p-6"
                >
                  <h2 className="text-2xl font-bold font-sora mb-6">Performance Analytics</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="glassmorphism-dark rounded-lg p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">156%</div>
                      <div className="text-sm text-muted-foreground">Growth Rate</div>
                    </div>
                    <div className="glassmorphism-dark rounded-lg p-4 text-center">
                      <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">1.2K</div>
                      <div className="text-sm text-muted-foreground">Total Likes</div>
                    </div>
                    <div className="glassmorphism-dark rounded-lg p-4 text-center">
                      <Repeat2 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">340</div>
                      <div className="text-sm text-muted-foreground">Retweets</div>
                    </div>
                    <div className="glassmorphism-dark rounded-lg p-4 text-center">
                      <MessageSquare className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">89</div>
                      <div className="text-sm text-muted-foreground">Replies</div>
                    </div>
                  </div>

                  <div className="glassmorphism-dark rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
                    <div className="space-y-4">
                      {[
                        { content: "Most SaaS founders make this mistake: They build features users ask for...", engagement: 89, type: "Thread" },
                        { content: "Unpopular opinion: Your SaaS doesn't need more features...", engagement: 67, type: "Tweet" },
                        { content: "I analyzed 100 failed SaaS startups. Here are the 5 patterns...", engagement: 134, type: "Thread" }
                      ].map((post, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm mb-1">{post.content}</div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                post.type === 'Thread' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {post.type}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-400">{post.engagement}</div>
                            <div className="text-xs text-muted-foreground">engagements</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
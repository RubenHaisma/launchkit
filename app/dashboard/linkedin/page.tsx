'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Linkedin,
  Send,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Share,
  Plus,
  Sparkles,
  ExternalLink,
  Copy,
  RefreshCw,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LinkedInPage() {
  const [postContent, setPostContent] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [postStyle, setPostStyle] = useState('');
  const [industry, setIndustry] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePosts = async () => {
    if (!aiTopic.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'linkedin',
          topic: aiTopic,
          style: postStyle || 'professional',
          industry,
          count: 3
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedPosts(data.content || []);
      }
    } catch (error) {
      console.error('Error generating posts:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const createLinkedInLink = (text: string) => {
    const encodedText = encodeURIComponent(text);
    return `https://www.linkedin.com/sharing/share-offsite/?url=&text=${encodedText}`;
  };

  const stats = [
    { label: 'Posts This Week', value: '5', change: '+1', icon: Linkedin, color: 'text-blue-400' },
    { label: 'Profile Views', value: '348', change: '+23%', icon: TrendingUp, color: 'text-green-400' },
    { label: 'New Connections', value: '+28', change: '+15%', icon: Users, color: 'text-purple-400' },
    { label: 'Post Engagement', value: '5.8%', change: '+1.2%', icon: Heart, color: 'text-pink-400' },
  ];

  const recentPosts = [
    {
      content: "5 lessons learned from building and scaling LaunchPilot to 1000+ users in 3 months. Thread below 👇",
      stats: { likes: 187, comments: 34, shares: 12 },
      time: '6 hours ago'
    },
    {
      content: "The biggest mistake I see entrepreneurs make: perfecting the product before understanding the market. LaunchPilot was born from this realization.",
      stats: { likes: 92, comments: 18, shares: 7 },
      time: '2 days ago'
    }
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">LinkedIn Management</h1>
          <p className="text-muted-foreground">
            Build your professional brand and grow your network with AI-powered content
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <Card key={stat.label} className="glassmorphism p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${
                stat.color === 'text-blue-400' ? 'from-blue-500/20 to-blue-600/20' :
                stat.color === 'text-green-400' ? 'from-green-500/20 to-green-600/20' :
                stat.color === 'text-purple-400' ? 'from-purple-500/20 to-purple-600/20' :
                'from-pink-500/20 to-pink-600/20'
              }`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <Badge variant="secondary" className="text-xs">
                {stat.change}
              </Badge>
            </div>
            <div className="text-2xl font-bold font-sora mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </motion.div>

      {/* AI Post Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glassmorphism rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold">AI LinkedIn Post Generator</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="What professional topic should I write about?"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            className="bg-black/20 border-white/10"
          />
          <Select value={postStyle} onValueChange={setPostStyle}>
            <SelectTrigger className="bg-black/20 border-white/10">
              <SelectValue placeholder="Select post style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional Insight</SelectItem>
              <SelectItem value="storytelling">Personal Story</SelectItem>
              <SelectItem value="educational">Educational Content</SelectItem>
              <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
              <SelectItem value="industry-news">Industry Commentary</SelectItem>
              <SelectItem value="tips">Tips & Advice</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Industry/niche (optional)"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="bg-black/20 border-white/10"
          />
        </div>

        <Button 
          onClick={generatePosts}
          disabled={!aiTopic.trim() || isGenerating}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full mb-6"
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Generating Posts...' : 'Generate AI LinkedIn Posts'}
        </Button>

        {generatedPosts.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Generated Post Options:</h4>
            {generatedPosts.map((post, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4 space-y-3">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{post}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {post.length} characters • ~{Math.ceil(post.split(' ').length / 4)} min read
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(post, index)}
                      className="glassmorphism h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.open(createLinkedInLink(post), '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 h-8"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Share on LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Manual Post Composer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glassmorphism rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Manual Compose</h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Share your professional insights, achievements, or industry thoughts..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="min-h-[150px] bg-black/20 border-white/10"
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {postContent.length} characters • ~{Math.ceil(postContent.split(' ').length / 4)} min read
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(postContent, -1)}
                disabled={!postContent.trim()}
                className="glassmorphism"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={() => window.open(createLinkedInLink(postContent), '_blank')}
                disabled={!postContent.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Share on LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Ideas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glassmorphism rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Professional Content Ideas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            'Share a recent professional achievement',
            'Industry trends and predictions',
            'Lessons learned from failures',
            'Behind-the-scenes of your work',
            'Career advice for newcomers',
            'Company culture highlights',
            'Product launch announcements',
            'Conference takeaways',
            'Book recommendations',
            'Team collaboration wins'
          ].map((idea, index) => (
            <Button
              key={index}
              variant="outline"
              className="glassmorphism h-auto p-3 text-left justify-start text-wrap"
              onClick={() => setAiTopic(idea)}
            >
              <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-xs">{idea}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Recent Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glassmorphism rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-6">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((post, index) => (
            <div key={index} className="bg-black/20 rounded-lg p-4">
              <p className="text-sm mb-3 leading-relaxed">{post.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{post.stats.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.stats.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share className="h-3 w-3" />
                    <span>{post.stats.shares}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{post.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare,
  Send,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  ArrowUp,
  Plus,
  Sparkles,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RedditPage() {
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [postStyle, setPostStyle] = useState('');
  const [targetSubreddit, setTargetSubreddit] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<Array<{title: string, content: string}>>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePosts = async () => {
    if (!aiTopic.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reddit',
          topic: aiTopic,
          style: postStyle || 'engaging',
          subreddit: targetSubreddit,
          count: 3
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Parse content into title and body
        const posts = data.content.map((content: string) => {
          const lines = content.split('\n').filter(line => line.trim());
          const title = lines[0]?.replace(/^(Title:|#\s*)/, '') || content.substring(0, 100);
          const body = lines.slice(1).join('\n').trim() || content;
          return { title, content: body };
        });
        setGeneratedPosts(posts);
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

  const createRedditLink = (title: string, content: string, subreddit?: string) => {
    const sub = subreddit || 'findareddit';
    const encodedTitle = encodeURIComponent(title);
    const encodedContent = encodeURIComponent(content);
    return `https://www.reddit.com/r/${sub}/submit?title=${encodedTitle}&text=${encodedContent}`;
  };

  const stats = [
    { label: 'Posts This Week', value: '8', change: '+2', icon: MessageSquare, color: 'text-orange-400' },
    { label: 'Total Karma', value: '1.2K', change: '+145', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Active Communities', value: '12', change: '+3', icon: Users, color: 'text-purple-400' },
    { label: 'Avg. Upvotes', value: '24', change: '+8', icon: ArrowUp, color: 'text-blue-400' },
  ];

  const recentPosts = [
    {
      title: "How LaunchPilot helped me automate my content strategy",
      subreddit: "r/entrepreneur",
      stats: { upvotes: 42, comments: 12 },
      time: '4 hours ago'
    },
    {
      title: "The hidden costs of manual content creation for indie hackers",
      subreddit: "r/indiehackers",
      stats: { upvotes: 89, comments: 23 },
      time: '1 day ago'
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
          <h1 className="text-3xl font-bold font-sora mb-2">Reddit Management</h1>
          <p className="text-muted-foreground">
            Create engaging posts and grow your presence across Reddit communities
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Post
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
                stat.color === 'text-orange-400' ? 'from-orange-500/20 to-red-600/20' :
                stat.color === 'text-green-400' ? 'from-green-500/20 to-green-600/20' :
                stat.color === 'text-purple-400' ? 'from-purple-500/20 to-purple-600/20' :
                'from-blue-500/20 to-blue-600/20'
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
          <h3 className="text-lg font-semibold">AI Reddit Post Generator</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="What topic should I post about?"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            className="bg-black/20 border-white/10"
          />
          <Select value={postStyle} onValueChange={setPostStyle}>
            <SelectTrigger className="bg-black/20 border-white/10">
              <SelectValue placeholder="Select post style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discussion">Discussion Starter</SelectItem>
              <SelectItem value="educational">Educational/Guide</SelectItem>
              <SelectItem value="personal">Personal Experience</SelectItem>
              <SelectItem value="question">Ask Reddit</SelectItem>
              <SelectItem value="showcase">Project Showcase</SelectItem>
              <SelectItem value="news">News/Update</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Target subreddit (optional)"
            value={targetSubreddit}
            onChange={(e) => setTargetSubreddit(e.target.value)}
            className="bg-black/20 border-white/10"
          />
        </div>

        <Button 
          onClick={generatePosts}
          disabled={!aiTopic.trim() || isGenerating}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 w-full mb-6"
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Generating Posts...' : 'Generate AI Reddit Posts'}
        </Button>

        {generatedPosts.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Generated Post Options:</h4>
            {generatedPosts.map((post, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-orange-400">Title:</div>
                  <p className="text-sm leading-relaxed font-medium">{post.title}</p>
                  <div className="text-sm font-semibold text-orange-400">Content:</div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Title: {post.title.length}/300 • Content: {post.content.length} chars
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(`${post.title}\n\n${post.content}`, index)}
                      className="glassmorphism h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.open(createRedditLink(post.title, post.content, targetSubreddit), '_blank')}
                      className="bg-orange-500 hover:bg-orange-600 h-8"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Post on Reddit
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
          <Input
            placeholder="Post title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="bg-black/20 border-white/10"
          />
          <Textarea
            placeholder="What's on your mind? Share with the community..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="min-h-[120px] bg-black/20 border-white/10"
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Title: {postTitle.length}/300 • Content: {postContent.length} characters
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(`${postTitle}\n\n${postContent}`, -1)}
                disabled={!postTitle.trim() && !postContent.trim()}
                className="glassmorphism"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={() => window.open(createRedditLink(postTitle, postContent), '_blank')}
                disabled={!postTitle.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Post on Reddit
              </Button>
            </div>
          </div>
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
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium leading-relaxed flex-1 mr-4">{post.title}</h4>
                <Badge variant="outline" className="text-xs">{post.subreddit}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <ArrowUp className="h-3 w-3" />
                    <span>{post.stats.upvotes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.stats.comments}</span>
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
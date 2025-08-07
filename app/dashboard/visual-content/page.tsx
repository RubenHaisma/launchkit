'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Instagram,
  Play,
  Camera,
  Hash,
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
  Image,
  Video,
  Eye,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function VisualContentPage() {
  const [postContent, setPostContent] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [contentStyle, setContentStyle] = useState('');
  const [platform, setPlatform] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Array<{
    caption: string;
    hashtags: string[];
    visualDescription: string;
    platform: string;
  }>>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateContent = async () => {
    if (!aiTopic.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'visual-content',
          topic: aiTopic,
          style: contentStyle || 'trendy',
          platform: platform || 'instagram',
          count: 3
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Parse the generated content into structured format
        const structuredContent = data.content.map((content: string, index: number) => {
          const lines = content.split('\n').filter(line => line.trim());
          const captionLine = lines.find(line => line.toLowerCase().includes('caption:')) || lines[0] || content;
          const hashtagsLine = lines.find(line => line.toLowerCase().includes('hashtags:')) || '';
          const visualLine = lines.find(line => line.toLowerCase().includes('visual:') || line.toLowerCase().includes('image:')) || '';
          
          return {
            caption: captionLine.replace(/^(caption:|#\s*)/i, '').trim(),
            hashtags: hashtagsLine.replace(/^hashtags:/i, '').trim().split(/[#\s]+/).filter(tag => tag.length > 0),
            visualDescription: visualLine.replace(/^(visual:|image:)/i, '').trim() || `Visual concept for ${aiTopic} content`,
            platform: platform || 'instagram'
          };
        });
        setGeneratedContent(structuredContent);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyFullContent = async (content: any, index: number) => {
    const fullText = `${content.caption}\n\n${content.hashtags.map((tag: string) => `#${tag}`).join(' ')}`;
    await copyToClipboard(fullText, index);
  };

  const stats = [
    { label: 'Posts This Week', value: '12', change: '+3', icon: Camera, color: 'text-pink-400' },
    { label: 'Total Followers', value: '2.4K', change: '+156', icon: Users, color: 'text-purple-400' },
    { label: 'Avg. Engagement', value: '8.2%', change: '+2.1%', icon: Heart, color: 'text-red-400' },
    { label: 'Reach', value: '15.7K', change: '+28%', icon: TrendingUp, color: 'text-green-400' },
  ];

  const contentIdeas = {
    instagram: [
      'Behind-the-scenes content',
      'User-generated content showcase',
      'Product photography tips',
      'Day in the life posts',
      'Before/after transformations',
      'Quote graphics',
      'Tutorial carousels',
      'Team spotlights',
      'Customer testimonials',
      'Trending audio content'
    ],
    tiktok: [
      'Quick tips and hacks',
      'Trending challenges',
      'Educational content',
      'Comedy sketches',
      'Duet opportunities',
      'Process videos',
      'Reaction videos',
      'Storytelling content',
      'Music-based content',
      'Transformation videos'
    ]
  };

  const platformLinks = {
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/upload'
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-sora mb-2">Visual Content</h1>
          <p className="text-muted-foreground">
            Create engaging Instagram and TikTok content with AI-powered captions and visual ideas
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Content
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
                stat.color === 'text-pink-400' ? 'from-pink-500/20 to-pink-600/20' :
                stat.color === 'text-purple-400' ? 'from-purple-500/20 to-purple-600/20' :
                stat.color === 'text-red-400' ? 'from-red-500/20 to-red-600/20' :
                'from-green-500/20 to-green-600/20'
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

      {/* AI Content Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glassmorphism rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold">AI Visual Content Generator</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="What should I create content about?"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            className="bg-black/20 border-white/10"
          />
          <Select value={contentStyle} onValueChange={setContentStyle}>
            <SelectTrigger className="bg-black/20 border-white/10">
              <SelectValue placeholder="Content style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trendy">Trendy & Viral</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="inspirational">Inspirational</SelectItem>
              <SelectItem value="funny">Funny & Entertaining</SelectItem>
              <SelectItem value="aesthetic">Aesthetic & Clean</SelectItem>
              <SelectItem value="storytelling">Storytelling</SelectItem>
            </SelectContent>
          </Select>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="bg-black/20 border-white/10">
              <SelectValue placeholder="Target platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="both">Both Platforms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={generateContent}
          disabled={!aiTopic.trim() || isGenerating}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full mb-6"
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Generating Content...' : 'Generate AI Visual Content'}
        </Button>

        {generatedContent.length > 0 && (
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-muted-foreground">Generated Content Ideas:</h4>
            {generatedContent.map((content, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  {content.platform === 'instagram' ? <Instagram className="h-4 w-4 text-pink-400" /> : <Play className="h-4 w-4 text-purple-400" />}
                  <Badge variant="outline" className="text-xs">
                    {content.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-semibold text-pink-400 mb-1 flex items-center gap-2">
                      <MessageCircle className="h-3 w-3" />
                      Caption:
                    </div>
                    <p className="text-sm leading-relaxed bg-black/10 rounded p-2">{content.caption}</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold text-purple-400 mb-1 flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      Visual Description:
                    </div>
                    <p className="text-sm text-muted-foreground bg-black/10 rounded p-2">{content.visualDescription}</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold text-blue-400 mb-1 flex items-center gap-2">
                      <Hash className="h-3 w-3" />
                      Hashtags:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {content.hashtags.slice(0, 10).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="text-xs text-muted-foreground">
                    Caption: {content.caption.length} chars • {content.hashtags.length} hashtags
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyFullContent(content, index)}
                      className="glassmorphism h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedIndex === index ? 'Copied!' : 'Copy All'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.open(platformLinks[content.platform as keyof typeof platformLinks], '_blank')}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 h-8"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open {content.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Content Ideas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glassmorphism rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Content Ideas by Platform</h3>
        <Tabs defaultValue="instagram" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glassmorphism">
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="tiktok" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              TikTok
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(contentIdeas).map(([platformKey, ideas]) => (
            <TabsContent key={platformKey} value={platformKey} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ideas.map((idea, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="glassmorphism h-auto p-3 text-left justify-start text-wrap"
                    onClick={() => {
                      setAiTopic(idea);
                      setPlatform(platformKey);
                    }}
                  >
                    {platformKey === 'instagram' ? 
                      <Image className="h-4 w-4 mr-2 flex-shrink-0" /> :
                      <Video className="h-4 w-4 mr-2 flex-shrink-0" />
                    }
                    <span className="text-xs">{idea}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Manual Content Creator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glassmorphism rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Manual Content Creator</h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Write your caption here..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="min-h-[100px] bg-black/20 border-white/10"
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {postContent.length} characters
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
                onClick={() => window.open('https://www.instagram.com/', '_blank')}
                disabled={!postContent.trim()}
                className="bg-pink-500 hover:bg-pink-600 mr-2"
              >
                <Instagram className="h-4 w-4 mr-2" />
                Instagram
              </Button>
              <Button
                onClick={() => window.open('https://www.tiktok.com/upload', '_blank')}
                disabled={!postContent.trim()}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Play className="h-4 w-4 mr-2" />
                TikTok
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  RefreshCw,
  TrendingUp,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

interface GeneratedContent {
  content: string;
  hashtags?: string[];
  suggestedPostTime?: string;
  engagementPrediction?: number;
  optimizations?: string[];
}

interface DemoResults {
  tweet: GeneratedContent;
  linkedinPost: GeneratedContent;
  emailSubject: GeneratedContent;
}

const demoPrompts = [
  "Launch my new SaaS product that helps remote teams collaborate better",
  "Announce my AI-powered design tool for indie developers", 
  "Share my journey building a $10K MRR startup in 6 months",
  "Promote my course on building viral marketing campaigns",
  "Introduce my productivity app that saves 5 hours per week"
];

export function AiDemo() {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<DemoResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(0);

  const generateDemo = async (demoPrompt?: string) => {
    const inputPrompt = demoPrompt || prompt;
    if (!inputPrompt.trim()) {
      toast.error('Please enter a prompt to see the magic!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputPrompt })
      });

      if (!response.ok) throw new Error('Demo failed');

      const data = await response.json();
      setResults(data.results);
      toast.success('✨ AI magic complete!');
    } catch (error) {
      console.error('Demo error:', error);
      toast.error('Demo unavailable. Try the examples!');
      // Show example results for demo purposes
      setResults({
        tweet: {
          content: `🚀 Just launched ${inputPrompt}!\n\nAfter months of building in stealth mode, we're finally ready to help indie builders scale their marketing.\n\n✨ AI-powered content generation\n🎯 Multi-platform automation\n📈 Real-time analytics\n\nFirst 100 users get 50% off! What do you think? 👇`,
          hashtags: ['#IndieHackers', '#SaaS', '#Marketing', '#AI'],
          suggestedPostTime: '9 AM EST',
          engagementPrediction: 8.5,
          optimizations: ['Consider adding a question to boost engagement', 'Great use of emojis and structure']
        },
        linkedinPost: {
          content: `The journey to launching ${inputPrompt} taught me everything about marketing as a solo founder.\n\n6 months ago, I was spending 20+ hours/week on content creation, social media, and outreach.\n\nToday, our AI handles:\n→ Content generation across all platforms\n→ Optimal posting schedules\n→ Community engagement\n→ Email campaigns\n\nThe result? 300% more reach with 80% less time.\n\nFor indie builders drowning in marketing tasks, this changes everything.\n\nWhat's your biggest marketing challenge as a founder?`,
          suggestedPostTime: '9 AM EST (Tuesday-Thursday)',
          engagementPrediction: 7.8,
          optimizations: ['Excellent storytelling structure', 'Question at the end drives engagement']
        },
        emailSubject: {
          content: `This ${inputPrompt.split(' ').pop()} just saved me 15 hours/week`,
          suggestedPostTime: '10 AM EST (Tuesday-Thursday)',
          engagementPrediction: 9.2,
          optimizations: ['Strong curiosity hook', 'Specific time benefit creates urgency']
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const copyContent = (content: string, platform: string) => {
    navigator.clipboard.writeText(content);
    toast.success(`${platform} content copied!`);
  };

  const nextDemo = () => {
    const nextIndex = (currentDemo + 1) % demoPrompts.length;
    setCurrentDemo(nextIndex);
    setPrompt(demoPrompts[nextIndex]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-purple-500 mr-2" />
          <h2 className="text-3xl font-bold font-sora bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            See AI Magic In Action
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Watch how our AI transforms one idea into platform-optimized content that actually converts. 
          No marketing expertise required.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glassmorphism rounded-xl p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Describe what you want to promote... (e.g., 'My new productivity app for remote teams')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black/20 border-white/10 text-white placeholder:text-white/60"
              onKeyPress={(e) => e.key === 'Enter' && generateDemo()}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => generateDemo()}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Generating...' : 'Generate'}
            </Button>
            <Button 
              variant="outline"
              onClick={nextDemo}
              className="glassmorphism"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Example prompts */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Try:</span>
          {demoPrompts.slice(0, 2).map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setPrompt(example);
                generateDemo(example);
              }}
              className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-purple-300 transition-all"
            >
              {example.length > 40 ? example.substring(0, 40) + '...' : example}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Twitter */}
            <Card className="glassmorphism p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Twitter className="h-5 w-5 text-blue-400 mr-2" />
                  <h3 className="font-semibold">Twitter</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyContent(results.tweet.content, 'Twitter')}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 mb-4 text-sm leading-relaxed">
                {results.tweet.content}
              </div>
              
              {results.tweet.hashtags && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {results.tweet.hashtags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Score: {results.tweet.engagementPrediction}/10
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {results.tweet.suggestedPostTime}
                </div>
              </div>
            </Card>

            {/* LinkedIn */}
            <Card className="glassmorphism p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Linkedin className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold">LinkedIn</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyContent(results.linkedinPost.content, 'LinkedIn')}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 mb-4 text-sm leading-relaxed max-h-48 overflow-y-auto">
                {results.linkedinPost.content}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Target className="h-3 w-3 mr-1" />
                  Score: {results.linkedinPost.engagementPrediction}/10
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {results.linkedinPost.suggestedPostTime?.split('(')[0]}
                </div>
              </div>
            </Card>

            {/* Email Subject */}
            <Card className="glassmorphism p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="font-semibold">Email Subject</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyContent(results.emailSubject.content, 'Email')}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 mb-4 text-sm leading-relaxed">
                <strong>Subject:</strong> {results.emailSubject.content}
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                <div className="text-xs font-semibold text-green-400 mb-1">Predicted Performance</div>
                <div className="text-sm">
                  <span className="text-green-400 font-bold">{(results.emailSubject.engagementPrediction || 8) * 5}%</span>
                  <span className="text-muted-foreground ml-1">open rate</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  High urgency
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {results.emailSubject.suggestedPostTime?.split('(')[0]}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 p-6 glassmorphism rounded-xl"
        >
          <h3 className="text-xl font-bold mb-2">
            🔥 This is just the beginning
          </h3>
          <p className="text-muted-foreground mb-4">
            Get access to 15+ content types, Twitter automation, Reddit posting, viral analysis, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Start Free Trial - $0
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="glassmorphism"
            >
              View All Features
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            No credit card required • 50 free generations • Cancel anytime
          </p>
        </motion.div>
      )}
    </div>
  );
}
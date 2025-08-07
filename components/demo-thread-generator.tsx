'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Twitter, Sparkles, RefreshCw } from 'lucide-react';
import { formatAsTwitterThread } from '@/lib/ai';
import TwitterThreadDisplay from '@/components/ui/twitter-thread-display';

export default function DemoThreadGenerator() {
  const [inputText, setInputText] = useState('');
  const [thread, setThread] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleConvertToThread = () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      const formattedThread = formatAsTwitterThread(inputText, ['#LaunchKit', '#TwitterThread', '#AI'], {
        addNumbers: true,
        enhanceHook: true,
        addCTA: true,
        maxTweetsPerThread: 10
      });
      
      setThread(formattedThread);
      setIsGenerating(false);
    }, 1000);
  };

  const generateAIThread = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'twitter-thread',
          topic: inputText || 'How to build a successful SaaS business',
          style: 'engaging'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.thread) {
          setThread(data.thread);
        } else {
          // Fallback to manual formatting
          const formattedThread = formatAsTwitterThread(data.content, data.hashtags);
          setThread(formattedThread);
        }
      }
    } catch (error) {
      console.error('Error generating thread:', error);
      
      // Demo fallback content
      const demoContent = `Building a successful SaaS business requires more than just a great idea. Here's what I've learned after launching multiple products:

First, validate your idea before writing a single line of code. Talk to potential customers, understand their pain points, and make sure there's genuine demand for your solution.

Second, focus on solving a specific problem really well. Don't try to be everything to everyone. A focused product that solves one problem exceptionally is better than a Swiss Army knife that does everything poorly.

Third, prioritize user experience from day one. Your users don't care about your tech stack or how clever your code is. They care about whether your product makes their life easier.

Finally, build in public and gather feedback constantly. Your users will guide you toward product-market fit if you listen to them.

Remember, building a SaaS is a marathon, not a sprint. Stay consistent, keep improving, and don't give up when things get tough.`;
      
      const formattedThread = formatAsTwitterThread(demoContent, ['#SaaS', '#Entrepreneurship', '#StartupTips']);
      setThread(formattedThread);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Smart Twitter Thread Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter your content or topic
            </label>
            <Textarea
              placeholder="Enter long content to convert to a thread, or a topic to generate content..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleConvertToThread}
              disabled={isGenerating || !inputText.trim()}
              variant="outline"
              className="flex-1"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Twitter className="h-4 w-4 mr-2" />
              )}
              Convert to Thread
            </Button>
            
            <Button 
              onClick={generateAIThread}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              AI Generate Thread
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <strong>Convert to Thread:</strong> Takes your text and formats it as a Twitter thread<br/>
            <strong>AI Generate Thread:</strong> Uses AI to create engaging thread content
          </div>
        </CardContent>
      </Card>

      {thread && (
        <TwitterThreadDisplay 
          thread={thread}
          showValidation={true}
          showStats={true}
        />
      )}
      
      {!thread && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-3">
              <Twitter className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">Ready to create amazing threads?</h3>
              <p className="text-muted-foreground">
                Enter your content above and watch it transform into an engaging Twitter thread with optimal formatting, numbering, and engagement features.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <Badge variant="secondary">Smart Formatting</Badge>
                <Badge variant="secondary">Auto Numbering</Badge>
                <Badge variant="secondary">Hook Enhancement</Badge>
                <Badge variant="secondary">CTA Addition</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

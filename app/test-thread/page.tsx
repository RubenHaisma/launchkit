'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TwitterThreadDisplay from '@/components/ui/twitter-thread-display';
import { formatAsTwitterThread } from '@/lib/ai';

export default function TestThreadPage() {
  const [inputText, setInputText] = useState(`Exciting news for large businesses! 🚀 Introducing Laava, your new digital colleague! We're transforming the way you work with AI agents that are always on and always learning. Ready to scale smarter and faster? Let's dive in!

Imagine a workforce that never sleeps—AI agents are available 24/7 to handle repetitive tasks. From Slack to HubSpot, our virtual colleagues integrate seamlessly with your existing tools.

Efficiency redefined! Laava's digital colleagues get smarter with every interaction, learning from your team and evolving to meet your business needs. 📈 Watch productivity soar!

Automate and innovate! Whether managing your inbox or syncing CRM data, let Laava handle the mundane so your team can focus on what truly matters—growth and strategy. 🌟

Why Laava? Expert integration, continuous learning, and unmatched availability. It's the future of staffing, here today. Experience the power of AI-driven efficiency!

Join the AI revolution with Laava! Ready to see a demo or learn more about how we can boost your business? Check out our website and start your journey with us! 🌐

The future is digital, and your business deserves to lead the charge. Let's talk about how Laava can transform your operations! 🤝 DM us or visit our site to get started.`);
  
  const [thread, setThread] = useState<any>(null);

  const handleFormatThread = () => {
    const formattedThread = formatAsTwitterThread(
      inputText,
      ['#AIAutomation', '#SaaSLaunch', '#VirtualColleague', '#FutureOfWork'],
      {
        addNumbers: true,
        enhanceHook: true,
        addCTA: true,
        maxTweetsPerThread: 10
      }
    );
    setThread(formattedThread);
  };

  const testAPICall = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'twitter-thread',
          prompt: 'Create a viral Twitter thread about my SaaS launch'
        })
      });
      
      const result = await response.json();
      console.log('API Result:', result);
      
      if (result.thread) {
        setThread(result.thread);
      } else {
        // If no thread data, create one from the content
        const formattedThread = formatAsTwitterThread(
          result.content,
          result.hashtags || [],
          {
            addNumbers: true,
            enhanceHook: true,
            addCTA: true
          }
        );
        setThread(formattedThread);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Twitter Thread Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px]"
            placeholder="Enter your content to format as a thread..."
          />
          
          <div className="flex gap-3">
            <Button onClick={handleFormatThread}>
              Format as Thread (Local)
            </Button>
            <Button onClick={testAPICall} variant="outline">
              Test API Call
            </Button>
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
    </div>
  );
}

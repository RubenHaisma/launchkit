'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Twitter, 
  Linkedin, 
  MessageSquare,
  Copy,
  ExternalLink,
  Sparkles,
  User,
  Bot,
  Trash2,
  RefreshCw,
  Zap,
  Globe,
  Hash,
  Clock,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/lib/store/dashboard-store';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useTokens } from '@/hooks/use-tokens';
import { TokenCostDisplay } from '@/components/ui/token-cost-display';
import TwitterThreadDisplay from '@/components/ui/twitter-thread-display';
import { formatAsTwitterThread } from '@/lib/ai';
import { FormattedThread } from '@/lib/twitter-thread-formatter';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'twitter' | 'twitter-thread' | 'linkedin' | 'reddit' | 'general';
  metadata?: {
    platform?: string;
    hashtags?: string[];
    engagement?: number;
    optimizations?: string[];
    thread?: FormattedThread;
    copyText?: string;
    provider?: string;
  };
}

const quickPrompts = [
  {
    text: "Create a viral Twitter thread about my SaaS launch",
    type: "twitter-thread" as const,
    icon: Twitter,
    color: "bg-blue-500"
  },
  {
    text: "Generate engaging Twitter posts for my product",
    type: "twitter" as const,
    icon: Zap,
    color: "bg-sky-500"
  },
  {
    text: "Write a professional LinkedIn post about my recent milestone",
    type: "linkedin" as const,
    icon: Linkedin,
    color: "bg-blue-600"
  },
  {
    text: "Generate a Reddit post for r/entrepreneur about my journey",
    type: "reddit" as const,
    icon: MessageSquare,
    color: "bg-orange-500"
  }
];

export default function GeneratePage() {
  const { data: session } = useSession();
  const { canUse, getTokenCost } = useTokens();
  const { addNotification } = useDashboardStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI content assistant. I can help you create viral content for X/Twitter, LinkedIn, Reddit, and more. What would you like to create today?",
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateContent = async (prompt: string, type: string = 'general') => {
    setIsGenerating(true);
    
    try {
      // Determine the API request based on type
      let apiBody: any = {
        prompt: prompt.trim(),
        type: type === 'twitter-thread' ? 'twitter-thread' : 
              type === 'twitter' ? 'tweet' : 
              type === 'linkedin' ? 'linkedin-post' : 
              type === 'reddit' ? 'reddit-post' : 'tweet',
        tone: type === 'linkedin' ? 'professional' : 
              type === 'reddit' ? 'casual' : 
              type === 'twitter-thread' ? 'engaging' : 'engaging',
        audience: 'entrepreneurs',
      };

      // For specific social media requests, we might want multiple variations
      if (type !== 'general') {
        apiBody.count = type === 'twitter' ? 3 : 1; // Generate 3 tweet variations, 1 for threads
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.code === 'INSUFFICIENT_CREDITS') {
          toast.error('Insufficient credits! Please upgrade your plan.');
          return;
        }
        throw new Error(result.error || 'Failed to generate content');
      }

      // Handle multiple content results (like Twitter variations)
      const content = Array.isArray(result.content) ? result.content.join('\n\n---\n\n') : result.content;
      
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        type: type as any,
        metadata: {
          platform: type,
          hashtags: result.hashtags || [],
          engagement: result.engagementPrediction || 7,
          optimizations: result.optimizations || [],
          thread: result.thread,
          copyText: result.copyText,
          provider: result.provider
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      toast.success('Content generated successfully!');
      addNotification({
        type: 'success',
        title: 'Content Generated',
        message: `New ${type} content is ready to post`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content. Please try again.');
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error generating that content. Please try again or rephrase your request.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Determine content type from message
    const message = inputValue.toLowerCase();
    let contentType = 'general';
    if (message.includes('thread') || message.includes('multiple tweets') || message.includes('long form')) {
      contentType = 'twitter-thread';
    } else if (message.includes('twitter') || message.includes('tweet') || message.includes('x.com')) {
      contentType = 'twitter';
    } else if (message.includes('linkedin')) {
      contentType = 'linkedin';
    } else if (message.includes('reddit')) {
      contentType = 'reddit';
    }

    setInputValue('');
    await generateContent(userMessage.content, contentType);
  };

  const handleQuickPrompt = async (prompt: string, type: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    await generateContent(prompt, type);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };
  
  const convertToThread = (content: string, hashtags: string[] = []) => {
    const thread = formatAsTwitterThread(content, hashtags, {
      addNumbers: true,
      enhanceHook: true,
      addCTA: true
    });
    
    const threadMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Here\'s your content formatted as a Twitter thread:',
      timestamp: new Date(),
      type: 'twitter-thread',
      metadata: {
        platform: 'twitter-thread',
        hashtags: hashtags,
        engagement: thread.estimatedEngagement,
        thread,
        copyText: thread.copyText
      }
    };
    
    setMessages(prev => [...prev, threadMessage]);
    toast.success('Converted to Twitter thread!');
  };

  const getPostingLink = (content: string, platform: string) => {
    const encodedContent = encodeURIComponent(content);
    
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedContent}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodedContent}`;
      case 'reddit':
        return `https://www.reddit.com/submit?title=${encodedContent}&text=${encodedContent}`;
      default:
        return '#';
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Chat cleared! What would you like to create today?",
        timestamp: new Date(),
      }
    ]);
    toast.success('Chat cleared!');
  };

  return (
    <div className="h-[calc(100vh-120px)] max-w-4xl mx-auto p-6 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div 
          className="inline-flex items-center space-x-3 glassmorphism-elevated rounded-full px-6 py-3 mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-4 w-4 text-white" />
          </motion.div>
          <span className="text-sm font-semibold text-gradient-premium">AI Content Chat</span>
        </motion.div>
        <h1 className="text-4xl font-bold font-sora mb-4">
          Generate <span className="text-gradient-premium">Viral Content</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Chat with AI to create engaging content for any platform
        </p>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 card-premium overflow-hidden flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {/* Avatar and name */}
                  <div className={`flex items-center mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-center space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Message content */}
                  <div className={`glassmorphism-dark rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30' 
                      : 'border-blue-500/30'
                  }`}>
                    {(message.type as string) === 'twitter-thread' && message.metadata?.thread ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Twitter className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-300">Smart Twitter Thread</span>
                          {message.metadata.provider && (
                            <Badge variant="outline" className="text-xs border-purple-300/30 text-purple-300">
                              AI: {message.metadata.provider}
                            </Badge>
                          )}
                        </div>
                        <TwitterThreadDisplay 
                          thread={message.metadata.thread}
                          showValidation={false}
                          showStats={true}
                          className="max-w-none"
                        />
                      </div>
                    ) : (
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    )}

                    {/* Message metadata and actions for assistant messages */}
                    {message.role === 'assistant' && message.type && message.type !== 'general' && (message.type as string) !== 'twitter-thread' && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        {/* Platform badge and metadata */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`${
                              message.type === 'twitter' ? 'border-blue-400 text-blue-400' :
                              message.type === 'linkedin' ? 'border-blue-600 text-blue-600' :
                              'border-orange-400 text-orange-400'
                            }`}>
                              {message.type === 'twitter' && <Twitter className="h-3 w-3 mr-1" />}
                              {message.type === 'linkedin' && <Linkedin className="h-3 w-3 mr-1" />}
                              {message.type === 'reddit' && <MessageSquare className="h-3 w-3 mr-1" />}
                              {message.type.toUpperCase()}
                            </Badge>
                            
                            {message.metadata?.engagement && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <TrendingUp className="h-3 w-3" />
                                <span>{message.metadata.engagement}/10</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Hashtags */}
                        {message.metadata?.hashtags && message.metadata.hashtags.length > 0 && (
                          <div className="flex items-center space-x-1 mb-3">
                            <Hash className="h-3 w-3 text-muted-foreground" />
                            <div className="flex flex-wrap gap-1">
                              {message.metadata.hashtags.slice(0, 5).map((tag, index) => (
                                <span key={index} className="text-xs text-blue-400">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center space-x-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(message.metadata?.copyText || message.content)}
                            className="glassmorphism-dark text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          
                          {(message.type as string) === 'twitter-thread' ? (
                            <Button
                              size="sm"
                              onClick={() => copyToClipboard(message.metadata?.thread?.tweets?.[0]?.content || message.content)}
                              className="glassmorphism-dark text-xs bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                            >
                              <Twitter className="h-3 w-3 mr-1" />
                              Copy First Tweet
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                onClick={() => window.open(getPostingLink(message.content, message.type || 'twitter'), '_blank')}
                                className={`text-xs ${
                                  message.type === 'twitter' ? 'bg-blue-500 hover:bg-blue-600' :
                                  message.type === 'linkedin' ? 'bg-blue-600 hover:bg-blue-700' :
                                  'bg-orange-500 hover:bg-orange-600'
                                } text-white`}
                              >
                                {message.type === 'twitter' && <Twitter className="h-3 w-3 mr-1" />}
                                {message.type === 'linkedin' && <Linkedin className="h-3 w-3 mr-1" />}
                                {message.type === 'reddit' && <MessageSquare className="h-3 w-3 mr-1" />}
                                Post Now
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                              
                              {message.content.length > 280 && (
                                <Button
                                  size="sm"
                                  onClick={() => convertToThread(message.content, message.metadata?.hashtags)}
                                  className="glassmorphism-dark text-xs bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30"
                                >
                                  <Zap className="h-3 w-3 mr-1" />
                                  Make Thread
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[70%]">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-2">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">AI Assistant</span>
                  <span className="text-xs text-muted-foreground ml-2">typing...</span>
                </div>
                <div className="glassmorphism-dark rounded-2xl p-4 border-blue-500/30">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <div className="text-sm font-medium mb-3 text-muted-foreground">Quick Start:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {quickPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleQuickPrompt(prompt.text, prompt.type)}
                  className="glassmorphism-dark rounded-lg p-3 text-left hover:bg-white/5 transition-all group"
                  disabled={isGenerating}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-6 h-6 ${prompt.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <prompt.icon className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{prompt.type.toUpperCase()}</span>
                  </div>
                  <div className="text-sm">{prompt.text}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Ask me to create content for any platform..."
                className="glassmorphism-dark border-white/20 pr-12"
                disabled={isGenerating}
              />
              {inputValue && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setInputValue('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isGenerating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
            
            {messages.length > 1 && (
              <Button
                variant="outline"
                onClick={clearChat}
                className="glassmorphism-dark"
                disabled={isGenerating}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Try: "Create a Twitter thread about my AI startup" or "Write a LinkedIn post about our new feature"
          </div>
        </div>
      </div>
    </div>
  );
}
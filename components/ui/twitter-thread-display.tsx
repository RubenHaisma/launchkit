'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Copy, 
  CheckCircle, 
  Twitter, 
  TrendingUp, 
  MessageCircle,
  AlertTriangle,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { FormattedThread, validateThread } from '@/lib/twitter-thread-formatter';

interface TwitterThreadDisplayProps {
  thread: FormattedThread;
  showValidation?: boolean;
  showStats?: boolean;
  className?: string;
}

export default function TwitterThreadDisplay({
  thread,
  showValidation = true,
  showStats = true,
  className = ''
}: TwitterThreadDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);

  const validation = validateThread(thread);

  const copyTweet = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const copyFullThread = async () => {
    try {
      await navigator.clipboard.writeText(thread.copyText);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    } catch (error) {
      console.error('Failed to copy thread:', error);
    }
  };

  const createTwitterUrl = () => {
    const firstTweet = thread.tweets[0]?.content || '';
    const encodedText = encodeURIComponent(firstTweet);
    return `https://twitter.com/intent/tweet?text=${encodedText}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Thread Stats */}
      {showStats && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Thread Overview</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyFullThread}
                  className="flex items-center gap-2"
                >
                  {copiedFull ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  Copy Thread
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a 
                    href={createTwitterUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Twitter className="h-3 w-3" />
                    Post
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{thread.totalTweets}</div>
                <div className="text-xs text-muted-foreground">Tweets</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{thread.totalChars}</div>
                <div className="text-xs text-muted-foreground">Characters</div>
              </div>
              <div>
                <div className="text-lg font-semibold flex items-center justify-center gap-1">
                  {thread.estimatedEngagement}
                  <TrendingUp className="h-3 w-3" />
                </div>
                <div className="text-xs text-muted-foreground">Engagement</div>
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {Math.ceil(thread.totalChars / 5)}
                </div>
                <div className="text-xs text-muted-foreground">Read Time (s)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Alerts */}
      {showValidation && !validation.isValid && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">Issues found:</div>
              {validation.warnings.map((warning, index) => (
                <div key={index} className="text-sm">• {warning}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Suggestions */}
      {showValidation && validation.suggestions.length > 0 && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">Suggestions:</div>
              {validation.suggestions.map((suggestion, index) => (
                <div key={index} className="text-sm">• {suggestion}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Thread Tweets */}
      <div className="space-y-3">
        {thread.tweets.map((tweet, index) => (
          <Card 
            key={tweet.id} 
            className={`relative ${tweet.isHook ? 'ring-2 ring-blue-200' : ''} ${tweet.isCTA ? 'ring-2 ring-green-200' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  {/* Tweet indicators */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Tweet {tweet.id}
                    </Badge>
                    {tweet.isHook && (
                      <Badge variant="secondary" className="text-xs">
                        Hook
                      </Badge>
                    )}
                    {tweet.isCTA && (
                      <Badge variant="secondary" className="text-xs">
                        CTA
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {tweet.charCount}/280
                    </div>
                  </div>

                  {/* Tweet content */}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {tweet.content}
                  </div>

                  {/* Hashtags */}
                  {tweet.hashtags && tweet.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tweet.hashtags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Copy button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyTweet(tweet.content, index)}
                  className="shrink-0"
                >
                  {copiedIndex === index ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Character count warning */}
              {tweet.charCount > 260 && (
                <div className="mt-2 text-xs text-orange-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Close to character limit
                </div>
              )}
            </CardContent>

            {/* Thread connector line */}
            {index < thread.tweets.length - 1 && (
              <div className="absolute left-1/2 -bottom-3 w-0.5 h-6 bg-border transform -translate-x-1/2" />
            )}
          </Card>
        ))}
      </div>

      {/* Copy instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-2">
              <div className="font-medium text-sm">How to post this thread:</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>1. Copy the first tweet and post it on Twitter</div>
                <div>2. Reply to your tweet with the second tweet</div>
                <div>3. Continue replying to build the thread</div>
                <div>4. Or use "Copy Thread" to get the full formatted text</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

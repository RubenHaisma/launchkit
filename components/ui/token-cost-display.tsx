'use client';

import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useTokens } from '@/hooks/use-tokens';
import { TokenUsageType } from '@/lib/token-manager';

interface TokenCostDisplayProps {
  type: TokenUsageType
  count?: number
  variant?: 'inline' | 'badge' | 'button'
  showInfo?: boolean
}

const TOKEN_DESCRIPTIONS: Record<TokenUsageType, string> = {
  'tweet': 'Single tweet generation',
  'twitter-thread': 'Multi-tweet thread with structure',
  'linkedin-post': 'Professional LinkedIn content',
  'reddit-post': 'Community-focused Reddit post',
  'instagram-caption': 'Visual-focused Instagram caption',
  'tiktok-script': 'Video script for TikTok',
  'email-subject': 'Compelling email subject line',
  'email-body': 'Full email content',
  'blog-title': 'SEO-optimized blog title',
  'blog-post': 'Long-form blog article',
  'product-hunt-launch': 'Product Hunt launch content',
  'cold-email': 'Personalized outreach email',
  'newsletter': 'Email newsletter content',
  'website-scraping': 'Website data extraction and analysis',
  'competitor-analysis': 'Competitive intelligence report',
  'daily-suggestions': 'AI-powered content suggestions',
  'email-sequence': 'Multi-email sequence creation',
  'community-response': 'Community engagement content',
  'viral-content': 'Viral content strategy and ideas',
  'personal-brand': 'Personal branding content',
  'outreach-message': 'Outreach and networking messages',
  'visual-content': 'Visual content captions and descriptions',
  'analytics-insight': 'Performance analytics and insights',
  'calendar-integration': 'Calendar management and scheduling',
  'bulk-tweet-generation': 'Multiple tweet variations',
  'bulk-email-campaign': 'Mass email campaign creation',
  'mass-outreach': 'Large-scale outreach campaigns',
}

export function TokenCostDisplay({ 
  type, 
  count = 1, 
  variant = 'inline', 
  showInfo = true 
}: TokenCostDisplayProps) {
  const { getTokenCost, canUse, isUnlimited } = useTokens();
  
  const cost = getTokenCost(type, count);
  const affordable = canUse(type, count);
  const description = TOKEN_DESCRIPTIONS[type] || 'AI-powered feature';

  if (variant === 'badge') {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant={affordable ? 'secondary' : 'destructive'} 
          className={`text-xs ${isUnlimited ? 'bg-purple-500/20 text-purple-400' : ''}`}
        >
          {isUnlimited ? 'Free' : `${cost} token${cost > 1 ? 's' : ''}`}
        </Badge>
        {showInfo && (
          <Popover>
            <PopoverTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">{description}</p>
                <div className="text-xs text-muted-foreground">
                  <p>Cost: {cost} token{cost > 1 ? 's' : ''}</p>
                  {count > 1 && <p>Count: {count}x</p>}
                  <p>Total: {cost * count} token{cost * count > 1 ? 's' : ''}</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <span className={`text-xs ${affordable ? 'text-muted-foreground' : 'text-red-400'}`}>
        {isUnlimited ? '(Free)' : `(${cost} token${cost > 1 ? 's' : ''})`}
      </span>
    );
  }

  // Inline variant
  return (
    <span className={`text-xs ${affordable ? 'text-muted-foreground' : 'text-red-400'}`}>
      {isUnlimited ? '' : `${cost} token${cost > 1 ? 's' : ''}`}
    </span>
  );
}

export function TokenCostTable() {
  const { isUnlimited } = useTokens();

  if (isUnlimited) {
    return (
      <div className="text-center p-4 bg-purple-500/10 rounded-lg">
        <p className="text-purple-400 font-medium">All features are free with your Growth plan!</p>
      </div>
    );
  }

  const features = [
    { type: 'tweet' as TokenUsageType, name: 'Tweet Generation' },
    { type: 'linkedin-post' as TokenUsageType, name: 'LinkedIn Post' },
    { type: 'twitter-thread' as TokenUsageType, name: 'Twitter Thread' },
    { type: 'email-body' as TokenUsageType, name: 'Email Content' },
    { type: 'blog-post' as TokenUsageType, name: 'Blog Post' },
    { type: 'competitor-analysis' as TokenUsageType, name: 'Competitor Analysis' },
    { type: 'website-scraping' as TokenUsageType, name: 'Website Scraping' },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Token Costs</h4>
      <div className="grid gap-2 text-sm">
        {features.map(({ type, name }) => (
          <div key={type} className="flex justify-between items-center">
            <span className="text-muted-foreground">{name}</span>
            <TokenCostDisplay type={type} variant="badge" showInfo={false} />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Costs vary based on content complexity and AI processing required.
      </p>
    </div>
  );
}

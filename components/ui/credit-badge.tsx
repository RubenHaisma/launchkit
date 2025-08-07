'use client';

import { useSession } from 'next-auth/react';
import { Zap, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useTokens } from '@/hooks/use-tokens';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface CreditBadgeProps {
  variant?: 'default' | 'detailed' | 'minimal'
  showUpgrade?: boolean
}

export function CreditBadge({ variant = 'default', showUpgrade = true }: CreditBadgeProps) {
  const { data: session } = useSession();
  const { tokens, plan, isUnlimited, isLowTokens, metrics, loading } = useTokens();

  if (!session?.user) return null;

  const getPlanLimits = () => {
    switch (plan) {
      case 'free': return 50;
      case 'pro': return 500;
      case 'growth': return 999999;
      default: return 50;
    }
  }

  const planLimit = getPlanLimits();
  const usagePercentage = isUnlimited ? 0 : ((planLimit - tokens) / planLimit) * 100;

  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center space-x-1 text-xs ${
        isLowTokens ? 'text-red-400' :
        isUnlimited ? 'text-purple-400' :
        'text-blue-400'
      }`}>
        <Zap className="h-3 w-3" />
        <span>{isUnlimited ? '∞' : tokens}</span>
      </div>
    );
  }

  const BadgeContent = () => (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm cursor-pointer transition-all hover:scale-105 ${
      isLowTokens ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
      isUnlimited ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    }`}>
      <Zap className="h-3 w-3" />
      <span>
        {isUnlimited ? 'Unlimited' : `${tokens} tokens`}
      </span>
      {isLowTokens && <AlertCircle className="h-3 w-3" />}
    </div>
  );

  if (variant === 'default') {
    return <BadgeContent />;
  }

  // Detailed variant with popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <BadgeContent />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Token Usage
              </h3>
              <p className="text-sm text-muted-foreground">
                {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {isUnlimited ? '∞' : tokens.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {isUnlimited ? 'Unlimited' : 'tokens remaining'}
              </p>
            </div>
          </div>

          {/* Usage Progress */}
          {!isUnlimited && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used this month</span>
                <span>{planLimit - tokens} / {planLimit}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>
          )}

          {/* Usage Stats */}
          {metrics && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Total Generated</p>
                <p className="font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {metrics.totalTokensUsed.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Reset Date</p>
                <p className="font-semibold flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {metrics.resetDate ? 
                    new Date(metrics.resetDate).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Top Usage Types */}
          {metrics?.usageByType && Object.keys(metrics.usageByType).length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Most Used Features</p>
              <div className="space-y-1">
                {Object.entries(metrics.usageByType)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([type, count]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="capitalize">{type.replace('-', ' ')}</span>
                      <span className="text-muted-foreground">{count} tokens</span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Low tokens warning */}
          {isLowTokens && showUpgrade && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400 mb-2">
                You're running low on tokens!
              </p>
              <Link href="/pricing">
                <Button size="sm" variant="outline" className="w-full">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          )}

          {/* Upgrade CTA for free users */}
          {plan === 'free' && showUpgrade && !isLowTokens && (
            <div className="p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-sm mb-2">Get more tokens and features</p>
              <Link href="/pricing">
                <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
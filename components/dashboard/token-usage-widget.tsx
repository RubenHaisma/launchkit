'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTokens } from '@/hooks/use-tokens';
import Link from 'next/link';

interface TokenUsageWidgetProps {
  variant?: 'compact' | 'detailed'
  showUpgrade?: boolean
}

export function TokenUsageWidget({ variant = 'detailed', showUpgrade = true }: TokenUsageWidgetProps) {
  const { 
    tokens, 
    plan, 
    isUnlimited, 
    isLowTokens, 
    metrics, 
    refreshTokens, 
    loading 
  } = useTokens();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTokens();
    setIsRefreshing(false);
  };

  const getPlanLimits = () => {
    switch (plan) {
      case 'free': return 50;
      case 'pro': return 500;
      case 'growth': return 999999;
      default: return 50;
    }
  };

  const planLimit = getPlanLimits();
  const usagePercentage = isUnlimited ? 0 : ((planLimit - tokens) / planLimit) * 100;

  // Get usage trends (mock data for now - you can enhance this)
  const getUsageTrend = () => {
    if (!metrics?.usageByDate) return { trend: 'stable', percentage: 0 };
    
    const dates = Object.keys(metrics.usageByDate).sort();
    if (dates.length < 2) return { trend: 'stable', percentage: 0 };
    
    const recent = metrics.usageByDate[dates[dates.length - 1]] || 0;
    const previous = metrics.usageByDate[dates[dates.length - 2]] || 0;
    
    if (recent > previous) {
      const increase = ((recent - previous) / (previous || 1)) * 100;
      return { trend: 'up', percentage: increase };
    } else if (recent < previous) {
      const decrease = ((previous - recent) / previous) * 100;
      return { trend: 'down', percentage: decrease };
    }
    
    return { trend: 'stable', percentage: 0 };
  };

  const usageTrend = getUsageTrend();

  if (variant === 'compact') {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isLowTokens ? 'bg-red-500/20' : 
              isUnlimited ? 'bg-purple-500/20' : 
              'bg-blue-500/20'
            }`}>
              <Zap className={`h-4 w-4 ${
                isLowTokens ? 'text-red-400' : 
                isUnlimited ? 'text-purple-400' : 
                'text-blue-400'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium">Tokens</p>
              <p className="text-lg font-bold">
                {isUnlimited ? '∞' : tokens.toLocaleString()}
              </p>
            </div>
          </div>
          
          {!isUnlimited && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">
                {Math.round(usagePercentage)}% used
              </p>
              <Progress value={usagePercentage} className="w-20 h-2" />
            </div>
          )}
        </div>
        
        {isLowTokens && showUpgrade && (
          <div className="mt-3 pt-3 border-t">
            <Link href="/pricing">
              <Button size="sm" variant="outline" className="w-full">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Token Usage
          </h3>
          <p className="text-sm text-muted-foreground">
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isUnlimited ? 'default' : isLowTokens ? 'destructive' : 'secondary'}>
            {isUnlimited ? 'Unlimited' : `${tokens} left`}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main Usage Display */}
      <div className="space-y-6">
        {!isUnlimited && (
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">{tokens.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">tokens remaining</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{planLimit - tokens} used</p>
                <p className="text-xs text-muted-foreground">of {planLimit}</p>
              </div>
            </div>
            <Progress value={usagePercentage} className="h-3" />
          </div>
        )}

        {/* Usage Stats Grid */}
        {metrics && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Total Generated</p>
              </div>
              <p className="text-xl font-bold">{metrics.totalTokensUsed.toLocaleString()}</p>
              
              {/* Usage Trend */}
              <div className="flex items-center gap-1 text-xs">
                {usageTrend.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3 text-green-500" />
                ) : usageTrend.trend === 'down' ? (
                  <ArrowDown className="h-3 w-3 text-red-500" />
                ) : null}
                <span className={
                  usageTrend.trend === 'up' ? 'text-green-500' :
                  usageTrend.trend === 'down' ? 'text-red-500' :
                  'text-muted-foreground'
                }>
                  {usageTrend.trend === 'stable' ? 'Stable usage' :
                   `${usageTrend.percentage.toFixed(0)}% ${usageTrend.trend}`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Reset Date</p>
              </div>
              <p className="text-xl font-bold">
                {metrics.resetDate ? 
                  new Date(metrics.resetDate).getDate() : 
                  '1st'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {metrics.resetDate ? 
                  new Date(metrics.resetDate).toLocaleDateString(undefined, { month: 'short' }) :
                  'Monthly'
                }
              </p>
            </div>
          </div>
        )}

        {/* Most Used Features */}
        {metrics?.usageByType && Object.keys(metrics.usageByType).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Most Used Features
            </h4>
            <div className="space-y-2">
              {Object.entries(metrics.usageByType)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([type, count]) => {
                  const percentage = (count / metrics.totalTokensUsed) * 100;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{type.replace('-', ' ')}</span>
                        <span className="text-muted-foreground">{count} tokens</span>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t">
          {isLowTokens && showUpgrade && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-sm text-red-400 mb-2">Running low on tokens!</p>
              <Link href="/pricing">
                <Button size="sm" variant="outline" className="w-full">
                  Upgrade Plan
                </Button>
              </Link>
            </motion.div>
          )}
          
          {plan === 'free' && !isLowTokens && showUpgrade && (
            <div className="p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-sm mb-2">Get 10x more tokens</p>
              <Link href="/pricing">
                <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          )}
          
          <Link href="/dashboard/analytics">
            <Button variant="ghost" size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

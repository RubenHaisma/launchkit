'use client';

import { useState, useEffect } from 'react';
import { useTokens } from '@/hooks/use-tokens';

export function UsageStatsWidget() {
  const { tokens, plan, isUnlimited } = useTokens();
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch('/api/metrics');
        if (response.ok) {
          const data = await response.json();
          setUserStats(data.summary);
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    fetchUserStats();
  }, []);

  const getPlanLimits = () => {
    switch (plan) {
      case 'free': return 50;
      case 'pro': return 500;
      case 'growth': return 999999;
      default: return 50;
    }
  };

  const planLimit = getPlanLimits();
  const used = planLimit - tokens;
  const usagePercentage = isUnlimited ? 0 : (used / planLimit) * 100;

  return (
    <>
      <div className="text-sm font-semibold mb-2">Usage This Month</div>
      <div className="text-xs text-muted-foreground mb-3">
        {isUnlimited ? (
          'Unlimited generations'
        ) : (
          `${used} / ${planLimit} generations`
        )}
      </div>
      {!isUnlimited && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, usagePercentage)}%` }} 
          />
        </div>
      )}
      {userStats && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Total: {userStats.totalGenerations} generations</div>
            <div>Tokens: {userStats.totalTokensUsed?.toLocaleString() || 0}</div>
          </div>
        </div>
      )}
    </>
  );
}

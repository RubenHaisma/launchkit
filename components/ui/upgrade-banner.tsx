'use client';

import { useSession } from 'next-auth/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function UpgradeBanner() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const credits = session.user.credits || 0;
  const plan = session.user.plan || 'free';
  
  // Show banner if user has low credits or is on free plan
  const shouldShow = (credits < 10 && plan !== 'growth') || plan === 'free';

  if (!shouldShow) return null;

  return (
    <div className="glassmorphism rounded-xl p-4 border-2 border-purple-500/50 neon-glow mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">
              {credits < 10 ? 'Running low on credits!' : 'Unlock unlimited potential'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {credits < 10 
                ? `Only ${credits} credits remaining. Upgrade for unlimited generations.`
                : 'Upgrade to Pro for 500 credits/month or Growth for unlimited access.'
              }
            </p>
          </div>
        </div>
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            Upgrade Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
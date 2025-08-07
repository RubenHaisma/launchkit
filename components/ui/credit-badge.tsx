'use client';

import { useSession } from 'next-auth/react';
import { Zap } from 'lucide-react';

export function CreditBadge() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const credits = session.user.credits || 0;
  const plan = session.user.plan || 'free';
  
  const isLowCredits = credits < 10 && plan !== 'growth';
  const isUnlimited = plan === 'growth';

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
      isLowCredits ? 'bg-red-500/20 text-red-400' :
      isUnlimited ? 'bg-purple-500/20 text-purple-400' :
      'bg-blue-500/20 text-blue-400'
    }`}>
      <Zap className="h-3 w-3" />
      <span>
        {isUnlimited ? 'Unlimited' : `${credits} credits`}
      </span>
    </div>
  );
}
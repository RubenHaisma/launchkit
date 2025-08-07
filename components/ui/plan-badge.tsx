'use client';

import { useSession } from 'next-auth/react';
import { Crown, Zap, Rocket } from 'lucide-react';

const planConfig = {
  free: { icon: Rocket, color: 'bg-gray-500/20 text-gray-400', label: 'Free' },
  pro: { icon: Zap, color: 'bg-purple-500/20 text-purple-400', label: 'Pro' },
  growth: { icon: Crown, color: 'bg-yellow-500/20 text-yellow-400', label: 'Growth' },
};

export function PlanBadge() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const plan = session.user.plan || 'free';
  const config = planConfig[plan as keyof typeof planConfig] || planConfig.free;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${config.color}`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </div>
  );
}
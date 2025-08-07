import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
})

export const PLANS = {
  free: {
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    credits: 50,
    features: [
      '50 tokens/month',
      '~50 tweets or 10 blog posts',
      'Basic templates',
      'Community support',
      'Export to text',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'For serious indie makers',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    credits: 500,
    features: [
      '500 tokens/month',
      '~500 tweets or 100 blog posts',
      'All templates & tools',
      'Website scraping',
      'Priority support',
      'Advanced analytics',
      'Social media integration',
      'Product Hunt launcher',
    ],
  },
  growth: {
    name: 'Growth',
    description: 'Scale your marketing operations',
    price: 79,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID!,
    credits: -1, // unlimited
    features: [
      'Unlimited tokens',
      'All premium features',
      'White-label reports',
      'Custom integrations',
      'Dedicated account manager',
      'Custom workflows',
      'API access',
      'Team collaboration',
    ],
  },
} as const

export type PlanType = keyof typeof PLANS
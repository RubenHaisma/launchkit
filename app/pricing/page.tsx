'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';
import Link from 'next/link';
import { useState } from 'react';

const plans = [
  {
    icon: Rocket,
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 project',
      '20 AI generations/month',
      'Basic templates',
      'Community support',
      'Export to text',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    icon: Zap,
    name: 'Pro',
    price: '$29',
    period: 'month',
    description: 'For serious indie makers',
    features: [
      '5 projects',
      '500 AI generations/month',
      'All templates & tools',
      'Priority support',
      'Advanced analytics',
      'Social media integration',
      'Product Hunt launcher',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    icon: Crown,
    name: 'Growth',
    price: '$79',
    period: 'month',
    description: 'Scale your marketing operations',
    features: [
      'Unlimited projects',
      'Unlimited AI generations',
      'White-label reports',
      'Custom integrations',
      'Dedicated account manager',
      'Custom workflows',
      'API access',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Simple, <span className="text-gradient">Transparent</span> Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your marketing needs. All plans include a 7-day free trial.
            </p>
            
            {/* Annual Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isAnnual ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    isAnnual ? 'translate-x-6' : ''
                  }`}
                />
              </button>
              <span className={`text-sm ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`glassmorphism rounded-2xl p-8 hover-lift relative ${
                  plan.popular ? 'border-2 border-purple-500/50 neon-glow' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${
                    plan.name === 'Free' ? 'from-gray-500 to-gray-600' :
                    plan.name === 'Pro' ? 'from-purple-500 to-pink-500' :
                    'from-yellow-500 to-orange-500'
                  } flex items-center justify-center`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold font-sora mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      {plan.name === 'Free' ? plan.price : 
                       isAnnual ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}` : plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{isAnnual && plan.name !== 'Free' ? 'month billed annually' : plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth/signup">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white neon-glow' 
                        : 'glassmorphism-dark hover:bg-white/10'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="glassmorphism rounded-xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold font-sora mb-4">Need a Custom Plan?</h3>
              <p className="text-muted-foreground mb-6">
                Enterprise solutions with custom integrations, dedicated support, and unlimited everything.
              </p>
              <Button size="lg" variant="outline" className="glassmorphism hover-lift">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
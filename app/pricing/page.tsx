'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, annual: 0 },
      credits: 50,
      icon: Zap,
      color: 'from-gray-500 to-gray-600',
      features: [
        'AI content generation',
        '50 generations/month',
        'Basic templates',
        'Email support',
        'Community access'
      ],
      limitations: [
        'Limited templates',
        'Standard support only'
      ]
    },
    {
      name: 'Pro',
      description: 'Best for solo entrepreneurs',
      price: { monthly: 20, annual: 16 },
      credits: 500,
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        'Everything in Free',
        '500 generations/month',
        'All content types',
        'Advanced templates',
        'Priority support',
        'Analytics dashboard',
        'Custom branding',
        'Twitter automation',
        'Email sequences'
      ]
    },
    {
      name: 'Growth',
      description: 'For growing businesses',
      price: { monthly: 79, annual: 63 },
      credits: 999999, // Unlimited
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Everything in Pro',
        'Unlimited generations',
        'Multi-platform automation',
        'Team collaboration',
        'Advanced analytics',
        'Custom integrations',
        'White-label options',
        'Dedicated support',
        'Custom AI training'
      ]
    }
  ];

  const faqs = [
    {
      question: 'What counts as a generation?',
      answer: 'Each piece of content created by AI uses tokens based on complexity: Tweets (1 token), LinkedIn posts (2 tokens), Blog posts (5 tokens), Website scraping (10 tokens), etc.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 7-day money-back guarantee for all paid plans. No questions asked.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! The Free plan gives you 50 generations to try LaunchPilot with no credit card required.'
    }
  ];

  return (
    <main className="min-h-screen bg-background">
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
            <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Simple Pricing</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Choose Your <span className="text-gradient">Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-purple-500"
              />
              <span className={`text-sm ${isAnnual ? 'text-white' : 'text-muted-foreground'}`}>
                Annual
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Save 20%
              </Badge>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className={`glassmorphism p-8 relative ${plan.popular ? 'ring-2 ring-purple-500/50' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.color}`}>
                      <plan.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-sora">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold font-sora">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {isAnnual && plan.price.monthly > 0 && (
                      <div className="text-sm text-green-400">
                        Save ${(plan.price.monthly - plan.price.annual) * 12}/year
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                        : 'glassmorphism border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Get Started' : 'Start Free Trial'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold font-sora text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glassmorphism rounded-xl p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
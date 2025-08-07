'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles, Target, Rocket, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BusinessSetup } from '@/components/business-setup';
import toast from 'react-hot-toast';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

const steps = [
  {
    id: 1,
    title: 'Welcome to LaunchPilot! 🚀',
    subtitle: 'Your AI marketing co-founder is ready to help you scale',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'Business Setup',
    subtitle: 'Tell us about your business for personalized AI content',
    icon: Globe,
  },
];

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showBusinessSetup, setShowBusinessSetup] = useState(false);

  const handleNext = () => {
    if (currentStep === 1) {
      setShowBusinessSetup(true);
    } else {
      onComplete({});
      onClose();
    }
  };

  const handleBack = () => {
    if (showBusinessSetup) {
      setShowBusinessSetup(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBusinessSetupComplete = async (businessData: any) => {
    try {
      // Save business profile to database
      const response = await fetch('/api/business-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });

      if (!response.ok) {
        throw new Error('Failed to save business profile');
      }

      toast.success('Business profile saved! Your AI content will now be personalized.');
      onComplete(businessData);
      onClose();
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast.error('Failed to save business profile. You can set it up later in settings.');
      onComplete({});
      onClose();
    }
  };

  const handleSkipBusinessSetup = () => {
    toast.success('Welcome to LaunchPilot! You can set up your business profile later in settings.');
    onComplete({});
    onClose();
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative glassmorphism rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-white/20"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</span>
                <span className="text-sm text-muted-foreground">{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {showBusinessSetup ? (
                <motion.div
                  key="business-setup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BusinessSetup 
                    onComplete={handleBusinessSetupComplete}
                    onSkip={handleSkipBusinessSetup}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      {currentStepData && <currentStepData.icon className="h-8 w-8 text-white" />}
                    </div>
                    <h2 className="text-2xl font-bold font-sora mb-2">{currentStepData?.title}</h2>
                    <p className="text-muted-foreground">{currentStepData?.subtitle}</p>
                  </div>

                  {/* Step Content */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-6">
                          LaunchPilot will help you create viral content, launch on Product Hunt, 
                          and scale your SaaS with AI-powered marketing strategies.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                          <div className="glassmorphism-dark rounded-lg p-3">
                            <div className="font-semibold mb-1">🎯 Personalized AI</div>
                            <div className="text-muted-foreground">Content tailored to your business</div>
                          </div>
                          <div className="glassmorphism-dark rounded-lg p-3">
                            <div className="font-semibold mb-1">🌐 Website Analysis</div>
                            <div className="text-muted-foreground">Auto-analyze your business context</div>
                          </div>
                          <div className="glassmorphism-dark rounded-lg p-3">
                            <div className="font-semibold mb-1">🚀 Launch Ready</div>
                            <div className="text-muted-foreground">Product Hunt campaigns</div>
                          </div>
                          <div className="glassmorphism-dark rounded-lg p-3">
                            <div className="font-semibold mb-1">📊 Smart Analytics</div>
                            <div className="text-muted-foreground">Track what matters</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Next, we'll set up your business profile so our AI can create 
                          perfectly tailored content for your specific industry and audience.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {!showBusinessSetup && (
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="glassmorphism-dark"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  {currentStep === 1 ? 'Set Up Business Profile' : 'Get Started'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
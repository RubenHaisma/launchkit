'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles, Target, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    title: 'Tell us about your SaaS',
    subtitle: 'Help us personalize your experience',
    icon: Target,
  },
  {
    id: 3,
    title: 'Ready to launch!',
    subtitle: 'Your AI co-founder is configured and ready',
    icon: Rocket,
  },
];

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    targetAudience: '',
    industry: '',
    goals: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                      <p className="text-muted-foreground mb-4">
                        LaunchPilot will help you create viral content, launch on Product Hunt, 
                        and scale your SaaS with AI-powered marketing strategies.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="glassmorphism-dark rounded-lg p-3">
                          <div className="font-semibold mb-1">🎯 Smart Content</div>
                          <div className="text-muted-foreground">AI-generated copy that converts</div>
                        </div>
                        <div className="glassmorphism-dark rounded-lg p-3">
                          <div className="font-semibold mb-1">🚀 Launch Ready</div>
                          <div className="text-muted-foreground">Product Hunt campaigns</div>
                        </div>
                        <div className="glassmorphism-dark rounded-lg p-3">
                          <div className="font-semibold mb-1">📧 Email Power</div>
                          <div className="text-muted-foreground">Cold outreach that works</div>
                        </div>
                        <div className="glassmorphism-dark rounded-lg p-3">
                          <div className="font-semibold mb-1">📊 Analytics</div>
                          <div className="text-muted-foreground">Track what matters</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                          id="productName"
                          placeholder="e.g., TaskFlow AI"
                          value={formData.productName}
                          onChange={(e) => updateFormData('productName', e.target.value)}
                          className="glassmorphism-dark border-white/20"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="productDescription">What does your SaaS do?</Label>
                        <Input
                          id="productDescription"
                          placeholder="e.g., AI-powered task management for teams"
                          value={formData.productDescription}
                          onChange={(e) => updateFormData('productDescription', e.target.value)}
                          className="glassmorphism-dark border-white/20"
                        />
                      </div>

                      <div>
                        <Label>Target Audience</Label>
                        <Select value={formData.targetAudience} onValueChange={(value) => updateFormData('targetAudience', value)}>
                          <SelectTrigger className="glassmorphism-dark border-white/20">
                            <SelectValue placeholder="Select your audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="developers">Developers</SelectItem>
                            <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                            <SelectItem value="marketers">Marketers</SelectItem>
                            <SelectItem value="designers">Designers</SelectItem>
                            <SelectItem value="saas-founders">SaaS Founders</SelectItem>
                            <SelectItem value="general">General Public</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Industry</Label>
                        <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                          <SelectTrigger className="glassmorphism-dark border-white/20">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="productivity">Productivity</SelectItem>
                            <SelectItem value="ai-ml">AI/ML</SelectItem>
                            <SelectItem value="fintech">Fintech</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6 text-center">
                    <div className="glassmorphism-dark rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Your AI Co-founder is Ready! 🎉</h3>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Product Analysis</span>
                          <span className="text-green-400">✓ Complete</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Audience Targeting</span>
                          <span className="text-green-400">✓ Complete</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Content Strategy</span>
                          <span className="text-green-400">✓ Complete</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Launch Plan</span>
                          <span className="text-green-400">✓ Ready</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      You're all set! Your personalized marketing strategy is ready. 
                      Let's start creating some viral content!
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
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
                {currentStep === steps.length ? 'Get Started' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
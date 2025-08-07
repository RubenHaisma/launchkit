'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Globe, 
  Target, 
  Users, 
  DollarSign,
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface BusinessSetupProps {
  onComplete: (data: BusinessFormData) => void;
  onSkip?: () => void;
}

interface BusinessFormData {
  businessName: string;
  website: string;
  industry: string;
  description: string;
  targetAudience: string;
  businessModel: string;
  monthlyRevenue: string;
  teamSize: string;
  founded: string;
  location: string;
  uniqueValueProp: string;
  mainChallenges: string[];
  goals: string[];
}

const steps = [
  {
    id: 1,
    title: 'Business Basics',
    subtitle: 'Tell us about your business',
    icon: Building,
  },
  {
    id: 2,
    title: 'Website & Audience',
    subtitle: 'Help us understand your market',
    icon: Globe,
  },
  {
    id: 3,
    title: 'Business Model',
    subtitle: 'Share your business details',
    icon: DollarSign,
  },
  {
    id: 4,
    title: 'Goals & Challenges',
    subtitle: 'What are you trying to achieve?',
    icon: Target,
  },
];

const industries = [
  'SaaS/Software',
  'E-commerce',
  'Fintech',
  'Healthcare',
  'Education',
  'Real Estate',
  'Marketing',
  'Consulting',
  'AI/ML',
  'Productivity',
  'Other'
];

const businessModels = [
  'SaaS/Subscription',
  'Marketplace',
  'E-commerce',
  'Freemium',
  'One-time Purchase',
  'Service-based',
  'Advertising',
  'Other'
];

const revenueRanges = [
  'Pre-revenue',
  '$0 - $1K',
  '$1K - $10K',
  '$10K - $50K',
  '$50K - $100K',
  '$100K - $500K',
  '$500K - $1M',
  '$1M+'
];

const teamSizes = [
  'Just me',
  '2-5 people',
  '6-10 people',
  '11-25 people',
  '26-50 people',
  '50+ people'
];

const commonChallenges = [
  'Getting more customers',
  'Increasing revenue',
  'Building brand awareness',
  'Content creation',
  'Social media presence',
  'Product-market fit',
  'Competition',
  'Fundraising'
];

const commonGoals = [
  'Increase website traffic',
  'Generate more leads',
  'Improve conversion rates',
  'Build email list',
  'Launch on Product Hunt',
  'Scale to $10K MRR',
  'Scale to $100K MRR',
  'Get featured in media'
];

export function BusinessSetup({ onComplete, onSkip }: BusinessSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isScrapingWebsite, setIsScrapingWebsite] = useState(false);
  const [websiteScraped, setWebsiteScraped] = useState(false);
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    website: '',
    industry: '',
    description: '',
    targetAudience: '',
    businessModel: '',
    monthlyRevenue: '',
    teamSize: '',
    founded: '',
    location: '',
    uniqueValueProp: '',
    mainChallenges: [],
    goals: [],
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: keyof BusinessFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: 'mainChallenges' | 'goals', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const scrapeWebsite = async () => {
    if (!formData.website) {
      toast.error('Please enter a website URL first');
      return;
    }

    setIsScrapingWebsite(true);
    try {
      const response = await fetch('/api/scrape-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website: formData.website }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to scrape website');
      }

      // Auto-fill form data from scraped content
      const { data } = result;
      setFormData(prev => ({
        ...prev,
        businessName: data.title || prev.businessName,
        description: data.description || prev.description,
      }));

      setWebsiteScraped(true);
      toast.success('Website analyzed successfully! We auto-filled some information for you.');
    } catch (error) {
      console.error('Error scraping website:', error);
      toast.error('Failed to analyze website. You can continue manually.');
    } finally {
      setIsScrapingWebsite(false);
    }
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.industry;
      case 2:
        return formData.website && formData.targetAudience;
      case 3:
        return formData.businessModel && formData.teamSize;
      case 4:
        return formData.mainChallenges.length > 0 && formData.goals.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
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

      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          {currentStepData && <currentStepData.icon className="h-8 w-8 text-white" />}
        </div>
        <h2 className="text-2xl font-bold font-sora mb-2">{currentStepData?.title}</h2>
        <p className="text-muted-foreground">{currentStepData?.subtitle}</p>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 mb-8"
        >
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="e.g., Acme SaaS Inc."
                  value={formData.businessName}
                  onChange={(e) => updateFormData('businessName', e.target.value)}
                  className="glassmorphism-dark border-white/20"
                />
              </div>
              
              <div>
                <Label>Industry *</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => updateFormData('industry', value)}
                >
                  <SelectTrigger className="glassmorphism-dark border-white/20">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your business does in a few sentences..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  className="glassmorphism-dark border-white/20"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="website">Website URL *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="website"
                    placeholder="e.g., yourstartup.com"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    className="glassmorphism-dark border-white/20 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={scrapeWebsite}
                    disabled={isScrapingWebsite || !formData.website}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    {isScrapingWebsite ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : websiteScraped ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll analyze your website to understand your business better
                </p>
              </div>

              <div>
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Small business owners, developers, marketers"
                  value={formData.targetAudience}
                  onChange={(e) => updateFormData('targetAudience', e.target.value)}
                  className="glassmorphism-dark border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="uniqueValueProp">Unique Value Proposition</Label>
                <Textarea
                  id="uniqueValueProp"
                  placeholder="What makes your business unique? What problem do you solve?"
                  value={formData.uniqueValueProp}
                  onChange={(e) => updateFormData('uniqueValueProp', e.target.value)}
                  className="glassmorphism-dark border-white/20"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Business Model *</Label>
                <Select 
                  value={formData.businessModel} 
                  onValueChange={(value) => updateFormData('businessModel', value)}
                >
                  <SelectTrigger className="glassmorphism-dark border-white/20">
                    <SelectValue placeholder="Select your business model" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessModels.map(model => (
                      <SelectItem key={model} value={model.toLowerCase()}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Monthly Revenue</Label>
                <Select 
                  value={formData.monthlyRevenue} 
                  onValueChange={(value) => updateFormData('monthlyRevenue', value)}
                >
                  <SelectTrigger className="glassmorphism-dark border-white/20">
                    <SelectValue placeholder="Select revenue range" />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueRanges.map(range => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Team Size *</Label>
                <Select 
                  value={formData.teamSize} 
                  onValueChange={(value) => updateFormData('teamSize', value)}
                >
                  <SelectTrigger className="glassmorphism-dark border-white/20">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamSizes.map(size => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="founded">Founded</Label>
                  <Input
                    id="founded"
                    placeholder="e.g., 2023"
                    value={formData.founded}
                    onChange={(e) => updateFormData('founded', e.target.value)}
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold">Main Challenges *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select the biggest challenges your business is facing
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {commonChallenges.map(challenge => (
                    <Card 
                      key={challenge} 
                      className={`cursor-pointer transition-all glassmorphism-dark border-white/20 ${
                        formData.mainChallenges.includes(challenge)
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'hover:border-white/40'
                      }`}
                      onClick={() => handleArrayToggle('mainChallenges', challenge)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            formData.mainChallenges.includes(challenge)
                              ? 'bg-purple-400'
                              : 'bg-gray-500'
                          }`} />
                          <span className="text-sm">{challenge}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Goals *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  What are you hoping to achieve in the next 6 months?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {commonGoals.map(goal => (
                    <Card 
                      key={goal} 
                      className={`cursor-pointer transition-all glassmorphism-dark border-white/20 ${
                        formData.goals.includes(goal)
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'hover:border-white/40'
                      }`}
                      onClick={() => handleArrayToggle('goals', goal)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            formData.goals.includes(goal)
                              ? 'bg-purple-400'
                              : 'bg-gray-500'
                          }`} />
                          <span className="text-sm">{goal}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="glassmorphism-dark"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {onSkip && currentStep === 1 && (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Setup
            </Button>
          )}
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          {currentStep === steps.length ? 'Complete Setup' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wand2, 
  Twitter, 
  FileText, 
  Mail, 
  MessageSquare, 
  Rocket,
  Copy,
  Download,
  RefreshCw,
  Sparkles,
  Target,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/navigation/navigation';
import { Footer } from '@/components/sections/footer';

const contentTypes = [
  { 
    id: 'twitter', 
    icon: Twitter, 
    title: 'Twitter Thread', 
    description: 'Viral-ready thread with hooks and CTAs',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'blog', 
    icon: FileText, 
    title: 'Blog Post', 
    description: 'SEO-optimized long-form content',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'email', 
    icon: Mail, 
    title: 'Cold Email', 
    description: 'Personalized outreach sequences',
    color: 'from-pink-500 to-rose-500'
  },
  { 
    id: 'reddit', 
    icon: MessageSquare, 
    title: 'Reddit Post', 
    description: 'Community-friendly engagement posts',
    color: 'from-orange-500 to-red-500'
  },
  { 
    id: 'launch', 
    icon: Rocket, 
    title: 'Product Hunt Copy', 
    description: 'Complete launch campaign materials',
    color: 'from-purple-500 to-pink-500'
  },
];

const tones = [
  'Professional', 'Casual', 'Friendly', 'Authoritative', 'Humorous', 'Inspiring'
];

const audiences = [
  'Developers', 'Entrepreneurs', 'Marketers', 'Designers', 'SaaS Founders', 'General Public'
];

export default function GeneratePage() {
  const [selectedType, setSelectedType] = useState('twitter');
  const [productDescription, setProductDescription] = useState('');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = async () => {
    if (!productDescription || !tone || !audience) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockContent = generateMockContent(selectedType, productDescription, tone, audience);
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 3000);
  };

  const generateMockContent = (type: string, product: string, tone: string, audience: string) => {
    const contents = {
      twitter: `🚀 Just discovered something that's about to change how ${audience.toLowerCase()} work forever...

${product}

Here's why this matters (thread 🧵):

1/ The problem: Most ${audience.toLowerCase()} waste 20+ hours/week on repetitive tasks that could be automated.

2/ The solution: ${product} uses AI to handle the heavy lifting, so you can focus on what actually moves the needle.

3/ Real results: Early users report 3x productivity gains and 50% less stress.

4/ The best part? It takes 5 minutes to set up and works with tools you already use.

Ready to 10x your productivity? 

Try it free: [link] 

What's your biggest time-waster? Drop it below 👇`,

      blog: `# How ${product} is Revolutionizing the Way ${audience} Work

## The Problem We're Solving

In today's fast-paced digital world, ${audience.toLowerCase()} are drowning in repetitive tasks. Studies show that the average professional spends over 20 hours per week on work that could be automated.

## Introducing ${product}

${product} is designed specifically for ${audience.toLowerCase()} who want to reclaim their time and focus on high-impact work.

### Key Features:
- AI-powered automation
- Seamless integrations
- Intuitive interface
- Real-time analytics

### Results Speak for Themselves:
- 3x productivity increase
- 50% reduction in manual work
- 95% user satisfaction rate

## Getting Started

Setting up ${product} takes less than 5 minutes. Here's how:

1. Sign up for your free account
2. Connect your existing tools
3. Let AI handle the rest

## Conclusion

The future of work is here, and it's automated. Join thousands of ${audience.toLowerCase()} who've already transformed their workflow with ${product}.

Ready to get started? Try it free today.`,

      email: `Subject: Quick question about your ${audience.toLowerCase()} workflow

Hi [Name],

I noticed you're working in the ${audience.toLowerCase()} space and thought you might find this interesting.

Most ${audience.toLowerCase()} I talk to spend 20+ hours/week on repetitive tasks. Sound familiar?

I've been working on ${product} - it uses AI to automate the busy work so you can focus on what actually matters.

Early users are seeing:
→ 3x productivity gains
→ 50% less time on manual tasks
→ More time for strategic work

Would you be interested in a quick 15-minute demo to see how it could help your workflow?

Best,
[Your name]

P.S. - We're offering free setup for the first 100 users. Interested?`,

      reddit: `${product} - A game-changer for ${audience.toLowerCase()}

Hey r/${audience.toLowerCase()},

I've been lurking here for a while and finally have something worth sharing.

Like many of you, I was spending way too much time on repetitive tasks. Then I discovered ${product}.

**What it does:**
- Automates the boring stuff
- Integrates with tools you already use
- Actually saves time (not just claims to)

**Real results:**
- Cut my weekly admin time from 20 hours to 5
- 3x more productive on actual work
- Way less stressed

I know we're all skeptical of "productivity tools" but this one actually delivers.

Happy to answer questions if anyone's curious!

**Edit:** Wow, didn't expect this response! DMing everyone who asked for the link.`,

      launch: `🚀 **${product} - Launching Today on Product Hunt!**

**Tagline:** The AI-powered solution that gives ${audience.toLowerCase()} their time back

**Description:**
${product} automates repetitive tasks so ${audience.toLowerCase()} can focus on what matters most. With AI-powered workflows and seamless integrations, it's like having a personal assistant that never sleeps.

**Key Benefits:**
✅ 3x productivity increase
✅ 50% less manual work  
✅ Works with existing tools
✅ 5-minute setup

**Maker Comment:**
"As a ${audience.toLowerCase().slice(0, -1)} myself, I was tired of spending 20+ hours/week on tasks that should be automated. ${product} is the solution I wish existed years ago."

**Gallery Images:**
- Dashboard screenshot
- Before/after workflow comparison
- User testimonials
- Feature highlights

**Launch Strategy:**
- Email to 5,000 subscribers
- Social media campaign
- Influencer outreach
- Community engagement

Ready to hunt! 🦄`
    };

    return contents[type as keyof typeof contents] || 'Content generated successfully!';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const selectedTypeData = contentTypes.find(type => type.id === selectedType);

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
            <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-6">
              <Wand2 className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">AI Content Generator</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-sora mb-6">
              Generate <span className="text-gradient">Viral Content</span>
              <br />
              in Seconds
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Describe your product and let our AI create high-converting content for any platform. 
              From Twitter threads to Product Hunt launches.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Content Type Selection */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">Choose Content Type</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`glassmorphism rounded-xl p-4 text-left hover-lift transition-all ${
                        selectedType === type.id ? 'border-2 border-purple-500/50 neon-glow' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mb-3`}>
                        <type.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">{type.title}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Description */}
              <div>
                <Label htmlFor="product" className="text-lg font-semibold mb-4 block">
                  Describe Your Product
                </Label>
                <Textarea
                  id="product"
                  placeholder="e.g., LaunchPilot is an AI-powered marketing platform that helps indie developers create viral content, launch on Product Hunt, and grow their SaaS..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="glassmorphism-dark border-white/20 min-h-[120px]"
                />
              </div>

              {/* Tone and Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-semibold mb-4 block">Tone of Voice</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="glassmorphism-dark border-white/20">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((t) => (
                        <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-lg font-semibold mb-4 block">Target Audience</Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger className="glassmorphism-dark border-white/20">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map((a) => (
                        <SelectItem key={a} value={a.toLowerCase()}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!productDescription || !tone || !audience || isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6 neon-glow"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Generating {selectedTypeData?.title}...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Generate {selectedTypeData?.title}</span>
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glassmorphism rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-sora">Generated Content</h3>
                {generatedContent && (
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard} className="glassmorphism">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" className="glassmorphism">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                )}
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-muted-foreground">AI is crafting your content...</p>
                  <div className="flex items-center space-x-2 text-sm text-purple-400">
                    <Volume2 className="h-4 w-4" />
                    <span>Analyzing your product</span>
                  </div>
                </div>
              ) : generatedContent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glassmorphism-dark rounded-lg p-6"
                >
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                    {generatedContent}
                  </pre>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedTypeData?.color} flex items-center justify-center mb-4 opacity-50`}>
                    {selectedTypeData && <selectedTypeData.icon className="h-8 w-8 text-white" />}
                  </div>
                  <p className="text-muted-foreground mb-2">Your {selectedTypeData?.title.toLowerCase()} will appear here</p>
                  <p className="text-sm text-muted-foreground">Fill in the details and click generate to get started</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
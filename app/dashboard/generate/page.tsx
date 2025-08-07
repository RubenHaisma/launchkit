'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Save,
  Send,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/lib/store/dashboard-store';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const contentTypes = [
  { 
    id: 'tweet', 
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
    id: 'launch', 
    icon: Rocket, 
    title: 'Product Hunt Copy', 
    description: 'Complete launch campaign materials',
    color: 'from-purple-500 to-pink-500'
  },
];

const tones = [
  'professional', 'casual', 'friendly', 'authoritative', 'humorous', 'inspiring'
];

const audiences = [
  'developers', 'entrepreneurs', 'marketers', 'designers', 'saas-founders', 'general'
];

export default function GeneratePage() {
  const { data: session } = useSession();
  const { 
    generatedContent, 
    addGeneratedContent, 
    removeGeneratedContent,
    addCampaign,
    addNotification 
  } = useDashboardStore();
  
  const [selectedType, setSelectedType] = useState('tweet');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim() || !tone || !audience) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          type: selectedType,
          tone,
          audience,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.code === 'INSUFFICIENT_CREDITS') {
          toast.error('Insufficient credits! Please upgrade your plan.');
          return;
        }
        throw new Error(result.error || 'Failed to generate content');
      }
      
      addGeneratedContent({
        type: selectedType as any,
        content: result.content,
        prompt: prompt.trim(),
        tone,
        audience,
      });
      
      toast.success('Content generated successfully! 🎉');
      addNotification({
        type: 'success',
        title: 'Content Generated',
        message: `New ${selectedType} content is ready to use`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const saveAsCampaign = (content: any) => {
    const campaignName = `${content.type.charAt(0).toUpperCase() + content.type.slice(1)} Campaign`;
    
    addCampaign({
      name: campaignName,
      type: content.type === 'tweet' ? 'twitter' : content.type,
      status: 'draft',
      content: content.content,
      subject: content.type === 'email' ? content.content.split('\n')[0].replace('Subject: ', '') : undefined,
    });
    
    toast.success('Saved as campaign!');
    addNotification({
      type: 'success',
      title: 'Campaign Created',
      message: `${campaignName} saved to your campaigns`,
    });
  };

  const startEditing = (content: any) => {
    setEditingId(content.id);
    setEditContent(content.content);
  };

  const saveEdit = (id: string) => {
    // In a real app, you'd update the content in the store
    // For now, we'll just show a success message
    setEditingId(null);
    toast.success('Content updated!');
  };

  const selectedTypeData = contentTypes.find(type => type.id === selectedType);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-4">
          <Wand2 className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium">AI Content Generator</span>
        </div>
        <h1 className="text-3xl font-bold font-sora mb-2">
          Generate <span className="text-gradient">Viral Content</span>
        </h1>
        <p className="text-muted-foreground">
          Create high-converting content for any platform in seconds
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generator Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glassmorphism rounded-xl p-6 space-y-6"
        >
          <h2 className="text-xl font-bold font-sora">Content Generator</h2>
          
          {/* Content Type Selection */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Content Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`glassmorphism-dark rounded-lg p-4 text-left hover-lift transition-all ${
                    selectedType === type.id ? 'border-2 border-purple-500/50 neon-glow' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mb-2`}>
                    <type.icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{type.title}</h3>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <Label htmlFor="prompt" className="text-sm font-semibold mb-2 block">
              Describe Your Product/Idea
            </Label>
            <Textarea
              id="prompt"
              placeholder="e.g., LaunchPilot is an AI-powered marketing platform that helps indie developers create viral content, launch on Product Hunt, and grow their SaaS..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="glassmorphism-dark border-white/20 min-h-[100px]"
            />
          </div>

          {/* Tone and Audience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="glassmorphism-dark border-white/20">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Target Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="glassmorphism-dark border-white/20">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a.charAt(0).toUpperCase() + a.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || !tone || !audience || isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 neon-glow"
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

        {/* Generated Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glassmorphism rounded-xl p-6"
        >
          <h2 className="text-xl font-bold font-sora mb-6">Generated Content</h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            <AnimatePresence>
              {generatedContent.length > 0 ? (
                generatedContent.map((content) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glassmorphism-dark rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          content.type === 'tweet' ? 'bg-blue-500/20 text-blue-400' :
                          content.type === 'email' ? 'bg-pink-500/20 text-pink-400' :
                          content.type === 'blog' ? 'bg-green-500/20 text-green-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {content.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {content.tone} • {content.audience}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(content.content)}
                          className="p-1 h-auto"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(content)}
                          className="p-1 h-auto"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeGeneratedContent(content.id)}
                          className="p-1 h-auto text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {editingId === content.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="glassmorphism border-white/20 min-h-[150px]"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => saveEdit(content.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                            className="glassmorphism"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                          {content.content}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(content.createdAt).toLocaleString()}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => saveAsCampaign(content)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Use in Campaign
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedTypeData?.color} flex items-center justify-center mb-4 opacity-50 mx-auto`}>
                    {selectedTypeData && <selectedTypeData.icon className="h-8 w-8 text-white" />}
                  </div>
                  <p className="text-muted-foreground mb-2">No content generated yet</p>
                  <p className="text-sm text-muted-foreground">Fill in the form and click generate to get started</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
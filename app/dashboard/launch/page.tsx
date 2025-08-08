'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Target,
  Zap,
  Link2,
  Mail,
  Database,
  FileText,
  Twitter,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import toast from 'react-hot-toast';
import Link from 'next/link';

type PlanItem = {
  day: string;
  task: string;
  description: string;
  action?: string;
  icon?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'completed';
};

export default function LaunchPage() {
  const [launchDate, setLaunchDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [integrations, setIntegrations] = useState<{ dataSources: any[]; emailServices: any[] }>({ dataSources: [], emailServices: [] });
  const [loading, setLoading] = useState(true);

  // AI generation state
  const [productName, setProductName] = useState('');
  const [valueProp, setValueProp] = useState('');
  const [audience, setAudience] = useState('');
  const [launchCopy, setLaunchCopy] = useState<string>('');
  const [tweetThread, setTweetThread] = useState<string>('');
  const [emailCopy, setEmailCopy] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<{ copy?: boolean; thread?: boolean; email?: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, sourcesRes, emailRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/data-sources'),
          fetch('/api/email-services'),
        ]);

        if (dashboardRes.ok) {
          const data = await dashboardRes.json();
          setPlan(data.marketingPlan || []);
          // infer completed from status
          const c = (data.marketingPlan || []).filter((i: PlanItem) => i.status === 'completed').map((i: PlanItem) => i.day);
          setCompleted(c);
        }
        if (sourcesRes.ok) {
          const data = await sourcesRes.json();
          setIntegrations((prev) => ({ ...prev, dataSources: data.dataSources || [] }));
        }
        if (emailRes.ok) {
          const data = await emailRes.json();
          setIntegrations((prev) => ({ ...prev, emailServices: data.services || [] }));
        }
      } catch (e) {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const progress = useMemo(() => {
    if (plan.length === 0) return 0;
    const completedCount = plan.filter((p) => p.status === 'completed' || completed.includes(p.day)).length;
    return Math.round((completedCount / plan.length) * 100);
  }, [plan, completed]);

  const markCompleted = async (day: string) => {
    try {
      const res = await fetch('/api/marketing-plan/complete-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskDay: day }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setCompleted(data.completedTasks || []);
      toast.success('Task marked complete');
    } catch (e) {
      toast.error('Could not complete task');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  const buildPrompt = () => {
    return `Product name: ${productName}\nValue proposition: ${valueProp}\nTarget audience: ${audience}`.trim();
  };

  const generateLaunchCopy = async () => {
    if (!productName || !valueProp) {
      toast.error('Enter product name and value proposition');
      return;
    }
    setIsGenerating((s) => ({ ...s, copy: true }));
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product-hunt-launch',
          prompt: buildPrompt(),
          count: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.content) throw new Error(data?.error || 'Failed');
      setLaunchCopy(data.content);
      toast.success('Launch copy generated');
    } catch (e: any) {
      toast.error(e?.message || 'Generation failed');
    } finally {
      setIsGenerating((s) => ({ ...s, copy: false }));
    }
  };

  const generateThread = async () => {
    if (!productName) {
      toast.error('Enter product name');
      return;
    }
    setIsGenerating((s) => ({ ...s, thread: true }));
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'twitter-thread',
          prompt: `Announce our Product Hunt launch for ${productName}. Focus on: ${valueProp}. Audience: ${audience || 'builders and early adopters'}.`,
          count: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.content) throw new Error(data?.error || 'Failed');
      setTweetThread(data.content);
      toast.success('Thread generated');
    } catch (e: any) {
      toast.error(e?.message || 'Generation failed');
    } finally {
      setIsGenerating((s) => ({ ...s, thread: false }));
    }
  };

  const generateEmail = async () => {
    if (!productName) {
      toast.error('Enter product name');
      return;
    }
    setIsGenerating((s) => ({ ...s, email: true }));
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email-body',
          prompt: `Email to subscribers announcing Product Hunt launch of ${productName}. Value prop: ${valueProp}. Audience: ${audience || 'subscribers'}. Clear CTA to support.`,
          count: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.content) throw new Error(data?.error || 'Failed');
      setEmailCopy(data.content);
      toast.success('Email generated');
    } catch (e: any) {
      toast.error(e?.message || 'Generation failed');
    } finally {
      setIsGenerating((s) => ({ ...s, email: false }));
    }
  };

  const hasEmailIntegration = integrations.emailServices?.some((s: any) => s.isActive) || false;
  const hasDataSources = (integrations.dataSources?.length || 0) > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-4">
          <Rocket className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium">Launch Control</span>
        </div>
        <h1 className="text-3xl font-bold font-sora mb-2">
          Product Hunt <span className="text-gradient">Launch</span>
        </h1>
        <p className="text-muted-foreground">Plan, generate assets, and execute a clean launch</p>
      </motion.div>

      {/* Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glassmorphism rounded-xl p-6 text-center">
          <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold mb-2">{launchDate}</div>
          <div className="text-sm text-muted-foreground">Launch Date</div>
          <div className="mt-3">
            <Input type="date" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} className="glassmorphism-dark border-white/20" />
          </div>
        </div>

        <div className="glassmorphism rounded-xl p-6 text-center">
          <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold mb-1">{progress}%</div>
          <div className="text-sm text-muted-foreground">Plan Progress</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="glassmorphism rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-purple-400" />
              <div className="font-semibold">Integrations</div>
            </div>
            <Link href="/integrations">
              <Button size="sm" variant="outline" className="glassmorphism">Manage</Button>
            </Link>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>Email Service</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${hasEmailIntegration ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {hasEmailIntegration ? 'Connected' : 'Action required'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <span>Data Sources</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${hasDataSources ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-300'}`}>
                {hasDataSources ? `${integrations.dataSources.length} connected` : 'None'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator and Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-bold font-sora">Launch Asset Generator</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div>
                <Label htmlFor="name">Product</Label>
                <Input id="name" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., LaunchPilot" className="glassmorphism-dark border-white/20" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="value">Value Proposition</Label>
                <Input id="value" value={valueProp} onChange={(e) => setValueProp(e.target.value)} placeholder="e.g., AI that turns ideas into launch-ready content fast" className="glassmorphism-dark border-white/20" />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="audience">Target Audience</Label>
                <Input id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., indie hackers, SaaS founders" className="glassmorphism-dark border-white/20" />
              </div>
            </div>

            <Tabs defaultValue="copy">
              <TabsList className="glassmorphism-dark">
                <TabsTrigger value="copy">PH Launch Copy</TabsTrigger>
                <TabsTrigger value="thread">Tweet Thread</TabsTrigger>
                <TabsTrigger value="email">Subscriber Email</TabsTrigger>
              </TabsList>
              <TabsContent value="copy" className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Generate your Product Hunt description and maker comment</div>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(launchCopy)} disabled={!launchCopy}>Copy</Button>
                    <Button size="sm" onClick={generateLaunchCopy} disabled={isGenerating.copy === true} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {isGenerating.copy ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>
                <Textarea value={launchCopy} onChange={(e) => setLaunchCopy(e.target.value)} placeholder="Generated copy will appear here" rows={10} className="glassmorphism-dark border-white/20" />
              </TabsContent>
              <TabsContent value="thread" className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Generate an announcement thread for X/Twitter</div>
                  <div className="space-x-2">
                    <Link href="/dashboard/twitter"><Button size="sm" variant="outline"><Twitter className="h-4 w-4 mr-1" />Open Twitter</Button></Link>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(tweetThread)} disabled={!tweetThread}>Copy</Button>
                    <Button size="sm" onClick={generateThread} disabled={isGenerating.thread === true} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {isGenerating.thread ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>
                <Textarea value={tweetThread} onChange={(e) => setTweetThread(e.target.value)} placeholder="Generated thread will appear here" rows={10} className="glassmorphism-dark border-white/20" />
              </TabsContent>
              <TabsContent value="email" className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Generate an email to your subscribers</div>
                  <div className="space-x-2">
                    <Link href="/dashboard/email-campaigns">
                      <Button size="sm" variant="outline"><Mail className="h-4 w-4 mr-1" />Open Campaigns</Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(emailCopy)} disabled={!emailCopy}>Copy</Button>
                    <Button size="sm" onClick={generateEmail} disabled={isGenerating.email === true} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {isGenerating.email ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>
                <Textarea value={emailCopy} onChange={(e) => setEmailCopy(e.target.value)} placeholder="Generated email will appear here" rows={10} className="glassmorphism-dark border-white/20" />
                {!hasEmailIntegration && (
                  <div className="text-xs text-yellow-400 mt-2">Connect an email service to send directly from LaunchPilot</div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Plan tasks */}
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-sora">This Week's Plan</h2>
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className="glassmorphism"><BarChart3 className="h-4 w-4 mr-1" />View Dashboard</Button>
              </Link>
            </div>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.map((item) => {
                  const isCompleted = item.status === 'completed' || completed.includes(item.day);
                  const StatusIcon = isCompleted ? CheckCircle : item.priority === 'high' ? AlertCircle : Clock;
                  return (
                    <div key={item.day} className={`glassmorphism-dark rounded-lg p-4 ${isCompleted ? 'opacity-75' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${item.priority === 'high' ? 'bg-red-500/20' : item.priority === 'medium' ? 'bg-yellow-500/20' : 'bg-purple-500/20'}`}>
                            <FileText className="h-4 w-4 text-purple-400" />
                          </div>
                          <div className="text-sm font-semibold">{item.day}</div>
                        </div>
                        <StatusIcon className={`h-4 w-4 ${isCompleted ? 'text-green-400' : item.priority === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
                      </div>
                      <div className="text-sm font-semibold mb-1">{item.task}</div>
                      <div className="text-xs text-muted-foreground mb-3">{item.description}</div>
                      <div className="flex items-center justify-between">
                        <div className={`text-xs px-2 py-1 rounded-full ${item.priority === 'high' ? 'bg-red-500/20 text-red-400' : item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-300'}`}>
                          {item.priority}
                        </div>
                        <div className="space-x-2">
                          {item.action && (
                            <Link href={item.action}>
                              <Button size="sm" variant="outline" className="text-xs h-7 px-3">Start</Button>
                            </Link>
                          )}
                          {!isCompleted && (
                            <Button size="sm" variant="outline" className="text-xs h-7 px-3" onClick={() => markCompleted(item.day)}>
                              <CheckCircle className="h-3 w-3 mr-1" />Done
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-bold font-sora mb-4 text-purple-400">Launch Tips</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="t1">
                <AccordionTrigger>Timing</AccordionTrigger>
                <AccordionContent>
                  Submit at 12:01 AM PST. Tuesday to Thursday typically perform best.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t2">
                <AccordionTrigger>Engagement</AccordionTrigger>
                <AccordionContent>
                  Reply to comments all day and update your post with useful info.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t3">
                <AccordionTrigger>Distribution</AccordionTrigger>
                <AccordionContent>
                  Share a concise thread and notify your email list within the first hour.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="glassmorphism rounded-xl p-6">
            <h3 className="text-lg font-bold font-sora mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/dashboard/generate"><Button variant="outline" className="w-full glassmorphism-dark">Generate Content</Button></Link>
              <Link href="/dashboard/twitter"><Button variant="outline" className="w-full glassmorphism-dark">Twitter</Button></Link>
              <Link href="/dashboard/email-campaigns"><Button variant="outline" className="w-full glassmorphism-dark">Email Campaigns</Button></Link>
              <Link href="/integrations"><Button variant="outline" className="w-full glassmorphism-dark">Integrations</Button></Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
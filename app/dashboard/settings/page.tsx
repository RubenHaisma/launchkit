'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Key, 
  Bell, 
  Palette, 
  Shield, 
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useDashboardStore } from '@/lib/store/dashboard-store';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'billing', label: 'Billing', icon: Key },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const { profile, setProfile } = useDashboardStore();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    company: profile.company,
    industry: profile.industry,
    apiKey: profile.apiKey || '',
  });
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: true,
    weeklyReports: true,
    campaignAlerts: true,
  });

  const handleSave = () => {
    setProfile(formData);
    toast.success('Settings saved successfully!');
  };

  const generateApiKey = () => {
    const newApiKey = 'lp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setFormData({ ...formData, apiKey: newApiKey });
    toast.success('New API key generated!');
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to open billing portal');
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      toast.error('Something went wrong');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="glassmorphism-dark border-white/20"
                  />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                    <SelectTrigger className="glassmorphism-dark border-white/20">
                      <SelectValue />
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
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Billing & Subscription</h3>
              <div className="space-y-4">
                <div className="glassmorphism-dark rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">Current Plan</h4>
                      <p className="text-muted-foreground">
                        You are currently on the <span className="capitalize font-medium">{session?.user?.plan || 'free'}</span> plan
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {session?.user?.credits === 999999 ? 'Unlimited' : session?.user?.credits || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Credits remaining</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleManageBilling}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Manage Subscription
                    </Button>
                    <Link href="/pricing">
                      <Button variant="outline" className="glassmorphism">
                        View Plans
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="glassmorphism-dark rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Usage This Month</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>AI Generations:</span>
                      <span>47 / {session?.user?.plan === 'growth' ? '∞' : session?.user?.plan === 'pro' ? '500' : '50'}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '47%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="apiKey"
                        type={showApiKey ? 'text' : 'password'}
                        value={formData.apiKey}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        className="glassmorphism-dark border-white/20 pr-10"
                        placeholder="Enter your API key"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      onClick={generateApiKey}
                      variant="outline"
                      className="glassmorphism"
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your API key is used to authenticate requests to LaunchPilot's API
                  </p>
                </div>
                
                <div className="glassmorphism-dark rounded-lg p-4">
                  <h4 className="font-semibold mb-2">API Usage</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Requests this month:</span>
                      <span>1,247 / 10,000</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '12.47%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between glassmorphism-dark rounded-lg p-4">
                    <div>
                      <div className="font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {key === 'emailUpdates' && 'Receive email notifications about important updates'}
                        {key === 'pushNotifications' && 'Get push notifications in your browser'}
                        {key === 'weeklyReports' && 'Weekly performance summary emails'}
                        {key === 'campaignAlerts' && 'Alerts when campaigns start, pause, or complete'}
                      </div>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'system', label: 'System', icon: Monitor },
                    ].map((themeOption) => (
                      <button
                        key={themeOption.id}
                        onClick={() => setTheme(themeOption.id)}
                        className={`glassmorphism-dark rounded-lg p-4 text-center transition-all hover:bg-white/5 ${
                          theme === themeOption.id ? 'border-2 border-purple-500/50' : ''
                        }`}
                      >
                        <themeOption.icon className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{themeOption.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="glassmorphism-dark rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" className="glassmorphism">
                    Enable 2FA
                  </Button>
                </div>
                
                <div className="glassmorphism-dark rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Active Sessions</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your active sessions across devices
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-muted-foreground">Chrome on macOS • Active now</div>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold font-sora mb-2">
          <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and configuration
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glassmorphism rounded-xl p-6"
        >
          <nav className="space-y-2">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <section.icon className="h-5 w-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 glassmorphism rounded-xl p-6"
        >
          {renderSection()}
          
          <div className="flex justify-end mt-8 pt-6 border-t border-white/10">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
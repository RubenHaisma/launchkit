'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  Shield,
  Mail,
  Database,
  Key,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AdminSettings {
  system: {
    siteName: string;
    siteUrl: string;
    contactEmail: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
  };
  security: {
    maxLoginAttempts: number;
    sessionTimeout: number;
    requireStrongPasswords: boolean;
    enableTwoFactor: boolean;
    corsOrigins: string[];
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    emailEnabled: boolean;
  };
  database: {
    connectionPool: number;
    queryTimeout: number;
    backupEnabled: boolean;
    backupFrequency: string;
    retentionPeriod: number;
  };
  ai: {
    defaultProvider: string;
    maxTokensPerRequest: number;
    rateLimitPerUser: number;
    costThreshold: number;
    autoFailover: boolean;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (section: keyof AdminSettings, key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold font-sora text-gradient-red">
            Admin Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {saveSuccess && (
            <div className="flex items-center space-x-2 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Settings saved</span>
            </div>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </motion.div>

      {/* System Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>System Settings</span>
            </CardTitle>
            <CardDescription>General application configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={settings.system.siteName}
                  onChange={(e) => updateSettings('system', 'siteName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-url">Site URL</Label>
                <Input
                  id="site-url"
                  value={settings.system.siteUrl}
                  onChange={(e) => updateSettings('system', 'siteUrl', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={settings.system.contactEmail}
                  onChange={(e) => updateSettings('system', 'contactEmail', e.target.value)}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable to show maintenance page to users
                  </p>
                </div>
                <Switch
                  checked={settings.system.maintenanceMode}
                  onCheckedChange={(checked) => updateSettings('system', 'maintenanceMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register accounts
                  </p>
                </div>
                <Switch
                  checked={settings.system.registrationEnabled}
                  onCheckedChange={(checked) => updateSettings('system', 'registrationEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Verification Required</Label>
                  <p className="text-sm text-muted-foreground">
                    Require email verification for new accounts
                  </p>
                </div>
                <Switch
                  checked={settings.system.emailVerificationRequired}
                  onCheckedChange={(checked) => updateSettings('system', 'emailVerificationRequired', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
            <CardDescription>Authentication and security configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input
                  id="max-login-attempts"
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cors-origins">CORS Origins (one per line)</Label>
              <Textarea
                id="cors-origins"
                value={settings.security.corsOrigins.join('\n')}
                onChange={(e) => updateSettings('security', 'corsOrigins', e.target.value.split('\n').filter(Boolean))}
                rows={3}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Require Strong Passwords</Label>
                  <p className="text-sm text-muted-foreground">
                    Enforce minimum password complexity requirements
                  </p>
                </div>
                <Switch
                  checked={settings.security.requireStrongPasswords}
                  onCheckedChange={(checked) => updateSettings('security', 'requireStrongPasswords', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable 2FA support for user accounts
                  </p>
                </div>
                <Switch
                  checked={settings.security.enableTwoFactor}
                  onCheckedChange={(checked) => updateSettings('security', 'enableTwoFactor', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Email Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Email Settings</span>
            </CardTitle>
            <CardDescription>SMTP configuration for outgoing emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <Label>Email Service Enabled</Label>
                <p className="text-sm text-muted-foreground">
                  Enable email functionality for the application
                </p>
              </div>
              <Switch
                checked={settings.email.emailEnabled}
                onCheckedChange={(checked) => updateSettings('email', 'emailEnabled', checked)}
              />
            </div>
            
            {settings.email.emailEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={settings.email.smtpHost}
                      onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSettings('email', 'smtpPort', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">SMTP Username</Label>
                    <Input
                      id="smtp-user"
                      value={settings.email.smtpUser}
                      onChange={(e) => updateSettings('email', 'smtpUser', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-email">From Email</Label>
                    <Input
                      id="from-email"
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-name">From Name</Label>
                    <Input
                      id="from-name"
                      value={settings.email.fromName}
                      onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>AI Configuration</span>
            </CardTitle>
            <CardDescription>AI provider and usage settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="default-provider">Default AI Provider</Label>
                <select
                  id="default-provider"
                  value={settings.ai.defaultProvider}
                  onChange={(e) => updateSettings('ai', 'defaultProvider', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens Per Request</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  value={settings.ai.maxTokensPerRequest}
                  onChange={(e) => updateSettings('ai', 'maxTokensPerRequest', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate-limit">Rate Limit Per User (per hour)</Label>
                <Input
                  id="rate-limit"
                  type="number"
                  value={settings.ai.rateLimitPerUser}
                  onChange={(e) => updateSettings('ai', 'rateLimitPerUser', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost-threshold">Cost Threshold ($)</Label>
                <Input
                  id="cost-threshold"
                  type="number"
                  step="0.01"
                  value={settings.ai.costThreshold}
                  onChange={(e) => updateSettings('ai', 'costThreshold', parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto Failover</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically switch to backup providers on failure
                </p>
              </div>
              <Switch
                checked={settings.ai.autoFailover}
                onCheckedChange={(checked) => updateSettings('ai', 'autoFailover', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

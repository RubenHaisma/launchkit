'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu,
  Settings,
  Key,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModelConfig {
  id: string;
  provider: string;
  model: string;
  enabled: boolean;
  apiKey: string;
  apiKeyConfigured: boolean;
  maxTokens: number;
  costPer1kTokens: number;
  usageCount: number;
  lastUsed?: string;
  responseTime: number;
  successRate: number;
  priority: number;
  isDefault: boolean;
}

interface ProviderConfig {
  provider: string;
  enabled: boolean;
  apiKey: string;
  apiKeyConfigured: boolean;
  models: ModelConfig[];
  totalUsage: number;
  avgResponseTime: number;
  successRate: number;
}

export default function AdminModels() {
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingModel, setEditingModel] = useState<ModelConfig | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchModelConfig = async () => {
    try {
      const response = await fetch('/api/admin/models');
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers);
      }
    } catch (error) {
      console.error('Failed to fetch model configuration:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchModelConfig();
  };

  const handleToggleProvider = async (provider: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/admin/models', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_provider', provider, enabled })
      });
      
      if (response.ok) {
        fetchModelConfig();
      }
    } catch (error) {
      console.error('Failed to toggle provider:', error);
    }
  };

  const handleToggleModel = async (modelId: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/admin/models', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_model', modelId, enabled })
      });
      
      if (response.ok) {
        fetchModelConfig();
      }
    } catch (error) {
      console.error('Failed to toggle model:', error);
    }
  };

  const handleUpdateApiKey = async (provider: string, apiKey: string) => {
    try {
      const response = await fetch('/api/admin/models', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_api_key', provider, apiKey })
      });
      
      if (response.ok) {
        fetchModelConfig();
      }
    } catch (error) {
      console.error('Failed to update API key:', error);
    }
  };

  const handleEditModel = (model: ModelConfig) => {
    setEditingModel({ ...model });
    setEditDialogOpen(true);
  };

  const handleSaveModel = async () => {
    if (!editingModel) return;
    
    try {
      const response = await fetch('/api/admin/models', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update_model', 
          modelId: editingModel.id,
          config: {
            maxTokens: editingModel.maxTokens,
            costPer1kTokens: editingModel.costPer1kTokens,
            priority: editingModel.priority,
            isDefault: editingModel.isDefault
          }
        })
      });
      
      if (response.ok) {
        setEditDialogOpen(false);
        setEditingModel(null);
        fetchModelConfig();
      }
    } catch (error) {
      console.error('Failed to update model:', error);
    }
  };

  useEffect(() => {
    fetchModelConfig();
  }, []);

  const getStatusIcon = (enabled: boolean, hasApiKey: boolean) => {
    if (!enabled) return <XCircle className="h-4 w-4 text-gray-500" />;
    if (!hasApiKey) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = (enabled: boolean, hasApiKey: boolean) => {
    if (!enabled) return 'Disabled';
    if (!hasApiKey) return 'No API Key';
    return 'Active';
  };

  const getStatusColor = (enabled: boolean, hasApiKey: boolean) => {
    if (!enabled) return 'text-gray-500';
    if (!hasApiKey) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading model configuration...</p>
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
            AI Model Configuration
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage AI providers, models, and API configurations
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Providers Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {providers.map((provider) => (
          <Card key={provider.provider} className="glassmorphism-dark border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold capitalize">
                {provider.provider}
              </CardTitle>
              <div className="flex items-center space-x-2">
                {getStatusIcon(provider.enabled, provider.apiKeyConfigured)}
                <Switch
                  checked={provider.enabled}
                  onCheckedChange={(enabled) => handleToggleProvider(provider.provider, enabled)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <span className={`text-sm font-medium ${getStatusColor(provider.enabled, provider.apiKeyConfigured)}`}>
                  {getStatusText(provider.enabled, provider.apiKeyConfigured)}
                </span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`${provider.provider}-api-key`} className="text-sm">
                  API Key
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id={`${provider.provider}-api-key`}
                    type="password"
                    placeholder={provider.apiKeyConfigured ? 'API key configured' : 'Enter API key'}
                    defaultValue=""
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById(`${provider.provider}-api-key`) as HTMLInputElement;
                      if (input?.value) {
                        handleUpdateApiKey(provider.provider, input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium">{provider.models.length}</div>
                  <div className="text-muted-foreground">Models</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{provider.totalUsage}</div>
                  <div className="text-muted-foreground">Usage</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{provider.avgResponseTime}ms</div>
                  <div className="text-muted-foreground">Avg Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Models Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="h-5 w-5" />
              <span>Model Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure individual AI models, pricing, and priorities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Max Tokens</TableHead>
                  <TableHead>Cost/1K Tokens</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.flatMap(provider => provider.models).map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{model.model}</span>
                        {model.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{model.provider}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(model.enabled, model.apiKeyConfigured)}
                        <Switch
                          checked={model.enabled}
                          onCheckedChange={(enabled) => handleToggleModel(model.id, enabled)}
                          className="size-4"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{model.maxTokens.toLocaleString()}</TableCell>
                    <TableCell>${model.costPer1kTokens.toFixed(4)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{model.usageCount}</div>
                        {model.lastUsed && (
                          <div className="text-xs text-muted-foreground">
                            {new Date(model.lastUsed).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{model.responseTime}ms</div>
                        <div className="text-xs text-muted-foreground">
                          {model.successRate}% success
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={model.priority === 1 ? 'default' : 'secondary'}>
                        {model.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditModel(model)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Model Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Model Configuration</DialogTitle>
            <DialogDescription>
              Update model settings and pricing
            </DialogDescription>
          </DialogHeader>
          
          {editingModel && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="model-name">Model</Label>
                <Input
                  id="model-name"
                  value={`${editingModel.provider} - ${editingModel.model}`}
                  disabled
                />
              </div>
              
              <div>
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  value={editingModel.maxTokens}
                  onChange={(e) => setEditingModel({
                    ...editingModel,
                    maxTokens: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="cost-per-1k">Cost per 1K Tokens ($)</Label>
                <Input
                  id="cost-per-1k"
                  type="number"
                  step="0.0001"
                  value={editingModel.costPer1kTokens}
                  onChange={(e) => setEditingModel({
                    ...editingModel,
                    costPer1kTokens: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority (1 = highest)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  value={editingModel.priority}
                  onChange={(e) => setEditingModel({
                    ...editingModel,
                    priority: parseInt(e.target.value) || 1
                  })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-default"
                  checked={editingModel.isDefault}
                  onCheckedChange={(checked) => setEditingModel({
                    ...editingModel,
                    isDefault: checked
                  })}
                />
                <Label htmlFor="is-default">Set as default model</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveModel}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

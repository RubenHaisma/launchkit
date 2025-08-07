'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ProviderHealth {
  name: string;
  isHealthy: boolean;
  responseTime?: number;
  error?: string;
  lastChecked: string;
}

interface ProviderStats {
  name: string;
  isAvailable: boolean;
  errorCount: number;
  maxErrors: number;
  hasApiKey: boolean;
  lastChecked: string;
}

interface HealthData {
  success: boolean;
  providers: ProviderHealth[];
  stats: ProviderStats[];
  summary: {
    totalProviders: number;
    healthyProviders: number;
    availableProviders: number;
    configuredApiKeys: number;
  };
  timestamp: string;
}

export default function AIProviderStatus() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/ai-health');
      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
      }
    } catch (error) {
      console.error('Failed to fetch AI provider health:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const resetProviderErrors = async () => {
    setResetting(true);
    try {
      const response = await fetch('/api/ai-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });
      
      if (response.ok) {
        await fetchHealthData(); // Refresh data after reset
      }
    } catch (error) {
      console.error('Failed to reset provider errors:', error);
    } finally {
      setResetting(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHealthData();
  };

  useEffect(() => {
    fetchHealthData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Provider Status</CardTitle>
          <CardDescription>Loading provider health information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!healthData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Provider Status</CardTitle>
          <CardDescription>Failed to load provider health information</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>AI Provider Status</CardTitle>
            <CardDescription>
              Monitor the health and availability of AI providers
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetProviderErrors}
              disabled={resetting}
            >
              Reset Errors
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{healthData.summary.totalProviders}</div>
              <div className="text-sm text-muted-foreground">Total Providers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{healthData.summary.healthyProviders}</div>
              <div className="text-sm text-muted-foreground">Healthy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{healthData.summary.availableProviders}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{healthData.summary.configuredApiKeys}</div>
              <div className="text-sm text-muted-foreground">Configured</div>
            </div>
          </div>

          <div className="space-y-4">
            {healthData.providers.map((provider, index) => {
              const stats = healthData.stats.find(s => s.name === provider.name);
              
              return (
                <Card key={provider.name} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {provider.isHealthy ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <h3 className="font-semibold capitalize">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last checked: {new Date(provider.lastChecked).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {stats?.hasApiKey ? (
                        <Badge variant="secondary">API Key Configured</Badge>
                      ) : (
                        <Badge variant="destructive">No API Key</Badge>
                      )}
                      
                      {provider.isHealthy ? (
                        <Badge variant="default">Healthy</Badge>
                      ) : (
                        <Badge variant="destructive">Unhealthy</Badge>
                      )}
                      
                      {provider.responseTime && (
                        <Badge variant="outline">{provider.responseTime}ms</Badge>
                      )}
                    </div>
                  </div>
                  
                  {provider.error && (
                    <Alert className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{provider.error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {stats && stats.errorCount > 0 && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      Error count: {stats.errorCount} / {stats.maxErrors}
                      {stats.errorCount >= stats.maxErrors && (
                        <span className="text-red-500 ml-2">(Provider disabled)</span>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          
          <div className="mt-6 text-xs text-muted-foreground">
            Last updated: {new Date(healthData.timestamp).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

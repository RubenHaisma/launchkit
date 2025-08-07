'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity,
  TrendingUp,
  Cpu,
  Database,
  Clock,
  DollarSign,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ApiUsageData {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  requestsToday: number;
  avgResponseTime: number;
  topModels: Array<{
    model: string;
    provider: string;
    requests: number;
    tokens: number;
    cost: number;
    avgResponseTime: number;
  }>;
  usage24h: Array<{
    hour: string;
    requests: number;
    tokens: number;
    cost: number;
  }>;
  recentUsage: Array<{
    id: string;
    provider: string;
    model: string;
    endpoint: string;
    tokens: number;
    cost: number;
    userId?: string;
    userName?: string;
    timestamp: string;
    responseTime: number;
  }>;
}

export default function AdminApiUsage() {
  const [usageData, setUsageData] = useState<ApiUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsageData = async () => {
    try {
      const response = await fetch(`/api/admin/api-usage?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setUsageData(data);
      }
    } catch (error) {
      console.error('Failed to fetch API usage data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsageData();
  };

  useEffect(() => {
    fetchUsageData();
  }, [timeRange]);

  useEffect(() => {
    fetchUsageData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchUsageData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading API usage data...</p>
        </div>
      </div>
    );
  }

  if (!usageData) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load API usage data</p>
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
            API Usage Analytics
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor AI provider usage, costs, and performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageData.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{usageData.requestsToday}</span> today
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageData.totalTokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Processing capacity used
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${usageData.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              AI provider costs
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageData.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Token</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(usageData.totalCost / usageData.totalTokens * 1000).toFixed(4)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per 1K tokens
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Models */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Top AI Models</span>
            </CardTitle>
            <CardDescription>Most used models and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageData.topModels.map((model, index) => (
                <div key={`${model.provider}-${model.model}`} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-bold text-muted-foreground">#{index + 1}</div>
                    <div>
                      <div className="font-medium">{model.model}</div>
                      <div className="text-sm text-muted-foreground">{model.provider}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{model.requests.toLocaleString()} requests</div>
                    <div className="text-sm text-muted-foreground">
                      ${model.cost.toFixed(3)} • {model.avgResponseTime}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Usage Over Time</span>
            </CardTitle>
            <CardDescription>Request volume in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {usageData.usage24h.slice(-12).map((hour) => (
                <div key={hour.hour} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{hour.hour}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">{hour.requests} req</div>
                    <div className="text-sm">${hour.cost.toFixed(3)}</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (hour.requests / Math.max(...usageData.usage24h.map(h => h.requests))) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Usage Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle>Recent API Usage</CardTitle>
            <CardDescription>
              Latest AI provider requests and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider/Model</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageData.recentUsage.map((usage) => (
                  <TableRow key={usage.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{usage.model}</div>
                        <Badge variant="outline" className="text-xs">{usage.provider}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{usage.userName || 'Anonymous'}</div>
                        {usage.userId && (
                          <div className="text-xs text-muted-foreground">{usage.userId.slice(0, 8)}...</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{usage.endpoint}</Badge>
                    </TableCell>
                    <TableCell>{usage.tokens.toLocaleString()}</TableCell>
                    <TableCell>${usage.cost.toFixed(4)}</TableCell>
                    <TableCell>
                      <Badge variant={usage.responseTime > 2000 ? 'destructive' : usage.responseTime > 1000 ? 'secondary' : 'default'}>
                        {usage.responseTime}ms
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(usage.timestamp).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

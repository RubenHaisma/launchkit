'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AIProviderStatus from '@/components/admin/ai-provider-status';

interface SystemHealth {
  database: {
    status: 'healthy' | 'warning' | 'error';
    connectionPool: number;
    activeConnections: number;
    avgQueryTime: number;
    slowQueries: number;
  };
  server: {
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu: {
      usage: number;
      load: number[];
    };
    disk: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  network: {
    status: 'healthy' | 'warning' | 'error';
    latency: number;
    throughput: number;
    errors: number;
  };
  services: Array<{
    name: string;
    status: 'running' | 'stopped' | 'error';
    uptime: number;
    memoryUsage: number;
    lastChecked: string;
  }>;
  logs: Array<{
    id: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
    service: string;
  }>;
}

export default function AdminSystem() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/admin/system');
      if (response.ok) {
        const data = await response.json();
        setSystemHealth(data);
      }
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSystemHealth();
  };

  useEffect(() => {
    fetchSystemHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
      case 'stopped':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'stopped':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading system health...</p>
        </div>
      </div>
    );
  }

  if (!systemHealth) {
    return (
      <div className="p-8">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load system health data</p>
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
            System Health
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor server performance and system resources
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Database Health */}
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemHealth.database.status)}
              <span className={`font-medium ${getStatusColor(systemHealth.database.status)}`}>
                {systemHealth.database.status.toUpperCase()}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Active Connections</span>
                <span>{systemHealth.database.activeConnections}/{systemHealth.database.connectionPool}</span>
              </div>
              <Progress 
                value={(systemHealth.database.activeConnections / systemHealth.database.connectionPool) * 100} 
                className="h-2"
              />
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Avg Query: {systemHealth.database.avgQueryTime}ms</div>
                <div>Slow Queries: {systemHealth.database.slowQueries}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Server Health */}
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemHealth.server.status)}
              <span className={`font-medium ${getStatusColor(systemHealth.server.status)}`}>
                {systemHealth.server.status.toUpperCase()}
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                Uptime: {formatUptime(systemHealth.server.uptime)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>CPU Usage</span>
                  <span>{systemHealth.server.cpu.usage}%</span>
                </div>
                <Progress value={systemHealth.server.cpu.usage} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Memory</span>
                  <span>{systemHealth.server.memory.percentage}%</span>
                </div>
                <Progress value={systemHealth.server.memory.percentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Health */}
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemHealth.network.status)}
              <span className={`font-medium ${getStatusColor(systemHealth.network.status)}`}>
                {systemHealth.network.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Latency</div>
                <div className="font-medium">{systemHealth.network.latency}ms</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Throughput</div>
                <div className="font-medium">{formatBytes(systemHealth.network.throughput)}/s</div>
              </div>
            </div>
            {systemHealth.network.errors > 0 && (
              <div className="text-xs text-red-400">
                {systemHealth.network.errors} network errors
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* System Resources */}
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="h-5 w-5" />
              <span>System Resources</span>
            </CardTitle>
            <CardDescription>CPU, Memory, and Disk usage details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm">{systemHealth.server.cpu.usage}%</span>
              </div>
              <Progress value={systemHealth.server.cpu.usage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Load: [{systemHealth.server.cpu.load.map(l => l.toFixed(2)).join(', ')}]</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Memory</span>
                <span className="text-sm">
                  {formatBytes(systemHealth.server.memory.used)} / {formatBytes(systemHealth.server.memory.total)}
                </span>
              </div>
              <Progress value={systemHealth.server.memory.percentage} className="h-3" />
              <div className="text-xs text-muted-foreground mt-1">
                {systemHealth.server.memory.percentage}% used
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Disk Space</span>
                <span className="text-sm">
                  {formatBytes(systemHealth.server.disk.used)} / {formatBytes(systemHealth.server.disk.total)}
                </span>
              </div>
              <Progress value={systemHealth.server.disk.percentage} className="h-3" />
              <div className="text-xs text-muted-foreground mt-1">
                {systemHealth.server.disk.percentage}% used
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Status */}
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Services</span>
            </CardTitle>
            <CardDescription>Application services and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.services.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Uptime: {formatUptime(service.uptime)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={service.status === 'running' ? 'default' : 'destructive'}>
                      {service.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatBytes(service.memoryUsage)} RAM
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Provider Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AIProviderStatus />
      </motion.div>

      {/* System Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Recent system events and messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {systemHealth.logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    log.level === 'error' ? 'bg-red-500' :
                    log.level === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {log.service}
                        </Badge>
                        <Badge variant={
                          log.level === 'error' ? 'destructive' :
                          log.level === 'warning' ? 'secondary' : 'default'
                        } className="text-xs">
                          {log.level.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

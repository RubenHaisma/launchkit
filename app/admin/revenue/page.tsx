'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
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

interface RevenueData {
  overview: {
    totalRevenue: number;
    monthlyRevenue: number;
    annualRevenue: number;
    revenueGrowth: number;
    totalCustomers: number;
    activeSubscriptions: number;
    churnRate: number;
    avgRevenuePerUser: number;
  };
  revenueByPlan: Array<{
    plan: string;
    revenue: number;
    customers: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    customers: number;
    growth: number;
  }>;
  recentTransactions: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    plan: string;
    status: 'completed' | 'pending' | 'failed';
    timestamp: string;
    stripeId?: string;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    totalSpent: number;
    plan: string;
    joinedAt: string;
    lastPayment: string;
  }>;
}

export default function AdminRevenue() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12m');
  const [refreshing, setRefreshing] = useState(false);

  const fetchRevenueData = async () => {
    try {
      const response = await fetch(`/api/admin/revenue?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data);
      }
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRevenueData();
  };

  const exportRevenue = async () => {
    try {
      const response = await fetch('/api/admin/revenue/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export revenue data:', error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'pro': return 'default';
      case 'premium': return 'secondary';
      case 'enterprise': return 'outline';
      default: return 'destructive';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load revenue data</p>
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
            Revenue Analytics
          </h1>
          <p className="text-muted-foreground text-lg">
            Track subscription revenue and customer metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportRevenue}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Revenue Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.overview.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {revenueData.overview.revenueGrowth > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{revenueData.overview.revenueGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{revenueData.overview.revenueGrowth}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.overview.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Annual: ${revenueData.overview.annualRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.overview.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {revenueData.overview.churnRate}% churn rate
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism-dark border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARPU</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.overview.avgRevenuePerUser}</div>
            <p className="text-xs text-muted-foreground">
              Average revenue per user
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revenue by Plan & Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
            <CardDescription>Breakdown of revenue by subscription tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.revenueByPlan.map((plan) => (
                <div key={plan.plan} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center space-x-3">
                    <Badge variant={getPlanBadgeVariant(plan.plan)}>
                      {plan.plan}
                    </Badge>
                    <div>
                      <div className="font-medium">${plan.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{plan.customers} customers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{plan.percentage}%</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                        style={{ width: `${plan.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Revenue growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueData.monthlyTrend.slice(-6).map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">${month.revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{month.customers} customers</div>
                    <div className={`text-sm flex items-center ${
                      month.growth > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {month.growth > 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(month.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest subscription payments and charges</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueData.recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.customerName}</div>
                        <div className="text-sm text-muted-foreground">{transaction.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPlanBadgeVariant(transaction.plan)}>
                        {transaction.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {transaction.stripeId || transaction.id.slice(0, 8)}...
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Customers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glassmorphism-dark border-white/10">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest value customers by total revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueData.topCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPlanBadgeVariant(customer.plan)}>
                        {customer.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${customer.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(customer.joinedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(customer.lastPayment).toLocaleDateString()}
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

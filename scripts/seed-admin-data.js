const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedAdminData() {
  try {
    console.log('🌱 Seeding admin dashboard data...');

    // Add some system metrics
    const now = new Date();
    const metrics = [
      { metricType: 'cpu_percentage', value: 35.2, unit: 'percentage' },
      { metricType: 'memory_percentage', value: 68.5, unit: 'percentage' },
      { metricType: 'disk_percentage', value: 42.1, unit: 'percentage' },
      { metricType: 'api_latency', value: 125.0, unit: 'milliseconds' },
      { metricType: 'db_query_time', value: 15.3, unit: 'milliseconds' },
      { metricType: 'network_throughput', value: 850.0, unit: 'mbps' }
    ];

    for (const metric of metrics) {
      await prisma.systemMetrics.create({
        data: {
          id: `metric_${metric.metricType}_${Date.now()}`,
          ...metric,
          timestamp: new Date(now.getTime() - Math.random() * 60 * 60 * 1000) // Random time in last hour
        }
      });
    }

    // Add some system logs
    const logMessages = [
      { level: 'info', service: 'api', message: 'API health check completed successfully' },
      { level: 'info', service: 'database', message: 'Database backup completed' },
      { level: 'warning', service: 'api', message: 'High response time detected for OpenAI requests' },
      { level: 'info', service: 'auth', message: 'User session cleanup completed' },
      { level: 'error', service: 'ai', message: 'Failed to connect to Anthropic API - retrying' },
      { level: 'info', service: 'system', message: 'Memory usage within normal parameters' }
    ];

    for (const log of logMessages) {
      await prisma.systemLogs.create({
        data: {
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...log,
          timestamp: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000) // Random time in last 24h
        }
      });
    }

    // Add some user activity for the test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (testUser) {
      const activities = [
        { activity: 'login', description: 'User logged in successfully' },
        { activity: 'generation', description: 'Generated Twitter thread about AI trends' },
        { activity: 'post_created', description: 'Created LinkedIn post' },
        { activity: 'settings_updated', description: 'Updated profile settings' }
      ];

      for (const activity of activities) {
        await prisma.userActivity.create({
          data: {
            id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: testUser.id,
            ...activity,
            timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last week
          }
        });
      }
    }

    // Add some API usage data
    if (testUser) {
      const apiCalls = [
        { provider: 'openai', model: 'gpt-4', endpoint: 'chat/completions', tokens: 1250, cost: 0.025, success: true, responseTime: 850 },
        { provider: 'openai', model: 'gpt-3.5-turbo', endpoint: 'chat/completions', tokens: 800, cost: 0.008, success: true, responseTime: 650 },
        { provider: 'anthropic', model: 'claude-3-sonnet', endpoint: 'messages', tokens: 1500, cost: 0.022, success: true, responseTime: 920 },
        { provider: 'openai', model: 'gpt-4', endpoint: 'chat/completions', tokens: 950, cost: 0.019, success: false, responseTime: 2100, errorMessage: 'Rate limit exceeded' },
        { provider: 'google', model: 'gemini-pro', endpoint: 'generateContent', tokens: 600, cost: 0.006, success: true, responseTime: 750 }
      ];

      for (const apiCall of apiCalls) {
        await prisma.apiUsage.create({
          data: {
            id: `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: testUser.id,
            ...apiCall,
            createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last week
          }
        });
      }
    }

    // Add some sample Stripe webhooks
    const stripeWebhooks = [
      {
        stripeEventId: 'evt_1234567890abcdef',
        eventType: 'invoice.payment_succeeded',
        data: { 
          customer_details: { name: 'John Doe', email: 'john@example.com' },
          lines: { data: [{ price: { nickname: 'Pro Plan' } }] }
        },
        customerId: 'cus_1234567890',
        amount: 2900, // $29.00 in cents
        currency: 'usd',
        status: 'succeeded',
        processed: true
      },
      {
        stripeEventId: 'evt_2345678901bcdefg',
        eventType: 'checkout.session.completed',
        data: { 
          customer_details: { name: 'Jane Smith', email: 'jane@example.com' },
          lines: { data: [{ price: { nickname: 'Premium Plan' } }] }
        },
        customerId: 'cus_2345678901',
        amount: 9900, // $99.00 in cents
        currency: 'usd',
        status: 'complete',
        processed: true
      }
    ];

    for (const webhook of stripeWebhooks) {
      await prisma.stripeWebhook.create({
        data: {
          id: `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...webhook,
          createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random time in last month
        }
      });
    }

    console.log('✅ Successfully seeded admin dashboard data!');
    console.log('📊 Added:');
    console.log('  - System metrics (CPU, memory, disk, etc.)');
    console.log('  - System logs (info, warning, error levels)');
    console.log('  - User activity tracking');
    console.log('  - API usage data with real metrics');
    console.log('  - Sample Stripe webhook data');
    console.log('\n🚀 Your admin dashboard now has realistic data to explore!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminData();

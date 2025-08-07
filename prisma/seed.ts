import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test user
  const hashedPassword = await bcrypt.hash('testpassword123', 12)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      plan: 'pro',
      credits: 1000,
      stripeCustomerId: 'cus_test123',
      stripePriceId: 'price_pro_monthly',
      stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  })

  console.log('✅ Created test user:', testUser.email)

  // Create user stats
  const userStats = await prisma.userStats.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      totalGenerations: 25,
      totalTokens: 15000,
      totalCost: 12.50,
      lastActiveAt: new Date(),
      planUpgradedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  })

  console.log('✅ Created user stats')

  // Create campaigns
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        userId: testUser.id,
        name: 'Product Launch Campaign',
        type: 'launch',
        status: 'active',
      },
    }),
    prisma.campaign.create({
      data: {
        userId: testUser.id,
        name: 'Email Newsletter Series',
        type: 'email',
        status: 'draft',
      },
    }),
    prisma.campaign.create({
      data: {
        userId: testUser.id,
        name: 'Twitter Growth Campaign',
        type: 'twitter',
        status: 'completed',
      },
    }),
  ])

  console.log('✅ Created campaigns')

  // Create emails for campaigns
  const emails = await Promise.all([
    prisma.email.create({
      data: {
        campaignId: campaigns[0].id,
        subject: '🚀 Launch Day: Our Revolutionary Product is Here!',
        body: `Hi there!

We're excited to announce the launch of our revolutionary product that's going to change everything.

Key Features:
- Lightning fast performance
- Intuitive user interface
- Advanced analytics
- 24/7 customer support

Get started today and experience the difference!

Best regards,
The Team`,
        status: 'sent',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    }),
    prisma.email.create({
      data: {
        campaignId: campaigns[1].id,
        subject: 'Weekly Insights: Industry Trends & Updates',
        body: `Hello valued subscriber!

Here's your weekly dose of industry insights and updates:

📊 Market Trends
- AI adoption continues to grow
- Remote work is here to stay
- Sustainability is becoming a priority

💡 Tips & Tricks
- Optimize your workflow with automation
- Focus on customer experience
- Build strong relationships

Stay tuned for more insights next week!

Best regards,
Your Team`,
        status: 'draft',
      },
    }),
  ])

  console.log('✅ Created emails')

  // Create posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        userId: testUser.id,
        platform: 'twitter',
        content: 'Just launched our new product! 🚀\n\nAfter months of hard work, we\'re finally live. The response has been incredible so far.\n\nKey features that users love:\n✅ Lightning fast\n✅ Intuitive design\n✅ Powerful analytics\n\nWhat do you think? #ProductLaunch #Startup',
        title: 'Product Launch Announcement',
        published: true,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
    prisma.post.create({
      data: {
        userId: testUser.id,
        platform: 'linkedin',
        content: 'The future of work is here, and it\'s remote-first.\n\nAs we continue to adapt to this new normal, I\'ve been reflecting on what makes successful remote teams:\n\n1. Clear communication protocols\n2. Trust-based management\n3. Regular check-ins\n4. Technology that enables collaboration\n\nWhat strategies have worked for your team? #RemoteWork #Leadership',
        title: 'Remote Work Leadership',
        published: true,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    }),
    prisma.post.create({
      data: {
        userId: testUser.id,
        platform: 'reddit',
        content: 'AMA: I built a SaaS product from $0 to $50k MRR in 18 months\n\nHey Reddit! I\'m the founder of [Product Name], and I\'m here to answer your questions about building a successful SaaS business.\n\nSome background:\n- Started with $0 funding\n- Built everything myself initially\n- Now have 3 team members\n- Hit $50k MRR last month\n\nAsk me anything about the journey!',
        title: 'SaaS Founder AMA',
        scheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        published: false,
      },
    }),
  ])

  console.log('✅ Created posts')

  // Create newsletters
  const newsletters = await Promise.all([
    prisma.newsletter.create({
      data: {
        userId: testUser.id,
        subject: '🚀 Product Launch Special: Early Access & Exclusive Deals',
        content: `Hi there!

We're thrilled to announce that our revolutionary product is finally here! 

🎉 LAUNCH SPECIAL
- 50% off for the first 100 customers
- Lifetime access to premium features
- Priority customer support

🔥 WHAT'S NEW
Our product solves the biggest pain points in the industry:
- Automated workflow management
- Real-time analytics dashboard
- Seamless integrations
- 24/7 AI-powered support

💡 EARLY BIRD BONUS
The first 50 customers get:
- Free onboarding session
- Custom implementation guide
- 30-day money-back guarantee

Don't miss out on this limited-time offer!

Best regards,
The Team`,
        sent: true,
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
    prisma.newsletter.create({
      data: {
        userId: testUser.id,
        subject: '📈 Weekly Growth Report: Your Business Insights',
        content: `Hello valued subscriber!

Here's your weekly growth report and industry insights:

📊 YOUR METRICS
- Website traffic: +15% this week
- Conversion rate: 3.2% (industry avg: 2.1%)
- Customer acquisition cost: $45 (down from $52)

🎯 INDUSTRY TRENDS
- AI-powered tools adoption up 40%
- Customer experience focus increasing
- Sustainability becoming key differentiator

💡 ACTIONABLE TIPS
1. Optimize your landing page for mobile
2. Implement customer feedback loops
3. Focus on retention over acquisition
4. Leverage automation for scaling

Stay tuned for more insights next week!

Best regards,
Your Growth Team`,
        sent: false,
      },
    }),
  ])

  console.log('✅ Created newsletters')

  // Create generations
  const generations = await Promise.all([
    prisma.generation.create({
      data: {
        userId: testUser.id,
        type: 'tweet',
        prompt: 'Create an engaging tweet about launching a new SaaS product',
        content: '🚀 Just launched our new SaaS product!\n\nAfter months of hard work, we\'re finally live. The response has been incredible so far.\n\nKey features that users love:\n✅ Lightning fast\n✅ Intuitive design\n✅ Powerful analytics\n\nWhat do you think? #ProductLaunch #Startup',
        tone: 'excited',
        audience: 'entrepreneurs',
        model: 'gpt-4',
        tokens: 150,
        cost: 0.03,
      },
    }),
    prisma.generation.create({
      data: {
        userId: testUser.id,
        type: 'email',
        prompt: 'Write a professional email announcing a product launch to existing customers',
        content: `Hi [Customer Name],

We're excited to announce the launch of our revolutionary new product that's going to change everything.

Key Features:
- Lightning fast performance
- Intuitive user interface
- Advanced analytics
- 24/7 customer support

Get started today and experience the difference!

Best regards,
The Team`,
        tone: 'professional',
        audience: 'existing customers',
        model: 'gpt-4',
        tokens: 200,
        cost: 0.04,
      },
    }),
    prisma.generation.create({
      data: {
        userId: testUser.id,
        type: 'blog',
        prompt: 'Write a blog post about the future of remote work',
        content: `# The Future of Work: Embracing Remote-First Culture

The COVID-19 pandemic accelerated a shift that was already underway: the transition to remote work. As we move forward, it's clear that remote work isn't just a temporary solution—it's the future of work.

## The Benefits of Remote Work

### For Employees
- Better work-life balance
- Reduced commute time
- Increased productivity
- More flexibility

### For Employers
- Access to global talent
- Reduced overhead costs
- Higher employee satisfaction
- Improved retention rates

## Building a Successful Remote Team

### 1. Clear Communication Protocols
Establish clear guidelines for communication, including preferred channels, response times, and meeting schedules.

### 2. Trust-Based Management
Focus on results rather than hours worked. Trust your team to manage their time effectively.

### 3. Regular Check-ins
Schedule regular one-on-one meetings and team standups to maintain connection and alignment.

### 4. Technology That Enables Collaboration
Invest in tools that facilitate seamless collaboration, from project management platforms to video conferencing solutions.

## The Road Ahead

As we continue to adapt to this new normal, organizations that embrace remote work will have a competitive advantage. The future belongs to those who can build and maintain strong, productive teams regardless of physical location.

The transition to remote work isn't without challenges, but the benefits far outweigh the obstacles. By focusing on clear communication, trust, and the right technology, any organization can build a successful remote team.

What strategies have worked for your team? Share your experiences in the comments below.`,
        tone: 'informative',
        audience: 'professionals',
        model: 'gpt-4',
        tokens: 800,
        cost: 0.16,
      },
    }),
    prisma.generation.create({
      data: {
        userId: testUser.id,
        type: 'launch',
        prompt: 'Create a compelling product launch announcement',
        content: `# 🚀 Introducing [Product Name]: The Future of [Industry]

We're thrilled to announce the launch of [Product Name], a revolutionary platform that's going to transform how you [main benefit].

## What Makes [Product Name] Special?

### ⚡ Lightning Fast Performance
Built with cutting-edge technology to deliver results in seconds, not minutes.

### 🎯 Intuitive Design
User experience that feels natural and requires zero training.

### 📊 Powerful Analytics
Deep insights that help you make data-driven decisions.

### 🔒 Enterprise-Grade Security
Your data is protected with bank-level security measures.

## Early Bird Special

For a limited time, we're offering:
- **50% off** for the first 100 customers
- **Lifetime access** to premium features
- **Priority customer support**
- **Free onboarding session**

## What Our Beta Users Say

> "This is exactly what we've been looking for. Game changer!" - Sarah M., CEO

> "The speed and accuracy are incredible. Highly recommended!" - Mike R., CTO

## Get Started Today

Don't miss out on this limited-time offer. Join thousands of professionals who are already experiencing the future of [industry].

[Get Started Now] → [Link]

Questions? We're here to help at support@[company].com

---

*Limited time offer. Terms and conditions apply.*`,
        tone: 'excited',
        audience: 'potential customers',
        model: 'gpt-4',
        tokens: 600,
        cost: 0.12,
      },
    }),
  ])

  console.log('✅ Created generations')

  // Create API usage records
  const apiUsage = await Promise.all([
    prisma.apiUsage.create({
      data: {
        provider: 'openai',
        model: 'gpt-4',
        endpoint: 'chat/completions',
        tokens: 150,
        cost: 0.03,
        userId: testUser.id,
      },
    }),
    prisma.apiUsage.create({
      data: {
        provider: 'openai',
        model: 'gpt-4',
        endpoint: 'chat/completions',
        tokens: 200,
        cost: 0.04,
        userId: testUser.id,
      },
    }),
    prisma.apiUsage.create({
      data: {
        provider: 'anthropic',
        model: 'claude-3-sonnet',
        endpoint: 'messages',
        tokens: 800,
        cost: 0.16,
        userId: testUser.id,
      },
    }),
  ])

  console.log('✅ Created API usage records')

  // Create system config
  const systemConfig = await Promise.all([
    prisma.systemConfig.upsert({
      where: { key: 'default_credits' },
      update: {},
      create: {
        key: 'default_credits',
        value: '50',
        type: 'number',
      },
    }),
    prisma.systemConfig.upsert({
      where: { key: 'max_generations_per_day' },
      update: {},
      create: {
        key: 'max_generations_per_day',
        value: '100',
        type: 'number',
      },
    }),
    prisma.systemConfig.upsert({
      where: { key: 'feature_flags' },
      update: {},
      create: {
        key: 'feature_flags',
        value: JSON.stringify({
          advanced_analytics: true,
          team_collaboration: false,
          api_access: true,
          custom_branding: true,
        }),
        type: 'json',
      },
    }),
  ])

  console.log('✅ Created system config')

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📧 Test user email: ${testUser.email}`)
  console.log(`🔑 Test user password: testpassword123`)
  console.log(`💰 Credits: ${testUser.credits}`)
  console.log(`📊 Plan: ${testUser.plan}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

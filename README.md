# LaunchPilot - Production Ready

LaunchPilot is now production-ready with Prisma, PostgreSQL, and Stripe integration.

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repo>
   cd launchpilot
   npm install
   ```

2. **Database Setup**
   ```bash
   # Set up your PostgreSQL database
   cp .env.example .env
   # Edit .env with your DATABASE_URL
   
   # Push schema to database
   npm run db:push
   
   # Generate Prisma client
   npm run db:generate
   ```

3. **Stripe Setup**
   - Create products and prices in Stripe Dashboard
   - Add price IDs to .env
   - Set up webhook endpoint: `/api/stripe/webhook`

4. **Run Development**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Database (Prisma + PostgreSQL)
- **Users**: Authentication, billing, credits
- **Campaigns**: Email campaigns and sequences  
- **Posts**: Social media content scheduling
- **Generations**: AI content generation history
- **Newsletters**: Email newsletter management

### Authentication (NextAuth.js)
- Prisma adapter for session storage
- Credential-based auth with bcrypt
- Session-based route protection

### Payments (Stripe)
- Subscription billing with webhooks
- Customer portal for self-service
- Credit-based usage tracking
- Automatic plan upgrades/downgrades

### API Routes
- `/api/generate` - AI content generation with credit deduction
- `/api/stripe/checkout` - Create subscription checkout
- `/api/stripe/webhook` - Handle subscription events
- `/api/stripe/portal` - Customer billing portal

## 💳 Subscription Plans

- **Free**: 50 credits/month
- **Pro**: $29/month, 500 credits  
- **Growth**: $79/month, unlimited credits

## 🔧 Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_GROWTH_PRICE_ID="price_..."
```

## 📊 Database Commands

```bash
npm run db:push      # Push schema changes
npm run db:migrate   # Create migration
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
```

## 🚀 Deployment

1. **Database**: Deploy PostgreSQL (Railway, Supabase, etc.)
2. **App**: Deploy to Vercel/Railway
3. **Stripe**: Configure webhook endpoint
4. **Environment**: Set all production env vars

## 🔐 Security Features

- Password hashing with bcrypt
- Session-based authentication
- API route protection
- Input sanitization
- Stripe webhook signature verification

## 📈 Monitoring

- User registration and subscription metrics
- Credit usage tracking
- API error logging
- Stripe webhook event handling

Ready for production! 🎉
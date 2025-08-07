# Token-Based Usage System

## Overview

This comprehensive token system has been implemented to track and manage AI usage across all features in the LaunchPilot dashboard. The system is designed to be scalable, accurate, and aligned with your pricing strategy.

## Key Features

### 🎯 **Smart Token Allocation**
- **Free Plan**: 50 tokens/month (~50 tweets or 10 blog posts)
- **Pro Plan**: 500 tokens/month (~500 tweets or 100 blog posts)
- **Growth Plan**: Unlimited tokens

### 📊 **Comprehensive Tracking**
- Real-time token usage monitoring
- Detailed analytics by feature type
- Usage history and trends
- Cost estimation and reporting

### 🔒 **Robust Implementation**
- Database-backed tracking with Prisma
- Transaction-safe token deduction
- Automatic monthly reset functionality
- Backward compatibility with existing credit system

## Token Costs by Feature

| Feature | Tokens | Reasoning |
|---------|--------|-----------|
| Tweet | 1 | Simple, short content |
| Instagram Caption | 1 | Brief visual content |
| Email Subject | 1 | Single line optimization |
| Blog Title | 1 | SEO-focused title |
| LinkedIn Post | 2 | Professional formatting |
| Reddit Post | 2 | Community-focused content |
| TikTok Script | 2 | Video script structure |
| Email Body | 2 | Persuasive copy writing |
| Cold Email | 2 | Personalization required |
| Twitter Thread | 3 | Multi-tweet structure |
| Newsletter | 3 | Complex email content |
| Product Hunt Launch | 3 | Strategic launch content |
| Email Sequence | 4 | Multi-email series |
| Blog Post | 5 | Long-form content |
| Analytics Insight | 5 | Data analysis required |
| Competitor Analysis | 7 | Research-intensive |
| Daily Suggestions | 8 | Personalized recommendations |
| Website Scraping | 10 | Data extraction + analysis |
| Bulk Operations | 15-20 | High-volume processing |

## Technical Implementation

### Core Components

1. **TokenManager** (`lib/token-manager.ts`)
   - Central token management system
   - Transaction-safe operations
   - Usage analytics and reporting

2. **useTokens Hook** (`hooks/use-tokens.ts`)
   - Frontend token state management
   - Real-time updates
   - User-friendly error handling

3. **API Endpoints**
   - `/api/tokens/use` - Token consumption
   - `/api/tokens/metrics` - Usage analytics

4. **UI Components**
   - Enhanced CreditBadge with detailed popover
   - TokenUsageWidget for dashboard
   - TokenCostDisplay for feature costs

### Database Schema

The system utilizes existing Prisma models:
- `User.credits` - Current token balance
- `UserStats` - Aggregate usage statistics
- `ApiUsage` - Detailed usage logs
- `Generation` - Content generation history

### Integration Points

All AI-powered features now integrate with the token system:
- ✅ Content Generation API (`/api/generate`)
- ✅ Website Scraping (`/api/scrape-website`)
- ✅ Twitter/LinkedIn/Reddit generation
- ✅ Email campaigns and sequences
- ✅ Blog post creation
- ✅ Competitor analysis

## User Experience

### Token Visibility
- **Dashboard Widget**: Real-time usage tracking
- **Navigation Badge**: Current balance with detailed popover
- **Feature Buttons**: Show token cost before usage
- **Analytics Page**: Comprehensive usage reports

### Smart Messaging
- Pre-action token availability checks
- Clear cost display on all AI features
- Upgrade prompts when tokens are low
- Success feedback with token usage

### Upgrade Flow
- Contextual upgrade suggestions
- Token cost explanations
- Plan comparison with token allocations
- Seamless Stripe integration

## Benefits for Business

### 💰 **Revenue Optimization**
- Clear value communication to users
- Transparent pricing aligned with usage
- Reduced support queries about limits
- Improved conversion to paid plans

### 📈 **Product Analytics**
- Detailed feature usage insights
- User behavior patterns
- Cost-per-feature analysis
- Churn prediction signals

### 🚀 **Scalability**
- Easy addition of new AI features
- Flexible token cost adjustments
- Support for enterprise pricing
- API-ready for future integrations

## Configuration

### Environment Variables
No additional environment variables required - uses existing database and Stripe configuration.

### Token Cost Adjustments
Update `TOKEN_COSTS` in `lib/token-manager.ts` to modify feature costs.

### Plan Limits
Update `PLANS` in `lib/stripe.ts` to adjust plan allocations.

## Testing

The system includes comprehensive error handling and validation:
- Token availability checks before processing
- Transaction rollbacks on failures
- Graceful degradation for API errors
- Clear user feedback for all scenarios

## Migration Notes

- Existing `credits` system remains functional
- New token system runs alongside for compatibility
- Users automatically benefit from enhanced tracking
- No data migration required

## Future Enhancements

### Planned Features
- Token gift/transfer system
- Usage prediction and recommendations
- Custom token packages
- Team usage management
- API rate limiting integration

This token system provides a solid foundation for sustainable growth while maintaining excellent user experience and clear value communication.

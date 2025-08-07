# Smart AI Provider System

## Overview

The smart AI provider system automatically manages multiple AI providers (Anthropic Claude and OpenAI GPT) with intelligent fallbacks, health checks, and error recovery. When one API is unavailable or returns errors, the system automatically switches to the next available provider.

## Key Features

- ✅ **Automatic Fallback**: Seamlessly switches between providers when one fails
- ✅ **Health Monitoring**: Real-time health checks with response time tracking
- ✅ **Error Recovery**: Automatic error counting and provider disabling/recovery
- ✅ **Smart Model Selection**: Optimal model selection based on task complexity
- ✅ **API Key Validation**: Checks for properly configured API keys
- ✅ **Caching**: Efficient health check caching to minimize overhead

## Configuration

### Environment Variables

```bash
# Required: At least one API key must be configured
ANTHROPIC_API_KEY="sk-ant-your-key-here"
OPENAI_API_KEY="sk-proj-your-key-here"
```

### Provider Configuration

The system automatically detects available providers based on:
1. API key configuration 
2. Network connectivity
3. Provider health status
4. Error history

## Usage

### Basic Content Generation

```typescript
import { generateContent } from '@/lib/ai';

const result = await generateContent({
  prompt: 'Write a professional tweet about AI',
  contentType: 'tweet',
  tone: 'professional',
  audience: 'developers'
});

console.log('Content:', result.content);
console.log('Provider used:', result.provider); // 'anthropic' or 'openai'
```

### Provider Health Monitoring

```typescript
import { getAllProvidersHealth, getProviderStats } from '@/lib/ai';

// Get real-time health status
const health = await getAllProvidersHealth();
console.log('Provider Health:', health);

// Get provider statistics
const stats = getProviderStats();
console.log('Provider Stats:', stats);
```

### Manual Provider Recovery

```typescript
import { resetProviderErrors } from '@/lib/ai';

// Reset error counts for all providers
resetProviderErrors();
```

## API Endpoints

### Health Check API

```bash
# Get provider health and stats
GET /api/ai-health

# Get only health status
GET /api/ai-health?action=health

# Get only statistics
GET /api/ai-health?action=stats

# Reset provider errors
POST /api/ai-health
{
  "action": "reset"
}
```

## Model Selection Strategy

The system chooses the optimal model based on content type and complexity:

| Content Type | Complexity | Preferred Provider | Reasoning |
|--------------|------------|-------------------|-----------|
| Tweet | Fast | Anthropic | Quick, witty responses |
| LinkedIn Post | Balanced | Anthropic | Professional tone |
| Blog Post | Smart | Anthropic | Long-form content |
| Instagram Caption | Fast | OpenAI | Creative, visual content |
| TikTok Script | Balanced | OpenAI | Trendy, engaging content |

## Error Handling

### Automatic Fallback Process

1. **Primary Provider**: Try the preferred provider for the content type
2. **Health Check**: Verify provider is healthy and has valid API key
3. **Error Detection**: Monitor for API errors (auth, rate limits, etc.)
4. **Fallback**: Switch to alternative provider if primary fails
5. **Error Tracking**: Count errors and disable provider if threshold exceeded
6. **Recovery**: Reset error counts periodically or manually

### Error Types Handled

- ❌ **Authentication Errors**: Invalid or missing API keys
- ❌ **Rate Limiting**: Provider temporarily unavailable
- ❌ **Network Issues**: Connectivity problems
- ❌ **Service Outages**: Provider service interruptions
- ❌ **Invalid Responses**: Malformed or empty responses

## Monitoring Dashboard

Use the admin component to monitor provider status:

```typescript
import AIProviderStatus from '@/components/admin/ai-provider-status';

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AIProviderStatus />
    </div>
  );
}
```

The dashboard shows:
- Real-time health status
- Response times
- Error counts
- API key configuration status
- Last check timestamps

## Best Practices

### 1. API Key Management
- Use different API keys for development and production
- Store keys securely in environment variables
- Never commit API keys to version control
- Rotate keys regularly

### 2. Error Handling
- Monitor the health dashboard regularly
- Set up alerts for provider failures
- Have backup API keys ready
- Test fallback scenarios

### 3. Performance Optimization
- Cache results when possible
- Use appropriate complexity levels
- Monitor response times
- Consider provider-specific optimizations

## Troubleshooting

### Common Issues

**Issue**: "No available AI providers"
- **Cause**: No API keys configured or all providers unhealthy
- **Solution**: Check environment variables and provider health

**Issue**: "invalid x-api-key" error
- **Cause**: Incorrect or expired API key
- **Solution**: Update API key in environment variables

**Issue**: Provider always falling back to secondary
- **Cause**: Primary provider has exceeded error threshold
- **Solution**: Reset provider errors or check API key validity

### Debug Steps

1. Check provider health: `GET /api/ai-health`
2. Verify API keys in `.env.local`
3. Check recent error logs
4. Reset provider errors if needed
5. Test with a simple content generation request

## Migration Guide

If you're upgrading from the old AI system:

1. **Update imports**:
   ```typescript
   // Old
   import { generateText } from 'ai';
   
   // New  
   import { generateContent } from '@/lib/ai';
   ```

2. **Update function calls**:
   ```typescript
   // Old
   const result = await generateText({ model, prompt, system });
   
   // New
   const result = await generateContent({ 
     prompt, 
     contentType: 'tweet', 
     tone: 'professional' 
   });
   ```

3. **Handle provider information**:
   ```typescript
   // New: Access which provider was used
   console.log('Provider used:', result.provider);
   ```

The new system is backward compatible and will automatically handle provider selection and fallbacks.

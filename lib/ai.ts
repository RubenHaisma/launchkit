import { z } from 'zod';
import { 
  generateTextWithFallback, 
  generateObjectWithFallback, 
  getBestProvider,
  getAllProvidersHealth,
  resetProviderErrors,
  getProviderStats
} from './ai-provider';
import { formatAsTwitterThread, FormattedThread } from './twitter-thread-formatter';

export type ContentType = 
  | 'tweet' 
  | 'twitter-thread'
  | 'linkedin-post'
  | 'reddit-post'
  | 'instagram-caption'
  | 'tiktok-script'
  | 'email-subject'
  | 'email-body'
  | 'blog-title'
  | 'blog-post'
  | 'product-hunt-launch'
  | 'cold-email'
  | 'newsletter';

export type ToneType = 
  | 'professional'
  | 'casual'
  | 'friendly'
  | 'authoritative'
  | 'playful'
  | 'inspirational'
  | 'educational'
  | 'conversational'
  | 'witty'
  | 'urgent';

export type AudienceType = 
  | 'developers'
  | 'entrepreneurs'
  | 'marketers'
  | 'designers'
  | 'business-owners'
  | 'investors'
  | 'general'
  | 'students'
  | 'professionals'
  | 'creatives';

interface GenerateContentOptions {
  prompt: string;
  contentType: ContentType;
  tone?: ToneType;
  audience?: AudienceType;
  platform?: string;
  additionalContext?: string;
  keywords?: string[];
  callToAction?: string;
  maxLength?: number;
  businessContext?: string;
}

interface GeneratedContent {
  content: string;
  variations?: string[];
  hashtags?: string[];
  suggestedPostTime?: string;
  engagementPrediction?: number;
  optimizations?: string[];
  thread?: FormattedThread; // For Twitter threads
  copyText?: string; // Ready-to-paste format
}

// Best complexity and provider selection for each content type
const getOptimalSettings = (contentType: ContentType) => {
  const settingsMap: Record<ContentType, { complexity: 'fast' | 'smart' | 'balanced'; preferredProvider?: 'anthropic' | 'openai' }> = {
    'tweet': { complexity: 'fast', preferredProvider: 'anthropic' }, // Fast, witty, concise
    'twitter-thread': { complexity: 'smart', preferredProvider: 'anthropic' }, // Better structure
    'linkedin-post': { complexity: 'balanced', preferredProvider: 'anthropic' }, // Professional tone
    'reddit-post': { complexity: 'fast', preferredProvider: 'anthropic' }, // Authentic, conversational
    'instagram-caption': { complexity: 'fast', preferredProvider: 'openai' }, // Creative, visual
    'tiktok-script': { complexity: 'balanced', preferredProvider: 'openai' }, // Trendy, engaging
    'email-subject': { complexity: 'fast', preferredProvider: 'anthropic' }, // High open rates
    'email-body': { complexity: 'balanced', preferredProvider: 'anthropic' }, // Persuasive
    'blog-title': { complexity: 'balanced', preferredProvider: 'anthropic' }, // SEO optimized
    'blog-post': { complexity: 'smart', preferredProvider: 'anthropic' }, // Long-form content
    'product-hunt-launch': { complexity: 'smart', preferredProvider: 'anthropic' }, // Strategic
    'cold-email': { complexity: 'balanced', preferredProvider: 'anthropic' }, // Personalized
    'newsletter': { complexity: 'smart', preferredProvider: 'anthropic' }, // Engaging narrative
  };

  return settingsMap[contentType] || { complexity: 'balanced', preferredProvider: 'anthropic' };
};

// Platform-specific constraints and best practices
const getPlatformSpecs = (contentType: ContentType) => {
  const specs: Record<ContentType, any> = {
    'tweet': { maxChars: 280, optimal: '200-250', format: 'Single tweet', bestPractices: 'Use questions, emojis, threads for long content' },
    'twitter-thread': { maxChars: 280, optimal: '3-7 tweets', format: 'Numbered thread', bestPractices: 'Hook in first tweet, value in each tweet, CTA at end' },
    'linkedin-post': { maxChars: 3000, optimal: '150-300 words', format: 'Professional post', bestPractices: 'Start with hook, use line breaks, include question' },
    'reddit-post': { maxChars: 40000, optimal: '200-500 words', format: 'Text post', bestPractices: 'Be authentic, provide value, follow subreddit rules' },
    'instagram-caption': { maxChars: 2200, optimal: '125-150 words', format: 'Caption with hashtags', bestPractices: 'Strong first line, story-driven, 5-10 hashtags' },
    'tiktok-script': { duration: '15-60s', optimal: '30-45s', format: 'Video script', bestPractices: 'Hook in first 3s, trending sounds, visual cues' },
    'email-subject': { maxChars: 50, optimal: '30-45 chars', format: 'Subject line', bestPractices: 'Urgency, curiosity, personalization' },
    'email-body': { maxWords: 200, optimal: '75-150 words', format: 'Email body', bestPractices: 'Personal, single CTA, mobile-friendly' },
    'blog-title': { maxChars: 60, optimal: '50-60 chars', format: 'SEO title', bestPractices: 'Keywords, numbers, power words' },
    'blog-post': { minWords: 1000, optimal: '1500-2500 words', format: 'Long-form article', bestPractices: 'H2/H3 structure, internal links, conclusion' },
    'product-hunt-launch': { maxChars: 260, optimal: '200-250 chars', format: 'Launch description', bestPractices: 'Clear value prop, excitement, call to support' },
    'cold-email': { maxWords: 150, optimal: '75-125 words', format: 'Personalized email', bestPractices: 'Research recipient, specific value, soft CTA' },
    'newsletter': { maxWords: 500, optimal: '200-400 words', format: 'Newsletter section', bestPractices: 'Consistent voice, valuable content, subscriber benefits' }
  };

  return specs[contentType] || {};
};

const buildSystemPrompt = (contentType: ContentType, tone: ToneType = 'professional', audience: AudienceType = 'general', businessContext?: string) => {
  const platformSpecs = getPlatformSpecs(contentType);
  
  const tweetSpecificRules = contentType === 'tweet' 
    ? '\n\nIMPORTANT TWEET RULES:\n- NEVER include hashtags in tweets\n- Focus on authentic, conversational content\n- Use natural language without forced hashtags\n- Make every word count within the character limit\n- Prioritize engagement through genuine value and relatability'
    : '';
  
  const businessSuggestions = businessContext && contentType === 'tweet'
    ? '\n\nBUSINESS-SPECIFIC SUGGESTIONS:\nBased on the business context provided, create content that:\n- Addresses the specific industry challenges and opportunities\n- Aligns with the business goals and target audience\n- Showcases expertise in their field\n- Provides actionable insights relevant to their business\n- Builds thought leadership in their industry'
    : '';
  
  const basePrompt = `You are an expert content creator and marketing strategist specializing in ${contentType} content.

CONTENT TYPE: ${contentType}
TARGET AUDIENCE: ${audience}
TONE: ${tone}
PLATFORM SPECS: ${JSON.stringify(platformSpecs)}

${businessContext || ''}${tweetSpecificRules}${businessSuggestions}

Create high-performing content that:
1. Matches the exact tone and audience specified
2. Follows platform best practices and constraints
3. Maximizes engagement potential
4. Includes strategic elements (hooks, CTAs, etc.)
5. Is authentic and provides real value
6. ${businessContext ? 'Incorporates the business context to create personalized, relevant content' : 'Focuses on content that indie builders and entrepreneurs would find genuinely valuable and share-worthy'}

${businessContext ? 'Always ensure the content aligns with the business\'s industry, goals, and target audience while addressing their specific challenges and unique value proposition.' : 'Focus on content that indie builders and entrepreneurs would find genuinely valuable and share-worthy.'}`;

  return basePrompt;
};

export async function generateContent(options: GenerateContentOptions): Promise<GeneratedContent & { provider?: string }> {
  const {
    prompt,
    contentType,
    tone = 'professional',
    audience = 'entrepreneurs',
    platform,
    additionalContext = '',
    keywords = [],
    callToAction,
    maxLength,
    businessContext
  } = options;

  try {
    const settings = getOptimalSettings(contentType);
    const systemPrompt = buildSystemPrompt(contentType, tone, audience, businessContext);
    const platformSpecs = getPlatformSpecs(contentType);

    // Build the user prompt with all context
    const contextualPrompt = `
Generate ${contentType} content based on:

MAIN PROMPT: ${prompt}

ADDITIONAL REQUIREMENTS:
${additionalContext ? `Context: ${additionalContext}` : ''}
${keywords.length > 0 ? `Keywords to include: ${keywords.join(', ')}` : ''}
${callToAction ? `Call to action: ${callToAction}` : ''}
${maxLength ? `Max length: ${maxLength}` : ''}
${platform ? `Specific platform: ${platform}` : ''}

Platform specifications: ${JSON.stringify(platformSpecs)}

Return the content optimized for maximum engagement and performance.
`;

    // For structured content types, use generateObject
    if (['twitter-thread', 'blog-post', 'product-hunt-launch'].includes(contentType)) {
      const schema = z.object({
        content: z.string().describe('The main content'),
        variations: z.array(z.string()).optional().describe('2-3 alternative versions'),
        hashtags: z.array(z.string()).optional().describe('Relevant hashtags'),
        suggestedPostTime: z.string().optional().describe('Optimal posting time'),
        // Accept 1-100 from models; will normalize to 1-10 after parsing
        engagementPrediction: z.number().min(1).max(100).optional().describe('Predicted engagement score (1-10 or 1-100)'),
        optimizations: z.array(z.string()).optional().describe('Suggestions to improve performance')
      });

      const result = await generateObjectWithFallback({
        system: systemPrompt,
        prompt: contextualPrompt,
        schema,
        temperature: 0.8,
        complexity: settings.complexity,
        preferredProvider: settings.preferredProvider
      });

      const generatedContent = result.object as GeneratedContent;
      const normalizedEngagement =
        typeof generatedContent.engagementPrediction === 'number'
          ? (generatedContent.engagementPrediction > 10
              ? Math.min(10, generatedContent.engagementPrediction / 10)
              : generatedContent.engagementPrediction)
          : undefined;
      
      // Special handling for Twitter threads
      if (contentType === 'twitter-thread') {
        const thread = formatAsTwitterThread(
          generatedContent.content, 
          generatedContent.hashtags,
          {
            addNumbers: true,
            enhanceHook: true,
            addCTA: true,
            maxTweetsPerThread: 15
          }
        );
        
        return {
          ...generatedContent,
          thread,
          copyText: thread.copyText,
          content: thread.tweets.map(t => t.content).join('\n\n'),
          engagementPrediction: thread.estimatedEngagement,
          provider: result.provider
        };
      }
      
      return {
        ...generatedContent,
        engagementPrediction: normalizedEngagement,
        provider: result.provider
      };
    } else {
      // For simple content, use generateText
      const result = await generateTextWithFallback({
        system: systemPrompt,
        prompt: contextualPrompt,
        temperature: 0.8,
        complexity: settings.complexity,
        preferredProvider: settings.preferredProvider
      });

      // Add basic enhancements
      const hashtags = extractHashtags(result.text, contentType);
      const engagementScore = predictEngagement(result.text, contentType);
      
      // Special handling for single tweets that might be long
      if (contentType === 'tweet' && result.text.length > 280) {
        const thread = formatAsTwitterThread(
          result.text, 
          hashtags,
          {
            addNumbers: true,
            enhanceHook: true,
            addCTA: false, // Single tweet converted to thread, keep it simple
            maxTweetsPerThread: 5
          }
        );
        
        return {
          content: thread.tweets.map(t => t.content).join('\n\n'),
          hashtags,
          engagementPrediction: thread.estimatedEngagement,
          suggestedPostTime: getSuggestedPostTime(contentType),
          optimizations: getOptimizationSuggestions(result.text, contentType),
          thread,
          copyText: thread.copyText,
          provider: result.provider
        };
      }

      return {
        content: result.text,
        hashtags,
        engagementPrediction: engagementScore,
        suggestedPostTime: getSuggestedPostTime(contentType),
        optimizations: getOptimizationSuggestions(result.text, contentType),
        provider: result.provider
      };
    }
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('AI service configuration error. Please check your API keys.');
    }
    if (error instanceof Error && error.message.includes('No available')) {
      throw new Error('All AI services are currently unavailable. Please try again later.');
    }
    
    throw new Error('Failed to generate content. Please try again.');
  }
}

// Helper functions
function extractHashtags(content: string, contentType: ContentType): string[] {
  // Skip hashtag extraction for tweets as per user requirements
  if (contentType === 'tweet') return [];
  
  if (!['instagram-caption', 'linkedin-post'].includes(contentType)) return [];
  
  const hashtags = content.match(/#[\w]+/g) || [];
  return Array.from(new Set(hashtags)); // Remove duplicates
}

function predictEngagement(content: string, contentType: ContentType): number {
  let score = 5; // Base score
  
  // Positive indicators
  if (content.includes('?')) score += 1; // Questions increase engagement
  if (content.length > 50) score += 0.5; // Adequate length
  if (/[!🔥💡⚡🚀]/.test(content)) score += 0.5; // Emojis/excitement
  if (content.includes('tips') || content.includes('how to')) score += 1; // Educational content
  
  // Platform-specific scoring
  if (contentType === 'tweet' && content.length <= 250) score += 1;
  if (contentType === 'linkedin-post' && content.includes('\n')) score += 0.5; // Line breaks
  
  return Math.min(Math.max(score, 1), 10);
}

function getSuggestedPostTime(contentType: ContentType): string {
  const timeMap: Record<ContentType, string> = {
    'tweet': '9 AM or 8 PM EST',
    'twitter-thread': '2 PM EST',
    'linkedin-post': '9 AM EST (Tuesday-Thursday)',
    'reddit-post': '8-10 AM EST',
    'instagram-caption': '6-9 PM EST',
    'tiktok-script': '7-9 PM EST',
    'email-subject': '10 AM EST (Tuesday-Thursday)',
    'email-body': '10 AM EST (Tuesday-Thursday)',
    'blog-title': 'Any time (SEO focused)',
    'blog-post': 'Any time (SEO focused)',
    'product-hunt-launch': '12:01 AM PST',
    'cold-email': '10 AM EST (Tuesday-Thursday)',
    'newsletter': '10 AM EST (Tuesday)'
  };
  
  return timeMap[contentType] || '10 AM EST';
}

function getOptimizationSuggestions(content: string, contentType: ContentType): string[] {
  const suggestions: string[] = [];
  
  if (contentType === 'tweet' && content.length > 240) {
    suggestions.push('Consider shortening for better mobile readability');
  }
  
  if (!content.includes('?') && ['tweet', 'linkedin-post'].includes(contentType)) {
    suggestions.push('Add a question to increase engagement');
  }
  
  if (!/[!🔥💡⚡🚀]/.test(content) && contentType !== 'email-body') {
    suggestions.push('Consider adding emojis for visual appeal');
  }
  
  if (contentType === 'cold-email' && content.length > 150) {
    suggestions.push('Shorten for better response rates');
  }
  
  return suggestions;
}

// Demo content generation for homepage
export async function generateDemoContent(demoPrompt: string): Promise<{
  tweet: GeneratedContent;
  linkedinPost: GeneratedContent;
  emailSubject: GeneratedContent;
}> {
  const [tweet, linkedinPost, emailSubject] = await Promise.all([
    generateContent({
      prompt: demoPrompt,
      contentType: 'tweet',
      tone: 'witty',
      audience: 'entrepreneurs'
    }),
    generateContent({
      prompt: demoPrompt,
      contentType: 'linkedin-post',
      tone: 'professional',
      audience: 'business-owners'
    }),
    generateContent({
      prompt: demoPrompt,
      contentType: 'email-subject',
      tone: 'urgent',
      audience: 'entrepreneurs'
    })
  ]);

  return { tweet, linkedinPost, emailSubject };
}

// Export provider management functions for admin/debugging
export { 
  getAllProvidersHealth, 
  resetProviderErrors, 
  getProviderStats,
  getBestProvider 
};

// Export thread formatting utilities
export { formatAsTwitterThread, validateThread } from './twitter-thread-formatter';
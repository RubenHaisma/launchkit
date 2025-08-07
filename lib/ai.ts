import { generateText, generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Initialize AI providers with API keys
const anthropicProvider = anthropic;

const openaiProvider = openai;

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
}

interface GeneratedContent {
  content: string;
  variations?: string[];
  hashtags?: string[];
  suggestedPostTime?: string;
  engagementPrediction?: number;
  optimizations?: string[];
}

// Best model selection for each content type
const getOptimalModel = (contentType: ContentType) => {
  const modelMap: Record<ContentType, any> = {
    'tweet': 'claude-3-5-haiku-latest', // Fast, witty, concise
    'twitter-thread': 'claude-3-5-sonnet-latest', // Better structure
    'linkedin-post': 'claude-3-5-sonnet-latest', // Professional tone
    'reddit-post': 'claude-3-5-haiku-latest', // Authentic, conversational
    'instagram-caption': 'gpt-4o-mini', // Creative, visual
    'tiktok-script': 'gpt-4o-mini', // Trendy, engaging
    'email-subject': 'claude-3-5-haiku-latest', // High open rates
    'email-body': 'claude-3-5-sonnet-latest', // Persuasive
    'blog-title': 'claude-3-5-sonnet-latest', // SEO optimized
    'blog-post': 'claude-3-5-sonnet-latest', // Long-form content
    'product-hunt-launch': 'claude-3-5-sonnet-latest', // Strategic
    'cold-email': 'claude-3-5-sonnet-latest', // Personalized
    'newsletter': 'claude-3-5-sonnet-latest', // Engaging narrative
  };

  const modelId = modelMap[contentType] || 'claude-3-5-sonnet-latest';
  
  // Return the appropriate provider based on model ID
  if (modelId.includes('claude')) {
    return anthropicProvider(modelId);
  } else {
    return openaiProvider(modelId);
  }
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

const buildSystemPrompt = (contentType: ContentType, tone: ToneType = 'professional', audience: AudienceType = 'general') => {
  const platformSpecs = getPlatformSpecs(contentType);
  
  const basePrompt = `You are an expert content creator and marketing strategist specializing in ${contentType} content.

CONTENT TYPE: ${contentType}
TARGET AUDIENCE: ${audience}
TONE: ${tone}
PLATFORM SPECS: ${JSON.stringify(platformSpecs)}

Create high-performing content that:
1. Matches the exact tone and audience specified
2. Follows platform best practices and constraints
3. Maximizes engagement potential
4. Includes strategic elements (hooks, CTAs, etc.)
5. Is authentic and provides real value

Focus on content that indie builders and entrepreneurs would find genuinely valuable and share-worthy.`;

  return basePrompt;
};

export async function generateContent(options: GenerateContentOptions): Promise<GeneratedContent> {
  const {
    prompt,
    contentType,
    tone = 'professional',
    audience = 'entrepreneurs',
    platform,
    additionalContext = '',
    keywords = [],
    callToAction,
    maxLength
  } = options;

  try {
    const model = getOptimalModel(contentType);
    const systemPrompt = buildSystemPrompt(contentType, tone, audience);
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
        engagementPrediction: z.number().min(1).max(10).optional().describe('Predicted engagement score'),
        optimizations: z.array(z.string()).optional().describe('Suggestions to improve performance')
      });

      const result = await generateObject({
        model,
        system: systemPrompt,
        prompt: contextualPrompt,
        schema,
        temperature: 0.8,
      });

      return result.object;
    } else {
      // For simple content, use generateText
      const result = await generateText({
        model,
        system: systemPrompt,
        prompt: contextualPrompt,
        temperature: 0.8,
      });

      // Add basic enhancements
      const hashtags = extractHashtags(result.text, contentType);
      const engagementScore = predictEngagement(result.text, contentType);

      return {
        content: result.text,
        hashtags,
        engagementPrediction: engagementScore,
        suggestedPostTime: getSuggestedPostTime(contentType),
        optimizations: getOptimizationSuggestions(result.text, contentType)
      };
    }
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}

// Helper functions
function extractHashtags(content: string, contentType: ContentType): string[] {
  if (!['tweet', 'instagram-caption', 'linkedin-post'].includes(contentType)) return [];
  
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
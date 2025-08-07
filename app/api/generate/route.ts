import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TokenManager, TokenUsageType } from '@/lib/token-manager'
import { generateContent, ContentType, ToneType, AudienceType } from '@/lib/ai'
import { getBusinessContext, buildBusinessContextPrompt, getPersonalizedTone, getPersonalizedAudience } from '@/lib/business-context'

interface GenerateRequest {
  prompt?: string;
  topic?: string;
  style?: string;
  count?: number;
  type: ContentType | string;
  tone?: ToneType;
  audience?: AudienceType;
  platform?: string;
  additionalContext?: string;
  keywords?: string[];
  callToAction?: string;
  maxLength?: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: GenerateRequest = await request.json();
    const { 
      prompt, 
      topic,
      style,
      count = 1,
      type, 
      tone, 
      audience, 
      platform,
      additionalContext,
      keywords,
      callToAction,
      maxLength 
    } = body;

    // Handle new social media formats
    let finalPrompt = prompt || '';
    let finalTone = tone;
    let finalType = type as ContentType;
    let finalPlatform = platform;

    if (type === 'twitter' && topic) {
      finalPrompt = topic;
      finalType = 'tweet';
      finalTone = (style || 'engaging') as ToneType;
      finalPlatform = 'twitter';
    } else if (type === 'twitter-thread') {
      finalPrompt = prompt || topic || '';
      finalType = 'twitter-thread';
      finalTone = (tone || style || 'engaging') as ToneType;
      finalPlatform = 'twitter';
    } else if (type === 'reddit' && topic) {
      finalPrompt = topic;
      finalType = 'reddit-post';
      finalTone = (style || 'discussion') as ToneType;
      finalPlatform = 'reddit';
    } else if (type === 'linkedin' && topic) {
      finalPrompt = topic;
      finalType = 'linkedin-post';
      finalTone = (style || 'professional') as ToneType;
      finalPlatform = 'linkedin';
    } else if (type === 'visual-content' && topic) {
      finalPrompt = topic;
      finalType = 'instagram-caption';
      finalTone = (style || 'trendy') as ToneType;
      finalPlatform = platform || 'instagram';
    } else if (type === 'email-sequence' && topic) {
      finalPrompt = `Create an email template for ${topic} sequence`;
      finalType = 'email-body';
      finalTone = (style || 'engaging') as ToneType;
      finalPlatform = 'email';
    } else if (type === 'community-response' && topic) {
      finalPrompt = topic;
      finalType = 'cold-email'; // Reuse existing type for community responses
      finalTone = (style || 'friendly') as ToneType;
      finalPlatform = platform || 'twitter';
    } else if (type === 'viral-content' && topic) {
      finalPrompt = `Create viral content ideas about ${topic}`;
      finalType = 'tweet'; // Reuse tweet type for viral content
      finalTone = (style || 'viral') as ToneType;
      finalPlatform = platform || 'twitter';
    } else if (type === 'personal-brand' && topic) {
      finalPrompt = `Create content about ${topic} that aligns with the brand voice: ${style}`;
      finalType = 'blog-post'; // Use blog-post type for personal brand content
      finalTone = (style || 'professional') as ToneType;
      finalPlatform = platform || 'linkedin';
    } else if (type === 'outreach' && topic) {
      finalPrompt = `Create a professional outreach message for: ${topic}`;
      finalType = 'cold-email'; // Use cold-email type for outreach messages
      finalTone = (style || 'professional') as ToneType;
      finalPlatform = platform || 'email';
    }

    // Map content types to token usage types
    const getTokenUsageType = (contentType: ContentType): TokenUsageType => {
      const typeMap: Record<ContentType, TokenUsageType> = {
        'tweet': 'tweet',
        'twitter-thread': 'twitter-thread',
        'linkedin-post': 'linkedin-post',
        'reddit-post': 'reddit-post',
        'instagram-caption': 'instagram-caption',
        'tiktok-script': 'tiktok-script',
        'email-subject': 'email-subject',
        'email-body': 'email-body',
        'blog-title': 'blog-title',
        'blog-post': 'blog-post',
        'product-hunt-launch': 'product-hunt-launch',
        'cold-email': 'cold-email',
        'newsletter': 'newsletter'
      }
      return typeMap[contentType] || 'tweet'
    }

    // Check and deduct tokens using new system
    const tokenUsageType = getTokenUsageType(finalType)
    const tokenResult = await TokenManager.useTokens(
      session.user.id, 
      tokenUsageType, 
      count,
      {
        provider: 'ai-generation',
        model: finalType,
        endpoint: '/api/generate'
      }
    )
    
    if (!tokenResult.success) {
      return NextResponse.json({ 
        error: tokenResult.error || 'Insufficient tokens',
        code: 'INSUFFICIENT_CREDITS',
        upgradeRequired: tokenResult.upgradeRequired
      }, { status: 402 })
    }

    // Get business context for personalized content
    const businessContext = await getBusinessContext(session.user.id);
    const businessContextPrompt = buildBusinessContextPrompt(businessContext);
    
    // Get personalized tone and audience based on business context
    const personalizedTone = finalTone || getPersonalizedTone(businessContext, 'professional') as ToneType;
    const personalizedAudience = audience || getPersonalizedAudience(businessContext, 'entrepreneurs') as AudienceType;

    // Generate multiple content pieces if requested
    const results = [];
    for (let i = 0; i < count; i++) {
      const result = await generateContent({
        prompt: finalPrompt,
        contentType: finalType,
        tone: personalizedTone,
        audience: personalizedAudience,
        platform: finalPlatform || 'twitter',
        additionalContext,
        keywords,
        callToAction,
        maxLength: finalType === 'tweet' ? 280 : undefined,
        businessContext: businessContextPrompt
      });
      results.push(result);
    }

    // Save generation to database
    const firstResult = results[0];
    
    // Store in generations table for all content types
    await prisma.generation.create({
      data: {
        userId: session.user.id,
        type: finalType,
        prompt: finalPrompt || '',
        content: firstResult.content,
        tone: personalizedTone,
        audience: personalizedAudience,
      }
    })

    // Additionally store tweets in the tweets table for analytics
    if (finalType === 'tweet') {
      for (const result of results) {
        await prisma.tweet.create({
          data: {
            userId: session.user.id,
            content: result.content,
            isGenerated: true,
            published: false, // Not published yet
            generationType: finalType,
            prompt: finalPrompt || '',
          }
        });
      }
    }

    // For multiple results (like Twitter), return array of content
    if (count > 1) {
      return NextResponse.json({
        success: true,
        content: results.map(r => r.content),
        variations: results.flatMap(r => r.variations || []),
        hashtags: firstResult.hashtags,
        suggestedPostTime: firstResult.suggestedPostTime,
        engagementPrediction: firstResult.engagementPrediction,
        optimizations: firstResult.optimizations,
        metadata: {
          type: finalType,
          tone: personalizedTone,
          audience: personalizedAudience,
          platform: platform || 'twitter',
          wordCount: firstResult.content.split(' ').length,
          estimatedReadTime: Math.ceil(firstResult.content.split(' ').length / 200),
          tokensUsed: tokenResult.tokensUsed || 0,
          businessContextUsed: !!businessContext,
        },
      });
    }

    // Single result (original format)
    return NextResponse.json({
      success: true,
      content: firstResult.content,
      variations: firstResult.variations,
      hashtags: firstResult.hashtags,
      suggestedPostTime: firstResult.suggestedPostTime,
      engagementPrediction: firstResult.engagementPrediction,
      optimizations: firstResult.optimizations,
      thread: (firstResult as any).thread, // Include thread data if available
      copyText: (firstResult as any).copyText, // Include copy text if available
      provider: (firstResult as any).provider, // Include provider info
      metadata: {
        type: finalType,
        tone: personalizedTone,
        audience: personalizedAudience,
        platform: platform || 'twitter',
        wordCount: firstResult.content.split(' ').length,
        estimatedReadTime: Math.ceil(firstResult.content.split(' ').length / 200),
        tokensUsed: tokenResult.tokensUsed || 0,
        businessContextUsed: !!businessContext,
      },
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

// Legacy function - now handled by TokenManager
// Kept for backward compatibility
function getCreditsForContentType(type: ContentType): number {
  const creditMap: Record<ContentType, number> = {
    'tweet': 1,
    'twitter-thread': 3,
    'linkedin-post': 2,
    'reddit-post': 2,
    'instagram-caption': 1,
    'tiktok-script': 2,
    'email-subject': 1,
    'email-body': 2,
    'blog-title': 1,
    'blog-post': 5,
    'product-hunt-launch': 3,
    'cold-email': 2,
    'newsletter': 3
  };
  
  return creditMap[type] || 1;
}
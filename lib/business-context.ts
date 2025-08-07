import { prisma } from '@/lib/prisma';

export interface BusinessContext {
  businessName?: string;
  website?: string;
  industry?: string;
  description?: string;
  targetAudience?: string;
  businessModel?: string;
  monthlyRevenue?: string;
  teamSize?: string;
  uniqueValueProp?: string;
  mainChallenges?: string[];
  goals?: string[];
  competitors?: string[];
  websiteData?: {
    title?: string;
    description?: string;
    features?: string[];
    technologies?: string[];
    pricing?: {
      hasPricing: boolean;
      plans?: string[];
    };
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      facebook?: string;
      instagram?: string;
    };
  };
}

export async function getBusinessContext(userId: string): Promise<BusinessContext | null> {
  try {
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { userId }
    });

    if (!businessProfile) {
      return null;
    }

    return {
      businessName: businessProfile.businessName || undefined,
      website: businessProfile.website || undefined,
      industry: businessProfile.industry || undefined,
      description: businessProfile.description || undefined,
      targetAudience: businessProfile.targetAudience || undefined,
      businessModel: businessProfile.businessModel || undefined,
      monthlyRevenue: businessProfile.monthlyRevenue || undefined,
      teamSize: businessProfile.teamSize || undefined,
      uniqueValueProp: businessProfile.uniqueValueProp || undefined,
      mainChallenges: businessProfile.mainChallenges || [],
      goals: businessProfile.goals || [],
      competitors: businessProfile.competitors || [],
      websiteData: businessProfile.websiteData as any || undefined,
    };
  } catch (error) {
    console.error('Error fetching business context:', error);
    return null;
  }
}

export function buildBusinessContextPrompt(businessContext: BusinessContext | null): string {
  if (!businessContext) {
    return '';
  }

  const contextParts: string[] = [];

  // Basic business information
  if (businessContext.businessName) {
    contextParts.push(`Business: ${businessContext.businessName}`);
  }

  if (businessContext.industry) {
    contextParts.push(`Industry: ${businessContext.industry}`);
  }

  if (businessContext.description) {
    contextParts.push(`Description: ${businessContext.description}`);
  }

  if (businessContext.targetAudience) {
    contextParts.push(`Target Audience: ${businessContext.targetAudience}`);
  }

  if (businessContext.uniqueValueProp) {
    contextParts.push(`Unique Value Proposition: ${businessContext.uniqueValueProp}`);
  }

  if (businessContext.businessModel) {
    contextParts.push(`Business Model: ${businessContext.businessModel}`);
  }

  // Goals and challenges
  if (businessContext.goals && businessContext.goals.length > 0) {
    contextParts.push(`Current Goals: ${businessContext.goals.join(', ')}`);
  }

  if (businessContext.mainChallenges && businessContext.mainChallenges.length > 0) {
    contextParts.push(`Main Challenges: ${businessContext.mainChallenges.join(', ')}`);
  }

  // Website insights
  if (businessContext.websiteData) {
    const webData = businessContext.websiteData;
    
    if (webData.features && webData.features.length > 0) {
      contextParts.push(`Key Features: ${webData.features.slice(0, 5).join(', ')}`);
    }

    if (webData.technologies && webData.technologies.length > 0) {
      contextParts.push(`Tech Stack: ${webData.technologies.join(', ')}`);
    }

    if (webData.pricing?.hasPricing) {
      contextParts.push(`Has Pricing: Yes`);
      if (webData.pricing.plans && webData.pricing.plans.length > 0) {
        contextParts.push(`Pricing Plans: ${webData.pricing.plans.slice(0, 3).join(', ')}`);
      }
    }
  }

  if (businessContext.competitors && businessContext.competitors.length > 0) {
    contextParts.push(`Competitors: ${businessContext.competitors.join(', ')}`);
  }

  if (contextParts.length === 0) {
    return '';
  }

  return `
BUSINESS CONTEXT:
${contextParts.join('\n')}

Use this business context to create personalized, relevant content that:
1. Aligns with the business's industry and target audience
2. Addresses their specific goals and challenges
3. Reflects their unique value proposition
4. Speaks in a tone appropriate for their business model
5. Incorporates relevant industry knowledge and terminology

Ensure all content feels authentic to this specific business and would resonate with their target audience.
`;
}

export function getPersonalizedTone(businessContext: BusinessContext | null, defaultTone: string): string {
  if (!businessContext) {
    return defaultTone;
  }

  // Suggest tone based on industry and business model
  const industry = businessContext.industry?.toLowerCase() || '';
  const businessModel = businessContext.businessModel?.toLowerCase() || '';

  if (industry.includes('fintech') || industry.includes('healthcare')) {
    return 'professional';
  }

  if (industry.includes('ai') || industry.includes('saas') || industry.includes('productivity')) {
    return 'authoritative';
  }

  if (industry.includes('education') || industry.includes('consulting')) {
    return 'educational';
  }

  if (businessModel.includes('b2c') || industry.includes('ecommerce')) {
    return 'friendly';
  }

  if (businessModel.includes('marketplace') || industry.includes('community')) {
    return 'conversational';
  }

  return defaultTone;
}

export function getPersonalizedAudience(businessContext: BusinessContext | null, defaultAudience: string): string {
  if (!businessContext || !businessContext.targetAudience) {
    return defaultAudience;
  }

  const targetAudience = businessContext.targetAudience.toLowerCase();

  if (targetAudience.includes('developer') || targetAudience.includes('engineer')) {
    return 'developers';
  }

  if (targetAudience.includes('entrepreneur') || targetAudience.includes('founder')) {
    return 'entrepreneurs';
  }

  if (targetAudience.includes('marketer') || targetAudience.includes('marketing')) {
    return 'marketers';
  }

  if (targetAudience.includes('designer')) {
    return 'designers';
  }

  if (targetAudience.includes('business owner') || targetAudience.includes('small business')) {
    return 'business-owners';
  }

  if (targetAudience.includes('student') || targetAudience.includes('learner')) {
    return 'students';
  }

  return 'professionals';
}

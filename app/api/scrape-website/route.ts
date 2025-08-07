import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { load } from 'cheerio';

interface WebsiteData {
  title?: string;
  description?: string;
  keywords?: string[];
  headings: string[];
  content: string;
  images: string[];
  links: string[];
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  technologies: string[];
  pricing?: {
    hasPricing: boolean;
    plans?: string[];
  };
  features: string[];
}

async function scrapeWebsite(url: string): Promise<WebsiteData> {
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = load(html);

    // Extract basic meta information
    const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || '';
    
    // Extract keywords
    const keywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()) || [];

    // Extract headings
    const headings: string[] = [];
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 200) {
        headings.push(text);
      }
    });

    // Extract main content (paragraphs, excluding navigation and footer)
    const contentParts: string[] = [];
    $('main p, article p, .content p, [role="main"] p').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 20 && text.length < 500) {
        contentParts.push(text);
      }
    });
    
    // Fallback to all paragraphs if no main content found
    if (contentParts.length === 0) {
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20 && text.length < 500) {
          contentParts.push(text);
        }
      });
    }

    const content = contentParts.slice(0, 10).join(' '); // Limit content

    // Extract images
    const images: string[] = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && (src.startsWith('http') || src.startsWith('//'))) {
        images.push(src);
      }
    });

    // Extract internal links
    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        const fullLink = new URL(href, url).href;
        links.push(fullLink);
      }
    });

    // Extract social media links
    const socialLinks: WebsiteData['socialLinks'] = {};
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.includes('twitter.com/') || href.includes('x.com/')) {
        socialLinks.twitter = href;
      } else if (href.includes('linkedin.com/')) {
        socialLinks.linkedin = href;
      } else if (href.includes('facebook.com/')) {
        socialLinks.facebook = href;
      } else if (href.includes('instagram.com/')) {
        socialLinks.instagram = href;
      }
    });

    // Detect technologies (basic detection)
    const technologies: string[] = [];
    const htmlLower = html.toLowerCase();
    
    if (htmlLower.includes('react')) technologies.push('React');
    if (htmlLower.includes('vue')) technologies.push('Vue.js');
    if (htmlLower.includes('angular')) technologies.push('Angular');
    if (htmlLower.includes('nextjs') || htmlLower.includes('next.js')) technologies.push('Next.js');
    if (htmlLower.includes('gatsby')) technologies.push('Gatsby');
    if (htmlLower.includes('wordpress')) technologies.push('WordPress');
    if (htmlLower.includes('shopify')) technologies.push('Shopify');
    if (htmlLower.includes('stripe')) technologies.push('Stripe');
    if (htmlLower.includes('vercel')) technologies.push('Vercel');
    if (htmlLower.includes('netlify')) technologies.push('Netlify');

    // Check for pricing information
    const pricingKeywords = ['pricing', 'plans', 'subscribe', 'purchase', 'buy now', 'get started'];
    const hasPricing = pricingKeywords.some(keyword => 
      htmlLower.includes(keyword) || 
      $('a, button').text().toLowerCase().includes(keyword)
    );

    const plans: string[] = [];
    if (hasPricing) {
      $('[class*="plan"], [class*="pricing"], [id*="plan"], [id*="pricing"]').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length < 100) {
          plans.push(text);
        }
      });
    }

    // Extract features (look for bullet points, feature lists)
    const features: string[] = [];
    $('ul li, ol li, [class*="feature"], [class*="benefit"]').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 10 && text.length < 200 && !text.includes('@')) {
        features.push(text);
      }
    });

    return {
      title,
      description,
      keywords,
      headings: headings.slice(0, 10),
      content,
      images: images.slice(0, 5),
      links: links.slice(0, 10),
      socialLinks,
      technologies,
      pricing: {
        hasPricing,
        plans: plans.slice(0, 5),
      },
      features: features.slice(0, 15),
    };

  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { website } = await request.json();

    if (!website) {
      return NextResponse.json({ error: 'Website URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(website.startsWith('http') ? website : `https://${website}`);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Scrape the website
    const websiteData = await scrapeWebsite(website);

    // Find or create user's business profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businessProfile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update or create business profile with scraped data
    const businessProfile = await prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: {
        website,
        websiteData: websiteData as any,
        lastScrapedAt: new Date(),
        // Auto-fill some fields from scraped data
        businessName: websiteData.title || undefined,
        description: websiteData.description || undefined,
        socialMediaLinks: websiteData.socialLinks as any,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        website,
        websiteData: websiteData as any,
        lastScrapedAt: new Date(),
        businessName: websiteData.title || undefined,
        description: websiteData.description || undefined,
        socialMediaLinks: websiteData.socialLinks as any,
      },
    });

    return NextResponse.json({
      success: true,
      data: websiteData,
      businessProfile,
    });

  } catch (error) {
    console.error('Error in scrape-website API:', error);
    return NextResponse.json(
      { error: 'Failed to scrape website' },
      { status: 500 }
    );
  }
}

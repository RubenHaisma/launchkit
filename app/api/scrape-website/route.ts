import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TokenManager } from '@/lib/token-manager'
import * as cheerio from 'cheerio'

interface WebsiteData {
  title?: string
  description?: string
  content?: string
  keywords?: string[]
  links?: string[]
  images?: string[]
  socialMedia?: {
    twitter?: string
    linkedin?: string
    facebook?: string
  }
  businessInfo?: {
    industry?: string
    location?: string
    services?: string[]
  }
}

interface ScrapeRequest {
  url: string
  updateProfile?: boolean
}

async function scrapeWebsite(url: string): Promise<WebsiteData> {
  try {
    // Validate URL
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol')
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LaunchPilot/1.0; +https://launchpilot.ai)'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract basic metadata
    const title = $('title').text().trim() || 
                 $('meta[property="og:title"]').attr('content') || 
                 $('h1').first().text().trim()

    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       $('meta[name="twitter:description"]').attr('content')

    // Extract main content
    const content = $('main, article, .content, #content')
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 2000) // Limit content length

    // Extract keywords
    const keywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()) || []

    // Extract links
    const links: string[] = []
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && (href.startsWith('http') || href.startsWith('/'))) {
        links.push(href)
      }
    })

    // Extract images
    const images: string[] = []
    $('img[src]').each((_, el) => {
      const src = $(el).attr('src')
      if (src) {
        images.push(src)
      }
    })

    // Extract social media links
    const socialMedia: WebsiteData['socialMedia'] = {}
    $('a[href*="twitter.com"], a[href*="x.com"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href) socialMedia.twitter = href
    })
    $('a[href*="linkedin.com"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href) socialMedia.linkedin = href
    })
    $('a[href*="facebook.com"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href) socialMedia.facebook = href
    })

    // Try to extract business information
    const businessInfo: WebsiteData['businessInfo'] = {}
    
    // Look for industry indicators
    const industryKeywords = ['saas', 'software', 'consulting', 'agency', 'startup', 'tech', 'marketing', 'design']
    const pageText = $('body').text().toLowerCase()
    for (const keyword of industryKeywords) {
      if (pageText.includes(keyword)) {
        businessInfo.industry = keyword
        break
      }
    }

    // Look for location information
    const locationPattern = /(?:based|located|headquarters|office)\s+(?:in|at)\s+([^.]+)/i
    const locationMatch = pageText.match(locationPattern)
    if (locationMatch) {
      businessInfo.location = locationMatch[1].trim()
    }

    // Extract services (look for common service indicators)
    const services: string[] = []
    const serviceSelectors = [
      'ul li:contains("service")',
      'ul li:contains("offer")',
      '.services li',
      '.offerings li'
    ]
    
    serviceSelectors.forEach(selector => {
      $(selector).each((_, el) => {
        const service = $(el).text().trim()
        if (service && service.length < 100) {
          services.push(service)
        }
      })
    })
    
    if (services.length > 0) {
      businessInfo.services = services.slice(0, 10) // Limit to 10 services
    }

    return {
      title,
      description,
      content,
      keywords,
      links: links.slice(0, 50), // Limit links
      images: images.slice(0, 20), // Limit images
      socialMedia,
      businessInfo
    }

  } catch (error) {
    console.error('Website scraping error:', error)
    throw new Error('Failed to scrape website')
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ScrapeRequest = await request.json()
    const { url, updateProfile = false } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ 
        error: 'Valid URL is required' 
      }, { status: 400 })
    }

    // Check and use tokens for website scraping
    const tokenResult = await TokenManager.useTokens(
      session.user.id, 
      'website-scraping', 
      1,
      {
        provider: 'website-scraper',
        model: 'cheerio-parser',
        endpoint: '/api/scrape-website'
      }
    )
    
    if (!tokenResult.success) {
      return NextResponse.json({ 
        error: tokenResult.error || 'Insufficient tokens',
        code: 'INSUFFICIENT_TOKENS',
        upgradeRequired: tokenResult.upgradeRequired
      }, { status: 402 })
    }

    // Scrape the website
    const websiteData = await scrapeWebsite(url)

    // Update business profile if requested
    if (updateProfile && websiteData) {
      await prisma.businessProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          website: url,
          websiteData: websiteData as any,
          lastScrapedAt: new Date(),
          businessName: websiteData.title,
          description: websiteData.description,
          industry: websiteData.businessInfo?.industry,
          location: websiteData.businessInfo?.location,
          socialMediaLinks: websiteData.socialMedia as any
        },
        update: {
          website: url,
          websiteData: websiteData as any,
          lastScrapedAt: new Date(),
          businessName: websiteData.title || undefined,
          description: websiteData.description || undefined,
          industry: websiteData.businessInfo?.industry || undefined,
          location: websiteData.businessInfo?.location || undefined,
          socialMediaLinks: websiteData.socialMedia as any || undefined
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: websiteData,
      tokensUsed: tokenResult.tokensUsed,
      message: updateProfile ? 'Website scraped and profile updated' : 'Website scraped successfully'
    })

  } catch (error) {
    console.error('Scrape website API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape website' 
      },
      { status: 500 }
    )
  }
}
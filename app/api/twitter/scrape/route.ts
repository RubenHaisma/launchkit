import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { scrapeTwitterProfile } from '@/lib/twitter-scraper';
import { scrapeRateLimiter } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check rate limiting
    const rateLimitResult = scrapeRateLimiter.isAllowed(session.user.id);
    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime!);
      return NextResponse.json({ 
        error: 'Rate limit exceeded. Please try again later.',
        resetTime: resetTime.toISOString(),
        remainingRequests: 0
      }, { status: 429 });
    }

    const body = await request.json();
    const { twitterHandle, forceRefresh = false } = body;

    if (!twitterHandle) {
      return NextResponse.json({ error: 'Twitter handle is required' }, { status: 400 });
    }

    // Get the user's business profile to store/update the Twitter handle
    const businessProfile = await prisma.businessProfile.upsert({
      where: { userId: session.user.id },
      update: { twitterHandle },
      create: {
        userId: session.user.id,
        twitterHandle,
        isSetupComplete: false,
      },
    });

    // Check if we have recent data and don't need to scrape again (unless forced)
    if (!forceRefresh) {
      const recentTweets = await prisma.tweet.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      const lastScrapedAt = businessProfile.lastScrapedAt;
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      if (recentTweets.length > 0 && lastScrapedAt && lastScrapedAt > oneHourAgo) {
        return NextResponse.json({ 
          success: true, 
          tweets: recentTweets,
          fromCache: true 
        });
      }
    }

    try {
      // Get credentials from environment variables
      const credentials = {
        username: process.env.TWITTER_USERNAME || '',
        password: process.env.TWITTER_PASSWORD || ''
      };

      if (!credentials.username || !credentials.password) {
        throw new Error('Twitter credentials not configured. Please set TWITTER_USERNAME and TWITTER_PASSWORD environment variables.');
      }

      // Scrape tweets from Twitter/X profile using real scraper
      const scrapedTweets = await scrapeTwitterProfile(twitterHandle, {
        maxTweets: 10,
        headless: true,
        timeout: 30000,
        retries: 2,
        credentials
      });
      
      // Store the scraped tweets in the database
      const savedTweets = [];
      for (const tweet of scrapedTweets) {
        try {
          const existingTweet = await prisma.tweet.findFirst({
            where: {
              userId: session.user.id,
              content: tweet.content,
            },
          });

          if (!existingTweet) {
            const savedTweet = await prisma.tweet.create({
              data: {
                userId: session.user.id,
                content: tweet.content,
                tweetUrl: tweet.url,
                published: true,
                publishedAt: tweet.publishedAt,
                views: tweet.stats.views,
                likes: tweet.stats.likes,
                retweets: tweet.stats.retweets,
                replies: tweet.stats.replies,
                isGenerated: false,
              },
            });
            savedTweets.push(savedTweet);
          } else {
            // Update existing tweet with latest stats
            const updatedTweet = await prisma.tweet.update({
              where: { id: existingTweet.id },
              data: {
                views: tweet.stats.views,
                likes: tweet.stats.likes,
                retweets: tweet.stats.retweets,
                replies: tweet.stats.replies,
                tweetUrl: tweet.url,
              },
            });
            savedTweets.push(updatedTweet);
          }
        } catch (error) {
          console.error('Error saving tweet:', error);
        }
      }

      // Update the last scraped time
      await prisma.businessProfile.update({
        where: { userId: session.user.id },
        data: { lastScrapedAt: new Date() },
      });

      return NextResponse.json({ 
        success: true, 
        tweets: savedTweets,
        scraped: savedTweets.length,
        fromCache: false,
        remainingRequests: scrapeRateLimiter.getRemainingRequests(session.user.id)
      });

    } catch (scrapeError) {
      console.error('Scraping error:', scrapeError);
      
      // Return existing tweets if scraping fails
      const existingTweets = await prisma.tweet.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      // Determine error message based on error type
      let errorMessage = 'Failed to scrape tweets';
      if (scrapeError instanceof Error) {
        if (scrapeError.message.includes('timeout')) {
          errorMessage = 'Scraping timed out - Twitter may be slow or blocking requests';
        } else if (scrapeError.message.includes('Navigation')) {
          errorMessage = 'Could not access Twitter profile - it may be private or suspended';
        } else if (scrapeError.message.includes('blocked')) {
          errorMessage = 'Twitter blocked the scraping request - try again later';
        }
      }

      return NextResponse.json({ 
        success: false, 
        error: errorMessage,
        tweets: existingTweets,
        fromCache: true,
        remainingRequests: scrapeRateLimiter.getRemainingRequests(session.user.id)
      }, { status: existingTweets.length > 0 ? 200 : 500 });
    }

  } catch (error) {
    console.error('Twitter scrape error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scrape Twitter profile' },
      { status: 500 }
    );
  }
}
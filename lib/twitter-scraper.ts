  import puppeteer, { Browser, Page, LaunchOptions } from 'puppeteer';
import { LRUCache } from 'lru-cache';

export interface ScrapedTweet {
  content: string;
  url: string;
  publishedAt: Date;
  stats: {
    views?: number;
    likes: number;
    retweets: number;
    replies: number;
  };
}

export interface ScrapingOptions {
  maxTweets?: number;
  headless?: boolean;
  timeout?: number;
  retries?: number;
  credentials?: {
    username: string;
    password: string;
  };
}

class TwitterScraper {
  private browser: Browser | null = null;
  private cache: LRUCache<string, ScrapedTweet[]>;

  constructor() {
    this.cache = new LRUCache({
      max: 100,
      ttl: 1000 * 60 * 60, // 1 hour cache
    });
  }

  async initBrowser(options: ScrapingOptions = {}): Promise<Browser> {
    if (this.browser?.connected) {
      return this.browser;
    }

    const launchOptions: LaunchOptions = {
      headless: options.headless ?? true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
      defaultViewport: { width: 1280, height: 720 },
    };

    this.browser = await puppeteer.launch(launchOptions);
    return this.browser;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async setupPage(page: Page): Promise<void> {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'stylesheet', 'media', 'font'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  private parseRelativeTime(timeText: string): Date {
    const now = new Date();
    const text = timeText.toLowerCase().trim();

    if (text.includes('now') || text.includes('just')) {
      return now;
    }

    const match = text.match(/(\d+)([smhdw])/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        w: 7 * 24 * 60 * 60 * 1000,
      };
      return new Date(now.getTime() - value * multipliers[unit]);
    }

    // Try parsing as a date directly
    try {
      const parsed = new Date(text);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch {
      // Fall through to return now
    }

    return now;
  }

  private parseEngagementNumber(text: string | null): number {
    if (!text) return 0;
    const cleanText = text.toLowerCase().replace(/,/g, '');
    const num = parseFloat(cleanText);

    if (cleanText.includes('k')) return Math.floor(num * 1000);
    if (cleanText.includes('m')) return Math.floor(num * 1000000);
    return Math.floor(num) || 0;
  }

  private async login(page: Page, credentials: { username: string; password: string }): Promise<boolean> {
    try {
      console.log('Attempting to login to X.com...');
      await page.goto('https://x.com/login', { waitUntil: 'networkidle2', timeout: 15000 });
      
      // Wait for username field and type username
      console.log('Waiting for username field...');
      await page.waitForSelector('input[name="text"]', { timeout: 10000 });
      console.log('Typing username...');
      await page.type('input[name="text"]', credentials.username, { delay: 100 });
      
      // Find and click the "Next" button
      console.log('Looking for Next button...');
      await page.waitForSelector('[role="button"]', { timeout: 10000 });
      
      // Try different approaches to find the Next button
      let nextClicked = false;
      
      // Method 1: Look for button with "Next" text
      const nextButtons = await page.$$('[role="button"]');
      for (const button of nextButtons) {
        const text = await page.evaluate(el => el.textContent?.trim(), button);
        console.log('Found button with text:', text);
        if (text?.includes('Next')) {
          console.log('Clicking Next button...');
          await button.click();
          nextClicked = true;
          break;
        }
      }
      
      // Method 2: If no Next button found, try common selectors
      if (!nextClicked) {
        const commonSelectors = [
          'button[type="submit"]',
          '[data-testid="LoginForm_Login_Button"]',
          'button:has-text("Next")'
        ];
        
        for (const selector of commonSelectors) {
          try {
            await page.click(selector);
            nextClicked = true;
            console.log(`Clicked using selector: ${selector}`);
            break;
          } catch (e) {
            // Continue to next selector
          }
        }
      }
      
      if (!nextClicked) {
        throw new Error('Could not find or click Next button');
      }
      
      // Wait for password field and type password
      console.log('Waiting for password field...');
      await page.waitForSelector('input[name="password"]', { timeout: 10000 });
      console.log('Typing password...');
      await page.type('input[name="password"]', credentials.password, { delay: 100 });
      
      // Find and click the "Log in" button
      console.log('Looking for Login button...');
      await page.waitForSelector('[role="button"]', { timeout: 10000 });
      
      let loginClicked = false;
      const loginButtons = await page.$$('[role="button"]');
      
      for (const button of loginButtons) {
        const text = await page.evaluate(el => el.textContent?.trim(), button);
        console.log('Found login button with text:', text);
        if (text?.includes('Log in') || text?.includes('Sign in')) {
          console.log('Clicking Login button...');
          await button.click();
          loginClicked = true;
          break;
        }
      }
      
      if (!loginClicked) {
        // Try pressing Enter on password field
        await page.keyboard.press('Enter');
        console.log('Pressed Enter on password field');
      }
      
      // Wait for navigation and check if login was successful
      console.log('Waiting for login to complete...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check if we're on the home page or if login was successful
      const currentUrl = page.url();
      console.log('Current URL after login attempt:', currentUrl);
      
      const isLoggedIn = currentUrl.includes('/home') || 
                        currentUrl === 'https://x.com/' ||
                        await page.$('[data-testid="AppTabBar_Profile_Link"]') !== null;

      if (isLoggedIn) {
        console.log('Login successful!');
        return true;
      } else {
        console.warn('Login may have failed - checking for errors...');
        
        // Check for error messages
        const pageText = await page.evaluate(() => document.body.textContent || '');
        
        if (pageText.includes('verification') || pageText.includes('2FA') || pageText.includes('code')) {
          console.error('2FA detected - this scraper doesn\'t support 2FA accounts');
          return false;
        }
        
        if (pageText.includes('incorrect') || pageText.includes('wrong') || pageText.includes('invalid')) {
          console.error('Login credentials appear to be incorrect');
          return false;
        }
        
        if (pageText.includes('suspended') || pageText.includes('locked')) {
          console.error('Account appears to be suspended or locked');
          return false;
        }
        
        console.error('Login failed for unknown reason. Current URL:', currentUrl);
        return false;
      }
      
    } catch (error) {
      console.error('Login attempt failed:', error);
      return false;
    }
  }

  async scrapeProfile(handle: string, options: ScrapingOptions = {}): Promise<ScrapedTweet[]> {
    const {
      maxTweets = 10,
      headless = true,
      timeout = 30000,
      retries = 2,
      credentials
    } = options;

    const cacheKey = `${handle}:${maxTweets}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let attempt = 0;
    while (attempt < retries) {
      try {
        const tweets = await this.attemptScrape(handle, maxTweets, headless, timeout, credentials);
        this.cache.set(cacheKey, tweets);
        return tweets;
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt}/${retries} failed:`, error);
        
        if (attempt >= retries) {
          throw new Error(`Failed to scrape after ${retries} attempts: ${error}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000 * Math.pow(2, attempt)));
      }
    }

    return [];
  }

  private async attemptScrape(
    handle: string,
    maxTweets: number,
    headless: boolean,
    timeout: number,
    credentials?: { username: string; password: string }
  ): Promise<ScrapedTweet[]> {
    const browser = await this.initBrowser({ headless });
    const page = await browser.newPage();
    
    try {
      await this.setupPage(page);

      // Login if credentials provided
      if (credentials) {
        const loginSuccess = await this.login(page, credentials);
        if (!loginSuccess) {
          throw new Error('Login failed - cannot scrape without authentication');
        }
      }

      const cleanHandle = handle.replace('@', '');
      const profileUrl = `https://x.com/${cleanHandle}`;
      await page.goto(profileUrl, { waitUntil: 'networkidle2', timeout });

      // Check for error states or protected accounts
      const hasError = await page.evaluate(() => {
        const errorMessages = [
          'This account doesn\'t exist',
          'Account suspended',
          'These Tweets are protected',
          'No posts yet',
          'User has been suspended'
        ];
        
        const bodyText = document.body.textContent || '';
        return errorMessages.some(msg => bodyText.includes(msg));
      });

      if (hasError) {
        console.warn(`Cannot access tweets for ${cleanHandle} - account may be private, suspended, or doesn't exist`);
        return [];
      }

      // Wait for tweets with fallback selectors
      const tweetSelector = '[data-testid="tweet"], article[role="article"]';
      await page.waitForSelector(tweetSelector, { timeout: 15000 }).catch((error) => {
        console.error('Tweet selector timeout:', error);
        throw error;
      });

      await this.scrollToLoadTweets(page, maxTweets);

      const tweets = await page.evaluate((maxTweets, cleanHandle) => {
        const tweetElements = Array.from(document.querySelectorAll('[data-testid="tweet"], article[role="article"]'));
        const tweets: any[] = [];

        for (const tweetElement of tweetElements.slice(0, maxTweets)) {
          try {
            // Get tweet content
            const tweetTextElement = tweetElement.querySelector('[data-testid="tweetText"], div[lang]');
            const content = tweetTextElement?.textContent?.trim() || '';
            if (!content) continue;

            // Get tweet URL and time
            const timeElement = tweetElement.querySelector('time');
            const timeText = timeElement?.textContent || '';
            const href = timeElement?.closest('a')?.getAttribute('href') || '';
            const tweetId = href.split('/').pop() || '';
            const url = `https://x.com/${cleanHandle}/status/${tweetId}`;

            // Get engagement metrics
            const engagementGroup = tweetElement.querySelector('[role="group"]');
            const getMetric = (selector: string) => {
              const element = engagementGroup?.querySelector(selector);
              return element?.textContent || '0';
            };

            tweets.push({
              content,
              url,
              timeText,
              stats: {
                likes: getMetric('[data-testid*="like"]'),
                retweets: getMetric('[data-testid*="retweet"]'),
                replies: getMetric('[data-testid*="reply"]'),
                views: getMetric('[data-testid*="impressions"]'),
              },
            });
          } catch (error) {
            console.error('Error parsing tweet:', error);
          }
        }

        return tweets;
      }, maxTweets, cleanHandle);

      return tweets.map(tweet => ({
        content: tweet.content,
        url: tweet.url,
        publishedAt: this.parseRelativeTime(tweet.timeText),
        stats: {
          views: this.parseEngagementNumber(tweet.stats.views),
          likes: this.parseEngagementNumber(tweet.stats.likes),
          retweets: this.parseEngagementNumber(tweet.stats.retweets),
          replies: this.parseEngagementNumber(tweet.stats.replies),
        },
      }));
    } finally {
      await page.close();
    }
  }

  private async scrollToLoadTweets(page: Page, maxTweets: number): Promise<void> {
    let previousTweetCount = 0;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const currentTweetCount = await page.evaluate(() => 
        document.querySelectorAll('[data-testid="tweet"], article[role="article"]').length
      );

      if (currentTweetCount >= maxTweets || currentTweetCount === previousTweetCount) {
        break;
      }

      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      previousTweetCount = currentTweetCount;
      attempts++;
    }
  }
}

export const twitterScraper = new TwitterScraper();

export async function scrapeTwitterProfile(handle: string, options?: ScrapingOptions): Promise<ScrapedTweet[]> {
  try {
    return await twitterScraper.scrapeProfile(handle, options);
  } catch (error) {
    console.error('Twitter scraping failed:', error);
    throw error;
  } finally {
    await twitterScraper.closeBrowser();
  }
}
export const SCRAPER_CONFIG = {
  // Browser settings
  HEADLESS: process.env.NODE_ENV === 'production',
  TIMEOUT: 30000, // 30 seconds
  MAX_TWEETS: 10,
  RETRIES: 2,
  
  // Rate limiting
  MAX_REQUESTS_PER_WINDOW: 5,
  RATE_LIMIT_WINDOW_MS: 10 * 60 * 1000, // 10 minutes
  
  // Selectors (may need updating if Twitter changes their HTML structure)
  SELECTORS: {
    TWEET: '[data-testid="tweet"]',
    TWEET_TEXT: '[data-testid="tweetText"]',
    TIME: 'time',
    ENGAGEMENT_GROUP: '[role="group"]',
    LIKE_BUTTON: '[data-testid*="like"]',
    RETWEET_BUTTON: '[data-testid*="retweet"]',
    REPLY_BUTTON: '[data-testid*="reply"]',
  },
  
  // User agent strings to rotate
  USER_AGENTS: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ],
  
  // Development settings
  DEBUG: process.env.NODE_ENV === 'development',
};

export function getRandomUserAgent(): string {
  return SCRAPER_CONFIG.USER_AGENTS[
    Math.floor(Math.random() * SCRAPER_CONFIG.USER_AGENTS.length)
  ];
}
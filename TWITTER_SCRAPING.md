# Twitter Scraping Setup

This application includes functionality to scrape Twitter/X profiles for real tweet data. Due to Twitter's requirement for authentication, you'll need to provide login credentials.

## Environment Variables

Add these environment variables to your `.env.local` file:

```env
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
```

## Important Notes

1. **Account Requirements**: 
   - Use a regular Twitter/X account (not a business/developer account)
   - 2FA should be disabled for scraping to work
   - Account should not be rate-limited or restricted

2. **Security Considerations**:
   - Consider using a dedicated account for scraping
   - Keep credentials secure and never commit them to version control
   - The scraper respects rate limits to avoid getting the account banned

3. **Limitations**:
   - Cannot scrape private/protected accounts
   - May be blocked by Twitter's anti-bot measures
   - Rate limited to 5 requests per 10 minutes per user

## How It Works

1. The scraper launches a headless Chrome browser
2. Logs into Twitter using provided credentials
3. Navigates to the specified profile
4. Extracts tweet content, timestamps, and engagement metrics
5. Returns structured data for storage in the database

## Troubleshooting

- **Login fails**: Check credentials, disable 2FA
- **Rate limited**: Wait and try again later
- **Account suspended**: Twitter detected automated behavior
- **No tweets found**: Profile may be private or suspended

## Alternative Approaches

If scraping proves unreliable, consider:
- Twitter API v2 (requires developer approval)
- Third-party APIs like RapidAPI
- Manual CSV export from Twitter Analytics
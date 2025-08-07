/**
 * Smart Twitter Thread Formatter
 * Converts long content into properly formatted Twitter threads with optimal structure
 */

export interface ThreadTweet {
  id: number;
  content: string;
  charCount: number;
  isHook: boolean;
  isCTA: boolean;
  hashtags?: string[];
}

export interface FormattedThread {
  tweets: ThreadTweet[];
  totalTweets: number;
  totalChars: number;
  estimatedEngagement: number;
  copyText: string; // Ready-to-paste thread format
}

const TWEET_MAX_CHARS = 280;
const OPTIMAL_TWEET_CHARS = 250; // Leave room for thread numbering
const THREAD_NUMBERING_CHARS = 6; // "1/X " format

/**
 * Smart content splitter that respects sentence boundaries and optimal lengths
 */
function smartSplit(content: string, maxLength: number): string[] {
  if (content.length <= maxLength) {
    return [content];
  }

  const sentences = content.split(/[.!?]\s+/).filter(s => s.trim());
  const chunks: string[] = [];
  let currentChunk = '';

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    const punctuation = content.match(new RegExp(sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([.!?])'));
    const sentenceWithPunct = sentence + (punctuation ? punctuation[1] : '.');
    
    // Check if adding this sentence would exceed the limit
    const potentialChunk = currentChunk 
      ? `${currentChunk} ${sentenceWithPunct}`
      : sentenceWithPunct;

    if (potentialChunk.length <= maxLength) {
      currentChunk = potentialChunk;
    } else {
      // If current chunk is empty and sentence is too long, force split
      if (!currentChunk) {
        chunks.push(...forceSplit(sentenceWithPunct, maxLength));
      } else {
        chunks.push(currentChunk);
        currentChunk = sentenceWithPunct;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Force split very long sentences at word boundaries
 */
function forceSplit(text: string, maxLength: number): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of words) {
    const potentialChunk = currentChunk ? `${currentChunk} ${word}` : word;
    
    if (potentialChunk.length <= maxLength) {
      currentChunk = potentialChunk;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = word;
      } else {
        // Single word is too long - truncate it
        chunks.push(word.substring(0, maxLength - 3) + '...');
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Extract and optimize hashtags for threads
 */
function optimizeHashtags(hashtags: string[] = [], tweetIndex: number, totalTweets: number): string[] {
  if (!hashtags.length) return [];
  
  // Use fewer hashtags in middle tweets, more in first and last
  if (tweetIndex === 0) {
    return hashtags.slice(0, 2); // Hook tweet - keep it clean
  } else if (tweetIndex === totalTweets - 1) {
    return hashtags.slice(0, 5); // Last tweet - can have more hashtags
  } else {
    return hashtags.slice(0, 1); // Middle tweets - minimal hashtags
  }
}

/**
 * Enhance hook tweet for maximum engagement
 */
function enhanceHookTweet(content: string): string {
  // Add thread indicator if not present
  if (!content.includes('🧵') && !content.includes('thread') && !content.includes('Thread')) {
    // Check if it ends with a hook question or statement
    if (content.endsWith('?') || content.endsWith(':') || content.includes('Here\'s')) {
      return `${content} 🧵`;
    } else {
      return `${content}\n\nThread 🧵`;
    }
  }
  return content;
}

/**
 * Add call-to-action to final tweet
 */
function enhanceFinalTweet(content: string, hasHashtags: boolean): string {
  const ctas = [
    "\n\nFound this helpful? Retweet to share with others!",
    "\n\nWhat are your thoughts? Drop a comment below!",
    "\n\nLike this? Follow for more content like this!",
    "\n\nRetweet if this resonates with you!",
    "\n\nThoughts? Let me know in the replies!"
  ];
  
  // Choose CTA based on content length and hashtags
  const availableSpace = OPTIMAL_TWEET_CHARS - content.length - (hasHashtags ? 20 : 0);
  const suitableCTAs = ctas.filter(cta => cta.length <= availableSpace);
  
  if (suitableCTAs.length > 0) {
    const randomCTA = suitableCTAs[Math.floor(Math.random() * suitableCTAs.length)];
    return content + randomCTA;
  }
  
  return content;
}

/**
 * Format content as a Twitter thread with smart structure
 */
export function formatAsTwitterThread(
  content: string, 
  hashtags: string[] = [],
  options: {
    addNumbers?: boolean;
    enhanceHook?: boolean;
    addCTA?: boolean;
    maxTweetsPerThread?: number;
  } = {}
): FormattedThread {
  const {
    addNumbers = true,
    enhanceHook = true,
    addCTA = true,
    maxTweetsPerThread = 25
  } = options;

  // Calculate max content length per tweet (accounting for numbering)
  const maxContentLength = addNumbers 
    ? OPTIMAL_TWEET_CHARS - THREAD_NUMBERING_CHARS 
    : OPTIMAL_TWEET_CHARS;

  // Split content into chunks
  let chunks = smartSplit(content, maxContentLength);
  
  // Respect max tweets limit
  if (chunks.length > maxTweetsPerThread) {
    chunks = chunks.slice(0, maxTweetsPerThread);
    chunks[chunks.length - 1] += "... (continued)";
  }

  const totalTweets = chunks.length;
  const tweets: ThreadTweet[] = [];

  chunks.forEach((chunk, index) => {
    let tweetContent = chunk;
    const isFirst = index === 0;
    const isLast = index === totalTweets - 1;
    
    // Enhance hook tweet
    if (isFirst && enhanceHook) {
      tweetContent = enhanceHookTweet(tweetContent);
    }
    
    // Add hashtags strategically
    const tweetHashtags = optimizeHashtags(hashtags, index, totalTweets);
    if (tweetHashtags.length > 0) {
      const hashtagString = tweetHashtags.join(' ');
      const availableSpace = OPTIMAL_TWEET_CHARS - tweetContent.length - (addNumbers ? THREAD_NUMBERING_CHARS : 0);
      
      if (hashtagString.length + 2 <= availableSpace) { // +2 for "\n\n"
        tweetContent += `\n\n${hashtagString}`;
      }
    }
    
    // Add CTA to final tweet
    if (isLast && addCTA && totalTweets > 1) {
      tweetContent = enhanceFinalTweet(tweetContent, tweetHashtags.length > 0);
    }
    
    // Add thread numbering
    if (addNumbers && totalTweets > 1) {
      tweetContent = `${index + 1}/${totalTweets} ${tweetContent}`;
    }

    tweets.push({
      id: index + 1,
      content: tweetContent,
      charCount: tweetContent.length,
      isHook: isFirst,
      isCTA: isLast && addCTA,
      hashtags: tweetHashtags
    });
  });

  // Calculate engagement prediction
  const estimatedEngagement = calculateThreadEngagement(tweets);
  
  // Generate copy-paste friendly format
  const copyText = generateCopyText(tweets);

  return {
    tweets,
    totalTweets,
    totalChars: tweets.reduce((sum, tweet) => sum + tweet.charCount, 0),
    estimatedEngagement,
    copyText
  };
}

/**
 * Calculate estimated engagement for the thread
 */
function calculateThreadEngagement(tweets: ThreadTweet[]): number {
  let score = 5; // Base score
  
  // Hook quality
  const hook = tweets[0];
  if (hook.content.includes('?')) score += 1;
  if (hook.content.includes('🧵')) score += 0.5;
  if (hook.isHook && hook.charCount < 200) score += 0.5;
  
  // Thread length optimization
  if (tweets.length >= 3 && tweets.length <= 7) score += 1;
  if (tweets.length > 10) score -= 0.5;
  
  // Content quality indicators
  const totalContent = tweets.map(t => t.content).join(' ');
  if (totalContent.includes('tips') || totalContent.includes('how to')) score += 1;
  if (tweets.some(t => t.hashtags && t.hashtags.length > 0)) score += 0.5;
  if (tweets[tweets.length - 1].isCTA) score += 0.5;
  
  // Engagement elements
  if (totalContent.includes('?')) score += 0.5;
  if (/[!🔥💡⚡🚀]/.test(totalContent)) score += 0.5;
  
  return Math.min(Math.max(Math.round(score * 10) / 10, 1), 10);
}

/**
 * Generate copy-paste friendly thread format
 */
function generateCopyText(tweets: ThreadTweet[]): string {
  return tweets.map((tweet, index) => {
    const separator = index === 0 ? '' : '\n\n---\n\n';
    return `${separator}${tweet.content}`;
  }).join('');
}

/**
 * Validate thread format and provide suggestions
 */
export function validateThread(thread: FormattedThread): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check tweet length limits
  const longTweets = thread.tweets.filter(t => t.charCount > TWEET_MAX_CHARS);
  if (longTweets.length > 0) {
    warnings.push(`${longTweets.length} tweet(s) exceed 280 characters`);
  }
  
  // Check thread length
  if (thread.totalTweets > 20) {
    warnings.push('Thread is very long - consider breaking into multiple threads');
  }
  
  if (thread.totalTweets < 3) {
    suggestions.push('Consider expanding content for better thread engagement');
  }
  
  // Check hook quality
  const hook = thread.tweets[0];
  if (!hook.content.includes('?') && !hook.content.includes('🧵')) {
    suggestions.push('Consider adding a question or thread indicator to the hook');
  }
  
  // Check if final tweet has CTA
  const finalTweet = thread.tweets[thread.tweets.length - 1];
  if (!finalTweet.isCTA && thread.totalTweets > 3) {
    suggestions.push('Consider adding a call-to-action to the final tweet');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions
  };
}

/**
 * Quick thread formatter for simple use cases
 */
export function quickThreadFormat(content: string, hashtags?: string[]): string {
  const thread = formatAsTwitterThread(content, hashtags);
  return thread.copyText;
}

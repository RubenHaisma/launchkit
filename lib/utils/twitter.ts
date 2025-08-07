export interface TwitterContent {
  text: string;
  isThread?: boolean;
  threadParts?: string[];
}

export const openTwitterIntent = (content: TwitterContent): void => {
  const { text, isThread, threadParts } = content;
  
  if (isThread && threadParts && threadParts.length > 1) {
    // For threads, open the first tweet and copy the rest to clipboard
    const firstTweet = threadParts[0];
    const remainingTweets = threadParts.slice(1);
    
    // Open Twitter with first tweet
    const encodedText = encodeURIComponent(firstTweet);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, '_blank');
    
    // Copy remaining tweets to clipboard
    if (remainingTweets.length > 0) {
      const threadText = threadParts.map((tweet, index) => 
        `${index + 1}/${threadParts.length}\n${tweet}`
      ).join('\n\n---\n\n');
      
      copyToClipboard(threadText);
    }
  } else {
    // Single tweet
    const encodedText = encodeURIComponent(text);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, '_blank');
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('Failed to copy to clipboard:', fallbackError);
      return false;
    }
  }
};

export const parseThreadContent = (content: string): TwitterContent => {
  // Split content by common thread indicators
  const threadSeparators = ['\n\n', '🧵', '/thread', 'Thread:', '1/', '2/', '3/'];
  
  // Check if content looks like a thread
  const hasThreadIndicators = threadSeparators.some(sep => 
    content.toLowerCase().includes(sep.toLowerCase())
  );
  
  if (hasThreadIndicators) {
    // Try to split into parts (simple heuristic)
    const parts = content.split(/\n\n+/).filter(part => part.trim().length > 0);
    
    if (parts.length > 1) {
      return {
        text: content,
        isThread: true,
        threadParts: parts.map(part => part.trim()),
      };
    }
  }
  
  return {
    text: content,
    isThread: false,
  };
};

export interface PostedTweet {
  id: string;
  content: string;
  timestamp: string;
  isThread: boolean;
  status: 'posted' | 'draft';
}

export const getPostedTweets = (): PostedTweet[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const tweets = localStorage.getItem('launchpilot-posted-tweets');
    return tweets ? JSON.parse(tweets) : [];
  } catch {
    return [];
  }
};

export const markTweetAsPosted = (tweetId: string, content: string, isThread: boolean = false): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const tweets = getPostedTweets();
    const newTweet: PostedTweet = {
      id: tweetId,
      content,
      timestamp: new Date().toISOString(),
      isThread,
      status: 'posted',
    };
    
    tweets.unshift(newTweet);
    
    // Keep only last 50 tweets
    const trimmedTweets = tweets.slice(0, 50);
    
    localStorage.setItem('launchpilot-posted-tweets', JSON.stringify(trimmedTweets));
  } catch (error) {
    console.error('Failed to save posted tweet:', error);
  }
};
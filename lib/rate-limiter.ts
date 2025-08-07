interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  
  // Rate limit: 5 requests per 10 minutes per user
  private readonly maxRequests = 5;
  private readonly windowMs = 10 * 60 * 1000; // 10 minutes

  isAllowed(userId: string): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const entry = this.limits.get(userId);

    // Clean up expired entries
    this.cleanup(now);

    if (!entry) {
      // First request for this user
      this.limits.set(userId, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true };
    }

    if (now >= entry.resetTime) {
      // Reset the counter
      this.limits.set(userId, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true };
    }

    if (entry.count < this.maxRequests) {
      // Within rate limit
      entry.count++;
      return { allowed: true };
    }

    // Rate limit exceeded
    return { allowed: false, resetTime: entry.resetTime };
  }

  private cleanup(now: number): void {
    for (const [userId, entry] of this.limits.entries()) {
      if (now >= entry.resetTime) {
        this.limits.delete(userId);
      }
    }
  }

  getRemainingRequests(userId: string): number {
    const entry = this.limits.get(userId);
    if (!entry || Date.now() >= entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }
}

export const scrapeRateLimiter = new RateLimiter();
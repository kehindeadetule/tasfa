// Client-side caching for voting data
export class VotingStatusCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl: number;

  constructor(ttl: number = 30000) {
    // Default 30 seconds
    this.ttl = ttl;
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < this.ttl) {
      return item.data;
    }
    return null;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  isExpired(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;
    return Date.now() - item.timestamp >= this.ttl;
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instances
export const votingStatusCache = new VotingStatusCache(30000); // 30 seconds for voting status
export const voteCountsCache = new VotingStatusCache(10000); // 10 seconds for vote counts

// Cache keys
export const CACHE_KEYS = {
  VOTING_STATUS: "voting-status",
  VOTE_COUNTS: "vote-counts",
} as const;

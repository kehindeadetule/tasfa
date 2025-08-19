// Enhanced Participant data caching with localStorage persistence and global state
interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  school: string;
  awardCategory: string;
  voteCount: number;
  image?: string;
}

interface CachedParticipantData {
  participants: Participant[];
  timestamp: number;
  category: string;
  lastFetchAttempt?: number;
  errorCount?: number;
}

interface GlobalCacheState {
  [category: string]: CachedParticipantData;
}

class ParticipantCache {
  private readonly STORAGE_KEY = "tasfa_participants_cache_v2";
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds
  private readonly ERROR_RETRY_DELAY = 30 * 1000; // 30 seconds for error retry
  private readonly MAX_ERROR_COUNT = 3;
  
  // Global state for runtime caching
  private globalCache: GlobalCacheState = {};
  private isInitialized = false;

  constructor() {
    this.initializeCache();
  }

  private initializeCache(): void {
    if (typeof window === "undefined" || this.isInitialized) return;

    try {
      // Clean up old cache versions
      this.cleanupOldCacheVersions();
      
      // Load existing cache from localStorage
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.globalCache = JSON.parse(stored);
        this.cleanupExpiredEntries();
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.warn("Failed to initialize participant cache:", error);
      this.globalCache = {};
      this.isInitialized = true;
    }
  }

  private cleanupOldCacheVersions(): void {
    const oldKeys = [
      "tasfa_participants_cache",
      "tasfa_participants_cache_v1",
    ];

    oldKeys.forEach((key) => {
      try {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // Silent cleanup
      }
    });
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    let hasChanges = false;

    Object.keys(this.globalCache).forEach((category) => {
      const data = this.globalCache[category];
      if (now - data.timestamp > this.CACHE_TTL) {
        delete this.globalCache[category];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.persistToStorage();
    }
  }

  private persistToStorage(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.globalCache));
    } catch (error) {
      console.warn("Failed to persist cache to localStorage:", error);
    }
  }

  // Get participants for a category with enhanced error handling
  getParticipants(category: string): Participant[] | null {
    this.initializeCache();

    try {
      const data = this.globalCache[category];
      if (!data) return null;

      const now = Date.now();
      
      // Check if cache is expired
      if (now - data.timestamp > this.CACHE_TTL) {
        delete this.globalCache[category];
        this.persistToStorage();
        return null;
      }

      // Check if we should retry after an error
      if (data.errorCount && data.errorCount >= this.MAX_ERROR_COUNT) {
        const timeSinceLastAttempt = data.lastFetchAttempt 
          ? now - data.lastFetchAttempt 
          : Infinity;
        
        if (timeSinceLastAttempt < this.ERROR_RETRY_DELAY) {
          return null; // Don't return stale data if we had recent errors
        }
      }

      return data.participants;
    } catch (error) {
      console.warn("Error getting cached participants:", error);
      return null;
    }
  }

  // Store participants for a category with enhanced metadata
  setParticipants(category: string, participants: Participant[]): void {
    this.initializeCache();

    try {
      this.globalCache[category] = {
        participants,
        timestamp: Date.now(),
        category,
        errorCount: 0, // Reset error count on successful fetch
        lastFetchAttempt: Date.now(),
      };

      this.persistToStorage();
    } catch (error) {
      console.warn("Failed to cache participants:", error);
    }
  }

  // Mark a fetch attempt (for error tracking)
  markFetchAttempt(category: string, success: boolean = true): void {
    this.initializeCache();

    try {
      if (!this.globalCache[category]) {
        this.globalCache[category] = {
          participants: [],
          timestamp: 0,
          category,
          errorCount: 0,
          lastFetchAttempt: Date.now(),
        };
      }

      this.globalCache[category].lastFetchAttempt = Date.now();
      
      if (!success) {
        this.globalCache[category].errorCount = 
          (this.globalCache[category].errorCount || 0) + 1;
      } else {
        this.globalCache[category].errorCount = 0;
      }

      this.persistToStorage();
    } catch (error) {
      console.warn("Failed to mark fetch attempt:", error);
    }
  }

  // Remove a specific category from cache
  removeCategory(category: string): void {
    this.initializeCache();

    try {
      delete this.globalCache[category];
      this.persistToStorage();
    } catch (error) {
      console.warn("Failed to remove category from cache:", error);
    }
  }

  // Clear all cached participants
  clearAll(): void {
    this.initializeCache();

    try {
      this.globalCache = {};
      this.persistToStorage();
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  }

  // Update vote count for a specific participant
  updateVoteCount(
    category: string,
    participantId: string,
    newVoteCount: number
  ): void {
    this.initializeCache();

    try {
      const data = this.globalCache[category];
      if (!data) return;

      // Update the vote count for the specific participant
      const updatedParticipants = data.participants.map((participant) =>
        participant._id === participantId
          ? { ...participant, voteCount: newVoteCount }
          : participant
      );

      this.globalCache[category] = {
        ...data,
        participants: updatedParticipants,
        timestamp: Date.now(), // Refresh timestamp
      };

      this.persistToStorage();
    } catch (error) {
      console.warn("Failed to update vote count in cache:", error);
    }
  }

  // Check if cache exists and is valid for a category
  hasValidCache(category: string): boolean {
    return this.getParticipants(category) !== null;
  }

  // Get cache status for debugging
  getCacheStatus(category?: string): any {
    this.initializeCache();

    if (category) {
      return this.globalCache[category] || null;
    }

    return {
      totalCategories: Object.keys(this.globalCache).length,
      categories: Object.keys(this.globalCache),
      cacheSize: JSON.stringify(this.globalCache).length,
    };
  }

  // Clean up any old localStorage keys that might be causing issues
  cleanupOldKeys(): void {
    if (typeof window === "undefined") return;

    try {
      // List of keys to remove (old vote timestamp storage)
      const oldKeys = [
        "tasfa_vote_timestamps",
        "tasfa_voting_timestamps",
        "tasfa_vote_history",
        "tasfa_voting_history",
        "tasfa_participants_cache",
        "tasfa_participants_cache_v1",
      ];

      oldKeys.forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Failed to cleanup old keys:", error);
    }
  }


}

// Export singleton instance
export const participantCache = new ParticipantCache();

// Utility functions for easy access
export const getCachedParticipants = (
  category: string
): Participant[] | null => {
  return participantCache.getParticipants(category);
};

export const setCachedParticipants = (
  category: string,
  participants: Participant[]
): void => {
  participantCache.setParticipants(category, participants);
};

export const updateCachedVoteCount = (
  category: string,
  participantId: string,
  newVoteCount: number
): void => {
  participantCache.updateVoteCount(category, participantId, newVoteCount);
};

export const clearParticipantCache = (category?: string): void => {
  if (category) {
    participantCache.removeCategory(category);
  } else {
    participantCache.clearAll();
  }
};

export const cleanupOldLocalStorageKeys = (): void => {
  participantCache.cleanupOldKeys();
};

export const markFetchAttempt = (category: string, success: boolean = true): void => {
  participantCache.markFetchAttempt(category, success);
};

export const getCacheStatus = (category?: string): any => {
  return participantCache.getCacheStatus(category);
};

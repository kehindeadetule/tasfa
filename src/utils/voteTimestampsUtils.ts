// Utility functions for handling the new voteTimestamps structure

export interface VoteTimestamp {
  votedAt: string | null;
  nextVoteAt: string | null;
  canVoteAgain: boolean;
  status: "available" | "pending";
}

export interface VoteTimestamps {
  [category: string]: VoteTimestamp;
}

// Local storage utilities for voting state persistence
export const VOTING_STORAGE_PREFIX = "voting_state_";
export const VOTING_STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface StoredVotingState {
  data: any;
  timestamp: number;
  category: string;
}

/**
 * Save voting state to localStorage
 */
export function saveVotingState(category: string, data: any): void {
  try {
    const stateToSave: StoredVotingState = {
      data,
      timestamp: new Date().getTime(),
      category,
    };
    localStorage.setItem(
      `${VOTING_STORAGE_PREFIX}${category}`,
      JSON.stringify(stateToSave)
    );
  } catch (error) {
    console.warn("Failed to save voting state:", error);
  }
}

/**
 * Load voting state from localStorage
 */
export function loadVotingState(category: string): any | null {
  try {
    const stored = localStorage.getItem(`${VOTING_STORAGE_PREFIX}${category}`);
    if (stored) {
      const parsed: StoredVotingState = JSON.parse(stored);
      const now = new Date().getTime();

      // Check if stored data is still valid (not expired)
      if (parsed.timestamp && now - parsed.timestamp < VOTING_STORAGE_EXPIRY) {
        return parsed.data;
      } else {
        // Clean up expired data
        localStorage.removeItem(`${VOTING_STORAGE_PREFIX}${category}`);
      }
    }
  } catch (error) {
    console.warn("Failed to load stored voting state:", error);
  }
  return null;
}

/**
 * Clear voting state from localStorage
 */
export function clearVotingState(category: string): void {
  try {
    localStorage.removeItem(`${VOTING_STORAGE_PREFIX}${category}`);
  } catch (error) {
    console.warn("Failed to clear voting state:", error);
  }
}

/**
 * Clear all voting states from localStorage
 */
export function clearAllVotingStates(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(VOTING_STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Failed to clear all voting states:", error);
  }
}

/**
 * Check if a user can vote for a specific category
 */
export function canVoteForCategory(
  category: string,
  voteTimestamps: VoteTimestamps
): boolean {
  const categoryData = voteTimestamps[category];
  return categoryData ? categoryData.status === "available" : false;
}

/**
 * Get the button state for a category
 */
export function getButtonState(
  category: string,
  voteTimestamps: VoteTimestamps
): "available" | "pending" | "error" {
  const categoryData = voteTimestamps[category];

  if (!categoryData) {
    return "error"; // Category not found
  }

  if (categoryData.status === "pending") {
    return "pending"; // Show timer
  }

  if (categoryData.status === "available") {
    return "available"; // Can vote
  }

  return "error";
}

/**
 * Get time remaining for pending categories in hours
 */
export function getTimeRemaining(
  category: string,
  voteTimestamps: VoteTimestamps
): number {
  const categoryData = voteTimestamps[category];

  if (categoryData && categoryData.nextVoteAt) {
    const now = new Date();
    const nextVote = new Date(categoryData.nextVoteAt);
    const timeRemaining = Math.ceil(
      (nextVote.getTime() - now.getTime()) / (1000 * 60 * 60)
    ); // hours

    return timeRemaining > 0 ? timeRemaining : 0;
  }

  return 0;
}

/**
 * Get formatted time remaining string (e.g., "5h 30m")
 */
export function getFormattedTimeRemaining(
  category: string,
  voteTimestamps: VoteTimestamps
): string {
  const categoryData = voteTimestamps[category];

  if (categoryData && categoryData.nextVoteAt) {
    const now = new Date();
    const nextVote = new Date(categoryData.nextVoteAt);
    const difference = nextVote.getTime() - now.getTime();

    if (difference <= 0) {
      return "0h 0m";
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }

  return "0h 0m";
}

/**
 * Count available categories
 */
export function countAvailableCategories(
  voteTimestamps: VoteTimestamps
): number {
  return Object.values(voteTimestamps).filter(
    (data) => data.status === "available"
  ).length;
}

/**
 * Count pending categories
 */
export function countPendingCategories(voteTimestamps: VoteTimestamps): number {
  return Object.values(voteTimestamps).filter(
    (data) => data.status === "pending"
  ).length;
}

/**
 * Get available categories list
 */
export function getAvailableCategories(
  voteTimestamps: VoteTimestamps
): string[] {
  return Object.keys(voteTimestamps).filter(
    (category) => voteTimestamps[category].status === "available"
  );
}

/**
 * Get pending categories with time remaining
 */
export function getPendingCategories(voteTimestamps: VoteTimestamps): Array<{
  category: string;
  timeRemaining: number;
}> {
  return Object.keys(voteTimestamps)
    .filter((category) => voteTimestamps[category].status === "pending")
    .map((category) => ({
      category,
      timeRemaining: getTimeRemaining(category, voteTimestamps),
    }));
}

/**
 * Get voting status for a specific category
 */
export function getCategoryVotingStatus(
  category: string,
  voteTimestamps: VoteTimestamps
): {
  canVote: boolean;
  message: string;
  nextVoteTime?: string;
} {
  const categoryData = voteTimestamps[category];

  if (!categoryData) {
    return {
      canVote: false,
      message: "Voting not available for this category",
    };
  }

  if (categoryData.status === "available") {
    return {
      canVote: true,
      message: "Ready to vote!",
    };
  }

  if (categoryData.status === "pending") {
    return {
      canVote: false,
      message:
        "You've already voted for this category. Please wait 24 hours before voting again.",
      nextVoteTime: categoryData.nextVoteAt || undefined,
    };
  }

  return {
    canVote: false,
    message: "Voting not available for this category",
  };
}

/**
 * Store voting data in localStorage with 24-hour expiration
 */
export function storeVotingData(
  categoryName: string,
  participantId: string
): void {
  try {
    const votingData = {
      categoryName,
      participantId,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    };

    localStorage.setItem(
      `tasfa_vote_${categoryName}`,
      JSON.stringify(votingData)
    );
    console.log(`Voting data stored for ${categoryName}`);
  } catch (error) {
    console.warn("Failed to store voting data:", error);
  }
}

/**
 * Get voting data from localStorage and check if it's still valid
 */
export function getVotingData(
  categoryName: string
): { participantId: string; timestamp: string } | null {
  try {
    const stored = localStorage.getItem(`tasfa_vote_${categoryName}`);
    if (stored) {
      const votingData = JSON.parse(stored);
      const now = new Date();
      const expiresAt = new Date(votingData.expiresAt);

      // Check if the voting data has expired
      if (now < expiresAt) {
        return {
          participantId: votingData.participantId,
          timestamp: votingData.timestamp,
        };
      } else {
        // Clean up expired data
        localStorage.removeItem(`tasfa_vote_${categoryName}`);
        console.log(`Voting data expired for ${categoryName}`);
      }
    }
  } catch (error) {
    console.warn("Failed to get voting data:", error);
  }
  return null;
}

/**
 * Check if user has voted for a specific category
 */
export function hasVotedForCategory(categoryName: string): boolean {
  return getVotingData(categoryName) !== null;
}

/**
 * Get all stored voting data
 */
export function getAllVotingData(): {
  [category: string]: { participantId: string; timestamp: string };
} {
  const votingData: {
    [category: string]: { participantId: string; timestamp: string };
  } = {};

  try {
    // Get all localStorage keys that start with tasfa_vote_
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("tasfa_vote_")) {
        const categoryName = key.replace("tasfa_vote_", "");
        const data = getVotingData(categoryName);
        if (data) {
          votingData[categoryName] = data;
        }
      }
    }
  } catch (error) {
    console.warn("Failed to get all voting data:", error);
  }

  return votingData;
}

/**
 * Clear all expired voting data
 */
export function clearExpiredVotingData(): void {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("tasfa_vote_")) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const votingData = JSON.parse(stored);
            const now = new Date();
            const expiresAt = new Date(votingData.expiresAt);

            if (now >= expiresAt) {
              keysToRemove.push(key);
            }
          } catch (error) {
            // If data is corrupted, remove it
            keysToRemove.push(key);
          }
        }
      }
    }

    // Remove expired keys
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`Removed expired voting data: ${key}`);
    });
  } catch (error) {
    console.warn("Failed to clear expired voting data:", error);
  }
}

/**
 * Clear voting data for a specific category
 */
export function clearVotingData(categoryName: string): void {
  try {
    localStorage.removeItem(`tasfa_vote_${categoryName}`);
    console.log(`Voting data cleared for ${categoryName}`);
  } catch (error) {
    console.warn("Failed to clear voting data:", error);
  }
}

/**
 * Clear all voting data
 */
export function clearAllVotingData(): void {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("tasfa_vote_")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log("All voting data cleared");
  } catch (error) {
    console.warn("Failed to clear all voting data:", error);
  }
}

/**
 * Debug function to log all localStorage voting data
 */
export function debugVotingData(): void {
  console.log("=== localStorage Voting Data Debug ===");

  try {
    const votingData = getAllVotingData();

    console.log("Voting Records:", votingData);

    // Log all tasfa-related localStorage keys
    const tasfaKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("tasfa_vote_")) {
        tasfaKeys.push(key);
      }
    }
    console.log("All TASFA localStorage keys:", tasfaKeys);
  } catch (error) {
    console.error("Error debugging voting data:", error);
  }
}

/**
 * Clear all TASFA-related localStorage data
 */
export function clearAllTasfaData(): void {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("tasfa_vote_")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`Removed: ${key}`);
    });

    console.log("All TASFA localStorage data cleared");
  } catch (error) {
    console.warn("Failed to clear all TASFA data:", error);
  }
}

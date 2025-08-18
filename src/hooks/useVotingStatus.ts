import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/config/api";

interface VotingStatus {
  votedCategories: string[];
  canVote: boolean;
  voteTimestamps: { [category: string]: string }; // ISO timestamp strings
}

interface VoteHistory {
  category: string;
  timestamp: string;
  nextVoteTime: string;
}

export const useVotingStatus = () => {
  const [votingStatus, setVotingStatus] = useState<VotingStatus>({
    votedCategories: [],
    canVote: true,
    voteTimestamps: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotingStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.votingStatus);
      const data = await response.json();

      if (data.success) {
        // Get local timestamps from localStorage
        const storedTimestamps = getStoredVoteTimestamps();

        setVotingStatus({
          ...data.data,
          voteTimestamps: storedTimestamps,
        });
      } else {
        setError("Failed to fetch voting status");
      }
    } catch (err) {
      setError("Error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const canVoteForCategory = (category: string): boolean => {
    const timestamp = votingStatus.voteTimestamps[category];
    if (!timestamp) return true;

    const voteTime = new Date(timestamp);
    const now = new Date();
    const hoursElapsed =
      (now.getTime() - voteTime.getTime()) / (1000 * 60 * 60);

    return hoursElapsed >= 24;
  };

  const getNextVoteTime = (category: string): Date | null => {
    const timestamp = votingStatus.voteTimestamps[category];
    if (!timestamp) return null;

    const voteTime = new Date(timestamp);
    const nextVoteTime = new Date(voteTime.getTime() + 24 * 60 * 60 * 1000);

    return nextVoteTime;
  };

  const getVoteHistory = (): VoteHistory[] => {
    return Object.entries(votingStatus.voteTimestamps).map(
      ([category, timestamp]) => {
        const voteTime = new Date(timestamp);
        const nextVoteTime = new Date(voteTime.getTime() + 24 * 60 * 60 * 1000);

        return {
          category,
          timestamp,
          nextVoteTime: nextVoteTime.toISOString(),
        };
      }
    );
  };

  const getAvailableCategories = (): string[] => {
    return Object.keys(votingStatus.voteTimestamps).filter((category) =>
      canVoteForCategory(category)
    );
  };

  const getPendingCategories = (): VoteHistory[] => {
    return getVoteHistory().filter((vote) => {
      const nextVoteTime = new Date(vote.nextVoteTime);
      return nextVoteTime > new Date();
    });
  };

  const updateVotingStatus = (category: string) => {
    const now = new Date().toISOString();

    // Update state
    setVotingStatus((prev) => ({
      ...prev,
      votedCategories: prev.votedCategories.includes(category)
        ? prev.votedCategories
        : [...prev.votedCategories, category],
      voteTimestamps: {
        ...prev.voteTimestamps,
        [category]: now,
      },
    }));

    // Store in localStorage
    storeVoteTimestamp(category, now);
  };

  const resetVotingStatus = () => {
    setVotingStatus({
      votedCategories: [],
      canVote: true,
      voteTimestamps: {},
    });

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("vote_timestamps");
    }
  };

  useEffect(() => {
    fetchVotingStatus();
  }, []);

  return {
    votingStatus,
    loading,
    error,
    canVoteForCategory,
    getNextVoteTime,
    getVoteHistory,
    getAvailableCategories,
    getPendingCategories,
    updateVotingStatus,
    resetVotingStatus,
    refetch: fetchVotingStatus,
  };
};

// Utility functions for localStorage management
function getStoredVoteTimestamps(): { [category: string]: string } {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem("vote_timestamps");
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error reading vote timestamps from localStorage:", error);
    return {};
  }
}

function storeVoteTimestamp(category: string, timestamp: string) {
  if (typeof window === "undefined") return;

  try {
    const existing = getStoredVoteTimestamps();
    const updated = { ...existing, [category]: timestamp };
    localStorage.setItem("vote_timestamps", JSON.stringify(updated));
  } catch (error) {
    console.error("Error storing vote timestamp to localStorage:", error);
  }
}

import { useState, useEffect, useRef, useCallback } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { votingStatusCache, CACHE_KEYS } from "@/utils/votingCache";
import { fetchWithRetry } from "@/utils/rateLimitHandler";

// Polling intervals based on user activity
const POLLING_INTERVALS = {
  idle: 30000, // 30 seconds when user is not actively voting
  active: 10000, // 10 seconds when user is on voting page
  voting: 5000, // 5 seconds immediately after voting
  error: 60000, // 60 seconds when there are errors
} as const;

interface VotingStatus {
  votedCategories: string[];
  canVote: boolean;
  voteTimestamps: { [category: string]: string };
}

interface UseSmartVotingPollerOptions {
  enabled?: boolean;
  initialInterval?: keyof typeof POLLING_INTERVALS;
  onStatusUpdate?: (status: VotingStatus) => void;
  onError?: (error: string) => void;
}

export const useSmartVotingPoller = (
  options: UseSmartVotingPollerOptions = {}
) => {
  const {
    enabled = true,
    initialInterval = "idle",
    onStatusUpdate,
    onError,
  } = options;

  const [votingStatus, setVotingStatus] = useState<VotingStatus>({
    votedCategories: [],
    canVote: true,
    voteTimestamps: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentInterval, setCurrentInterval] =
    useState<keyof typeof POLLING_INTERVALS>(initialInterval);

  const isActive = useRef(false);
  const lastVoteTime = useRef(0);
  const pollTimeoutRef = useRef<NodeJS.Timeout>();
  const errorCount = useRef(0);

  // Check if user is actively on the page
  const isUserActive = useCallback(() => {
    if (typeof window === "undefined") return false;
    return document.hasFocus() && !document.hidden;
  }, []);

  // Check if user recently voted
  const hasRecentVote = useCallback(() => {
    const timeSinceLastVote = Date.now() - lastVoteTime.current;
    return timeSinceLastVote < 60000; // Within 1 minute
  }, []);

  // Determine optimal polling interval
  const getOptimalInterval = useCallback((): keyof typeof POLLING_INTERVALS => {
    if (errorCount.current > 2) return "error";
    if (hasRecentVote()) return "voting";
    if (isUserActive()) return "active";
    return "idle";
  }, [hasRecentVote, isUserActive]);

  // Fetch voting status with caching
  const fetchVotingStatus = useCallback(async () => {
    try {
      // Check cache first
      const cached = votingStatusCache.get(CACHE_KEYS.VOTING_STATUS);
      if (cached) {
        setVotingStatus(cached);
        setLoading(false);
        setError(null);
        onStatusUpdate?.(cached);
        return cached;
      }

      setLoading(true);
      const response = await fetchWithRetry(
        API_ENDPOINTS.votingStatus,
        {},
        {
          maxRetries: 2,
          showNotification: false,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Get local timestamps from localStorage
        const storedTimestamps = getStoredVoteTimestamps();
        const statusData = {
          ...data.data,
          voteTimestamps: storedTimestamps,
        };

        // Cache the result
        votingStatusCache.set(CACHE_KEYS.VOTING_STATUS, statusData);

        setVotingStatus(statusData);
        setLoading(false);
        setError(null);
        errorCount.current = 0;
        onStatusUpdate?.(statusData);

        return statusData;
      } else {
        throw new Error(data.error || "Failed to fetch voting status");
      }
    } catch (err: any) {
      errorCount.current++;
      const errorMessage = err.message || "Error fetching voting status";
      setError(errorMessage);
      setLoading(false);
      onError?.(errorMessage);

      // Increase interval on error
      setCurrentInterval("error");

      throw err;
    }
  }, [onStatusUpdate, onError]);

  // Polling function
  const poll = useCallback(async () => {
    if (!isActive.current) return;

    try {
      await fetchVotingStatus();

      // Adjust polling interval based on current conditions
      const optimalInterval = getOptimalInterval();
      setCurrentInterval(optimalInterval);
    } catch (error) {
      console.error("Polling error:", error);
    }

    // Schedule next poll
    if (isActive.current) {
      pollTimeoutRef.current = setTimeout(
        poll,
        POLLING_INTERVALS[currentInterval]
      );
    }
  }, [fetchVotingStatus, getOptimalInterval, currentInterval]);

  // Start polling
  const startPolling = useCallback(() => {
    if (isActive.current) return;

    isActive.current = true;
    errorCount.current = 0;
    poll();
  }, [poll]);

  // Stop polling
  const stopPolling = useCallback(() => {
    isActive.current = false;
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }
  }, []);

  // Set voting mode (called when user votes)
  const setVotingMode = useCallback(() => {
    lastVoteTime.current = Date.now();
    setCurrentInterval("voting");

    // Clear cache to get fresh data
    votingStatusCache.invalidate(CACHE_KEYS.VOTING_STATUS);

    // Force immediate poll
    if (isActive.current) {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
      poll();
    }
  }, [poll]);

  // Manual refresh
  const refresh = useCallback(async () => {
    votingStatusCache.invalidate(CACHE_KEYS.VOTING_STATUS);
    return await fetchVotingStatus();
  }, [fetchVotingStatus]);

  // Update voting status when user votes
  const updateVotingStatus = useCallback(
    (category: string) => {
      const now = new Date().toISOString();

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

      // Set voting mode for immediate updates
      setVotingMode();
    },
    [setVotingMode]
  );

  // Start/stop polling based on enabled state
  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [enabled, startPolling, stopPolling]);

  // Listen for page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCurrentInterval("idle");
      } else {
        setCurrentInterval(getOptimalInterval());
      }
    };

    const handleFocus = () => {
      setCurrentInterval(getOptimalInterval());
    };

    const handleBlur = () => {
      setCurrentInterval("idle");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [getOptimalInterval]);

  return {
    votingStatus,
    loading,
    error,
    currentInterval: POLLING_INTERVALS[currentInterval],
    updateVotingStatus,
    refresh,
    setVotingMode,
    startPolling,
    stopPolling,
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

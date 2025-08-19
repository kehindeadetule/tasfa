"use client";

import { useState, useEffect } from "react";
import { apiClient, handleApiError, ApiError } from "@/utils/secureApiClient";
import {
  getAllVotingData,
  clearExpiredVotingData,
} from "@/utils/voteTimestampsUtils";

interface VotingOverviewProps {}

interface VoteTimestamp {
  votedAt: string | null;
  nextVoteAt: string | null;
  canVoteAgain: boolean;
  status: "available" | "pending";
}

interface GlobalVotingStatus {
  votedCategories: string[];
  votableCategories: string[];
  pendingCategories: Array<{
    category: string;
    participantName: string;
    votedAt: string;
    nextVoteTime: string;
    timeRemaining: number;
    canVoteAgain: boolean;
  }>;
  canVote: boolean;
  voteTimestamps: { [category: string]: VoteTimestamp };
  nextVoteTimes: { [category: string]: string | null };
  timeUntilNextVote: { [category: string]: number };
}

export default function SimpleVotingOverview({}: VotingOverviewProps) {
  const [votingStatus, setVotingStatus] = useState<GlobalVotingStatus | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVotingStatus = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Clear expired voting data first
      clearExpiredVotingData();

      const result = await apiClient.get("/api/votes/voting-status");

      if (result.success) {
        const apiVotingStatus = result.data as GlobalVotingStatus;

        // Get localStorage voting data
        const localStorageVotingData = getAllVotingData();

        // Debug logging
        console.log("Voting Status Data:", {
          apiVotingStatus,
          localStorageVotingData,
          voteTimestamps: apiVotingStatus.voteTimestamps,
          votedCategories: apiVotingStatus.votedCategories,
        });

        // Merge localStorage data with API data
        const mergedVotingStatus = {
          ...apiVotingStatus,
          votedCategories: [
            ...new Set([
              ...apiVotingStatus.votedCategories,
              ...Object.keys(localStorageVotingData),
            ]),
          ],
        };

        setVotingStatus(mergedVotingStatus);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.message || "Failed to fetch voting status");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? handleApiError(err as ApiError)
          : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVotingStatus();

    // Add auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchVotingStatus();
    }, 30000);

    // Listen for localStorage changes (when votes are submitted)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("tasfa_vote_")) {
        // Refresh when voting data changes
        fetchVotingStatus();
      }
    };

    // Listen for keyboard shortcut (Ctrl+R) to refresh
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        fetchVotingStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005B96] mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading voting status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-2">
            Error loading voting status
          </p>
          <button
            onClick={fetchVotingStatus}
            className="text-sm text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!votingStatus) {
    return null;
  }

  // Use the new comprehensive structure for accurate counting
  const voteTimestamps = votingStatus.voteTimestamps || {};

  // Get localStorage voting data as fallback
  const localStorageVotingData = getAllVotingData();

  // If API doesn't provide voteTimestamps, create a basic structure from localStorage
  let effectiveVoteTimestamps = voteTimestamps;
  if (
    Object.keys(voteTimestamps).length === 0 &&
    Object.keys(localStorageVotingData).length > 0
  ) {
    // Create basic voteTimestamps structure from localStorage data
    effectiveVoteTimestamps = Object.keys(localStorageVotingData).reduce(
      (acc, category) => {
        acc[category] = {
          votedAt: localStorageVotingData[category].timestamp,
          nextVoteAt: new Date(
            new Date(localStorageVotingData[category].timestamp).getTime() +
              24 * 60 * 60 * 1000
          ).toISOString(),
          canVoteAgain: false,
          status: "pending" as const,
        };
        return acc;
      },
      {} as { [category: string]: VoteTimestamp }
    );
  }

  // Count available categories (status === "available")
  const availableCount = Object.values(effectiveVoteTimestamps).filter(
    (data) => data.status === "available"
  ).length;

  // Count pending categories (status === "pending")
  const pendingCount = Object.values(effectiveVoteTimestamps).filter(
    (data) => data.status === "pending"
  ).length;

  // Total categories - include both API and localStorage data
  const totalCount = Math.max(
    Object.keys(effectiveVoteTimestamps).length,
    Object.keys(localStorageVotingData).length
  );

  // Get categories by status for display
  const availableCategories = Object.keys(effectiveVoteTimestamps).filter(
    (category) => effectiveVoteTimestamps[category].status === "available"
  );

  const pendingCategories = Object.keys(effectiveVoteTimestamps)
    .filter(
      (category) => effectiveVoteTimestamps[category].status === "pending"
    )
    .map((category) => ({
      category,
      timeRemaining: votingStatus.timeUntilNextVote[category] || 0,
    }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            🗳️ Your Voting Progress
          </h3>
          <button
            onClick={fetchVotingStatus}
            disabled={refreshing}
            className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh voting status"
          >
            <span className="text-xs">{refreshing ? "⟳" : "↻"}</span>
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Track your voting journey across all categories
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Auto-refreshes every 30 seconds • Updates when you vote
          {lastUpdated && (
            <span className="block mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {pendingCount}
          </div>
          <div className="text-sm text-orange-700">Pending</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {availableCount}
          </div>
          <div className="text-sm text-blue-700">Available</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{totalCount}</div>
          <div className="text-sm text-gray-700">Total</div>
        </div>
      </div>

      {/* Security Features Info */}
      {/* <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="text-sm font-medium text-green-800 mb-2">
          🔒 Security Features Active
        </h4>
        <div className="text-xs text-green-700 space-y-1">
          <div>• 1-minute cooldown between votes</div>
          <div>• Session + IP binding prevents multiple tabs</div>
          <div>• Maximum 5 votes per minute per IP</div>
          <div>• 24-hour category lock after voting</div>
          <div>• Session persistence across browser tabs</div>
        </div>
      </div> */}

      {pendingCount > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            ⏰ Categories Waiting for Next Vote
          </h4>
          <div className="flex flex-wrap gap-2">
            {pendingCategories.slice(0, 5).map((pending: any) => (
              <span
                key={pending.category}
                className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
              >
                {pending.category} ({pending.timeRemaining}h)
              </span>
            ))}
            {pendingCategories.length > 5 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{pendingCategories.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {availableCount > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            🎯 Categories Available for Voting
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableCategories.slice(0, 5).map((category: string) => (
              <span
                key={category}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
            {availableCategories.length > 5 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{availableCategories.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 You can vote once per category every 24 hours
        </p>

        {/* Debug section - only show in development */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              🔧 Debug Info (Development Only)
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
              <div>
                <strong>API VoteTimestamps:</strong>{" "}
                {Object.keys(voteTimestamps).length} categories
              </div>
              <div>
                <strong>localStorage Data:</strong>{" "}
                {Object.keys(localStorageVotingData).length} categories
              </div>
              <div>
                <strong>Effective VoteTimestamps:</strong>{" "}
                {Object.keys(effectiveVoteTimestamps).length} categories
              </div>
              <div>
                <strong>Available:</strong> {availableCount} |{" "}
                <strong>Pending:</strong> {pendingCount} |{" "}
                <strong>Total:</strong> {totalCount}
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

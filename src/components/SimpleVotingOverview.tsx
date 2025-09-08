"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/config/api";
import { useSecureVoting } from "@/hooks/useSecureVoting";

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
  const { isAuthenticated, user, logout } = useAuth();
  const [votingHistory, setVotingHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVotingHistory = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("Authentication required");
      return;
    }

    try {
      setRefreshing(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/secure-votes/my-history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tasfa_auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setVotingHistory(data.data.votes || []);
          setLastUpdated(new Date());
        } else {
          throw new Error(data.message || "Failed to fetch voting history");
        }
      } else {
        throw new Error("Failed to fetch voting history");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchVotingHistory();
    } else {
      setLoading(false);
    }

    // Add auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (isAuthenticated) {
        fetchVotingHistory();
      }
    }, 30000);

    // Listen for keyboard shortcut (Ctrl+R) to refresh
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        if (isAuthenticated) {
          fetchVotingHistory();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            🔐 Authentication Required
          </h3>
          <p className="text-gray-600 text-sm">
            Please log in with your phone number to view your voting progress
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005B96] mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">
            Loading voting history...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-2">
            Error loading voting history
          </p>
          <button
            onClick={fetchVotingHistory}
            className="text-sm text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate voting statistics from history
  const totalVotes = votingHistory.length;
  const votedCategories = votingHistory.map((vote) => vote.category);
  const uniqueCategories = [...new Set(votedCategories)];

  // Group votes by category
  const votesByCategory = votingHistory.reduce((acc, vote) => {
    if (!acc[vote.category]) {
      acc[vote.category] = [];
    }
    acc[vote.category].push(vote);
    return acc;
  }, {} as { [category: string]: any[] });

  // Get recent votes (last 5)
  const recentVotes = votingHistory.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            🗳️ Your Voting History
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchVotingHistory}
              disabled={refreshing}
              className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh voting history"
            >
              <span className="text-xs">{refreshing ? "⟳" : "↻"}</span>
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Logout
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600">Logged in as: {user?.email}</p>
        <p className="text-xs text-gray-500 mt-1">
          Auto-refreshes every 30 seconds
          {lastUpdated && (
            <span className="block mt-1">
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalVotes}</div>
          <div className="text-sm text-green-700">Total Votes</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {uniqueCategories.length}
          </div>
          <div className="text-sm text-blue-700">Categories Voted</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {user?.isVerified ? "✓" : "✗"}
          </div>
          <div className="text-sm text-purple-700">Verified</div>
        </div>
      </div>

      {/* Security Features Info */}
      <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="text-sm font-medium text-green-800 mb-2">
          🔒 Security Features Active
        </h4>
        <div className="text-xs text-green-700 space-y-1">
          <div>• Phone number verification required</div>
          <div>• JWT token authentication</div>
          <div>• Rate limiting on votes and OTP requests</div>
          <div>• 24-hour category lock after voting</div>
          <div>• Secure vote tracking by phone number</div>
        </div>
      </div>

      {totalVotes > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            📊 Recent Voting Activity
          </h4>
          <div className="space-y-2">
            {recentVotes.map((vote, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs"
              >
                <span className="font-medium">{vote.category}</span>
                <span className="text-gray-500">
                  {new Date(vote.votedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {totalVotes > 5 && (
              <div className="text-center text-xs text-gray-500">
                +{totalVotes - 5} more votes
              </div>
            )}
          </div>
        </div>
      )}

      {Object.keys(votesByCategory).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            🏆 Categories You've Voted In
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.keys(votesByCategory)
              .slice(0, 5)
              .map((category) => (
                <span
                  key={category}
                  className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            {Object.keys(votesByCategory).length > 5 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{Object.keys(votesByCategory).length - 5} more
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
                <strong>Total Votes:</strong> {totalVotes}
              </div>
              <div>
                <strong>Unique Categories:</strong> {uniqueCategories.length}
              </div>
              <div>
                <strong>User Phone:</strong> {user?.email}
              </div>
              <div>
                <strong>Is Verified:</strong> {user?.isVerified ? "Yes" : "No"}
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

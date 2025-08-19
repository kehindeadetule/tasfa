"use client";

import { useState, useEffect } from "react";
import { apiClient, handleApiError, ApiError } from "@/utils/secureApiClient";

interface VotingOverviewProps {}

export default function SimpleVotingOverview({}: VotingOverviewProps) {
  const [votingStatus, setVotingStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVotingStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiClient.get("/api/votes/voting-status");

        if (result.success) {
          setVotingStatus(result.data);
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
      }
    };

    fetchVotingStatus();

    // Refresh every 30 seconds
    const interval = setInterval(fetchVotingStatus, 30000);
    return () => clearInterval(interval);
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
            onClick={() => window.location.reload()}
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

  // Calculate correct counts
  const pendingCount = votingStatus.pendingCategories?.length || 0; // Categories under timer
  const availableCount = votingStatus.votableCategories?.length || 0; // Categories you can vote for
  const totalCount = pendingCount + availableCount; // Total categories

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🗳️ Your Voting Progress
        </h3>
        <p className="text-sm text-gray-600">
          Track your voting journey across all categories
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
      {/* 
      {pendingCount > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            ⏰ Categories Waiting for Next Vote
          </h4>
          <div className="flex flex-wrap gap-2">
            {votingStatus.pendingCategories?.slice(0, 5).map((pending: any) => (
              <span
                key={pending.category}
                className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
              >
                {pending.category} ({pending.timeRemaining}h)
              </span>
            ))}
            {votingStatus.pendingCategories?.length > 5 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{votingStatus.pendingCategories.length - 5} more
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
            {votingStatus.votableCategories
              ?.slice(0, 5)
              .map((category: string) => (
                <span
                  key={category}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            {votingStatus.votableCategories?.length > 5 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{votingStatus.votableCategories.length - 5} more
              </span>
            )}
          </div>
        </div>
      )} */}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 You can vote once per category every 24 hours
        </p>
      </div>
    </div>
  );
}

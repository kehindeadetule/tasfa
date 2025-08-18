"use client";

import { useVotingStatus } from "@/hooks/useVotingStatus";
import VotingTimer, { VotingTimerWithProgress } from "./VotingTimer";
import VotingDebugInfo from "./VotingDebugInfo";

export default function VotingStatusIndicator() {
  const {
    votingStatus,
    loading,
    error,
    getPendingCategories,
    getAvailableCategories,
    setVotingMode,
    currentInterval,
  } = useVotingStatus();

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#005B96] mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading voting status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 text-sm">Error loading voting status</p>
        <button
          onClick={() => setVotingMode()}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const votedCount = votingStatus.votedCategories.length;
  const pendingCategories = getPendingCategories();
  const availableCategories = getAvailableCategories();
  const totalVotedEver = Object.keys(votingStatus.voteTimestamps).length;

  const handleVotingAvailable = () => {
    // Set voting mode when a countdown expires to get immediate updates
    setVotingMode();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                availableCategories.length > 0
                  ? "bg-green-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              Voting Status
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {totalVotedEver} total votes
        </div>
      </div>

      {/* Available Categories */}
      {availableCategories.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-green-800">
              Ready to Vote
            </h4>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
              {availableCategories.length} available
            </span>
          </div>
          <div className="grid gap-1 max-h-24 overflow-y-auto">
            {availableCategories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full inline-block"
              >
                {category}
              </span>
            ))}
            {availableCategories.length > 3 && (
              <span className="text-xs text-green-600">
                +{availableCategories.length - 3} more categories
              </span>
            )}
          </div>
        </div>
      )}

      {/* Pending Categories with Countdowns */}
      {pendingCategories.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Next Voting Available
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {pendingCategories.slice(0, 4).map((vote) => (
              <VotingTimerWithProgress
                key={vote.category}
                categoryName={vote.category}
                nextVoteTime={vote.nextVoteTime}
                voteTimestamp={vote.timestamp}
                onVotingAvailable={handleVotingAvailable}
                className="text-xs"
              />
            ))}
            {pendingCategories.length > 4 && (
              <div className="text-center py-2">
                <button
                  className="text-xs text-[#005B96] hover:underline"
                  onClick={() => {
                    // Could expand to show all or navigate to a detailed view
                    console.log("Show all pending categories");
                  }}
                >
                  View {pendingCategories.length - 4} more categories
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="pt-3 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-green-600">
              {availableCategories.length}
            </p>
            <p className="text-xs text-gray-600">Ready</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-orange-600">
              {pendingCategories.length}
            </p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#005B96]">
              {totalVotedEver}
            </p>
            <p className="text-xs text-gray-600">Total Votes</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {totalVotedEver === 0 && (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🗳️</div>
          <p className="text-sm text-gray-600 mb-2">Ready to start voting?</p>
          <p className="text-xs text-gray-500">
            All categories are available for voting.
          </p>
        </div>
      )}

      {/* Debug Info */}
      <VotingDebugInfo currentInterval={currentInterval} />
    </div>
  );
}

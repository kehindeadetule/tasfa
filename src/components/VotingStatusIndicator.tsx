"use client";

import { useVotingStatus } from "@/hooks/useVotingStatus";

export default function VotingStatusIndicator() {
  const { votingStatus, loading, error } = useVotingStatus();

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
      </div>
    );
  }

  const votedCount = votingStatus.votedCategories.length;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Voting Progress</span>
          </div>
          <span className="text-sm text-gray-600">
            {votedCount === 0 
              ? "Ready to vote" 
              : `${votedCount} categor${votedCount === 1 ? 'y' : 'ies'} completed`
            }
          </span>
        </div>
        
        {votedCount > 0 && (
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {votedCount} voted
          </div>
        )}
      </div>
      
      {votedCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Completed today:</p>
          <div className="flex flex-wrap gap-1">
            {votingStatus.votedCategories.map((category, index) => (
              <span 
                key={index}
                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
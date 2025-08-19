"use client";

import { useState, useEffect } from "react";
import { votingStatusCache, voteCountsCache } from "@/utils/votingCache";

interface VotingDebugInfoProps {
  currentInterval: number;
  enabled?: boolean;
}

export default function VotingDebugInfo({
  currentInterval,
  enabled = true,
}: VotingDebugInfoProps) {
  const [cacheInfo, setCacheInfo] = useState({
    votingStatus: 0,
    voteCounts: 0,
    totalEntries: 0,
  });

  useEffect(() => {
    const updateCacheInfo = () => {
      // Get cache sizes using the size method
      const votingStatusSize = votingStatusCache.size();
      const voteCountsSize = voteCountsCache.size();

      setCacheInfo({
        votingStatus: votingStatusSize,
        voteCounts: voteCountsSize,
        totalEntries: votingStatusSize + voteCountsSize,
      });
    };

    updateCacheInfo();
    const interval = setInterval(updateCacheInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!enabled || process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-3 rounded-lg text-xs z-50 max-w-xs">
      <div className="font-semibold mb-2">Voting Debug Info</div>
      <div className="space-y-1">
        <div>Polling Interval: {currentInterval / 1000}s</div>
        <div>Cache Entries: {cacheInfo.totalEntries}</div>
        <div>Status Cache: {cacheInfo.votingStatus}</div>
        <div>Counts Cache: {cacheInfo.voteCounts}</div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-700">
        <button
          onClick={() => {
            votingStatusCache.clear();
            voteCountsCache.clear();
          }}
          className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
        >
          Clear Cache
        </button>
      </div>
    </div>
  );
}

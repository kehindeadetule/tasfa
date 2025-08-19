"use client";

import { useState, useEffect } from "react";

interface VotingStatus {
  canVote: boolean;
  votedParticipantId?: string;
  nextVoteTime?: string;
  message?: string;
}

interface PendingCategory {
  category: string;
  participantName: string;
  votedAt: string;
  nextVoteTime: string;
  timeRemaining: number;
  canVoteAgain: boolean;
}

interface SimpleVotingStatusProps {
  votingStatus: VotingStatus;
  categoryName: string;
  pendingCategories?: PendingCategory[];
}

export default function SimpleVotingStatus({
  votingStatus,
  categoryName,
  pendingCategories = [],
}: SimpleVotingStatusProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Simple countdown timer that only shows if backend provides nextVoteTime
  useEffect(() => {
    if (!votingStatus.nextVoteTime) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const nextVote = new Date(votingStatus.nextVoteTime!).getTime();
      const difference = nextVote - now;

      if (difference <= 0) {
        setTimeLeft("");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [votingStatus.nextVoteTime]);

  if (votingStatus.canVote) {
    return (
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-sm font-medium text-green-800">
              ✅ Ready to Vote!
            </h3>
          </div>
          <p className="text-xs text-green-700">
            {votingStatus.message || "Choose your favorite participant below"}
          </p>
        </div>
      </div>
    );
  }

  if (votingStatus.votedParticipantId) {
    return (
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 className="text-sm font-medium text-blue-800">
              🗳️ Vote Submitted!
            </h3>
          </div>
          <p className="text-xs text-blue-700">
            {votingStatus.message || "Thank you for your vote!"}
          </p>
        </div>
      </div>
    );
  }

  if (votingStatus.nextVoteTime && timeLeft) {
    return (
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-orange-800">
              ⏰ Next Vote Available
            </h3>
          </div>
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-orange-600">{timeLeft}</div>
            <p className="text-xs text-orange-700 mt-1">
              You can vote for this category again once the countdown reaches
              zero
            </p>
          </div>
          {votingStatus.message && (
            <p className="text-xs text-orange-700 text-center mb-3">
              {votingStatus.message}
            </p>
          )}

          {/* Pending Categories Section */}

        </div>
      </div>
    );
  }

  // Default state
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <h3 className="text-sm font-medium text-gray-800">
            📊 Voting Status
          </h3>
        </div>
        <p className="text-xs text-gray-700">
          {votingStatus.message || "Loading voting information..."}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useCountdown, formatCountdown } from "@/hooks/useCountdown";

interface VotingTimerProps {
  categoryName: string;
  nextVoteTime: Date | string | number;
  onVotingAvailable?: () => void;
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export default function VotingTimer({
  categoryName,
  nextVoteTime,
  onVotingAvailable,
  className = "",
  showIcon = true,
  compact = false,
}: VotingTimerProps) {
  const timeLeft = useCountdown(nextVoteTime, {
    onExpire: onVotingAvailable,
  });

  if (timeLeft.isExpired) {
    return (
      <div
        className={`flex items-center ${
          compact ? "space-x-1" : "space-x-2"
        } ${className}`}
      >
        {showIcon && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
        <span
          className={`text-green-600 font-medium ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          Available now
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center ${
        compact ? "space-x-1" : "space-x-2"
      } ${className}`}
    >
      {showIcon && (
        <div className="flex items-center">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
      )}
      <div className="flex flex-col">
        {!compact && (
          <span className="text-xs text-gray-500">Next vote in:</span>
        )}
        <span
          className={`text-orange-600 font-medium ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {formatCountdown(timeLeft)}
        </span>
      </div>
    </div>
  );
}

// Enhanced version with progress bar
export function VotingTimerWithProgress({
  categoryName,
  nextVoteTime,
  voteTimestamp,
  onVotingAvailable,
  className = "",
}: VotingTimerProps & {
  voteTimestamp: Date | string | number;
}) {
  const timeLeft = useCountdown(nextVoteTime, {
    onExpire: onVotingAvailable,
  });

  const totalDuration = 24 * 60 * 60 * 1000; // 24 hours in ms
  const elapsed = Date.now() - new Date(voteTimestamp).getTime();
  const progressPercentage = Math.min((elapsed / totalDuration) * 100, 100);

  if (timeLeft.isExpired) {
    return (
      <div
        className={`p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-800">
            {categoryName}
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Ready</span>
          </div>
        </div>
        <div className="w-full bg-green-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full w-full"></div>
        </div>
        <p className="text-xs text-green-700 mt-1">You can vote again!</p>
      </div>
    );
  }

  return (
    <div
      className={`p-3 bg-orange-50 border border-orange-200 rounded-lg ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-orange-800">
          {categoryName}
        </span>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-xs text-orange-600 font-medium">
            {formatCountdown(timeLeft)}
          </span>
        </div>
      </div>
      <div className="w-full bg-orange-200 rounded-full h-2">
        <div
          className="bg-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-orange-700 mt-1">
        {timeLeft.days > 0 &&
          `${timeLeft.days} day${timeLeft.days > 1 ? "s" : ""}, `}
        {timeLeft.hours}h {timeLeft.minutes}m remaining
      </p>
    </div>
  );
}

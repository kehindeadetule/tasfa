import { useSmartVotingPoller } from "./useSmartVotingPoller";

interface VoteHistory {
  category: string;
  timestamp: string;
  nextVoteTime: string;
}

export const useVotingStatus = () => {
  const {
    votingStatus,
    loading,
    error,
    updateVotingStatus,
    refresh,
    setVotingMode,
  } = useSmartVotingPoller({
    enabled: true,
    initialInterval: "active",
  });

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

  const resetVotingStatus = () => {
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("vote_timestamps");
    }
    // Refresh to get updated status
    refresh();
  };

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
    refetch: refresh,
    setVotingMode,
  };
};

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { apiClient, handleApiError, ApiError } from "@/utils/secureApiClient";

// Utility function to clear all voting-related localStorage data
const clearAllVotingData = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      // Clear all voting-related data to ensure fresh state
      if (
        key.startsWith("voting_state_") ||
        key.startsWith("tasfa_vote_") ||
        key.startsWith("tasfa_voted_") ||
        key.startsWith("tasfa_voting_")
      ) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Failed to clear voting localStorage:", error);
  }
};

// Export the clear function for use in other components
export const clearVotingData = clearAllVotingData;

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  school: string;
  awardCategory: string;
  voteCount: number;
  image?: string;
}

interface VotingStatus {
  canVote: boolean | undefined;
  votedParticipantId?: string;
  nextVoteTime?: string;
  message?: string;
  timeRemaining?: number;
}

interface CategoryData {
  participants: Participant[];
  votingStatus: VotingStatus;
}

interface VoteResponse {
  success: boolean;
  message?: string;
  data?: any;
  queued?: boolean;
  retryAfter?: number;
}

interface UserVotingStatus {
  canVote: boolean;
  votedCategories: string[];
  nextVoteTimes: { [category: string]: string };
  timeRemaining: { [category: string]: number };
}

export const useSecureVoting = (categoryName: string) => {
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState<CategoryData>({
    participants: [],
    votingStatus: { canVote: undefined },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userVotingStatus, setUserVotingStatus] =
    useState<UserVotingStatus | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Detect user changes and clear voting data when user switches
  useEffect(() => {
    if (user?.id && user.id !== currentUserId) {
      clearAllVotingData();
      setCurrentUserId(user.id);
      setData({
        participants: [],
        votingStatus: { canVote: undefined },
      });
      setUserVotingStatus(null);
    } else if (!user && currentUserId) {
      clearAllVotingData();
      setCurrentUserId(null);
      setData({
        participants: [],
        votingStatus: { canVote: undefined },
      });
      setUserVotingStatus(null);
    }
  }, [user?.id, currentUserId]);

  const fetchCategoryData = useCallback(async () => {
    if (!isAuthenticated) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch participants, voting limits, and voting history in parallel
      const [participantsResult, votingLimitsResult, votingHistoryResult] =
        await Promise.all([
          apiClient.getCategoryParticipants(categoryName),
          apiClient.getMyVotingStatus(), // This calls /api/email-voting/voting-limits
          apiClient.getMyVotingHistory(), // This calls /api/email-voting/voting-history
        ]);

      if (!participantsResult.success) {
        throw new Error(
          participantsResult.message || "Failed to fetch category participants"
        );
      }

      if (!votingLimitsResult.success) {
        throw new Error(
          votingLimitsResult.message || "Failed to fetch voting limits"
        );
      }

      if (!votingHistoryResult.success) {
        throw new Error(
          votingHistoryResult.message || "Failed to fetch voting history"
        );
      }

      const participants: Participant[] =
        participantsResult.data?.participants || [];

      // Process the voting history to find voted participant for this category
      const votingHistory = (votingHistoryResult as any) || {};
      const historyVotes = votingHistory.votes || [];
      let votedParticipantId = historyVotes.find((vote: any) => {
        // Based on vote response structure, prioritize categoryId
        const voteCategory =
          vote.categoryId || vote.category || vote.awardCategory;
        const matches =
          voteCategory === categoryName ||
          voteCategory === categoryName.toLowerCase() ||
          voteCategory === categoryName.replace(/\s+/g, "-").toLowerCase();

        return matches;
      })?.participantId;

      // Fallback: Check localStorage for voted participant ID only if API doesn't have it
      // This prevents localStorage from overriding fresh API data
      if (!votedParticipantId) {
        const localStorageKey = `tasfa_voted_${categoryName}`;
        const storedVotedId = localStorage.getItem(localStorageKey);
        if (storedVotedId) {
          votedParticipantId = storedVotedId;
        }
      }

      // Process the voting limits response
      // The API client returns the raw response, not wrapped in a 'data' property
      const votingLimits = (votingLimitsResult as any) || {};
      const {
        votingLimits: limits = {},
        dailyVoteCount = 0,
        lastVoteDate = null,
      } = votingLimits;

      // Use API response directly - no manual defaults
      const categoryLimit = limits[categoryName];
      const canVoteForCategory = categoryLimit
        ? categoryLimit.canVoteAgain
        : true; // Default to true if category not found (new category)

      // Create user voting status from API response - no manual defaults
      const userVotingStatus: UserVotingStatus = {
        canVote: canVoteForCategory,
        votedCategories: Object.keys(limits).filter(
          (cat) => limits[cat]?.canVoteAgain === false
        ),
        nextVoteTimes: Object.keys(limits).reduce((acc, cat) => {
          if (limits[cat]?.lastVoteTime) {
            // Calculate next vote time (24 hours after last vote)
            const lastVote = new Date(limits[cat].lastVoteTime);
            const nextVote = new Date(lastVote.getTime() + 24 * 60 * 60 * 1000);
            acc[cat] = nextVote.toISOString();
          }
          return acc;
        }, {} as { [category: string]: string }),
        timeRemaining: Object.keys(limits).reduce((acc, cat) => {
          if (limits[cat]?.remainingHours) {
            acc[cat] = limits[cat].remainingHours * 3600; // Convert hours to seconds
          }
          return acc;
        }, {} as { [category: string]: number }),
      };

      setUserVotingStatus(userVotingStatus);

      // Use API response directly - no manual calculations
      const canVote = canVoteForCategory;

      const nextVoteTime = categoryLimit?.lastVoteTime
        ? new Date(
            new Date(categoryLimit.lastVoteTime).getTime() + 24 * 60 * 60 * 1000
          ).toISOString()
        : undefined;
      const timeRemaining = categoryLimit?.remainingHours
        ? categoryLimit.remainingHours * 3600
        : undefined;

      // Clear all localStorage voting data to ensure real-time updates
      clearAllVotingData();

      // Determine voting status with API data taking priority
      const hasVotedFromAPI = !!votedParticipantId;
      const finalCanVote = canVote && !hasVotedFromAPI;

      const votingStatus: VotingStatus = {
        canVote: finalCanVote,
        votedParticipantId,
        nextVoteTime,
        timeRemaining,
        message: hasVotedFromAPI
          ? "You have already voted for this category"
          : canVote
          ? "You can vote for this category"
          : nextVoteTime && timeRemaining
          ? `You can vote again in ${Math.ceil(timeRemaining / 3600)} hours`
          : "Voting not available for this category",
      };

      setData({
        participants,
        votingStatus,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [categoryName, isAuthenticated]);

  const submitVote = useCallback(
    async (participantId: string): Promise<VoteResponse> => {
      if (!isAuthenticated) {
        return {
          success: false,
          message: "Authentication required",
        };
      }

      if (isSubmitting) {
        return {
          success: false,
          message: "Vote submission in progress. Please wait...",
        };
      }

      // Check if user can vote for this category
      if (!data.votingStatus?.canVote) {
        return {
          success: false,
          message:
            data.votingStatus?.message ||
            "You cannot vote for this category at this time",
        };
      }

      try {
        setIsSubmitting(true);

        const participant = data.participants.find(
          (p) => p._id === participantId
        );
        if (!participant) {
          throw new Error("Participant not found");
        }

        const result = await apiClient.submitVote(participantId, categoryName);

        if (result.success) {
          // Extract participantId from vote response
          const votedParticipantId =
            (result as any).vote?.participantId || participantId;

          // Store voted participant ID in localStorage for persistence
          const localStorageKey = `tasfa_voted_${categoryName}`;
          localStorage.setItem(localStorageKey, votedParticipantId);

          // Update local state to reflect the vote
          setData((prevData) => ({
            ...prevData,
            votingStatus: {
              canVote: false,
              votedParticipantId: votedParticipantId,
              nextVoteTime: new Date(
                Date.now() + 24 * 60 * 60 * 1000
              ).toISOString(),
              timeRemaining: 24 * 60 * 60,
              message:
                "You have already voted for this category. You can vote again in 24 hours.",
            },
            participants: prevData?.participants?.map((p) =>
              p._id === votedParticipantId
                ? { ...p, voteCount: p.voteCount + 1 }
                : p
            ),
          }));

          // Update user voting status
          setUserVotingStatus((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              canVote: false,
              votedCategories: [...prev.votedCategories, categoryName],
              nextVoteTimes: {
                ...prev.nextVoteTimes,
                [categoryName]: new Date(
                  Date.now() + 24 * 60 * 60 * 1000
                ).toISOString(),
              },
              timeRemaining: {
                ...prev.timeRemaining,
                [categoryName]: 24 * 60 * 60,
              },
            };
          });

          return {
            success: true,
            message:
              result.message ||
              `Vote submitted successfully for ${participant.firstName} ${participant.lastName}!`,
          };
        } else {
          return {
            success: false,
            message: result.message || "Failed to submit vote",
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? handleApiError(err as ApiError)
            : "Failed to submit vote";
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      categoryName,
      data.participants,
      data.votingStatus,
      isAuthenticated,
      isSubmitting,
    ]
  );

  const getVoteCounts = useCallback(async () => {
    try {
      const result = await apiClient.getVoteCounts();
      return result;
    } catch (err) {
      console.error("Failed to fetch vote counts:", err);
      return { success: false, message: "Failed to fetch vote counts" };
    }
  }, []);

  const getVotingHistory = useCallback(async () => {
    try {
      const result = await apiClient.getMyVotingHistory();
      return result;
    } catch (err) {
      console.error("Failed to fetch voting history:", err);
      return { success: false, message: "Failed to fetch voting history" };
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategoryData();
    } else {
      setLoading(false);
      setError("Authentication required");
    }
  }, [fetchCategoryData, isAuthenticated]);

  return {
    participants: data.participants,
    votingStatus: data.votingStatus,
    userVotingStatus,
    loading,
    error,
    isSubmitting,
    submitVote,
    refresh: fetchCategoryData,
    getVoteCounts,
    getVotingHistory,
    isAuthenticated,
    user,
  };
};

import { useState, useEffect, useCallback } from "react";
import { apiClient, handleApiError, ApiError } from "@/utils/secureApiClient";
import {
  saveVotingState,
  loadVotingState,
  storeVotingData,
  getVotingData,
  hasVotedForCategory,
  clearExpiredVotingData,
} from "@/utils/voteTimestampsUtils";

interface VotingStatus {
  canVote: boolean;
  votedParticipantId?: string;
  nextVoteTime?: string;
  message?: string;
}

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  school: string;
  awardCategory: string;
  voteCount: number;
  image?: string;
}

interface CategoryData {
  participants: Participant[];
  votingStatus: VotingStatus;
  pendingCategories: Array<{
    category: string;
    participantName: string;
    votedAt: string;
    nextVoteTime: string;
    timeRemaining: number;
    canVoteAgain: boolean;
  }>;
}

interface VoteTimestamp {
  votedAt: string | null;
  nextVoteAt: string | null;
  canVoteAgain: boolean;
  status: "available" | "pending";
}

interface CategoryStatus {
  canVote: boolean;
  reason: string;
  nextVoteTime: string | null;
  hoursUntilNextVote: number;
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
  categoryStatus: { [category: string]: CategoryStatus };
}

export const useSimpleVoting = (categoryName: string) => {
  const [data, setData] = useState<CategoryData>({
    participants: [],
    votingStatus: { canVote: false },
    pendingCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial state from localStorage
  const loadStoredState = useCallback(() => {
    return loadVotingState(categoryName);
  }, [categoryName]);

  // Save state to localStorage
  const saveState = useCallback(
    (newData: CategoryData) => {
      saveVotingState(categoryName, newData);
    },
    [categoryName]
  );

  // Get voting status from localStorage
  const getVotingStatusFromStorage = useCallback(() => {
    const hasVoted = hasVotedForCategory(categoryName);
    const votingData = getVotingData(categoryName);

    if (hasVoted && votingData) {
      const voteTime = new Date(votingData.timestamp);
      const expiresAt = new Date(voteTime.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const timeLeft = Math.max(0, expiresAt.getTime() - now.getTime());

      return {
        canVote: false,
        message:
          "You have already voted for this category. Please wait 24 hours before voting again.",
        nextVoteTime: expiresAt.toISOString(),
        votedParticipantId: votingData.participantId,
      };
    }

    return {
      canVote: true,
    };
  }, [categoryName]);

  const fetchCategoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both category participants and voting status in parallel
      const [participantsResult, votingStatusResult] = await Promise.all([
        apiClient.get(
          `/api/votes/category/${encodeURIComponent(categoryName)}`
        ),
        apiClient.get("/api/votes/voting-status"),
      ]);

      if (!participantsResult.success) {
        throw new Error(
          participantsResult.message || "Failed to fetch category participants"
        );
      }

      if (!votingStatusResult.success) {
        throw new Error(
          votingStatusResult.message || "Failed to fetch voting status"
        );
      }

      // Extract participants from backend (vote counts come from backend)
      const participants: Participant[] = Array.isArray(participantsResult.data)
        ? participantsResult.data
        : [];

      // Get voting status from localStorage first, then fallback to API
      const localStorageVotingStatus = getVotingStatusFromStorage();

      // Extract voting status using the new comprehensive structure
      const globalVotingStatus: GlobalVotingStatus =
        votingStatusResult.data as GlobalVotingStatus;
      const categoryStatus = globalVotingStatus.categoryStatus?.[categoryName];
      const voteTimestamp = globalVotingStatus.voteTimestamps?.[categoryName];

      // Use localStorage status if user has voted, otherwise use API status
      const categoryVotingStatus: VotingStatus =
        localStorageVotingStatus.canVote
          ? {
              canVote: categoryStatus?.canVote || false,
              message:
                categoryStatus?.reason ||
                "Voting not available for this category",
              nextVoteTime: categoryStatus?.nextVoteTime || undefined,
            }
          : localStorageVotingStatus;

      const newData = {
        participants,
        votingStatus: categoryVotingStatus,
        pendingCategories: globalVotingStatus.pendingCategories || [],
      };

      setData(newData);
      saveState(newData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? handleApiError(err as ApiError)
          : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [categoryName, saveState, getVotingStatusFromStorage]);

  const submitVote = useCallback(
    async (participantId: string) => {
      if (isSubmitting) {
        return {
          success: false,
          message: "Vote submission in progress. Please wait...",
        };
      }

      // Check if user has already voted for this category
      if (hasVotedForCategory(categoryName)) {
        return {
          success: false,
          message:
            "You have already voted for this category. Please wait 24 hours before voting again.",
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

        // Validate participant data before submitting
        if (!participant.firstName?.trim() || !participant.lastName?.trim()) {
          throw new Error("Invalid participant data");
        }

        const result = await apiClient.post("/api/votes", {
          firstName: participant.firstName.trim(),
          lastName: participant.lastName.trim(),
          school: participant.school.trim(),
          awardCategory: categoryName.trim(),
        });

        if (result.success) {
          // Store voting data in localStorage with 24-hour expiration (for restriction only)
          storeVotingData(categoryName, participantId);

          // Refresh the data to get updated vote counts from backend
          await fetchCategoryData();

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

        // Handle specific error cases
        if (err instanceof Error && "status" in err) {
          const apiError = err as ApiError;
          if (apiError.status === 429) {
            return {
              success: false,
              message:
                "You're voting too quickly. Please wait a moment before trying again.",
              retryAfter: 60, // 1 minute
            };
          }
          if (apiError.status === 403) {
            return {
              success: false,
              message:
                "You have already voted for this category. Please wait 24 hours before voting again.",
            };
          }
          if (apiError.status === 500) {
            return {
              success: false,
              message: "Server error. Please try again later.",
            };
          }
        }

        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [categoryName, data.participants, fetchCategoryData, isSubmitting]
  );

  // Initial fetch with fallback to stored state
  useEffect(() => {
    // Clear expired voting data first
    clearExpiredVotingData();

    const storedState = loadStoredState();
    if (storedState) {
      setData(storedState);
      setLoading(false);
    }
    fetchCategoryData();
  }, [fetchCategoryData, loadStoredState]);

  // Removed auto-refresh interval to prevent automatic refreshing

  return {
    participants: data.participants,
    votingStatus: data.votingStatus,
    pendingCategories: data.pendingCategories,
    loading,
    error,
    isSubmitting,
    submitVote,
    refresh: fetchCategoryData,
  };
};

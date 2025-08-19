import { useState, useEffect, useCallback } from "react";
import { apiClient, handleApiError, ApiError } from "@/utils/secureApiClient";

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

      // Extract participants
      const participants: Participant[] = Array.isArray(participantsResult.data)
        ? participantsResult.data
        : [];

      // Extract voting status using the new comprehensive structure
      const globalVotingStatus: GlobalVotingStatus =
        votingStatusResult.data as GlobalVotingStatus;
      const categoryStatus = globalVotingStatus.categoryStatus?.[categoryName];
      const voteTimestamp = globalVotingStatus.voteTimestamps?.[categoryName];

      const categoryVotingStatus: VotingStatus = {
        canVote: categoryStatus?.canVote || false,
        message:
          categoryStatus?.reason || "Voting not available for this category",
        nextVoteTime: categoryStatus?.nextVoteTime || undefined,
      };

      setData({
        participants,
        votingStatus: categoryVotingStatus,
        pendingCategories: globalVotingStatus.pendingCategories || [],
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? handleApiError(err as ApiError)
          : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  const submitVote = useCallback(
    async (participantId: string) => {
      if (isSubmitting) {
        return {
          success: false,
          message: "Vote submission in progress. Please wait...",
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
          // Refresh the data to get updated voting status and vote counts
          await fetchCategoryData();
          return {
            success: true,
            message: result.message || "Vote submitted successfully!",
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

  // Initial fetch
  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  // Auto-refresh every 30 seconds to keep data current
  useEffect(() => {
    const interval = setInterval(fetchCategoryData, 30000);
    return () => clearInterval(interval);
  }, [fetchCategoryData]);

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

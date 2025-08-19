import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "@/config/api";
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
  votedAt: string;
  nextVoteAt: string;
  canVoteAgain: boolean;
  participantName?: string;
}

interface GlobalVotingStatus {
  votableCategories?: string[];
  votedCategories?: string[];
  voteTimestamps?: { [category: string]: VoteTimestamp };
  pendingCategories?: Array<{
    category: string;
    participantName: string;
    votedAt: string;
    nextVoteTime: string;
    timeRemaining: number;
    canVoteAgain: boolean;
  }>;
}

export const useSimpleVoting = (categoryName: string) => {
  const [data, setData] = useState<CategoryData>({
    participants: [],
    votingStatus: { canVote: false },
    pendingCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both category participants and voting status in parallel using secure API client
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

      // Extract voting status for this specific category
      const globalVotingStatus: GlobalVotingStatus =
        votingStatusResult.data || {};
      const categoryVotingStatus: VotingStatus = {
        canVote: false,
        message: "Loading voting status...",
      };

      // Check if user can vote for this category
      if (globalVotingStatus.votableCategories?.includes(categoryName)) {
        categoryVotingStatus.canVote = true;
        categoryVotingStatus.message = "Ready to vote!";
      } else if (globalVotingStatus.votedCategories?.includes(categoryName)) {
        // User has voted for this category, find the timing info
        const voteTimestamp = globalVotingStatus.voteTimestamps?.[categoryName];
        if (voteTimestamp) {
          categoryVotingStatus.canVote = voteTimestamp.canVoteAgain || false;
          categoryVotingStatus.nextVoteTime = voteTimestamp.nextVoteAt;

          if (voteTimestamp.canVoteAgain) {
            categoryVotingStatus.message = "You can vote again!";
          } else {
            categoryVotingStatus.message =
              "You've already voted for this category";
          }

          // Find which participant was voted for
          const votedParticipant = participants.find(
            (p: Participant) =>
              p.firstName === voteTimestamp.participantName?.split(" ")[0] &&
              p.lastName ===
                voteTimestamp.participantName?.split(" ").slice(1).join(" ")
          );
          if (votedParticipant) {
            categoryVotingStatus.votedParticipantId = votedParticipant._id;
          }
        }
      } else {
        categoryVotingStatus.message = "Voting not available for this category";
      }

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
      try {
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
        return {
          success: false,
          message: errorMessage,
        };
      }
    },
    [categoryName, data.participants, fetchCategoryData]
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
    submitVote,
    refresh: fetchCategoryData,
  };
};

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { apiClient, handleApiError, ApiError } from "@/utils/secureApiClient";

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
  canVote: boolean;
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
    votingStatus: { canVote: false },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userVotingStatus, setUserVotingStatus] =
    useState<UserVotingStatus | null>(null);

  const fetchCategoryData = useCallback(async () => {
    if (!isAuthenticated) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch participants and user voting status in parallel
      const [participantsResult, statusResult] = await Promise.all([
        apiClient.getCategoryParticipants(categoryName),
        apiClient.getMyVotingStatus(),
      ]);

      if (!participantsResult.success) {
        throw new Error(
          participantsResult.message || "Failed to fetch category participants"
        );
      }

      if (!statusResult.success) {
        throw new Error(
          statusResult.message || "Failed to fetch voting status"
        );
      }

      const participants: Participant[] = participantsResult.data || [];
      const status: UserVotingStatus = statusResult.data;

      setUserVotingStatus(status);

      // Check if user can vote for this category
      const canVote =
        status.canVote && !status.votedCategories.includes(categoryName);
      const nextVoteTime = status.nextVoteTimes[categoryName];
      const timeRemaining = status.timeRemaining[categoryName];

      const votingStatus: VotingStatus = {
        canVote,
        nextVoteTime,
        timeRemaining,
        message: canVote
          ? "You can vote for this category"
          : nextVoteTime
          ? `You can vote again in ${Math.ceil(timeRemaining / 3600)} hours`
          : "You have already voted for this category",
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
      if (!data.votingStatus.canVote) {
        return {
          success: false,
          message:
            data.votingStatus.message ||
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
          // Update local state to reflect the vote
          setData((prevData) => ({
            ...prevData,
            votingStatus: {
              canVote: false,
              votedParticipantId: participantId,
              nextVoteTime: new Date(
                Date.now() + 24 * 60 * 60 * 1000
              ).toISOString(),
              timeRemaining: 24 * 60 * 60,
              message:
                "You have already voted for this category. You can vote again in 24 hours.",
            },
            participants: prevData.participants.map((p) =>
              p._id === participantId ? { ...p, voteCount: p.voteCount + 1 } : p
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

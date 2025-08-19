"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useVotingStatus } from "@/hooks/useVotingStatus";
import { API_ENDPOINTS } from "@/config/api";
import { categorySlugToName } from "@/utils/categoryMapping";
import VotingTimer from "@/components/VotingTimer";
import { fetchWithRetry } from "@/utils/rateLimitHandler";
import {
  getCachedParticipants,
  setCachedParticipants,
  updateCachedVoteCount,
  cleanupOldLocalStorageKeys,
  markFetchAttempt,
} from "@/utils/participantCache";

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  school: string;
  awardCategory: string;
  voteCount: number;
  image?: string;
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votedParticipantId, setVotedParticipantId] = useState<string | null>(
    null
  );

  const {
    votingStatus,
    canVoteForCategory,
    updateVotingStatus,
    getNextVoteTime,
    setVotingMode,
  } = useVotingStatus();

  const slug = params.category;
  const categoryName = categorySlugToName[slug] || slug;
  const canVote = canVoteForCategory(categoryName);
  const nextVoteTime = getNextVoteTime(categoryName);

  // Backend workaround: If user has voted, they can't vote again regardless of server status
  const actualCanVote = canVote && votedParticipantId === null;

  // Debug logging
  console.log("Voting status debug:", {
    categoryName,
    canVote,
    votedParticipantId,
    actualCanVote,
    voteTimestamps: votingStatus.voteTimestamps[categoryName],
  });

  // Initialize cache cleanup on mount
  useEffect(() => {
    cleanupOldLocalStorageKeys();
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check localStorage cache first
        const cached = getCachedParticipants(categoryName);

        if (cached && cached.length > 0) {
          console.log(
            `Using cached data for ${categoryName}:`,
            cached.length,
            "participants"
          );
          setParticipants(cached);
          setLoading(false);

          // Still fetch voting history in background
          fetchVotingHistory();
          return; // Exit early if we have cached data
        }

        console.log(`No cache found for ${categoryName}, fetching from API...`);

        // Mark fetch attempt
        markFetchAttempt(categoryName, false);

        // If no cache, fetch from API
        const response = await fetchWithRetry(
          API_ENDPOINTS.category(categoryName),
          {},
          {
            maxRetries: 3,
            showNotification: true,
            baseDelay: 3000, // Longer delay for rate limits
          }
        );

        if (!response.ok) {
          markFetchAttempt(categoryName, false);

          if (response.status === 429) {
            setError("High traffic detected. Please try again in a moment.");
          } else {
            setError("Failed to fetch participants");
          }
          return;
        }

        const data = await response.json();
        if (data.success) {
          console.log(
            `Successfully fetched ${data.data.length} participants for ${categoryName}`
          );

          setParticipants(data.data);

          // Cache the participants data in localStorage
          setCachedParticipants(categoryName, data.data);
          markFetchAttempt(categoryName, true);

          // Fetch voting history
          await fetchVotingHistory();
        } else {
          markFetchAttempt(categoryName, false);
          setError("Failed to fetch participants");
        }
      } catch (err: any) {
        markFetchAttempt(categoryName, false);

        if (err.message?.includes("Rate limited") || err.status === 429) {
          setError("High traffic detected. Please try again in a moment.");
        } else {
          setError("Error, please try again");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchVotingHistory = async () => {
      try {
        const historyResponse = await fetchWithRetry(
          API_ENDPOINTS.votingHistory,
          {},
          {
            maxRetries: 2,
            showNotification: false,
          }
        );
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          if (historyData.success) {
            const votedParticipant = historyData.data.votedParticipants.find(
              (p: any) => p.awardCategory === categoryName
            );
            if (votedParticipant) {
              setVotedParticipantId(votedParticipant._id);
            } else {
              setVotedParticipantId(null);
            }
          }
        }
      } catch (historyErr) {
        console.warn("Failed to fetch voting history:", historyErr);
        setVotedParticipantId(null);
      }
    };

    fetchParticipants();
  }, [categoryName]);

  // Clear votedParticipantId when user can vote (24-hour restriction expired)
  useEffect(() => {
    if (canVote && votedParticipantId !== null) {
      setVotedParticipantId(null);
    }
  }, [canVote, votedParticipantId, categoryName]);

  const handleVote = async (participantId: string) => {
    if (!actualCanVote) {
      toast.error("You cannot vote at this time");
      return;
    }

    // Find the participant details
    const participant = participants.find((p) => p._id === participantId);
    if (!participant) {
      toast.error("Participant not found");
      return;
    }

    try {
      const response = await fetchWithRetry(
        API_ENDPOINTS.votes,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: participant.firstName,
            lastName: participant.lastName,
            school: participant.school,
            awardCategory: participant.awardCategory,
          }),
        },
        {
          maxRetries: 2,
          showNotification: true,
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Too many requests. Please wait before voting again.");
        } else {
          toast.error("Failed to submit vote");
        }
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Vote submitted successfully!");

        // Update local state immediately
        setVotedParticipantId(participantId);
        console.log(
          "Vote successful - set votedParticipantId to:",
          participantId
        );

        // Update cache with new vote count
        const updatedParticipants = participants.map((participant) =>
          participant._id === participantId
            ? { ...participant, voteCount: participant.voteCount + 1 }
            : participant
        );

        setParticipants(updatedParticipants);
        const currentParticipant = participants.find(
          (p) => p._id === participantId
        );
        if (currentParticipant) {
          updateCachedVoteCount(
            categoryName,
            participantId,
            currentParticipant.voteCount + 1
          );
        }

        // Update voting status immediately to disable voting
        updateVotingStatus(categoryName);
        console.log("Updated voting status for category:", categoryName);

        // Set voting mode to active to refresh status
        setVotingMode();
      } else {
        toast.error(data.error || "Failed to submit vote");
      }
    } catch (error) {
      console.error("Vote submission error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleVotingAvailable = () => {
    console.log("Voting available - resetting local state");
    setVotedParticipantId(null);
    updateVotingStatus(categoryName);
  };

  if (loading) {
    return (
      <section className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005B96] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading participants...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1B1464] text-center mb-4">
          {categoryName}
        </h1>

        {/* Voting Status Banner */}
        {!actualCanVote && nextVoteTime && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-orange-800">
                  🗳️ Voting Status for {categoryName}
                </h3>
              </div>
              <div className="flex items-center justify-center mb-3">
                <VotingTimer
                  categoryName={categoryName}
                  nextVoteTime={nextVoteTime}
                  onVotingAvailable={handleVotingAvailable}
                  compact={false}
                />
              </div>
              <p className="text-xs text-orange-700 text-center">
                You can vote again once the countdown reaches zero
              </p>
            </div>
          </div>
        )}

        {actualCanVote && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-sm font-medium text-green-800">
                  ✅ Ready to Vote!
                </h3>
              </div>
              <p className="text-xs text-green-700">
                Choose your favorite participant below
              </p>
            </div>
          </div>
        )}

        {participants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No participants found for this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants.map((participant) => (
              <div
                key={participant._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-80 md:h-80 w-full">
                  {participant.image ? (
                    <img
                      src={participant.image}
                      alt={`${participant.firstName} ${participant.lastName}`}
                      className="object-cover object-top w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#005B96] to-[#1B1464] flex items-center justify-center">
                      <div className="text-white text-4xl font-bold">
                        {participant.firstName.charAt(0).toUpperCase()}
                        {participant.lastName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-5 py-6 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-2">
                    {participant.firstName} {participant.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">{participant.school}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Votes:</span>
                      <span className="text-lg font-bold text-[#1B1464]">
                        {participant.voteCount}
                      </span>
                    </div>
                    {votedParticipantId === participant._id ? (
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                        ✓ Voted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVote(participant._id)}
                        disabled={!actualCanVote}
                        className={`px-6 py-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 ${
                          !actualCanVote
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#005B96] text-white hover:bg-[#004080] hover:scale-105 active:scale-95"
                        }`}
                        title={
                          !actualCanVote
                            ? votedParticipantId === participant._id
                              ? "You have already voted for this participant"
                              : "You need to wait before voting again"
                            : "Click to vote"
                        }
                      >
                        {!actualCanVote
                          ? votedParticipantId === participant._id
                            ? "✓ Voted"
                            : "⏰ Wait"
                          : "Vote"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

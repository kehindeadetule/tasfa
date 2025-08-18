"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useVotingStatus } from "@/hooks/useVotingStatus";
import { API_ENDPOINTS } from "@/config/api";
import { categorySlugToName } from "@/utils/categoryMapping";
import VotingTimer from "@/components/VotingTimer";

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
    canVoteForCategory,
    updateVotingStatus,
    votingStatus,
    getNextVoteTime,
  } = useVotingStatus();

  const slug = params.category;
  const categoryName = categorySlugToName[slug] || slug;
  const canVote = canVoteForCategory(categoryName);
  const nextVoteTime = getNextVoteTime(categoryName);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.category(categoryName));
        if (!response.ok) {
          setError("Failed to fetch participants");
          return;
        }
        const data = await response.json();
        if (data.success) {
          setParticipants(data.data);
          console.log(data.data);
          // Check voting history
          try {
            const historyResponse = await fetch(API_ENDPOINTS.votingHistory);
            if (historyResponse.ok) {
              const historyData = await historyResponse.json();
              if (historyData.success) {
                const votedParticipant =
                  historyData.data.votedParticipants.find(
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
            setVotedParticipantId(null);
          }
        } else {
          setError("Failed to fetch participants");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [categoryName]);

  const handleVote = async (participant: Participant) => {
    if (!canVote) {
      toast.info(
        `You have already voted for ${categoryName} today. Check the countdown timer to see when you can vote again!`,
        {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    if (votedParticipantId !== null) return;
    try {
      const response = await fetch(API_ENDPOINTS.votes, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: participant.firstName,
          lastName: participant.lastName,
          school: participant.school,
          awardCategory: categoryName,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to submit vote. Please try again.");
        return;
      }
      const data = await response.json();
      if (data.success) {
        setParticipants((prev) =>
          prev.map((p) =>
            p._id === participant._id
              ? { ...p, voteCount: data.data.voteCount }
              : p
          )
        );
        setVotedParticipantId(participant._id);
        updateVotingStatus(categoryName);
        toast.success(
          `Vote count for ${participant.firstName} ${participant.lastName}!`
        );
      } else {
        toast.error("Failed to submit vote. Please try again.");
      }
    } catch (err) {
      toast.error(
        "Error submitting vote. Please check your connection and try again."
      );
    }
  };

  const handleVotingAvailable = () => {
    toast.success(`Voting is now available for ${categoryName}!`, {
      position: "top-center",
      autoClose: 5000,
    });
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
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#005B96] text-white rounded-full hover:bg-[#004080]"
            >
              Try Again
            </button>
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
        {!canVote && nextVoteTime && (
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

        {canVote && votedParticipantId === null && (
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
                        onClick={() => handleVote(participant)}
                        // disabled={!canVote || votedParticipantId !== null}
                        disabled={true}
                        className={`px-6 py-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 ${
                          !canVote
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : votedParticipantId !== null
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#005B96] text-white hover:bg-[#004080] hover:scale-105 active:scale-95"
                        }`}
                        title={
                          !canVote
                            ? "You need to wait before voting again"
                            : votedParticipantId !== null
                            ? "You have already voted in this category"
                            : "Click to vote"
                        }
                      >
                        {!canVote ? "⏰ Wait" : "Vote"}
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

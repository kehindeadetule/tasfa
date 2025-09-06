"use client";

import { toast } from "react-toastify";
import { categorySlugToName } from "@/utils/categoryMapping";
import { useAuth } from "@/hooks/useAuth";
import { useSecureVoting } from "@/hooks/useSecureVoting";
import { useState } from "react";

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
  const slug = params.category;
  const categoryName = categorySlugToName[slug] || slug;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [disableVoteButton, setDisableVoteButton] = useState(false);

  const {
    participants,
    votingStatus,
    loading,
    error,
    isSubmitting,
    submitVote,
    refresh,
  } = useSecureVoting(categoryName);

  const handleVote = async (participant: Participant) => {
    // Prevent multiple rapid clicks
    if (isSubmitting) {
      toast.info("Vote submission in progress. Please wait...");
      return;
    }

    const result = await submitVote(participant._id);

    if (result.success) {
      setDisableVoteButton(true);
      toast.success(
        result.message ||
          `Vote submitted for ${participant.firstName} ${participant.lastName}!`
      );
    } else {
      toast.error(result.message || "Failed to submit vote. Please try again.");
      setDisableVoteButton(false);
    }
  };

  // Get the voted participant ID for highlighting
  const votedParticipantId = votingStatus.votedParticipantId;

  if (authLoading) {
    return (
      <section className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005B96] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔐 Authentication Required
              </h2>
              <p className="text-gray-600 mb-6">
                Please log in with your phone number and password to vote for{" "}
                {categoryName}
              </p>
              <div className="space-y-4">
                <a
                  href="/auth"
                  className="w-full bg-[#005B96] hover:bg-[#004080] text-white font-semibold py-3 px-6 rounded-lg transition-colors block text-center"
                >
                  Login / Sign Up
                </a>
                <a
                  href="/voting"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors block text-center"
                >
                  Go to Secure Voting
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
      <section className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refresh}
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

        {/* Voting Status */}
        {!votingStatus.canVote && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-orange-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-800">
                  {votingStatus.message ||
                    "You have already voted for this category"}
                </p>
                {votingStatus.nextVoteTime && (
                  <p className="text-xs text-orange-600 mt-1">
                    Next vote available:{" "}
                    {new Date(votingStatus.nextVoteTime).toLocaleString()}
                  </p>
                )}
              </div>
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
                        // disabled={true}
                        disabled={
                          !votingStatus.canVote ||
                          !!votingStatus.votedParticipantId ||
                          disableVoteButton ||
                          isSubmitting
                        }
                        className={`px-6 py-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 ${
                          !votingStatus.canVote ||
                          votedParticipantId ||
                          disableVoteButton ||
                          isSubmitting
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#005B96] text-white hover:bg-[#004080] hover:scale-105 active:scale-95"
                        }`}
                        title={
                          isSubmitting
                            ? "Vote submission in progress..."
                            : !votingStatus.canVote
                            ? votingStatus.message || "Voting not available"
                            : votedParticipantId
                            ? "You have already voted in this category"
                            : "Click to vote"
                        }
                      >
                        {isSubmitting
                          ? "Submitting..."
                          : !votingStatus.canVote || disableVoteButton
                          ? "⏰ Wait"
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

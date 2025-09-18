"use client";

import { toast } from "react-toastify";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSecureVoting } from "@/hooks/useSecureVoting";
import { categorySlugToName } from "@/utils/categoryMapping";

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
  const votedParticipantId = votingStatus?.votedParticipantId;

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
          <div className="max-w-md mx-auto w-full space-y-10">
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔐 Authentication Required
              </h2>
              <p className="text-gray-600 mb-6">
                Please log in with your Email Address and password to view{" "}
                {categoryName}
              </p>
              <div className="space-y-4">
                <a
                  href="/auth"
                  className="w-full bg-[#005B96] hover:bg-[#004080] text-white font-semibold py-3 px-6 rounded-lg transition-colors block text-center"
                >
                  Login | Sign Up
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

        {/* Voting Status - Voting Ended */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">
                🏁 Voting has ended for this category!
              </p>
              <p className="text-xs text-red-600 mt-1">
                Thank you for participating in the TASFA Awards voting.
              </p>
            </div>
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No participants found for this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants?.map((participant: Participant) => (
              <div
                key={participant._id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                  votingStatus?.votedParticipantId === participant._id
                    ? "ring-2 ring-green-500 ring-opacity-50"
                    : ""
                }`}
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
                  {/* Voted indicator overlay */}
                  {votingStatus?.votedParticipantId === participant._id && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
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
                    {votingStatus?.votedParticipantId === participant._id ? (
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                        ✓ Voted
                      </span>
                    ) : (
                      <button
                        disabled={true}
                        className="px-6 py-2 rounded-full font-medium transition-all duration-200 bg-gray-300 text-gray-500 cursor-not-allowed"
                        title="Voting has ended"
                      >
                        🏁 Ended
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

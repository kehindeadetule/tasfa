"use client";

import { toast } from "react-toastify";
import { categorySlugToName } from "@/utils/categoryMapping";
import { useSimpleVoting } from "@/hooks/useSimpleVoting";
import SimpleVotingStatus from "@/components/SimpleVotingStatus";

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
  
  const {
    participants,
    votingStatus,
    pendingCategories,
    loading,
    error,
    submitVote,
  } = useSimpleVoting(categoryName);

  const handleVote = async (participant: Participant) => {
    const result = await submitVote(participant._id);
    
    if (result.success) {
      toast.success(result.message || `Vote submitted for ${participant.firstName} ${participant.lastName}!`);
    } else {
      toast.error(result.message || "Failed to submit vote. Please try again.");
    }
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

        {/* Voting Status - Backend controlled */}
        <SimpleVotingStatus 
          votingStatus={votingStatus} 
          categoryName={categoryName}
          pendingCategories={pendingCategories}
        />

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
                    {votingStatus.votedParticipantId === participant._id ? (
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                        ✓ Voted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVote(participant)}
                        disabled={!votingStatus.canVote || !!votingStatus.votedParticipantId}
                        className={`px-6 py-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 ${
                          !votingStatus.canVote || votingStatus.votedParticipantId
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#005B96] text-white hover:bg-[#004080] hover:scale-105 active:scale-95"
                        }`}
                        title={
                          !votingStatus.canVote
                            ? votingStatus.message || "Voting not available"
                            : votingStatus.votedParticipantId
                            ? "You have already voted in this category"
                            : "Click to vote"
                        }
                      >
                        {!votingStatus.canVote ? "⏰ Wait" : "Vote"}
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

"use client";

import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSecureVoting } from "@/hooks/useSecureVoting";
import { categorySlugToName } from "@/utils/categoryMapping";
import { API_BASE_URL } from "@/config/api";

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  school: string;
  awardCategory: string;
  voteCount: number;
  image?: string;
}

interface CategoryPageUIProps {
  category: string;
}

export default function CategoryPageUI({ category }: CategoryPageUIProps) {
  const { user } = useAuth();
  const { submitVote, isSubmitting } = useSecureVoting(category);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryName = categorySlugToName[category] || category;

  const handleVote = async (participantId: string) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }

    try {
      const result = await submitVote(participantId);
      if (result.success) {
        toast.success("Vote submitted successfully!");
        // Refresh participants to show updated vote count
        fetchParticipants();
      } else {
        toast.error(result.message || "Failed to submit vote");
      }
    } catch (error) {
      console.error("Voting error:", error);
      toast.error("An error occurred while voting");
    }
  };

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/email-voting/category/${encodeURIComponent(
          category
        )}`
      );
      const data = await response.json();

      if (data.success) {
        setParticipants(data.data.participants || []);
      } else {
        setError(data.message || "Failed to fetch participants");
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      setError("Failed to fetch participants");
    } finally {
      setLoading(false);
    }
  };

  // Fetch participants on component mount
  useEffect(() => {
    fetchParticipants();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading participants...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the nominees for {categoryName}.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="text-red-500 text-3xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Category
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchParticipants}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryName}
          </h1>
          <p className="text-sm text-gray-800">
            🏁 Voting has ended for{" "}
            <span className="font-bold">{categoryName}!</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Thank you for participating in the TASFA Awards voting.
          </p>
        </div>

        {/* Participants Grid */}
        {participants?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Participants Yet
            </h3>
            <p className="text-gray-600">
              No nominees have been submitted for this category yet.
            </p>
          </div>
        ) : (
          // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          //   {participants?.map((participant) => (
          //     <div
          //       key={participant._id}
          //       className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          //     >
          //       {/* Participant Image */}
          //       <div className="aspect-w-16 aspect-h-12 bg-gray-200">
          //         {participant.image ? (
          //           <img
          //             src={participant.image}
          //             alt={`${participant.firstName} ${participant.lastName}`}
          //             className="w-full h-48 object-cover"
          //           />
          //         ) : (
          //           <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
          //             <div className="text-6xl text-gray-400">
          //               {participant.firstName.charAt(0)}
          //               {participant.lastName.charAt(0)}
          //             </div>
          //           </div>
          //         )}
          //       </div>

          //       {/* Participant Info */}
          //       <div className="p-6">
          //         <h3 className="text-xl font-bold text-gray-900 mb-2">
          //           {participant.firstName} {participant.lastName}
          //         </h3>
          //         <p className="text-gray-600 mb-2">{participant.school}</p>
          //         <p className="text-sm text-gray-500 mb-4">
          //           {participant.voteCount} vote
          //           {participant.voteCount !== 1 ? "s" : ""}
          //         </p>

          //         {/* Vote Button */}
          //         <button
          //           onClick={() => handleVote(participant._id)}
          //           disabled={isSubmitting}
          //           className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          //         >
          //           {isSubmitting ? "Voting..." : "Vote"}
          //         </button>
          //       </div>
          //     </div>
          //   ))}
          // </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants?.map((participant: Participant) => (
              <div
                key={participant._id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`}
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
                </div>
                <div className="px-5 py-6 md:p-4">
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

                    <button
                      // onClick={() => handleVote(participant)}
                      disabled={true}
                      className={`px-6 py-2 rounded-full font-medium transition-all duration-200  disabled:cursor-not-allowed disabled:bg-[#005B96]/50 bg-[#005B96] text-white hover:bg-[#004080]
                        `}
                    >
                      Voting has ended
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Back to Awards Button */}
        <div className="text-center mt-12">
          <a
            href="/awards"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1B1464] hover:bg-[#1B1464]/80 transition-colors"
          >
            ← Back to All Categories
          </a>
        </div>
      </div>
    </div>
  );
}

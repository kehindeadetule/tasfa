"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useVotingStatus } from "@/hooks/useVotingStatus";
import { API_ENDPOINTS } from "@/config/api";
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
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votedParticipantId, setVotedParticipantId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { canVoteForCategory, updateVotingStatus, votingStatus } = useVotingStatus();

  const slug = params.category;
  const categoryName = categorySlugToName[slug] || slug;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.category(categoryName));
        if (!response.ok) {
          setError('Failed to fetch participants');
          return;
        }
        const data = await response.json();
        if (data.success) {
          setParticipants(data.data);
          // Check voting history
          try {
            const historyResponse = await fetch(API_ENDPOINTS.votingHistory);
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
            setVotedParticipantId(null);
          }
        } else {
          setError('Failed to fetch participants');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [categoryName]);

  const handleVote = async (participant: Participant) => {
    if (!canVoteForCategory(categoryName)) {
      setShowNotification(true);
      return;
    }
    if (votedParticipantId !== null) return;
    try {
      const response = await fetch(API_ENDPOINTS.votes, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: participant.firstName,
          lastName: participant.lastName,
          school: participant.school,
          awardCategory: categoryName
        })
      });
      if (!response.ok) {
        setError('Failed to submit vote');
        return;
      }
      const data = await response.json();
      if (data.success) {
        setParticipants(prev => 
          prev.map(p => 
            p._id === participant._id 
              ? { ...p, voteCount: data.data.voteCount }
              : p
          )
        );
        setVotedParticipantId(participant._id);
        updateVotingStatus(categoryName);
      } else {
        setError('Failed to submit vote');
      }
    } catch (err) {
      setError('Error submitting vote');
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
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
        <h1 className="text-3xl md:text-4xl font-bold text-[#1B1464] text-center mb-8">
          {categoryName}
        </h1>
        {participants.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No Participants Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Be the first to nominate someone for the "{categoryName}" category!
                </p>
                <Link
                  href={`/voting-form?category=${encodeURIComponent(categoryName)}`}
                  className="inline-flex items-center px-6 py-3 bg-[#005B96] text-white rounded-lg hover:bg-[#004080] transition-colors font-medium"
                >
                  🎭 Submit Nomination
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants.map((participant) => (
              <div
                key={participant._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 w-full">
                  <img
                    src={participant.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face"}
                    alt={`${participant.firstName} ${participant.lastName}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">
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
                        disabled={votedParticipantId !== null}
                        className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                          votedParticipantId === participant._id
                            ? "bg-green-500 text-white cursor-not-allowed"
                            : !canVoteForCategory(categoryName)
                            ? "bg-gray-300 text-gray-500 cursor-pointer"
                            : votedParticipantId !== null
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#005B96] text-white hover:bg-[#004080] hover:scale-105 active:scale-95"
                        }`}
                      >
                        {votedParticipantId === participant._id
                          ? "✓ Voted"
                          : !canVoteForCategory(categoryName)
                          ? "Vote"
                          : votedParticipantId !== null
                          ? "Vote"
                          : "Vote"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Submit Nomination Button */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Know someone deserving?
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Nominate a candidate for the "{categoryName}" category
            </p>
            <Link
              href={`/voting-form?category=${encodeURIComponent(categoryName)}`}
              className="inline-flex items-center px-6 py-3 bg-[#005B96] text-white rounded-lg hover:bg-[#004080] transition-colors font-medium"
            >
              🎭 Submit Nomination
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 
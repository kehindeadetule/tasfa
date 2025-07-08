"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useVotingStatus } from "@/hooks/useVotingStatus";
import VoteNotification from "@/components/VoteNotification";

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  school: string;
  image?: string;
  voteCount: number;
}

const categorySlugToName: Record<string, string> = {
  'best-actor': 'Best Actor',
  'best-actress': 'Best Actress',
  'best-supporting-actor': 'Best Supporting Actor',
  'best-supporting-actress': 'Best Supporting Actress',
  'revelation-of-the-year-male': 'Revelation of the Year (Male)',
  'revelation-of-the-year-female': 'Revelation of the Year (Female)',
  'best-director': 'Best Director',
  'best-stage-manager': 'Best Stage Manager',
  'best-playwright': 'Best Playwright',
  'best-set-designer': 'Best Set Designer',
  'best-light-designer': 'Best Light Designer',
  'best-props-designer': 'Best Props Designer',
  'best-costumier': 'Best Costumier',
  'best-makeup-artist': 'Best Makeup Artist',
  'best-publicity-manager': 'Best Publicity Manager',
  'best-dancer-male': 'Best Dancer (Male)',
  'best-dancer-female': 'Best Dancer (Female)',
  'best-drummer-male': 'Best Drummer (Male)',
  'best-drummer-female': 'Best Drummer (Female)',
  'best-choreographer': 'Best Choreographer',
  'best-music-director': 'Best Music Director',
  'best-media-student-male': 'Best Media Student (Male)',
  'best-media-student-female': 'Best Media Student (Female)',
  'creative-art-institution-of-the-year': 'Creative Art Institution of the Year',
  'creative-art-institution-of-the-year-1st-runner-up': 'Creative Art Institution of the Year (1st Runner-Up)',
  'creative-art-institution-of-the-year-2nd-runner-up': 'Creative Art Institution of the Year (2nd Runner-Up)',
  'theatre-legend-of-the-year': 'Theatre Legend of the Year',
};

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

  // Fetch participants from backend and check voting status
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://172.20.10.2:3001/api/votes/category/${categoryName}`);
        
        if (!response.ok) {
          if (response.status === 429) {
            setError('Too many requests. Please wait a moment and try again.');
          } else {
            setError('Failed to fetch participants');
          }
          return;
        }
        
        const data = await response.json();
        
        if (data.success) {
          setParticipants(data.data);
          // Always check voting history to see if user has voted for this category
          try {
            const historyResponse = await fetch('http://172.20.10.2:3001/api/votes/voting-history');
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
            console.log('Could not fetch voting history:', historyErr);
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
    // Check if user can vote for this category
    if (!canVoteForCategory(categoryName)) {
      setShowNotification(true);
      return;
    }

    if (votedParticipantId !== null) return;

    try {
      const response = await fetch('http://172.20.10.2:3001/api/votes', {
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
        if (response.status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
        } else {
          setError('Failed to submit vote');
        }
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        // Update the participant's vote count in the local state
        setParticipants(prev => 
          prev.map(p => 
            p._id === participant._id 
              ? { ...p, voteCount: data.data.voteCount }
              : p
          )
        );
        setVotedParticipantId(participant._id);
        // Update voting status to reflect that user has voted for this category
        updateVotingStatus(categoryName);
      } else {
        if (data.error && data.error.includes('already voted')) {
          setShowNotification(true);
          // Update voting status if server says user already voted
          updateVotingStatus(categoryName);
        } else {
          setError('Failed to submit vote');
        }
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
            <p className="text-gray-600 text-lg">No participants found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants.map((participant) => (
              <div
                key={participant._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={participant.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face"}
                    alt={`${participant.firstName} ${participant.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    {participant.firstName} {participant.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">{participant.school}</p>

                  {/* Vote Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Votes:</span>
                      <span className="text-lg font-bold text-[#1B1464]">
                        {participant.voteCount}
                      </span>
                    </div>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vote Notification */}
      <VoteNotification
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        categoryName={categoryName}
      />
    </section>
  );
} 
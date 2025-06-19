"use client";

import Image from "next/image";
import { useState } from "react";

// This would typically come from your database
const mockParticipants = [
  {
    id: 1,
    name: "John Doe",
    school: "School of Performing Arts",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
    quote: "Theatre is my passion and my life.",
    initialVotes: 127,
  },
  {
    id: 2,
    name: "Jane Smith",
    school: "Drama Academy",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face",
    quote: "Every performance is a new journey.",
    initialVotes: 89,
  },
  // Add more mock participants as needed
];

export default function CategoryPage({
  params,
}: {
  params: { zone: string; category: string };
}) {
  const [votes, setVotes] = useState<Record<number, number>>(
    mockParticipants.reduce((acc, participant) => {
      acc[participant.id] = participant.initialVotes;
      return acc;
    }, {} as Record<number, number>)
  );

  const [votedParticipantId, setVotedParticipantId] = useState<number | null>(
    null
  );

  const handleVote = (participantId: number) => {
    if (votedParticipantId === null) {
      setVotes((prev) => ({
        ...prev,
        [participantId]: prev[participantId] + 1,
      }));
      setVotedParticipantId(participantId);
    }
  };

  const zoneName = params.zone.charAt(0).toUpperCase() + params.zone.slice(1);
  const categoryName = params.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl text-[#1B1464] font-bold text-center mb-8">
          {zoneName} Zone - {categoryName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockParticipants.map((participant) => (
            <div
              key={participant.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={participant.image}
                  alt={participant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">
                  {participant.name}
                </h2>
                <p className="text-gray-600 mb-4">{participant.school}</p>
                <blockquote className="italic text-gray-700 border-l-4 border-gray-300 pl-4 mb-4">
                  "{participant.quote}"
                </blockquote>

                {/* Vote Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Votes:</span>
                    <span className="text-lg font-bold text-[#1B1464]">
                      {votes[participant.id]}
                    </span>
                  </div>
                  <button
                    onClick={() => handleVote(participant.id)}
                    disabled={votedParticipantId !== null}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                      votedParticipantId !== null
                        ? votedParticipantId === participant.id
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#005B96] text-white hover:bg-[#004080] hover:scale-105 active:scale-95"
                    }`}
                  >
                    {votedParticipantId === participant.id
                      ? "✓ Voted"
                      : votedParticipantId !== null
                      ? "Vote"
                      : "Vote"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

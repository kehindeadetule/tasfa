"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { useSecureVoting } from "@/hooks/useSecureVoting";
import { apiClient } from "@/utils/secureApiClient";

interface SecureVotingInterfaceProps {
  categoryName?: string;
}

const SecureVotingInterface: React.FC<SecureVotingInterfaceProps> = ({
  categoryName = "Best Actor",
}) => {
  const { user, logout } = useAuth();
  const {
    participants,
    votingStatus,
    userVotingStatus,
    loading,
    error,
    submitVote,
    isSubmitting,
    getVoteCounts,
    getVotingHistory,
  } = useSecureVoting(categoryName);

  const [voteCounts, setVoteCounts] = useState<any>(null);
  const [votingHistory, setVotingHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countsResult, historyResult] = await Promise.all([
          getVoteCounts(),
          getVotingHistory(),
        ]);

        if (countsResult.success) {
          setVoteCounts(countsResult.data);
        }

        if (historyResult.success) {
          setVotingHistory(historyResult.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch additional data:", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, getVoteCounts, getVotingHistory]);

  const handleVote = async (participantId: string) => {
    const result = await submitVote(participantId);

    if (result.success) {
      toast.success(result.message);
      // Refresh vote counts
      const countsResult = await getVoteCounts();
      if (countsResult.success) {
        setVoteCounts(countsResult.data);
      }
    } else {
      toast.error(result.message);
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005B96] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading voting interface...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🗳️ TASFA Awards Voting
              </h1>
              <p className="text-gray-600">
                Vote for your favorite participants in each category
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">
                Logged in as: <span className="font-medium">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Logout
              </button>
            </div>
          </div>

          {/* User Stats */}
          {userVotingStatus && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {userVotingStatus.votedCategories.length}
                </div>
                <div className="text-sm text-green-700">Categories Voted</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {userVotingStatus?.canVote ? "Yes" : "No"}
                </div>
                <div className="text-sm text-blue-700">Can Vote</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {voteCounts?.totalVotes || 0}
                </div>
                <div className="text-sm text-purple-700">Total Votes</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.keys(userVotingStatus.nextVoteTimes).length}
                </div>
                <div className="text-sm text-orange-700">
                  Pending Categories
                </div>
              </div>
            </div>
          )}

          {/* Voting Status */}
          {votingStatus && !votingStatus?.canVote && (
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
                    {votingStatus.message}
                  </p>
                  {votingStatus.timeRemaining && (
                    <p className="text-xs text-orange-600 mt-1">
                      Time remaining:{" "}
                      {formatTimeRemaining(votingStatus.timeRemaining)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              {showHistory ? "Hide" : "Show"} Voting History
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Voting History */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Voting History
            </h2>
            {votingHistory.length > 0 ? (
              <div className="space-y-4">
                {votingHistory.map((vote, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{vote.participantName}</div>
                      <div className="text-sm text-gray-600">
                        {vote.awardCategory}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vote.participantSchool}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(vote.votedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No voting history found
              </p>
            )}
          </motion.div>
        )}

        {/* Category Participants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {categoryName} - Participants
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants?.map((participant) => (
              <motion.div
                key={participant._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-center">
                  {participant.image ? (
                    <img
                      src={participant.image}
                      alt={`${participant.firstName} ${participant.lastName}`}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-500">
                        {participant.firstName.charAt(0)}
                        {participant.lastName.charAt(0)}
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {participant.firstName} {participant.lastName}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2">
                    {participant.school}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Votes:</span>
                    <span className="text-lg font-bold text-[#005B96]">
                      {participant.voteCount}
                    </span>
                  </div>

                  <motion.button
                    onClick={() => handleVote(participant._id)}
                    disabled={!votingStatus?.canVote || isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors ${
                      !votingStatus?.canVote || isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#005B96] hover:bg-[#004080] cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? "Voting..." : "Vote"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {participants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No participants found for this category
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SecureVotingInterface;

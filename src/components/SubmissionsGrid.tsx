"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/config/api";

interface Submission {
  _id: string;
  firstName: string;
  lastName: string;
  school: string;
  awardCategory: string;
  image?: string;
  voteCount: number;
  createdAt: string;
}

interface EditFormData {
  firstName: string;
  lastName: string;
  school: string;
  awardCategory: string;
}

const SubmissionsGrid: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(
    null
  );
  const [editFormData, setEditFormData] = useState<EditFormData>({
    firstName: "",
    lastName: "",
    school: "",
    awardCategory: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubmissionsByCategory(selectedCategory);
    } else {
      fetchSubmissions();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/voting-form/categories`
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      // Error fetching categories
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/voting-form/submissions`
      );
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionsByCategory = async (category: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/voting-form/submissions/category/${encodeURIComponent(
          category
        )}`
      );
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = (submission: Submission) => {
    setEditingSubmission(submission);
    setEditFormData({
      firstName: submission.firstName,
      lastName: submission.lastName,
      school: submission.school,
      awardCategory: submission.awardCategory,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/voting-form/submissions/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Submission deleted successfully");
        fetchSubmissions();
      } else {
        toast.error(data.error || "Failed to delete submission");
      }
    } catch (error) {
      toast.error("Failed to delete submission");
    }
  };

  const handleUpdate = async () => {
    if (!editingSubmission) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/voting-form/submissions/${editingSubmission._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Submission updated successfully");
        setIsEditModalOpen(false);
        setEditingSubmission(null);
        fetchSubmissions();
      } else {
        toast.error(data.error || "Failed to update submission");
      }
    } catch (error) {
      toast.error("Failed to update submission");
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSubmission(null);
    setEditFormData({
      firstName: "",
      lastName: "",
      school: "",
      awardCategory: "",
    });
  };

  const clearAllVotingData = () => {
    if (
      !confirm(
        "⚠️ WARNING: This will clear ALL frontend voting data from users' browsers!\n\nThis action will:\n• Clear all vote counts from localStorage\n• Clear all voting timestamps\n• Clear all voted category records\n• Allow users to vote fresh\n\nAre you sure you want to proceed?"
      )
    ) {
      return;
    }

    try {
      let totalCleared = 0;
      const clearedKeys: Array<{ key: string; reason: string }> = [];

      // Get all localStorage keys
      const allKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          allKeys.push(key);
        }
      }

      // Clear keys by prefix and content
      allKeys.forEach((key) => {
        let shouldClear = false;
        let reason = "";

        // Check for known voting prefixes
        if (key.startsWith("voting_state_")) {
          shouldClear = true;
          reason = "voting_state_ prefix";
        } else if (key.startsWith("tasfa_vote_")) {
          shouldClear = true;
          reason = "tasfa_vote_ prefix";
        } else if (
          key.toLowerCase().includes("vote") ||
          key.toLowerCase().includes("voting") ||
          key.toLowerCase().includes("tasfa")
        ) {
          shouldClear = true;
          reason = "contains vote/voting/tasfa";
        } else {
          // Check the actual data content
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsed = JSON.parse(value);

              // Check if it contains voting-related data structure
              if (parsed && typeof parsed === "object") {
                const hasVotingData =
                  parsed.votingStatus !== undefined ||
                  parsed.participants !== undefined ||
                  parsed.category !== undefined ||
                  parsed.timestamp !== undefined ||
                  parsed.canVote !== undefined ||
                  parsed.pendingCategories !== undefined ||
                  parsed.voteTimestamps !== undefined ||
                  parsed.votedCategories !== undefined;

                if (hasVotingData) {
                  shouldClear = true;
                  reason = "contains voting data structure";
                }
              }
            }
          } catch (e) {
            // If JSON parsing fails, check if it's a string containing voting keywords
            const value = localStorage.getItem(key);
            if (
              value &&
              typeof value === "string" &&
              (value.toLowerCase().includes("vote") ||
                value.toLowerCase().includes("voting") ||
                value.toLowerCase().includes("tasfa"))
            ) {
              shouldClear = true;
              reason = "string contains voting keywords";
            }
          }
        }

        if (shouldClear) {
          localStorage.removeItem(key);
          totalCleared++;
          clearedKeys.push({ key, reason });
        }
      });

      toast.success(
        `✅ Successfully cleared ${totalCleared} voting data items! Users can now vote fresh.`
      );
      console.log(`🗑️ Cleared ${totalCleared} voting data items:`, clearedKeys);
    } catch (error) {
      toast.error("❌ Error clearing voting data: " + (error as Error).message);
      console.error("Error clearing voting data:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-14">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Award participants
            </h2>
            <p className="text-gray-600">
              View all submitted nominations for the award
            </p>
            <p className="text-gray-600">
              Total submissions: {submissions.length}
            </p>
            <p className="text-gray-600">
              Total categories: {categories.length}
            </p>

            {/* calculate the total votes */}
            <p className="text-gray-600">
              Total votes across all participants:{" "}
              <span className="font-semibold">
                {submissions
                  .reduce((acc, submission) => acc + submission.voteCount, 0)
                  .toLocaleString()}
              </span>
            </p>
            <p className="text-gray-600">
              Total participants:{" "}
              <span className="font-semibold">{submissions.length}</span>
              {submissions.length > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  (Avg:{" "}
                  {Math.round(
                    submissions.reduce(
                      (acc, submission) => acc + submission.voteCount,
                      0
                    ) / submissions.length
                  )}{" "}
                  votes per participant)
                </span>
              )}
            </p>
          </div>

          {/* Clear Voting Data Button */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                🗑️ Clear All Voting Data
              </h3>
              <p className="text-sm text-red-600 mb-4">
                This will clear all frontend voting data (vote counts,
                timestamps, voted categories) from users' browsers. Users will
                be able to vote fresh after this action.
              </p>
              <button
                onClick={clearAllVotingData}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                🧹 Clear All Frontend Voting Data
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="categoryFilter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Category
            </label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="relative">
                  {submission.image ? (
                    <img
                      src={submission.image}
                      alt={`${submission.firstName} ${submission.lastName}`}
                      className="w-full h-80 object-cover object-top"
                      onLoad={() => {
                        // Image loaded successfully
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = target.nextSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
                      submission.image ? "hidden" : ""
                    }`}
                  >
                    <span className="text-white text-4xl font-bold">
                      {submission.firstName.charAt(0)}
                      {submission.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {submission.voteCount} votes
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {submission.firstName} {submission.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {submission.school}
                  </p>
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {submission.awardCategory}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Submitted: {formatDate(submission.createdAt)}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(submission)}
                      disabled={true}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(submission._id)}
                      className="flex-1 bg-black hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {submissions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No submissions found.</p>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500 text-center">
            Total submissions: {submissions.length}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Submission
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={editFormData.firstName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editFormData.lastName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School
                </label>
                <input
                  type="text"
                  value={editFormData.school}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, school: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Award Category
                </label>
                <select
                  value={editFormData.awardCategory}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      awardCategory: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                Update
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsGrid;

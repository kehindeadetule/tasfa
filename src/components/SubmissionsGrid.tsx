'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '@/config/api';

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

const SubmissionsGrid: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

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
      const response = await fetch(`${API_BASE_URL}/api/voting-form/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/voting-form/submissions`);
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionsByCategory = async (category: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/voting-form/submissions/category/${encodeURIComponent(category)}`);
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions by category:', error);
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Voting Submissions
            </h2>
            <p className="text-gray-600">
              View all submitted nominations
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${submission.image ? 'hidden' : ''}`}>
                    <span className="text-white text-4xl font-bold">
                      {submission.firstName.charAt(0)}{submission.lastName.charAt(0)}
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
                  <p className="text-xs text-gray-500">
                    Submitted: {formatDate(submission.createdAt)}
                  </p>
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
    </div>
  );
};

export default SubmissionsGrid; 
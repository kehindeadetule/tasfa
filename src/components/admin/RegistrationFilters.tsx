"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface FilterOptions {
  page: number;
  limit: number;
  status?: string;
  emailConfirmed?: boolean;
  // accommodationReservation?: string;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface RegistrationFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onDownloadCSV: () => void;
  loading: boolean;
}

const RegistrationFilters: React.FC<RegistrationFiltersProps> = ({
  filters,
  onFilterChange,
  onDownloadCSV,
  loading,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: e.target.value || undefined });
  };

  const handleEmailConfirmedChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    onFilterChange({
      emailConfirmed: value === "" ? undefined : value === "true",
    });
  };

  // const handleAccommodationChange = (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   onFilterChange({ accommodationReservation: e.target.value || undefined });
  // };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortOrder: e.target.value as "asc" | "desc" });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ limit: parseInt(e.target.value) });
  };

  const clearFilters = () => {
    onFilterChange({
      status: undefined,
      emailConfirmed: undefined,
      // accommodationReservation: undefined,
      search: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, organization, or occupation..."
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.status || ""}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={
              filters.emailConfirmed === undefined
                ? ""
                : filters.emailConfirmed.toString()
            }
            onChange={handleEmailConfirmedChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Email Status</option>
            <option value="true">Email Confirmed</option>
            <option value="false">Email Not Confirmed</option>
          </select>
          {/* 
          <select
            value={filters.accommodationReservation || ""}
            onChange={handleAccommodationChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Accommodation</option>
            <option value="yes">Needs Accommodation</option>
            <option value="no">No Accommodation</option>
          </select> */}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced
          </button>

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            Clear Filters
          </button>

          <button
            onClick={onDownloadCSV}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📥 Download CSV
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={handleSortByChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Registration Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="organization">Organization</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={handleSortOrderChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items Per Page
              </label>
              <select
                value={filters.limit}
                onChange={handleLimitChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RegistrationFilters;

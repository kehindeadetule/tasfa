"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/config/api";
import RegistrationsGrid from "@/components/admin/RegistrationsGrid";
import RegistrationModal from "@/components/admin/RegistrationModal";
import RegistrationStats from "@/components/admin/RegistrationStats";
import RegistrationFilters from "@/components/admin/RegistrationFilters";

interface Registration {
  _id: string;
  registrationId: string;
  name: string;
  email: string;
  phoneNumber: string;
  image?: string;
  gender: string;
  occupation: string;
  organization: string;
  daysAttending: string[];
  accommodationReservation: string;
  status: "pending" | "confirmed" | "cancelled";
  emailConfirmed: boolean;
  checkedIn: boolean;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRegistrations: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Statistics {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  withAccommodation: number;
  checkedIn: number;
}

interface FilterOptions {
  page: number;
  limit: number;
  status?: string;
  emailConfirmed?: boolean;
  accommodationReservation?: string;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${API_BASE_URL}/api/admin/event-registrations?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tasfa_a_t")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const data = await response.json();
      if (data.success) {
        setRegistrations(data.data.registrations);
        setPagination(data.data.pagination);
        setStatistics(data.data.statistics);
      } else {
        toast.error(data.message || "Failed to fetch registrations");
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/event-registrations/statistics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tasfa_a_t")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStatistics(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleRegistrationClick = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRegistration(null);
  };

  const handleUpdateRegistration = async (
    id: string,
    updates: Partial<Registration>
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/event-registrations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tasfa_a_t")}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update registration");
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Registration updated successfully");
        fetchRegistrations();
        if (selectedRegistration?._id === id) {
          setSelectedRegistration(data.data);
        }
      } else {
        toast.error(data.message || "Failed to update registration");
      }
    } catch (error) {
      console.error("Error updating registration:", error);
      toast.error("Failed to update registration");
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.emailConfirmed !== undefined)
        queryParams.append("emailConfirmed", filters.emailConfirmed.toString());
      if (filters.accommodationReservation)
        queryParams.append(
          "accommodationReservation",
          filters.accommodationReservation
        );

      const response = await fetch(
        `${API_BASE_URL}/api/admin/event-registrations/export/csv?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tasfa_a_t")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `event-registrations-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("CSV downloaded successfully");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error("Failed to download CSV");
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [filters]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Event Registrations
          </h1>
          <p className="text-gray-600">
            Manage and view all event registrations
          </p>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="mb-8">
            <RegistrationStats statistics={statistics} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <RegistrationFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onDownloadCSV={handleDownloadCSV}
            loading={loading}
          />
        </div>

        {/* Registrations Grid */}
        <div className="mb-8">
          <RegistrationsGrid
            registrations={registrations}
            loading={loading}
            onRegistrationClick={handleRegistrationClick}
          />
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-3 py-2 text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Registration Modal */}
        {showModal && selectedRegistration && (
          <RegistrationModal
            registration={selectedRegistration}
            onClose={handleCloseModal}
            onUpdate={handleUpdateRegistration}
          />
        )}
      </div>
    </div>
  );
}

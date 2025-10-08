"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
  status: "pending" | "confirmed" | "cancelled";
  emailConfirmed: boolean;
  checkedIn: boolean;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface RegistrationsGridProps {
  registrations: Registration[];
  loading: boolean;
  onRegistrationClick: (registration: Registration) => void;
}

const RegistrationsGrid: React.FC<RegistrationsGridProps> = ({
  registrations,
  loading,
  onRegistrationClick,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "✅";
      case "pending":
        return "⏳";
      case "cancelled":
        return "❌";
      default:
        return "❓";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No registrations found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or check back later for new registrations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {registrations.map((registration, index) => (
        <motion.div
          key={registration._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onRegistrationClick(registration)}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300"
        >
          {/* Header with Avatar and Status */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              {registration.image ? (
                <Image
                  src={registration.image}
                  alt={registration.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {registration.name.charAt(0).toUpperCase()}
                </div>
              )}
              {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs">
                  {registration.emailConfirmed ? "📧" : "⏳"}
                </span>
              </div> */}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {registration.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {registration.organization}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between ">
            {/* <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                registration.status
              )}`}
            >
              <span className="mr-1">{getStatusIcon(registration.status)}</span>
              {registration.status.charAt(0).toUpperCase() +
                registration.status.slice(1)}
            </span> */}
            {registration.checkedIn && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                📋 Checked In
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2">📧</span>
              <span className="truncate">{registration.email}</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2">📱</span>
              <span>{registration.phoneNumber}</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2">💼</span>
              <span className="truncate">{registration.occupation}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>ID: {registration.registrationId}</span>
              <span>{formatDate(registration.createdAt)}</span>
            </div>
          </div>

          {/* Admin Notes Indicator */}
          {registration.adminNotes && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <span className="font-medium">Note:</span>{" "}
              {registration.adminNotes}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default RegistrationsGrid;

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
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
  daysAttending: string[];
  accommodationReservation: string;
  status: "pending" | "confirmed" | "cancelled";
  emailConfirmed: boolean;
  checkedIn: boolean;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface RegistrationModalProps {
  registration: Registration;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Registration>) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  registration,
  onClose,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: registration.status,
    adminNotes: registration.adminNotes || "",
    checkedIn: registration.checkedIn,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(registration._id, editData);
      setIsEditing(false);
      toast.success("Registration updated successfully");
    } catch (error) {
      toast.error("Failed to update registration");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      status: registration.status,
      adminNotes: registration.adminNotes || "",
      checkedIn: registration.checkedIn,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-4 text-center sm:block sm:p-0">
          Backdrop
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-4 sm:align-middle sm:max-w-6xl sm:w-full max-h-[90vh] z-50"
          >
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {registration.image ? (
                    <Image
                      src={registration.image}
                      alt={registration.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                      {registration.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {registration.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Registration ID: {registration.registrationId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "💾 Save"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
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
              </div>
            </div>

            {/* Content */}
            <div
              className="bg-white px-6 py-6 overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 200px)" }}
            >
              {/* Large Image Section */}
              {registration.image && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Profile Photo
                  </h4>
                  <div className="flex justify-center">
                    <div className="relative">
                      <Image
                        src={registration.image}
                        alt={registration.name}
                        width={400}
                        height={400}
                        className="w-96 h-96 object-cover rounded-lg shadow-lg border border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Personal Information
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {registration.name}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1 flex items-center">
                        <p className="text-sm text-gray-900">
                          {registration.email}
                        </p>
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            registration.emailConfirmed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {registration.emailConfirmed
                            ? "✅ Confirmed"
                            : "⏳ Pending"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {registration.phoneNumber}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {registration.gender}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Professional Information
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Occupation
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {registration.occupation}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Organization
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {registration.organization}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Event Information
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Days Attending
                      </label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {registration.daysAttending.map((day, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            📅 {day}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Accommodation
                      </label>
                      <div className="mt-1">
                        {registration.accommodationReservation === "yes" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            🏨 Needs Accommodation
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            🏠 Own Accommodation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Admin Information
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      {isEditing ? (
                        <select
                          value={editData.status}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              status: e.target.value as any,
                            })
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span
                          className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            registration.status
                          )}`}
                        >
                          {registration.status.charAt(0).toUpperCase() +
                            registration.status.slice(1)}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Check-in Status
                      </label>
                      {isEditing ? (
                        <div className="mt-1">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editData.checkedIn}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  checkedIn: e.target.checked,
                                })
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-900">
                              Checked In
                            </span>
                          </label>
                        </div>
                      ) : (
                        <div className="mt-1">
                          {registration.checkedIn ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              📋 Checked In
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              ⏳ Not Checked In
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Admin Notes
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editData.adminNotes}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              adminNotes: e.target.value,
                            })
                          }
                          rows={3}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add admin notes..."
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {registration.adminNotes || "No notes added"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Timestamps
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registration Date
                    </label>
                    <p className="mt-1 text-gray-900">
                      {formatDate(registration.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Updated
                    </label>
                    <p className="mt-1 text-gray-900">
                      {formatDate(registration.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default RegistrationModal;

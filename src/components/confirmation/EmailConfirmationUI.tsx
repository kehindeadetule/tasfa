"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

interface ConfirmationData {
  registrationId: string;
  name: string;
  email: string;
  status: string;
}

interface EmailConfirmationUIProps {
  token: string;
}

export default function EmailConfirmationUI({
  token,
}: EmailConfirmationUIProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);

  useEffect(() => {
    const confirmRegistration = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/event-registration/confirm/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setSuccess(true);
          setConfirmationData(data.data);
          toast.success("Registration confirmed successfully!");
        } else {
          setError(data.message || "Confirmation failed");
          toast.error(data.message || "Confirmation failed");
        }
      } catch (error) {
        console.error("Confirmation error:", error);
        setError("Network error. Please try again.");
        toast.error("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      confirmRegistration();
    } else {
      setError("Invalid confirmation link");
      setLoading(false);
    }
  }, [token]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoToAwards = () => {
    router.push("/awards");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Confirming your registration...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl p-8 text-center"
          >
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Confirmation Failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleGoHome}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Homepage
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (success && confirmationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl p-8 text-center"
          >
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you, <strong>{confirmationData.name}</strong>! Your
              registration for the Theatre Arts Students Festival and Awards has
              been successfully confirmed.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">
                Registration Details
              </h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>
                  <strong>Registration ID:</strong>{" "}
                  {confirmationData.registrationId}
                </div>
                <div>
                  <strong>Email:</strong> {confirmationData.email}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">{confirmationData.status}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoToAwards}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View Awards
              </button>
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Go to Homepage
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                📧 What's Next?
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>
                  • You will receive event details closer to the event date
                </div>
                <div>• Check your email for any updates</div>
                <div>• You can now vote for your favorite nominees</div>
                <div>• Contact us if you have any questions</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}

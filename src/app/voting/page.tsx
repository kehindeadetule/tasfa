"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import SecureVotingInterface from "@/components/SecureVotingInterface";

function VotingPageContent() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("category") || "Best Actor";
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005B96] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-24 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full space-y-8">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔐 Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in with your phone number and password to access the
              voting system
            </p>
            <div className="space-y-4">
              <a
                href="/auth"
                className="w-full bg-[#005B96] hover:bg-[#004080] text-white font-semibold py-3 px-6 rounded-lg transition-colors block text-center"
              >
                Login / Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <SecureVotingInterface categoryName={categoryName} />;
}

export default function VotingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-24 flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <VotingPageContent />
    </Suspense>
  );
}

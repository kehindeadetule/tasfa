"use client";
import { useState } from "react";
import FestivalSelector from "./FestivalSelector";
import ImageUploader from "./ImageUploader";
import ImageManager from "./ImageManager";

export default function AdminGalleryPage() {
  const [selectedFestival, setSelectedFestival] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00244F] via-[#005B96] to-[#016CEE] pt-36 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Gallery Management
          </h1>
          <p className="text-gray-200 text-lg">
            Upload, manage, and organize festival images
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedFestival ? (
          <FestivalSelector onSelectFestival={setSelectedFestival} />
        ) : (
          <div>
            {/* Back Button */}
            <button
              onClick={() => setSelectedFestival(null)}
              className="flex items-center space-x-2 text-[#005B96] hover:text-[#016CEE] transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium">Back to Festivals</span>
            </button>

            {/* Festival Title */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                TASFA {selectedFestival}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage images for {selectedFestival} festival
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 p-1 inline-flex w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md font-medium transition-all text-sm sm:text-base ${
                  activeTab === "upload"
                    ? "bg-[#005B96] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Upload Images
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md font-medium transition-all text-sm sm:text-base ${
                  activeTab === "manage"
                    ? "bg-[#005B96] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Manage Images
              </button>
            </div>

            {/* Content */}
            {activeTab === "upload" ? (
              <ImageUploader festivalYear={selectedFestival} />
            ) : (
              <ImageManager festivalYear={selectedFestival} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

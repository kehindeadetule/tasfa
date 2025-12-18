"use client";
import { useState } from "react";
import FestivalCards from "./FestivalCards";
import ImageGrid from "./ImageGrid";

export default function GalleryPage() {
  const [selectedFestival, setSelectedFestival] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 px-4 bg-gradient-to-r from-[#00244F] via-[#005B96] to-[#016CEE]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4">
            Festival Gallery
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Explore the vibrant moments captured during TASFA celebrations
          </p>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 fill-gray-50"
            viewBox="0 0 1440 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,32L1440,32L1440,48L1360,48C1280,48,1120,48,960,48C800,48,640,48,480,48C320,48,160,48,80,48L0,48Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {!selectedFestival ? (
          <FestivalCards onSelectFestival={setSelectedFestival} />
        ) : (
          <ImageGrid
            festivalYear={selectedFestival}
            onBack={() => setSelectedFestival(null)}
          />
        )}
      </div>
    </div>
  );
}

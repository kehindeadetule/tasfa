"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { API_BASE_URL } from "@/config/api";

interface ImageGridProps {
  festivalYear: string;
  onBack: () => void;
}

interface BackendImage {
  url: string;
  key: string;
  filename: string;
  category: string;
  size: number;
  lastModified: string;
}

export default function ImageGrid({ festivalYear, onBack }: ImageGridProps) {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const categories = [
    "All",
    "Performance",
    "Behind the Scenes",
    "Awards",
    "Audience",
  ];

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/gallery/images?limit=1000`
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // Filter images by festival year prefix and parse categories
          const yearImages = data.data.images
            .filter((img: BackendImage) =>
              img.category.startsWith(`${festivalYear}-`)
            )
            .map((img: BackendImage) => {
              const categoryParts = img.category.split("-");
              const words = categoryParts.slice(1);
              const actualCategory = words
                .map((word, index) => {
                  // Capitalize first word and non-small words
                  const smallWords = [
                    "the",
                    "of",
                    "and",
                    "a",
                    "an",
                    "in",
                    "on",
                  ];
                  if (index === 0 || !smallWords.includes(word.toLowerCase())) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                  }
                  return word.toLowerCase();
                })
                .join(" ");
              return {
                id: img.key,
                url: img.url,
                alt: img.filename,
                category: actualCategory || "Other",
                size: img.size,
                lastModified: img.lastModified,
              };
            });

          setImages(yearImages);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [festivalYear]);

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter(
          (img) => img.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div>
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-[#005B96] hover:text-[#016CEE] transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
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
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#00244F]">
          TASFA {festivalYear}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          {filteredImages.length} photos captured
        </p>
      </motion.div>

      {/* Category Filter - Scrollable on mobile */}
      {/* <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 sm:mb-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:flex-wrap pb-2 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                selectedCategory === category
                  ? "bg-[#005B96] text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div> */}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            No Images Found
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            No images available for this festival yet
          </p>
        </div>
      ) : (
        /* Image Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="absolute inset-0 bg-gray-100">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Badge */}
                {/* <div className="absolute top-2 sm:top-4 left-2 sm:left-4 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#00244F] z-10">
                  {image.category}
                </div> */}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden p-4 sm:p-6"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button - Outside the image container */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-2 sm:top-6 sm:right-6 text-white hover:text-gray-300 transition-colors z-20 p-2 bg-black/50 rounded-full hover:bg-black/70"
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-7xl max-h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container */}
              <div className="relative w-full h-full rounded-none sm:rounded-xl overflow-hidden">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className="w-full h-full object-contain max-h-[90vh]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

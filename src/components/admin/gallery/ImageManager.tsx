"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/config/api";

interface ImageManagerProps {
  festivalYear: string;
}

interface GalleryImage {
  url: string;
  key: string;
  filename: string;
  category: string;
  size: number;
  lastModified: string;
}

const categories = [
  "All",
  "Performance",
  "Behind the Scenes",
  "Awards",
  "Audience",
  "Other",
];

export default function ImageManager({ festivalYear }: ImageManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, [festivalYear]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredImages(images);
    } else {
      setFilteredImages(
        images.filter(
          (img: any) =>
            img.displayCategory.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }
  }, [selectedCategory, images]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/gallery/images?limit=1000`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Filter images by festival year prefix
        const yearImages = data.data.images.filter((img: GalleryImage) =>
          img.category.startsWith(`${festivalYear}-`)
        );

        // Parse category to separate year and actual category
        const parsedImages = yearImages.map((img: GalleryImage) => {
          const categoryParts = img.category.split("-");
          const actualCategory = categoryParts
            .slice(1)
            .join("-")
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return {
            ...img,
            displayCategory: actualCategory || "Other",
          };
        });

        setImages(parsedImages);
      } else {
        toast.error(data.error || "Failed to fetch images");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageKey: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery/images`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: imageKey }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Image deleted successfully");
        setImages((prev) => prev.filter((img) => img.key !== imageKey));
        setDeleteConfirm(null);
      } else {
        toast.error(data.error || "Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats & Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Total Images: {images.length}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Showing {filteredImages.length} image(s)
            </p>
          </div>

          <button
            onClick={fetchImages}
            className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Category Filter - Scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:flex-wrap pb-2 sm:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                  selectedCategory === category
                    ? "bg-[#005B96] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Images Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-200 rounded-xl animate-pulse"
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
            {selectedCategory === "All"
              ? "Upload images to get started"
              : `No images in "${selectedCategory}" category`}
          </p>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="inline-flex items-center px-4 py-2 bg-[#005B96] text-white rounded-lg text-sm font-medium hover:bg-[#004080] transition-colors"
            >
              View All Images
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredImages.map((image: any) => (
            <div
              key={image.key}
              className="group relative rounded-xl shadow-sm overflow-hidden bg-white animate-in fade-in duration-300"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden relative">
                <button
                  onClick={() => setSelectedImage(image)}
                  className="absolute inset-0 w-full h-full cursor-pointer"
                  type="button"
                />
                {/* Actual image from S3 */}
                <img
                  src={image.url}
                  alt={image.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                  onError={(e) => {
                    // Fallback to placeholder on error
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#005B96] via-[#016CEE] to-[#00244F] text-white/50">
                          <div class="text-center p-4">
                            <svg class="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-xs">Image unavailable</p>
                          </div>
                        </div>
                      `;
                  }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-10 h-10 text-white"
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

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#00244F] pointer-events-none z-10">
                  {image.displayCategory}
                </div>
              </div>

              {/* Image Info & Actions */}
              <div className="p-3 sm:p-4 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(image.lastModified).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                {deleteConfirm === image.key ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(image.key)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(image.key)}
                    className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 p-2"
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

              {/* Image */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden ">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.filename}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Image Info */}
              <div className="mt-3 sm:mt-4 text-white">
                <h3 className="text-base sm:text-lg font-semibold mb-2 truncate">
                  {selectedImage.filename}
                </h3>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
                  <div>
                    <span className="text-gray-400">Category:</span>{" "}
                    {(selectedImage as any).displayCategory ||
                      selectedImage.category}
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span>{" "}
                    {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <div>
                    <span className="text-gray-400">Uploaded:</span>{" "}
                    {new Date(selectedImage.lastModified).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

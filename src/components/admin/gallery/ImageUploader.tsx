"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/config/api";

interface ImageUploaderProps {
  festivalYear: string;
}

const categories = [
  "Performance",
  "Behind the Scenes",
  "Awards",
  "Audience",
  "Other",
];

export default function ImageUploader({ festivalYear }: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Performance");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      toast.warning("Only image files are allowed");
    }

    setSelectedFiles((prev) => [...prev, ...imageFiles]);

    // Generate previews
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Map festival year to backend category format
      // Using "general" as default category
      const backendCategory = `${festivalYear}-general`;
      formData.append("category", backendCategory);

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(
        `${API_BASE_URL}/api/gallery/upload-multiple`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Successfully uploaded ${selectedFiles.length} image(s)`);
        setSelectedFiles([]);
        setPreviews([]);
        setUploadProgress(100);
      } else {
        toast.error(data.error || "Failed to upload images");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
      >
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Category
        </label>
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
      </motion.div> */}

      {/* File Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center cursor-pointer hover:border-[#005B96] hover:bg-gray-50 transition-all"
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-3 sm:mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
              Upload Images
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 px-4">
              Click to browse or drag and drop images here
            </p>
            <p className="text-xs text-gray-400">
              Supports: JPG, PNG, GIF, WEBP (Max 30MB each)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Selected Images ({previews.length})
            </h3>
            <button
              onClick={() => {
                setSelectedFiles([]);
                setPreviews([]);
              }}
              className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white p-1 sm:p-1.5 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
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
                <div className="mt-1 text-xs text-gray-500 truncate px-1">
                  {selectedFiles[index]?.name}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4 sm:mt-6">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#005B96] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 sm:mt-6 w-full bg-[#005B96] text-white py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#004080] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? "Uploading..."
              : `Upload ${selectedFiles.length} Image(s)`}
          </button>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

interface Category {
  id: string;
  name: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  school: string;
  awardCategory: string;
  picture: File | null;
}

const VotingFormContent: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    school: "",
    awardCategory: categoryFromUrl || "",
    picture: null,
  });

  // Categories are hardcoded in the select element
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Component mount effect - no longer needed for security checks
  useEffect(() => {
    // Authentication is now handled by the parent component
  }, []);

  // Categories are now hardcoded in the select element for better performance
  // No need to fetch from API

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file immediately
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        e.target.value = ""; // Clear the input
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        e.target.value = ""; // Clear the input
        return;
      }

      setFormData((prev) => ({
        ...prev,
        picture: file,
      }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.school.trim() ||
        !formData.awardCategory.trim()
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName.trim());
      formDataToSend.append("lastName", formData.lastName.trim());
      formDataToSend.append("school", formData.school.trim());
      formDataToSend.append("awardCategory", formData.awardCategory.trim());

      if (formData.picture) {
        // Validate file size (5MB limit)
        if (formData.picture.size > 5 * 1024 * 1024) {
          toast.error("Image size must be less than 5MB");
          return;
        }

        // Validate file type
        if (!formData.picture.type.startsWith("image/")) {
          toast.error("Please select a valid image file");
          return;
        }

        formDataToSend.append("picture", formData.picture);
      }

      const response = await fetch(`${API_BASE_URL}/api/voting-form/submit`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const data = await response.json();

      // Check for errors in response
      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Network response was not ok"
        );
      }

      if (data.success) {
        toast.success("Voting form submitted successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          school: "",
          awardCategory: "",
          picture: null,
        });
        setPreviewUrl(null);

        // Clear the file input
        const fileInput = document.getElementById(
          "picture"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-lg md:text-3xl font-bold text-gray-900 mb-2">
              Voting Awards Submission
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Submit your nomination for the voting awards
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="school"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                School *
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter school name"
              />
            </div>

            <div>
              <label
                htmlFor="awardCategory"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Award Category *
              </label>
              <select
                id="awardCategory"
                name="awardCategory"
                value={formData.awardCategory}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a category</option>

                {/* Student Categories */}
                <optgroup label="Student Categories">
                  <option value="Best Actor">Best Actor</option>
                  <option value="Best Actress">Best Actress</option>
                  <option value="Best Supporting Actor">
                    Best Supporting Actor
                  </option>
                  <option value="Best Supporting Actress">
                    Best Supporting Actress
                  </option>
                  <option value="Revelation of the Year (Male)">
                    Revelation of the Year (Male)
                  </option>
                  <option value="Revelation of the Year (Female)">
                    Revelation of the Year (Female)
                  </option>
                  <option value="Best Director">Best Director</option>
                  <option value="Best Stage Manager">Best Stage Manager</option>
                  <option value="Best Playwright">Best Playwright</option>
                  <option value="Best Set Designer">Best Set Designer</option>
                  <option value="Best Light Designer">
                    Best Light Designer
                  </option>
                  <option value="Best Props Designer">
                    Best Props Designer
                  </option>
                  <option value="Best Costumier">Best Costumier</option>
                  <option value="Best Makeup Artist">Best Makeup Artist</option>
                  <option value="Best Publicity Manager">
                    Best Publicity Manager
                  </option>
                  <option value="Best Dancer (Male)">Best Dancer (Male)</option>
                  <option value="Best Dancer (Female)">
                    Best Dancer (Female)
                  </option>
                  <option value="Best Drummer (Male)">
                    Best Drummer (Male)
                  </option>
                  <option value="Best Drummer (Female)">
                    Best Drummer (Female)
                  </option>
                  <option value="Best Choreographer">Best Choreographer</option>
                  <option value="Best Music Director">
                    Best Music Director
                  </option>
                  <option value="Best Media Student (Male)">
                    Best Media Student (Male)
                  </option>
                  <option value="Best Media Student (Female)">
                    Best Media Student (Female)
                  </option>
                </optgroup>
              </select>
            </div>

            <div>
              <label
                htmlFor="picture"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Profile Picture
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  id="picture"
                  name="picture"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors bg-[#005B96]  ${
                loading
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:bg-[#004080]"
              }`}
            >
              {loading ? "Submitting..." : "Submit Nomination"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const VotingForm: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-24 flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <VotingFormContent />
    </Suspense>
  );
};

export default VotingForm;

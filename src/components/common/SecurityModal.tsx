"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export interface SecurityModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: "error" | "warning" | "info";
  onClose: () => void;
}

const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  title,
  message,
  type,
  onClose,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div
          className={`flex justify-between items-center p-6 border-b border-gray-200 ${
            type === "error"
              ? "border-l-4 border-l-red-500"
              : type === "warning"
              ? "border-l-4 border-l-yellow-500"
              : "border-l-4 border-l-blue-500"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              type === "error"
                ? "text-red-600"
                : type === "warning"
                ? "text-yellow-600"
                : "text-blue-600"
            }`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 text-gray-500"
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

        {/* Body */}
        <div className="p-6">
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {message}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              type === "error"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : type === "warning"
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at the top level
  return createPortal(modalContent, document.body);
};

export default SecurityModal;


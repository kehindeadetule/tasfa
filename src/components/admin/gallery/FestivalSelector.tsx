"use client";
import { motion } from "framer-motion";

interface FestivalSelectorProps {
  onSelectFestival: (year: string) => void;
}

const festivals = [
  {
    year: "2025",
    title: "TASFA 2025",
    available: true,
  },
  {
    year: "2026",
    title: "TASFA 2026",
    available: true,
  },
];

export default function FestivalSelector({
  onSelectFestival,
}: FestivalSelectorProps) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Select Festival Year
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {festivals.map((festival, index) => (
          <motion.button
            key={festival.year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => onSelectFestival(festival.year)}
            className="group relative overflow-hidden bg-gradient-to-br from-[#00244F] via-[#005B96] to-[#016CEE] rounded-xl p-6 sm:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id={`admin-pattern-${festival.year}`}
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="20" cy="20" r="1.5" fill="white" />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill={`url(#admin-pattern-${festival.year})`}
                />
              </svg>
            </div>

            {/* Content */}
            <div className="relative">
              <div className="text-6xl sm:text-7xl font-bold text-white/20 mb-2">
                {festival.year}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {festival.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-200 mb-4">
                Manage images for this festival
              </p>

              <div className="flex items-center text-[#FFD200] font-medium text-sm sm:text-base">
                <span>Manage Gallery</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

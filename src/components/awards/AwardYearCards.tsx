"use client";
import { motion } from "framer-motion";

interface AwardYearCardsProps {
  onSelectYear: (year: string) => void;
}

const awardYears = [
  {
    year: "2025",
    title: "TASFA 2025",
    description: "Celebrating and awarding the first festival",
    available: true,
  },
  {
    year: "2026",
    title: "TASFA 2026",
    description: "Coming soon - Stay tuned for an unforgettable celebration",
    available: false,
  },
];

export default function AwardYearCards({
  onSelectYear,
}: AwardYearCardsProps) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12"
      >
        {awardYears.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            <div
              onClick={() => item.available && onSelectYear(item.year)}
              className={`relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 ${
                item.available
                  ? "cursor-pointer hover:shadow-2xl hover:-translate-y-2"
                  : "cursor-not-allowed opacity-90"
              }`}
            >
              {/* Card Background with Gradient */}
              <div className="relative h-[450px] sm:h-[500px] bg-gradient-to-br from-[#00244F] via-[#005B96] to-[#1B1464]">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <svg
                      className="w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          id={`award-pattern-${item.year}`}
                          x="0"
                          y="0"
                          width="50"
                          height="50"
                          patternUnits="userSpaceOnUse"
                        >
                          <circle cx="25" cy="25" r="2" fill="white" />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#award-pattern-${item.year})`}
                      />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
                  {/* Badge */}
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-semibold">
                      {item.available ? "View Awards" : "Coming Soon"}
                    </span>
                    {!item.available && (
                      <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FFD200] rounded-full text-[#00244F] text-xs sm:text-sm font-bold">
                        Soon
                      </span>
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Year Display */}
                    <div className="relative">
                      <h2 className="text-7xl sm:text-8xl md:text-9xl font-bold text-white/10 leading-none">
                        {item.year}
                      </h2>
                      <h3 className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                        {item.year}
                      </h3>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                        {item.title}
                      </h4>
                      <p className="text-gray-200 text-sm sm:text-base md:text-lg">
                        {item.description}
                      </p>
                    </div>

                    {/* Call to Action */}
                    {item.available && (
                      <div className="flex items-center justify-between pt-3 sm:pt-4">
                        <span className="text-white font-medium text-sm sm:text-base">
                          Click to explore
                        </span>
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD200] transition-transform group-hover:translate-x-2"
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
                    )}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                {item.available && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#016CEE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

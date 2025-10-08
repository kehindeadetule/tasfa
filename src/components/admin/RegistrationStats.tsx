"use client";

import React from "react";
import { motion } from "framer-motion";

interface Statistics {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  withAccommodation: number;
  checkedIn: number;
}

interface RegistrationStatsProps {
  statistics: Statistics;
}

const RegistrationStats: React.FC<RegistrationStatsProps> = ({
  statistics,
}) => {
  const stats = [
    {
      title: "Total Registrations",
      value: statistics?.total,
      color: "bg-blue-50",
      icon: "👥",
    },
    // {
    //   title: "Confirmed",
    //   value: statistics?.confirmed,
    //   color: "bg-green-50",
    //   icon: "✅",
    // },
    // {
    //   title: "Pending",
    //   value: statistics?.pending,
    //   color: "bg-yellow-50",
    //   icon: "⏳",
    // },
    // {
    //   title: "Cancelled",
    //   value: statistics?.cancelled,
    //   color: "bg-red-50",
    //   icon: "❌",
    // },
    // {
    //   title: "Need Accommodation",
    //   value: statistics?.withAccommodation,
    //   color: "bg-purple-50",
    //   icon: "🏨",
    // },
    // {
    //   title: "Checked In",
    //   value: statistics?.checkedIn,
    //   color: "bg-indigo-50",
    //   icon: "📋",
    // },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat?.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat?.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stat?.value?.toLocaleString()}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${stat?.color} rounded-lg flex items-center justify-center text-white text-xl`}
            >
              {stat?.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RegistrationStats;

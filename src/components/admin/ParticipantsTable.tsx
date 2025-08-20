"use client";

import { useState } from "react";

interface AffectedParticipant {
  participantName: string;
  category: string;
  totalVotes: number;
  incognitoVotes: number;
  incognitoPercentage: number;
  suspiciousIPs: string[];
  deviceVotes: {
    laptop: number;
    phone: number;
    tablet: number;
    system: number;
    unknown: number;
  };
  riskLevel: "high" | "medium" | "low";
}

interface ParticipantsTableProps {
  participants: AffectedParticipant[];
  onRefresh: () => void;
}

export function ParticipantsTable({
  participants,
  onRefresh,
}: ParticipantsTableProps) {
  const [sortBy, setSortBy] = useState("totalVotes");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIncognitoColor = (percentage: number) => {
    if (percentage > 70) return "text-red-600 font-semibold";
    if (percentage > 40) return "text-orange-600 font-semibold";
    return "text-gray-600";
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const categories = [...new Set(participants.map((p) => p.category))];

  const filteredAndSortedParticipants = participants
    .filter((participant) => {
      const riskMatch =
        filterRisk === "all" || participant.riskLevel === filterRisk;
      const categoryMatch =
        filterCategory === "all" || participant.category === filterCategory;
      return riskMatch && categoryMatch;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "totalVotes":
          aValue = a.totalVotes;
          bValue = b.totalVotes;
          break;
        case "incognitoPercentage":
          aValue = a.incognitoPercentage;
          bValue = b.incognitoPercentage;
          break;
        case "incognitoVotes":
          aValue = a.incognitoVotes;
          bValue = b.incognitoVotes;
          break;
        case "participantName":
          aValue = a.participantName.toLowerCase();
          bValue = b.participantName.toLowerCase();
          break;
        default:
          aValue = a.totalVotes;
          bValue = b.totalVotes;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Ensure both values are numbers for arithmetic operations
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Fallback: convert to numbers if possible
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
    });

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("participantName")}
              >
                Participant
                {sortBy === "participantName" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("totalVotes")}
              >
                Total Votes
                {sortBy === "totalVotes" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("incognitoPercentage")}
              >
                Incognito %
                {sortBy === "incognitoPercentage" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("incognitoVotes")}
              >
                Incognito Votes
                {sortBy === "incognitoVotes" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device Breakdown
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suspicious IPs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedParticipants.map((participant, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {participant.participantName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {participant.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {participant.totalVotes}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm ${getIncognitoColor(
                      participant.incognitoPercentage
                    )}`}
                  >
                    {participant.incognitoPercentage.toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {participant.incognitoVotes}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500 space-y-1">
                    {Object.entries(participant.deviceVotes)
                      .filter(([key, value]) => value > 0)
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs">
                    {participant.suspiciousIPs.slice(0, 2).map((ip, idx) => (
                      <div key={idx} className="font-mono text-blue-600">
                        {ip}
                      </div>
                    ))}
                    {participant.suspiciousIPs.length > 2 && (
                      <div className="text-gray-500">
                        +{participant.suspiciousIPs.length - 2} more
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(
                      participant.riskLevel
                    )}`}
                  >
                    {participant.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedParticipants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No affected participants found matching the current filters.
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

interface SuspiciousIP {
  ipAddress: string;
  riskScore: number;
  sessionCount: number;
  totalVotes: number;
  incognitoUsage: {
    percentage: number;
    sessions: number;
    totalSessions: number;
    votes: number;
    totalVotes: number;
    indicators: string[];
  };
  deviceBreakdown: {
    laptop: number;
    phone: number;
    tablet: number;
    system: number;
    unknown: number;
    total: number;
  };
  deviceDiversity: number;
  riskLevel: 'high' | 'medium' | 'low';
}

interface SuspiciousIPsTableProps {
  ips: SuspiciousIP[];
  onIPClick: (ipAddress: string) => void;
  onRefresh: () => void;
}

export function SuspiciousIPsTable({ ips, onIPClick, onRefresh }: SuspiciousIPsTableProps) {
  const [sortBy, setSortBy] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncognitoColor = (percentage: number) => {
    if (percentage > 70) return 'text-red-600 font-semibold';
    if (percentage > 40) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedIPs = ips
    .filter(ip => filterRisk === 'all' || ip.riskLevel === filterRisk)
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'riskScore':
          aValue = a.riskScore;
          bValue = b.riskScore;
          break;
        case 'totalVotes':
          aValue = a.totalVotes;
          bValue = b.totalVotes;
          break;
        case 'incognitoPercentage':
          aValue = a.incognitoUsage.percentage;
          bValue = b.incognitoUsage.percentage;
          break;
        case 'deviceDiversity':
          aValue = a.deviceDiversity;
          bValue = b.deviceDiversity;
          break;
        default:
          aValue = a.riskScore;
          bValue = b.riskScore;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('riskScore')}
              >
                Risk Score
                {sortBy === 'riskScore' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalVotes')}
              >
                Total Votes
                {sortBy === 'totalVotes' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('incognitoPercentage')}
              >
                Incognito %
                {sortBy === 'incognitoPercentage' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('deviceDiversity')}
              >
                Devices
                {sortBy === 'deviceDiversity' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedIPs.map((ip, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-blue-600">{ip.ipAddress}</div>
                  <div className="text-xs text-gray-500">{ip.sessionCount} sessions</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{ip.riskScore}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{ip.totalVotes}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${getIncognitoColor(ip.incognitoUsage.percentage)}`}>
                    {ip.incognitoUsage.percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {ip.incognitoUsage.votes}/{ip.incognitoUsage.totalVotes} votes
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{ip.deviceDiversity}</div>
                  <div className="text-xs text-gray-500">
                    {Object.entries(ip.deviceBreakdown)
                      .filter(([key, value]) => key !== 'total' && value > 0)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(ip.riskLevel)}`}>
                    {ip.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onIPClick(ip.ipAddress)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedIPs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No suspicious IPs found matching the current filters.
        </div>
      )}
    </div>
  );
}

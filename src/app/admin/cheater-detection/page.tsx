"use client";

import { useState, useEffect } from "react";

import { MonitoringStatus } from "@/components/admin/MonitoringStatus";
import { DeviceChart } from "@/components/admin/DeviceChart";
import { IPDetailsModal } from "@/components/admin/IPDetailsModal";
import { ParticipantsTable } from "@/components/admin/ParticipantsTable";
import { RiskChart } from "@/components/admin/RiskChart";
import { SummaryCards } from "@/components/admin/SummaryCards";
import { SuspiciousIPsTable } from "@/components/admin/SuspiciousIPsTable";
import { VercelDataImporter } from "@/components/admin/VercelDataImporter";

export default function CheaterDetectionPage() {
  const [summary, setSummary] = useState<any>(null);
  const [suspiciousIPs, setSuspiciousIPs] = useState<any[]>([]);
  const [affectedParticipants, setAffectedParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIP, setSelectedIP] = useState<any>(null);
  const [showIPModal, setShowIPModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAutoMonitoring, setIsAutoMonitoring] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [scanCount, setScanCount] = useState(0);

  const ADMIN_KEY =
    process.env.NEXT_PUBLIC_ADMIN_KEY || "tasfa-admin-2024-secure-key";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryData, ipsData, participantsData] = await Promise.all([
        getSummary(),
        getSuspiciousIPs(20, 0),
        getAffectedParticipants(20, 0),
      ]);

      setSummary(summaryData.data);
      setSuspiciousIPs(ipsData.data.ips);
      setAffectedParticipants(participantsData.data.participants);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSummary = async () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://tasfa-be.onrender.com";

    console.log("🔍 Debug - Backend URL:", backendUrl);
    console.log("🔍 Debug - Admin Key:", ADMIN_KEY);

    const response = await fetch(`${backendUrl}/api/admin/cheater-summary`, {
      headers: { "x-admin-key": ADMIN_KEY },
    });

    console.log("🔍 Debug - Response status:", response.status);
    const data = await response.json();
    console.log("🔍 Debug - Response data:", data);

    return data;
  };

  const getSuspiciousIPs = async (limit = 20, offset = 0, riskLevel = null) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (riskLevel) params.append("riskLevel", riskLevel);

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://tasfa-be.onrender.com";
    const response = await fetch(
      `${backendUrl}/api/admin/suspicious-ips?${params}`,
      {
        headers: { "x-admin-key": ADMIN_KEY },
      }
    );
    return response.json();
  };

  const getAffectedParticipants = async (
    limit = 20,
    offset = 0,
    sortBy = "totalVotes"
  ) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      sortBy,
    });

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://tasfa-be.onrender.com";
    const response = await fetch(
      `${backendUrl}/api/admin/affected-participants?${params}`,
      {
        headers: { "x-admin-key": ADMIN_KEY },
      }
    );
    return response.json();
  };

  const handleIPClick = async (ipAddress: string) => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://tasfa-be.onrender.com";
      const response = await fetch(
        `${backendUrl}/api/admin/ip-details/${ipAddress}`,
        {
          headers: { "x-admin-key": ADMIN_KEY },
        }
      );
      const data = await response.json();
      setSelectedIP(data.data);
      setShowIPModal(true);
    } catch (error) {
      console.error("Error fetching IP details:", error);
    }
  };

  const handleVercelDataImport = async (vercelIPs: string[]) => {
    // This would integrate with your existing cheater detection system
    console.log("Importing Vercel IPs:", vercelIPs);
    // You can add logic here to cross-reference with your voting database
  };

  const handleAutoMonitoringToggle = (
    isMonitoring: boolean,
    lastScanTime: Date | null,
    scanCountValue: number
  ) => {
    setIsAutoMonitoring(isMonitoring);
    setLastScan(lastScanTime);
    setScanCount(scanCountValue);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading cheater detection data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🚨 Cheater Detection Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and identify suspicious voting patterns from multiple tabs
            and incognito usage
          </p>
        </div>

        {/* Summary Cards */}
        {summary && <SummaryCards data={summary} />}

        {/* Vercel Data Importer */}
        <div className="mb-8">
          <VercelDataImporter
            onImport={handleVercelDataImport}
            onAutoMonitoringToggle={handleAutoMonitoringToggle}
          />
        </div>

        {/* Monitoring Status */}
        <div className="mb-8">
          <MonitoringStatus
            isAutoMonitoring={isAutoMonitoring}
            lastScan={lastScan}
            scanCount={scanCount}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", name: "Overview", icon: "📊" },
              { id: "suspicious-ips", name: "Suspicious IPs", icon: "🌐" },
              { id: "participants", name: "Affected Participants", icon: "👥" },
              { id: "analytics", name: "Analytics", icon: "📈" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === "overview" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Risk Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskChart data={summary?.riskLevels} />
                <DeviceChart data={summary?.deviceStats} />
              </div>
            </div>
          )}

          {activeTab === "suspicious-ips" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Suspicious IP Addresses
              </h2>
              <SuspiciousIPsTable
                ips={suspiciousIPs}
                onIPClick={handleIPClick}
                onRefresh={loadDashboardData}
              />
            </div>
          )}

          {activeTab === "participants" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Affected Participants
              </h2>
              <ParticipantsTable
                participants={affectedParticipants}
                onRefresh={loadDashboardData}
              />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Analytics & Trends</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Incognito Usage</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {summary?.incognitoStats?.ipsWithIncognito || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    IPs with incognito activity
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Multi-Device Activity</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {summary?.deviceStats?.multiDeviceIPs || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    IPs using multiple devices
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* IP Details Modal */}
        {showIPModal && selectedIP && (
          <IPDetailsModal
            ipData={selectedIP}
            onClose={() => {
              setShowIPModal(false);
              setSelectedIP(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

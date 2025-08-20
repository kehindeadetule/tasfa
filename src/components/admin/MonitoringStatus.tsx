"use client";

import React, { useState, useEffect } from "react";

interface MonitoringData {
  timestamp: string;
  activity: {
    hourlySessions: number;
    dailySessions: number;
  };
  recentAlerts: number;
  lastAlert: string;
  alertSummary: Array<{
    timestamp: string;
    suspiciousIPs: number;
    totalAlerts: number;
  }>;
}

interface MonitoringStatusProps {
  isAutoMonitoring: boolean;
  lastScan: Date | null;
  scanCount: number;
}

export function MonitoringStatus({
  isAutoMonitoring,
  lastScan,
  scanCount,
}: MonitoringStatusProps) {
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const ADMIN_KEY =
    process.env.NEXT_PUBLIC_ADMIN_KEY || "tasfa-admin-2024-secure-key";

  useEffect(() => {
    if (isAutoMonitoring) {
      fetchMonitoringStatus();
    }
  }, [isAutoMonitoring]);

  const fetchMonitoringStatus = async () => {
    setLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://tasfa-be.onrender.com";
      const response = await fetch(
        `${backendUrl}/api/admin/monitoring-status`,
        {
          headers: {
            "x-admin-key": ADMIN_KEY,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMonitoringData(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching monitoring status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!isAutoMonitoring) return "text-gray-500";
    if (monitoringData?.recentAlerts && monitoringData.recentAlerts > 0) {
      return "text-red-600";
    }
    return "text-green-600";
  };

  const getStatusIcon = () => {
    if (!isAutoMonitoring) return "⚪";
    if (monitoringData?.recentAlerts && monitoringData.recentAlerts > 0) {
      return "🔴";
    }
    return "🟢";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📊 Monitoring Status
        </h3>
        <button
          onClick={fetchMonitoringStatus}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getStatusIcon()}</span>
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <div className={`font-semibold ${getStatusColor()}`}>
                  {isAutoMonitoring ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Scans</div>
            <div className="text-2xl font-bold text-blue-600">{scanCount}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Recent Alerts</div>
            <div className="text-2xl font-bold text-red-600">
              {monitoringData?.recentAlerts || 0}
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        {monitoringData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">Hourly Sessions</div>
              <div className="text-xl font-bold text-blue-800">
                {monitoringData.activity.hourlySessions}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600">Daily Sessions</div>
              <div className="text-xl font-bold text-green-800">
                {monitoringData.activity.dailySessions}
              </div>
            </div>
          </div>
        )}

        {/* Last Scan Info */}
        {lastScan && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-800">
              <strong>Last Scan:</strong> {lastScan.toLocaleString()}
            </div>
            <div className="text-xs text-yellow-700 mt-1">
              Next scan in:{" "}
              {Math.max(
                0,
                5 - Math.floor((Date.now() - lastScan.getTime()) / (1000 * 60))
              )}{" "}
              minutes
            </div>
          </div>
        )}

        {/* Recent Alerts */}
        {monitoringData?.alertSummary &&
          monitoringData.alertSummary.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Recent Alert Summary
              </h4>
              <div className="space-y-2">
                {monitoringData.alertSummary.slice(0, 5).map((alert, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div>
                      <div className="text-sm font-medium text-red-800">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      <div className="text-xs text-red-600">
                        {alert.suspiciousIPs} suspicious IPs detected
                      </div>
                    </div>
                    <div className="text-sm font-bold text-red-600">
                      {alert.totalAlerts} alerts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Auto-Monitoring Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Auto-Monitoring:</strong>{" "}
            {isAutoMonitoring ? (
              <span className="text-green-600">
                Active - Scanning every 5 minutes for suspicious IPs and voting
                patterns
              </span>
            ) : (
              <span className="text-gray-600">
                Inactive - Click "Start Auto-Monitoring" to begin automatic
                scanning
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

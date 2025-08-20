"use client";

import React, { useState, useEffect } from "react";

interface VercelIPData {
  ipAddress: string;
  requests: string;
  cached: string;
}

interface VercelDataImporterProps {
  onImport: (ips: string[]) => void;
  onAutoMonitoringToggle?: (
    isMonitoring: boolean,
    lastScan: Date | null,
    scanCount: number
  ) => void;
}

export function VercelDataImporter({
  onImport,
  onAutoMonitoringToggle,
}: VercelDataImporterProps) {
  const [vercelData, setVercelData] = useState("");
  const [parsedIPs, setParsedIPs] = useState<VercelIPData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAutoMonitoring, setIsAutoMonitoring] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [scanCount, setScanCount] = useState(0);

  const ADMIN_KEY =
    process.env.NEXT_PUBLIC_ADMIN_KEY || "tasfa-admin-2024-secure-key";

  // Auto-monitoring effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoMonitoring) {
      // Initial scan
      performAutoScan();

      // Set up 5-minute interval
      interval = setInterval(() => {
        performAutoScan();
      }, 5 * 60 * 1000); // 5 minutes
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoMonitoring]);

  const performAutoScan = async () => {
    try {
      console.log("🔄 Performing automatic IP scan...");

      // Get all suspicious IPs from backend
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://tasfa-be.onrender.com";
      const response = await fetch(
        `${backendUrl}/api/admin/suspicious-ips?limit=100&offset=0`,
        {
          headers: {
            "x-admin-key": ADMIN_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data?.ips) {
        const ipAddresses = data.data.ips.map((ip: any) => ip.ipAddress);
        console.log(
          `📊 Found ${ipAddresses.length} suspicious IPs in auto-scan`
        );

        // Trigger analysis
        onImport(ipAddresses);

        setLastScan(new Date());
        setScanCount((prev) => prev + 1);

        // Notify parent component of updated state
        if (onAutoMonitoringToggle) {
          onAutoMonitoringToggle(true, new Date(), scanCount + 1);
        }
      }
    } catch (error) {
      console.error("❌ Auto-scan error:", error);
    }
  };

  const parseVercelData = (data: string) => {
    const lines = data.trim().split("\n");
    const ips: VercelIPData[] = [];

    lines.forEach((line, index) => {
      if (index === 0) return; // Skip header

      // Parse IP, Requests, Cached columns
      const parts = line.split(/\s+/);
      if (parts.length >= 3) {
        const ipAddress = parts[0];
        const requests = parts[1];
        const cached = parts[2];

        if (ipAddress && requests && cached) {
          ips.push({ ipAddress, requests, cached });
        }
      }
    });

    return ips;
  };

  const handleDataPaste = () => {
    if (!vercelData.trim()) return;

    const ips = parseVercelData(vercelData);
    setParsedIPs(ips);
  };

  const handleAnalyzeIPs = async () => {
    if (parsedIPs.length === 0) return;

    setIsAnalyzing(true);
    try {
      const ipAddresses = parsedIPs.map((ip) => ip.ipAddress);
      onImport(ipAddresses);

      // You can add additional analysis here
      console.log("Analyzing IPs:", ipAddresses);
    } catch (error) {
      console.error("Error analyzing IPs:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearData = () => {
    setVercelData("");
    setParsedIPs([]);
  };

  const toggleAutoMonitoring = () => {
    const newMonitoringState = !isAutoMonitoring;
    setIsAutoMonitoring(newMonitoringState);

    if (!newMonitoringState) {
      setScanCount(0);
      setLastScan(null);
    }

    // Notify parent component
    if (onAutoMonitoringToggle) {
      onAutoMonitoringToggle(newMonitoringState, lastScan, scanCount);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          📊 Import Vercel Suspicious IPs
        </h3>
        <p className="text-sm text-gray-600">
          Paste the IP data from your Vercel Edge Requests dashboard to analyze
          suspicious voting patterns
        </p>
      </div>

      {/* Auto-Monitoring Section */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-md font-semibold text-blue-900">
            🤖 Automatic Monitoring
          </h4>
          <button
            onClick={toggleAutoMonitoring}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isAutoMonitoring
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isAutoMonitoring ? "Stop Monitoring" : "Start Auto-Monitoring"}
          </button>
        </div>

        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>Status:</strong>{" "}
            {isAutoMonitoring ? (
              <span className="text-green-600">
                🟢 Active - Scanning every 5 minutes
              </span>
            ) : (
              <span className="text-gray-600">⚪ Inactive</span>
            )}
          </p>
          {lastScan && (
            <p>
              <strong>Last Scan:</strong> {lastScan.toLocaleTimeString()}
            </p>
          )}
          {scanCount > 0 && (
            <p>
              <strong>Total Scans:</strong> {scanCount}
            </p>
          )}
          <p className="text-xs mt-2">
            Automatically scans all suspicious IPs from your backend every 5
            minutes and cross-references with voting data.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Data Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vercel Edge Requests Data
          </label>
          <textarea
            value={vercelData}
            onChange={(e) => setVercelData(e.target.value)}
            placeholder="Paste your Vercel Edge Requests table data here...
Example:
172.71.178.18    31K    88.6%
172.68.42.176     26K    92.3%
172.71.178.19     25K    88.9%"
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleDataPaste}
            disabled={!vercelData.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Parse Data
          </button>

          <button
            onClick={handleAnalyzeIPs}
            disabled={parsedIPs.length === 0 || isAnalyzing}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze IPs"}
          </button>

          <button
            onClick={clearData}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Clear
          </button>
        </div>

        {/* Parsed Results */}
        {parsedIPs.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Parsed IP Addresses ({parsedIPs.length})
            </h4>
            <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-700">IP Address</div>
                <div className="font-medium text-gray-700">Requests</div>
                <div className="font-medium text-gray-700">Cached</div>

                {parsedIPs.slice(0, 10).map((ip, index) => (
                  <React.Fragment key={index}>
                    <div className="font-mono text-blue-600">
                      {ip.ipAddress}
                    </div>
                    <div>{ip.requests}</div>
                    <div>{ip.cached}</div>
                  </React.Fragment>
                ))}

                {parsedIPs.length > 10 && (
                  <div className="col-span-3 text-xs text-gray-500 mt-2">
                    ... and {parsedIPs.length - 10} more IPs
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            How to use:
          </h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>
              1. Go to your Vercel dashboard → Observability → Edge Requests
            </li>
            <li>2. Copy the table data (IP, Requests, Cached columns)</li>
            <li>3. Paste it in the textarea above</li>
            <li>4. Click "Parse Data" to extract IP addresses</li>
            <li>5. Click "Analyze IPs" to cross-reference with voting data</li>
            <li>
              6. <strong>Or use Auto-Monitoring</strong> to automatically scan
              every 5 minutes
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

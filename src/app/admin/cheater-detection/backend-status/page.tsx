"use client";

import { useState } from "react";

export default function BackendStatusPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testEndpoints = [
    { name: "Health Check", url: "https://tasfa-be.onrender.com/health" },
    { name: "Root", url: "https://tasfa-be.onrender.com/" },
    { name: "API Root", url: "https://tasfa-be.onrender.com/api" },
    {
      name: "Cheater Summary",
      url: "https://tasfa-be.onrender.com/api/admin/cheater-summary",
    },
    {
      name: "Suspicious IPs",
      url: "https://tasfa-be.onrender.com/api/admin/suspicious-ips",
    },
  ];

  const testBackend = async () => {
    setLoading(true);
    setResults([]);

    for (const endpoint of testEndpoints) {
      try {
        console.log(`Testing: ${endpoint.name} - ${endpoint.url}`);

        const startTime = Date.now();
        const response = await fetch(endpoint.url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const endTime = Date.now();

        let data;
        try {
          data = await response.text();
          // Try to parse as JSON
          try {
            data = JSON.parse(data);
          } catch {
            // Keep as text if not JSON
          }
        } catch {
          data = "Could not read response";
        }

        setResults((prev) => [
          ...prev,
          {
            name: endpoint.name,
            url: endpoint.url,
            status: response.status,
            statusText: response.statusText,
            responseTime: endTime - startTime,
            data: data,
            headers: Object.fromEntries(response.headers.entries()),
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        setResults((prev) => [
          ...prev,
          {
            name: endpoint.name,
            url: endpoint.url,
            status: "ERROR",
            statusText:
              error instanceof Error ? error.message : "Unknown error",
            responseTime: 0,
            data: null,
            headers: {},
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }

    setLoading(false);
  };

  const getStatusColor = (status: number | string) => {
    if (status === 200) return "text-green-600";
    if (status === 502) return "text-red-600";
    if (status === "ERROR") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">🔧 Backend Status Checker</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Backend Endpoints</h2>
          <p className="text-gray-600 mb-4">
            This will test all endpoints to diagnose the 502 Bad Gateway issue.
          </p>

          <button
            onClick={testBackend}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test All Endpoints"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{result.name}</h3>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`font-mono text-sm ${getStatusColor(
                        result.status
                      )}`}
                    >
                      {result.status} {result.statusText}
                    </span>
                    {result.responseTime > 0 && (
                      <span className="text-sm text-gray-500">
                        {result.responseTime}ms
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-sm text-gray-600">URL:</span>
                  <span className="text-sm font-mono ml-2">{result.url}</span>
                </div>

                {result.data && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Response:</span>
                    <div className="bg-gray-50 p-3 rounded-md mt-1">
                      <pre className="text-xs overflow-auto max-h-40">
                        {typeof result.data === "object"
                          ? JSON.stringify(result.data, null, 2)
                          : result.data}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Tested at: {new Date(result.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🔍 Troubleshooting 502 Bad Gateway
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Check if your Render service is running and healthy</li>
            <li>
              • Verify the service URL is correct: https://tasfa-be.onrender.com
            </li>
            <li>• Check Render dashboard for service status and logs</li>
            <li>• Ensure your backend is properly deployed and started</li>
            <li>• Check if there are any environment variable issues</li>
            <li>• Verify the API endpoints exist in your backend code</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

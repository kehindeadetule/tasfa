"use client";

import { useState, useEffect } from "react";

export default function MemoryMonitorPage() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkBackendHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://tasfa-be.onrender.com/health", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setMemoryInfo({
        status: response.status,
        data: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setMemoryInfo({
        error: error instanceof Error ? error.message : "Unknown error",
        status: "ERROR",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">💾 Memory Monitor</h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-800 mb-4">
            🚨 Memory Issue Detected
          </h2>
          <p className="text-red-700 mb-4">
            Your backend is crashing due to JavaScript heap out of memory. This
            is causing the 502 Bad Gateway errors.
          </p>

          <div className="space-y-2 text-sm text-red-700">
            <p>
              <strong>Error:</strong> FATAL ERROR: Reached heap limit Allocation
              failed - JavaScript heap out of memory
            </p>
            <p>
              <strong>Solution:</strong> Increase memory limit in Render service
              configuration
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔧 Fix Steps</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                1. Add Memory Limit to Render
              </h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  In your Render service dashboard, add this environment
                  variable:
                </p>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  NODE_OPTIONS=--max-old-space-size=2048
                </code>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                2. Check for Memory Leaks
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Large database queries without pagination</li>
                <li>• Unclosed database connections</li>
                <li>• Sessions not being cleaned up</li>
                <li>• Large data processing in memory</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3. Optimize Your Backend
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Implement proper pagination (limit/offset)</li>
                <li>• Use streaming for large data operations</li>
                <li>• Add memory monitoring</li>
                <li>• Clean up old sessions and data</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Backend Health Check</h2>
            <button
              onClick={checkBackendHealth}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Check Health"}
            </button>
          </div>

          {memoryInfo && (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`text-sm font-semibold ${
                    memoryInfo.status === 200
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {memoryInfo.status}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-sm text-gray-600">Timestamp:</span>
                <span className="text-sm ml-2">
                  {new Date(memoryInfo.timestamp).toLocaleString()}
                </span>
              </div>

              {memoryInfo.data && (
                <div>
                  <span className="text-sm text-gray-600">Response:</span>
                  <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-40">
                    {JSON.stringify(memoryInfo.data, null, 2)}
                  </pre>
                </div>
              )}

              {memoryInfo.error && (
                <div className="text-red-600 text-sm">
                  Error: {memoryInfo.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function TestAuthPage() {
  const [adminKey, setAdminKey] = useState("tasfa-admin-2024-secure-key");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      const backendUrl = "https://tasfa-be.onrender.com";
      console.log("Testing with admin key:", adminKey);

      const response = await fetch(`${backendUrl}/api/admin/cheater-summary`, {
        headers: { "x-admin-key": adminKey },
      });

      const data = await response.json();
      setResult({
        status: response.status,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
        status: "ERROR",
      });
    } finally {
      setLoading(false);
    }
  };

  const commonKeys = [
    "tasfa-admin-2024-secure-key",
    "admin-key",
    "admin",
    "secret",
    "tasfa-admin",
    "admin2024",
    "secure-key",
    "your-admin-key-here",
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">🔐 Admin Key Test</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Key:
            </label>
            <input
              type="text"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin key"
            />
          </div>

          <button
            onClick={testAuth}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Auth"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Test Common Keys</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {commonKeys.map((key) => (
              <button
                key={key}
                onClick={() => {
                  setAdminKey(key);
                  setTimeout(testAuth, 100);
                }}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

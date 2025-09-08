"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";

interface QueueStatus {
  queue: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
  redis: {
    connected: boolean;
    memory: string;
  };
}

export default function QueueStatusMonitor() {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQueueStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/secure-votes/queue-status`
      );
      const data = await response.json();

      if (data.success) {
        setQueueStatus(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch queue status");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch queue status"
      );
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchQueueStatus();

  //   // Refresh every 30 seconds
  //   const interval = setInterval(fetchQueueStatus, 30000);
  //   return () => clearInterval(interval);
  // }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading queue status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-center text-red-600">
          <p className="text-sm">Queue status unavailable</p>
          <button
            onClick={fetchQueueStatus}
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!queueStatus) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Queue Status</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {queueStatus.queue.waiting}
          </div>
          <div className="text-xs text-gray-600">Waiting</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {queueStatus.queue.active}
          </div>
          <div className="text-xs text-gray-600">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {queueStatus.queue.completed}
          </div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {queueStatus.queue.failed}
          </div>
          <div className="text-xs text-gray-600">Failed</div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Redis Status:</span>
          <span
            className={`text-sm font-medium ${
              queueStatus.redis.connected ? "text-green-600" : "text-red-600"
            }`}
          >
            {queueStatus.redis.connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600">Memory Usage:</span>
          <span className="text-sm font-medium text-gray-800">
            {queueStatus.redis.memory}
          </span>
        </div>
      </div>

      <button
        onClick={fetchQueueStatus}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
      >
        Refresh Status
      </button>
    </div>
  );
}
